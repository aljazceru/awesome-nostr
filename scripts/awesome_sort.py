#!/usr/bin/env python3
"""awesome-nostr: machine-readable data + configurable weekly sorting.

Parses README.md into a structured tree (categories -> subcategories -> items),
optionally fetches live repository metadata (stars, last activity) from
GitHub/GitLab/Codeberg, re-orders list entries according to a configurable
strategy, then writes back:

  * README.md                 (entries re-sorted in place, formatting preserved)
  * data/awesome-nostr.json   (full machine-readable snapshot)
  * data/repo-meta.json       (fetched repo metadata cache, committed to the repo)

Sorting strategies:

  hybrid           (default) two buckets: entries with ``star_threshold`` or
                   more stars are ranked by stars (mature, well-known projects
                   stay discoverable even if development winds down); entries
                   below the threshold are ranked by last activity (fresh,
                   active small projects get promoted, dead ones sink). Stars
                   break activity ties and vice versa.
  last-active      most recently pushed/updated first
  stars            highest star count first
  stars-weighted   stars decayed by repo inactivity (halving every
                   ``half_life_days``); rewards popular *and* alive projects
  manual           keep the current README order for a section

Entries without repository metadata always sink to the bottom of their
section, keeping their original relative order.

Strategies can be set per-run (``--strategy``), globally (``sort.config.json``
-> ``strategy``), per GitHub Actions run (``workflow_dispatch`` input), or per
repository variable (``vars.SORT_STRATEGY``). Sections can opt out via
``manual`` in ``sort.config.json`` -> ``sections``.

Usage:
    python scripts/awesome_sort.py                       # full run
    python scripts/awesome_sort.py --no-fetch            # offline, cached meta only
    python scripts/awesome_sort.py --strategy stars
    python scripts/awesome_sort.py --check               # CI mode: exit 1 if stale
"""

import argparse
import json
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from pathlib import Path

# ---------------------------------------------------------------------------
# Regexes
# ---------------------------------------------------------------------------

H2_RE = re.compile(r"^## (.+?)\s*$")
H3_RE = re.compile(r"^### (.+?)\s*$")
ITEM_RE = re.compile(r"( *)- (.*)")
MD_LINK_RE = re.compile(r"\[([^\]]*)\]\(\s*([^)\s]+)[^)]*\)")
NESTED_BADGE_RE = re.compile(r"\[!\[stars\]\([^)]*\)\]\([^)]*\)")
BADGE_RE = re.compile(r"!\[stars\]\([^)]*\)")
ZAP_LINK_RE = re.compile(r"\[\? zap\]\(([^)]*)\)")
BADGE_URL_RE = re.compile(
    r"shields\.io/(github|gitlab)/stars/([^/\s)\]]+)/([^?\s)\]]+)"
)
GITHUB_URL_RE = re.compile(r"github\.com/([^/\s)#]+)(?:/([^/\s)#]+))?")
GITLAB_URL_RE = re.compile(r"gitlab\.com/([^/\s)#]+(?:/[^/\s)#]+)*)")
CODEBERG_URL_RE = re.compile(r"codeberg\.org/([^/\s)#]+)/([^/\s)#]+)")
LEADING_DASH_RE = re.compile(r"^\s*[-–—:]\s*")

GITHUB_RESERVED_OWNERS = {
    "orgs", "topics", "trending", "features", "marketplace", "settings",
    "sponsors", "collections", "about", "pricing", "site", "security",
}

DEFAULT_CONFIG = {
    "strategy": "hybrid",
    "star_threshold": 500,
    "half_life_days": 180,
    "fetch": {"concurrency": 8, "timeout_seconds": 20, "retries": 1},
    "sections": {
        "Most popular": {"strategy": "manual"},
        "Deprecated/Defunct": {"strategy": "manual"},
        "Contributing": {"strategy": "manual"},
        "Contributors": {"strategy": "manual"},
    },
}

VALID_STRATEGIES = {"hybrid", "last-active", "stars", "stars-weighted", "manual"}

# ---------------------------------------------------------------------------
# Parsing
# ---------------------------------------------------------------------------


def _strip_suffix(repo: str) -> str:
    for suffix in (".svg", ".git"):
        if repo.endswith(suffix):
            repo = repo[: -len(suffix)]
    return repo


def extract_repo_from_badge(badge_url: str):
    m = BADGE_URL_RE.search(badge_url)
    if not m:
        return None, None
    return _strip_suffix(f"{m.group(2)}/{m.group(3)}"), m.group(1)


def extract_repo_from_url(url: str):
    for regex, forge in ((GITHUB_URL_RE, "github"), (CODEBERG_URL_RE, "codeberg")):
        m = regex.search(url)
        if m and not (forge == "github" and m.group(1) in GITHUB_RESERVED_OWNERS):
            if m.group(2):
                return f"{m.group(1)}/{_strip_suffix(m.group(2))}", forge
    m = GITLAB_URL_RE.search(url)
    if m:
        # keep full group path (API supports it); drop /-/tree/... style suffixes
        path = re.split(r"/-/", m.group(1))[0].strip("/")
        if "/" in path:
            return path, "gitlab"
    return None, None


def parse_item_line(line: str) -> dict | None:
    m = ITEM_RE.match(line)
    if not m:
        return None
    raw = m.group(2)

    nested = NESTED_BADGE_RE.search(raw)
    badge_url = None
    badge_match = None
    if nested:
        badge_match = nested
        inner = re.search(r"!\[stars\]\(([^)]*)\)", nested.group(0))
        badge_url = inner.group(1) if inner else None
    else:
        badge_match = BADGE_RE.search(raw)
        if badge_match:
            inner = re.search(r"\(([^)]*)\)", badge_match.group(0))
            badge_url = inner.group(1) if inner else None

    zap_match = ZAP_LINK_RE.search(raw)

    name, url, first_span = None, None, None
    for link in MD_LINK_RE.finditer(raw):
        span = link.span()
        # skip spans that belong to badge markup already removed conceptually
        if badge_match and (badge_match.start() <= span[0] < badge_match.end()):
            continue
        name, url, first_span = link.group(1).strip(), link.group(2).strip(), span
        break

    if not name or not url:
        return None

    # description = raw minus badge, zap, and primary-link spans (merge overlaps)
    spans = sorted(m.span() for m in (badge_match, zap_match) if m)
    if first_span not in spans:
        spans.append(first_span)
        spans.sort()
    merged = []
    for start, end in spans:
        if merged and start <= merged[-1][1]:
            merged[-1] = (merged[-1][0], max(merged[-1][1], end))
        else:
            merged.append((start, end))
    desc_parts = []
    pos = 0
    for start, end in merged:
        desc_parts.append(raw[pos:start])
        pos = end
    desc_parts.append(raw[pos:])
    description = "".join(desc_parts)
    description = LEADING_DASH_RE.sub("", description.strip(), count=1).strip()
    description = re.sub(r"\s{2,}", " ", description)

    repo, forge = extract_repo_from_badge(badge_url or "")
    if not repo:
        repo, forge = extract_repo_from_url(url)

    return {
        "indent": len(m.group(1)),
        "raw_line": line,
        "name": name.strip(),
        "url": url,
        "description": description,
        "repo": repo,
        "forge": forge,
        "zap": zap_match.group(1) if zap_match else None,
        "stars": None,
        "last_active": None,
        "children": [],
    }


class Block:
    """A loose text block or one top-level entry (with its indented children)."""

    __slots__ = ("lines", "item")

    def __init__(self, lines, item=None):
        self.lines = lines
        self.item = item


class Section:
    def __init__(self, title, title_line):
        self.title = title
        self.title_line = title_line
        self.blocks = []          # blocks before any ### heading
        self.subsections = []     # list[Section]
        self.strategy = None      # filled during sorting

    def all_blocks(self):
        yield self
        for sub in self.subsections:
            yield sub


def parse_readme(text: str):
    lines = text.split("\n")
    doc = {"preamble": [], "sections": []}
    section = None
    subsection = None
    target = None  # where blocks are currently appended

    def new_section(title, title_line):
        nonlocal section, subsection, target
        section = Section(title, title_line)
        doc["sections"].append(section)
        subsection = None
        target = section.blocks

    for line in lines:
        h2 = H2_RE.match(line)
        h3 = H3_RE.match(line)
        if h2:
            new_section(h2.group(1).strip(), line)
        elif h3 and section is not None:
            subsection = Section(h3.group(1).strip(), line)
            section.subsections.append(subsection)
            target = subsection.blocks
        elif section is None:
            doc["preamble"].append(line)
        elif line.lstrip().startswith("- "):
            item = parse_item_line(line)
            if item is None:
                target.append(Block([line]))
            elif item["indent"] > 0 and target and target[-1].item is not None:
                target[-1].lines.append(line)
            else:
                target.append(Block([line], item=item))
        else:
            target.append(Block([line]))
    return doc


# ---------------------------------------------------------------------------
# Repo metadata fetching
# ---------------------------------------------------------------------------


def _http_json(url: str, token: str | None, timeout: int):
    req = urllib.request.Request(url, headers={"User-Agent": "awesome-nostr-sorter"})
    if token and "api.github.com" in url:
        req.add_header("Authorization", f"Bearer {token}")
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return json.loads(resp.read().decode("utf-8"))


def fetch_repo_meta(repo: str, forge: str, cfg: dict, token: str | None):
    fetch_cfg = cfg["fetch"]
    timeout = fetch_cfg["timeout_seconds"]
    last_error = None
    for _ in range(fetch_cfg["retries"] + 1):
        try:
            if forge == "github":
                data = _http_json(f"https://api.github.com/repos/{repo}", token, timeout)
                return {"stars": data["stargazers_count"], "last_active": data["pushed_at"]}
            if forge == "gitlab":
                path = urllib.parse.quote(repo, safe="")
                data = _http_json(
                    f"https://gitlab.com/api/v4/projects/{path}", None, timeout
                )
                return {"stars": data["star_count"], "last_active": data["last_activity_at"]}
            if forge == "codeberg":
                data = _http_json(f"https://codeberg.org/api/v1/repos/{repo}", None, timeout)
                return {"stars": data["stars_count"], "last_active": data["updated_at"]}
            return None
        except Exception as exc:  # noqa: BLE001 - keep going on any single failure
            last_error = exc
            time.sleep(1)
    print(f"warning: failed to fetch {forge}:{repo}: {last_error}", file=sys.stderr)
    return None


def refresh_repo_meta(pending: dict, cache: dict, cfg: dict) -> int:
    token = os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN")
    if not pending:
        return 0
    concurrency = min(cfg["fetch"]["concurrency"], len(pending))
    fetched = 0
    with ThreadPoolExecutor(max_workers=concurrency) as pool:
        futures = {
            key: pool.submit(fetch_repo_meta, repo, forge, cfg, token)
            for key, (repo, forge) in pending.items()
        }
        for key, future in futures.items():
            result = future.result()
            if result is None:
                continue
            result["fetched_at"] = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
            cache["repos"][key] = result
            fetched += 1
    return fetched


def apply_meta_to_doc(doc: dict, cache: dict) -> tuple[int, int]:
    repos = cache.setdefault("repos", {})
    tracked, with_meta = 0, 0

    def apply(item: dict):
        nonlocal tracked, with_meta
        if not item["repo"]:
            return
        tracked += 1
        meta = repos.get(f"{item['forge']}:{item['repo']}")
        if meta:
            item["stars"] = meta["stars"]
            item["last_active"] = meta["last_active"]
            with_meta += 1

    for section in doc["sections"]:
        for owner in section.all_blocks():
            for block in owner.blocks:
                if block.item is None:
                    continue
                apply(block.item)
                for child in block.item["children"]:
                    apply(child)
    return tracked, with_meta


# ---------------------------------------------------------------------------
# Sorting
# ---------------------------------------------------------------------------


def _days_since(iso_ts: str | None, now: datetime) -> float:
    if not iso_ts:
        return float("inf")
    try:
        ts = datetime.fromisoformat(iso_ts.replace("Z", "+00:00"))
    except ValueError:
        return float("inf")
    return max(0.0, (now - ts).total_seconds() / 86400.0)


def _epoch(iso_ts: str | None) -> float:
    if not iso_ts:
        return 0.0
    try:
        ts = datetime.fromisoformat(iso_ts.replace("Z", "+00:00"))
    except ValueError:
        return 0.0
    return ts.timestamp()


def compute_sort_key(item: dict, strategy: str, cfg: dict, now: datetime):
    """Return a comparable tuple; entries sort with ``reverse=True``.

    Shape: ``(bucket, primary, tiebreak)`` — bucket -1 = no repo metadata
    (sinks, stable original order via equal keys), 0 = active bucket,
    1 = featured bucket. Values are floats so buckets stay comparable.
    """
    has_data = item["repo"] is not None and (
        item["last_active"] is not None or item["stars"] is not None
    )
    if not has_data:
        return (-1, 0.0, 0.0)
    stars = float(item["stars"] or 0)
    active = _epoch(item["last_active"])

    if strategy == "stars":
        return (1, stars, active)
    if strategy == "stars-weighted":
        days = _days_since(item["last_active"], now)
        half_life = float(cfg["half_life_days"])
        score = stars * (0.5 ** (days / half_life)) if days != float("inf") else 0.0
        return (1, score, stars)
    if strategy == "hybrid":
        if stars >= float(cfg["star_threshold"]):
            return (1, stars, active)
        return (0, active, stars)
    # default: last-active (epoch seconds as primary, stars as tiebreak)
    return (1, active, stars)


def sort_strategy_for(section: Section, cfg: dict) -> str:
    override = cfg["sections"].get(section.title, {})
    return override.get("strategy", cfg["strategy"])


def sort_blocks(section: Section, cfg: dict, now: datetime) -> None:
    strategy = sort_strategy_for(section, cfg)
    section.strategy = strategy
    if strategy == "manual":
        return
    items = [b for b in section.blocks if b.item is not None]
    if len(items) < 2:
        return
    ordered = sorted(
        items,
        key=lambda b: compute_sort_key(b.item, strategy, cfg, now),
        reverse=True,
    )
    iter_ordered = iter(ordered)
    section.blocks = [
        next(iter_ordered) if b.item is not None else b for b in section.blocks
    ]


# ---------------------------------------------------------------------------
# Output: README + JSON
# ---------------------------------------------------------------------------


def render_readme(doc: dict) -> str:
    out = list(doc["preamble"])
    for section in doc["sections"]:
        out.append(section.title_line)
        for block in section.blocks:
            out.extend(block.lines)
        for sub in section.subsections:
            out.append(sub.title_line)
            for block in sub.blocks:
                out.extend(block.lines)
    return "\n".join(out)


def build_json(doc: dict, cfg_strategy: str, now: datetime) -> dict:
    counts = {"categories": 0, "items": 0, "tracked_repos": 0}

    def item_to_json(item: dict):
        counts["items"] += 1
        obj = {
            "name": item["name"],
            "url": item["url"],
            "description": item["description"],
        }
        if item["repo"]:
            obj["repo"] = item["repo"]
            obj["forge"] = item["forge"]
            obj["stars"] = item["stars"]
            obj["last_active"] = item["last_active"]
            counts["tracked_repos"] += 1
        if item["zap"]:
            obj["zap"] = item["zap"]
        if item["children"]:
            obj["children"] = [item_to_json(c) for c in item["children"]]
        return obj

    def blocks_to_items(blocks, strategy):
        items = []
        for block in blocks:
            if block.item is None:
                continue
            obj = item_to_json(block.item)
            obj["sort_strategy"] = strategy
            items.append(obj)
        return items

    categories = []
    for section in doc["sections"]:
        counts["categories"] += 1
        strategy = section.strategy or cfg_strategy
        category = {"name": section.title, "sort_strategy": strategy, "items": blocks_to_items(section.blocks, strategy)}
        subs = []
        for sub in section.subsections:
            sub_items = blocks_to_items(sub.blocks, strategy)
            if sub_items:
                subs.append({"name": sub.title, "sort_strategy": sub.strategy or strategy, "items": sub_items})
        if subs:
            category["subcategories"] = subs
        categories.append(category)

    return {
        "_meta": {
            "generated_at": now.strftime("%Y-%m-%dT%H:%M:%SZ"),
            "source": "README.md",
            "sort_strategy": cfg_strategy,
            "counts": counts,
        },
        "categories": categories,
    }


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------


def load_config(path: Path) -> dict:
    config = json.loads(json.dumps(DEFAULT_CONFIG))  # deep copy
    if path.exists():
        user = json.loads(path.read_text(encoding="utf-8"))
        config.update(user)
        for key in ("fetch", "sections"):
            config.setdefault(key, DEFAULT_CONFIG[key])
            config[key] = {**DEFAULT_CONFIG.get(key, {}), **user.get(key, {})}
    return config


def attach_children(doc: dict) -> None:
    """Fold indented continuation lines into ``children`` of their parent item."""
    for section in doc["sections"]:
        for owner in section.all_blocks():
            for block in owner.blocks:
                if block.item is None:
                    continue
                for line in block.lines[1:]:
                    child = parse_item_line(line)
                    if child is not None:
                        block.item["children"].append(child)


def main(argv=None) -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--readme", default="README.md")
    parser.add_argument("--config", default="sort.config.json")
    parser.add_argument("--strategy", help="override config strategy")
    parser.add_argument("--meta-cache", default="data/repo-meta.json")
    parser.add_argument("--data-out", default="data/awesome-nostr.json")
    parser.add_argument("--no-fetch", action="store_true", help="use cached meta only")
    parser.add_argument("--check", action="store_true", help="exit 1 if README is stale")
    args = parser.parse_args(argv)

    repo_root = Path(args.readme).resolve().parent
    cfg = load_config(repo_root / args.config)
    if args.strategy:
        cfg["strategy"] = args.strategy
    if cfg["strategy"] not in VALID_STRATEGIES:
        parser.error(
            f"unknown strategy {cfg['strategy']!r}; valid: {', '.join(sorted(VALID_STRATEGIES))}"
        )

    readme_path = repo_root / args.readme
    original = readme_path.read_text(encoding="utf-8")
    doc = parse_readme(original)
    attach_children(doc)

    cache_path = repo_root / args.meta_cache
    cache = {"repos": {}}
    if cache_path.exists():
        cache = json.loads(cache_path.read_text(encoding="utf-8"))
        cache.setdefault("repos", {})

    if not args.no_fetch and not args.check:
        pending = {}
        for section in doc["sections"]:
            for owner in section.all_blocks():
                for block in owner.blocks:
                    if block.item is None or not block.item["repo"]:
                        continue
                    for item in [block.item, *block.item["children"]]:
                        if not item["repo"]:
                            continue
                        key = f"{item['forge']}:{item['repo']}"
                        pending[key] = (item["repo"], item["forge"])
        pending = {k: v for k, v in pending.items() if v[0] and v[1]}
        known = {k for k in pending if k in cache["repos"]}
        print(f"fetching metadata for {len(pending)} repos "
              f"({len(pending) - len(known)} new, {len(known)} cached)")
        refresh_repo_meta(pending, cache, cfg)
        cache_path.parent.mkdir(parents=True, exist_ok=True)
        cache_path.write_text(
            json.dumps(cache, ensure_ascii=False, indent=1, sort_keys=True) + "\n",
            encoding="utf-8",
        )

    tracked, with_meta = apply_meta_to_doc(doc, cache)

    now = datetime.now(timezone.utc)
    for section in doc["sections"]:
        for owner in section.all_blocks():
            sort_blocks(owner, cfg, now)

    updated = render_readme(doc)
    if updated != original:
        if args.check:
            print("README.md is stale: entries not in configured sort order", file=sys.stderr)
            return 1
        readme_path.write_text(updated, encoding="utf-8")
        print("README.md updated")
    else:
        print("README.md already up to date")

    if not args.check:
        data_path = repo_root / args.data_out
        data_path.parent.mkdir(parents=True, exist_ok=True)
        snapshot = build_json(doc, cfg["strategy"], now)
        data_path.write_text(
            json.dumps(snapshot, ensure_ascii=False, indent=1) + "\n", encoding="utf-8"
        )
        print(f"wrote {args.data_out}: {json.dumps(snapshot['_meta']['counts'])}")

    print(f"repos tracked: {tracked}, with metadata: {with_meta}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
