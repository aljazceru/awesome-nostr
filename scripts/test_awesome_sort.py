"""Unit tests for scripts/awesome_sort.py (run: python -m unittest discover -s scripts)."""

import sys
import unittest
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

import awesome_sort as aw  # noqa: E402

NOW = datetime(2026, 9, 1, tzinfo=timezone.utc)


def make_item(name, repo=None, forge="github", stars=None, active=None, children=None):
    return {
        "indent": 0,
        "raw_line": f"- [{name}](https://example.com)",
        "name": name,
        "url": "https://example.com",
        "description": f"{name} description",
        "repo": repo,
        "forge": forge,
        "zap": None,
        "stars": stars,
        "last_active": active,
        "children": children or [],
    }


CFG = {
    "strategy": "hybrid",
    "star_threshold": 500,
    "half_life_days": 180,
    "fetch": {"concurrency": 8, "timeout_seconds": 20, "retries": 1},
    "sections": {},
}


class ParseItemLineTest(unittest.TestCase):
    def test_basic_github_entry(self):
        item = aw.parse_item_line(
            "- [strfry](https://github.com/hoytech/strfry)![stars]"
            "(https://img.shields.io/github/stars/hoytech/strfry.svg?style=social)"
            " - C++ implementation backed by LMDB"
        )
        self.assertEqual(item["name"], "strfry")
        self.assertEqual(item["url"], "https://github.com/hoytech/strfry")
        self.assertEqual(item["description"], "C++ implementation backed by LMDB")
        self.assertEqual(item["repo"], "hoytech/strfry")
        self.assertEqual(item["forge"], "github")
        self.assertIsNone(item["zap"])
        self.assertEqual(item["indent"], 0)

    def test_zap_link_extracted_and_removed(self):
        for label in ("[? zap]", "[⚡ zap]"):
            line = (
                "- [Damus](https://damus.io/) - iOS, Android and Desktop client"
                f" {label}(https://nostr.net/grant/?zap=damus@sendsats.lol)"
            )
            item = aw.parse_item_line(line)
            self.assertEqual(item["description"], "iOS, Android and Desktop client")
            self.assertEqual(item["zap"], "https://nostr.net/grant/?zap=damus@sendsats.lol")
            self.assertIsNone(item["repo"])

    def test_nested_badge_repo_wins_over_non_repo_url(self):
        line = (
            "- [NosTracker](https://marcodpt.github.io/nostracker/) [![stars]"
            "(https://img.shields.io/github/stars/marcodpt/nostracker.svg?style=social)]"
            "(https://github.com/marcodpt/nostracker) - Information about NIP support"
        )
        item = aw.parse_item_line(line)
        self.assertEqual(item["repo"], "marcodpt/nostracker")
        self.assertEqual(item["url"], "https://marcodpt.github.io/nostracker/")
        self.assertEqual(item["description"], "Information about NIP support")

    def test_url_with_subpath_yields_repo_root(self):
        item = aw.parse_item_line(
            "- [Relayer Basic](https://github.com/fiatjaf/relayer/tree/master/examples/basic)"
            " - a simple relay"
        )
        self.assertEqual(item["repo"], "fiatjaf/relayer")

    def test_reserved_github_owners_are_not_repos(self):
        item = aw.parse_item_line("- [Trending](https://github.com/trending) - weekly")
        self.assertIsNone(item["repo"])

    def test_gitlab_and_codeberg(self):
        item = aw.parse_item_line(
            "- [Ephemerelay](https://gitlab.com/soapbox-pub/ephemerelay)![stars]"
            "(https://img.shields.io/gitlab/stars/soapbox-pub/ephemerelay.svg?style=social)"
            " - in-memory relay"
        )
        self.assertEqual(item["repo"], "soapbox-pub/ephemerelay")
        self.assertEqual(item["forge"], "gitlab")
        item = aw.parse_item_line(
            "- [Nerostr](https://codeberg.org/pluja/nerostr) - expensive relay"
        )
        self.assertEqual(item["repo"], "pluja/nerostr")
        self.assertEqual(item["forge"], "codeberg")

    def test_description_links_are_preserved(self):
        item = aw.parse_item_line(
            "- [Minds relay](https://gitlab.com/minds/infrastructure/nostr-relay)"
            " - a relay for [Minds](https://www.minds.com), an open network"
        )
        self.assertIn("[Minds](https://www.minds.com)", item["description"])

    def test_indented_child(self):
        item = aw.parse_item_line("  - [Zapoli](https://github.com/dezh-tech/ddsr/tree/main/zapoli) - sub")
        self.assertEqual(item["indent"], 2)
        self.assertEqual(item["repo"], "dezh-tech/ddsr")


class ParseReadmeTest(unittest.TestCase):
    FIXTURE = (
        "intro line\n"
        "\n"
        "## One\n"
        "\n"
        "- [Alpha](https://github.com/a/a)![stars](https://img.shields.io/github/stars/a/a.svg?style=social) - da\n"
        "- [Beta](https://beta.example.com) - db\n"
        "  - [Beta Live](https://live.beta.example.com) - instance\n"
        "  - [Beta Docs](https://docs.beta.example.com) - docs\n"
        "- [Gamma](https://github.com/c/c)![stars](https://img.shields.io/github/stars/c/c.svg?style=social) - dc\n"
        "\n"
        "## Two\n"
        "para before sub\n"
        "### Sub Two\n"
        "- [Delta](https://github.com/d/d)![stars](https://img.shields.io/github/stars/d/d.svg?style=social) - dd\n"
    )

    def setUp(self):
        self.doc = aw.parse_readme(self.FIXTURE)
        aw.attach_children(self.doc)

    def test_section_structure(self):
        titles = [s.title for s in self.doc["sections"]]
        self.assertEqual(titles, ["One", "Two"])
        self.assertEqual(self.doc["preamble"], ["intro line", ""])
        self.assertEqual([s.title for s in self.doc["sections"][1].subsections], ["Sub Two"])

    def test_children_attached(self):
        blocks = [b for b in self.doc["sections"][0].blocks if b.item]
        self.assertEqual(len(blocks), 3)
        self.assertEqual(
            [c["name"] for c in blocks[1].item["children"]], ["Beta Live", "Beta Docs"]
        )

    def test_loose_blocks_preserved(self):
        loose = [b for b in self.doc["sections"][1].blocks if b.item is None]
        self.assertEqual([l for b in loose for l in b.lines], ["para before sub"])

    def test_render_roundtrip_identity(self):
        self.assertEqual(aw.render_readme(self.doc), self.FIXTURE)

    def test_fenced_code_blocks_are_not_items(self):
        text = (
            "## Contributing\n"
            "text before\n"
            "```\n"
            "- [Fake Project](https://example.com) - placeholder [? zap](https://nostr.net/grant/?zap=x@y.com)\n"
            "```\n"
            "- [Real](https://github.com/r/r)![stars](https://img.shields.io/github/stars/r/r.svg?style=social) - real\n"
        )
        doc = aw.parse_readme(text)
        aw.attach_children(doc)
        items = [b.item for b in doc["sections"][0].blocks if b.item]
        self.assertEqual([i["name"] for i in items], ["Real"])
        self.assertEqual(aw.render_readme(doc), text)


class SortTest(unittest.TestCase):
    def _section(self, items):
        section = aw.Section("Test", "## Test")
        section.blocks = [aw.Block([i["raw_line"]], item=i) for i in items]
        return section

    def test_hybrid_two_buckets(self):
        items = [
            make_item("A", "a/a", stars=600, active="2026-01-01T00:00:00Z"),
            make_item("B", "b/b", stars=550, active="2020-01-01T00:00:00Z"),
            make_item("C", "c/c", stars=100, active="2026-08-31T00:00:00Z"),
            make_item("D", "d/d", stars=100, active="2026-01-01T00:00:00Z"),
            make_item("E", "e/e", stars=0, active="2026-08-31T00:00:00Z"),
            make_item("F"),
        ]
        section = self._section(items)
        aw.sort_blocks(section, CFG, NOW)
        names = [b.item["name"] for b in section.blocks]
        # featured bucket by stars; active bucket by recency (stars tiebreak):
        # E is stale-free (last active same day as C) so it outranks D (active Jan)
        self.assertEqual(names, ["A", "B", "C", "E", "D", "F"])

    def test_hybrid_threshold_boundary_is_inclusive(self):
        item = make_item("A", "a/a", stars=500, active="2020-01-01T00:00:00Z")
        key = aw.compute_sort_key(item, "hybrid", CFG, NOW)
        self.assertEqual(key[0], 1)
        item = make_item("B", "b/b", stars=499, active="2020-01-01T00:00:00Z")
        key = aw.compute_sort_key(item, "hybrid", CFG, NOW)
        self.assertEqual(key[0], 0)

    def test_hybrid_threshold_configurable(self):
        cfg = dict(CFG, star_threshold=1000)
        item = make_item("A", "a/a", stars=600, active="2020-01-01T00:00:00Z")
        self.assertEqual(aw.compute_sort_key(item, "hybrid", cfg, NOW)[0], 0)

    def test_last_active(self):
        items = [
            make_item("A", "a/a", active="2025-01-01T00:00:00Z"),
            make_item("B", "b/b", active="2026-08-31T00:00:00Z"),
            make_item("C"),
        ]
        section = self._section(items)
        aw.sort_blocks(section, CFG, NOW)
        self.assertEqual(
            [b.item["name"] for b in section.blocks], ["B", "A", "C"]
        )

    def test_stars(self):
        items = [
            make_item("A", "a/a", stars=10, active="2026-08-31T00:00:00Z"),
            make_item("B", "b/b", stars=1000, active="2001-01-01T00:00:00Z"),
        ]
        section = self._section(items)
        aw.sort_blocks(section, CFG, NOW)
        self.assertEqual([b.item["name"] for b in section.blocks], ["B", "A"])

    def test_stars_weighted_favours_fresh(self):
        cfg = dict(CFG, half_life_days=180)
        fresh_small = make_item("fresh", "f/f", stars=100, active="2026-08-01T00:00:00Z")
        old_big = make_item("old", "o/o", stars=10000, active="2020-01-01T00:00:00Z")
        self.assertGreater(
            aw.compute_sort_key(fresh_small, "stars-weighted", cfg, NOW)[1],
            aw.compute_sort_key(old_big, "stars-weighted", cfg, NOW)[1],
        )

    def test_manual_keeps_order(self):
        items = [
            make_item("A", "a/a", active="2020-01-01T00:00:00Z"),
            make_item("B", "b/b", active="2026-08-31T00:00:00Z"),
        ]
        section = self._section(items)
        cfg = dict(CFG, sections={"Test": {"strategy": "manual"}})
        aw.sort_blocks(section, cfg, NOW)
        self.assertEqual([b.item["name"] for b in section.blocks], ["A", "B"])

    def test_section_override(self):
        cfg = dict(CFG, sections={"Test": {"strategy": "stars"}})
        self.assertEqual(aw.sort_strategy_for(aw.Section("Test", "## Test"), cfg), "stars")

    def test_subsection_inherits_pinned_parent_strategy(self):
        parent = aw.Section("Most popular", "## Most popular")
        sub = aw.Section("Apps", "### Apps")
        parent.subsections.append(sub)
        cfg = dict(CFG, sections={"Most popular": {"strategy": "manual"}})
        self.assertEqual(aw.sort_strategy_for(parent, cfg), "manual")
        self.assertEqual(aw.sort_strategy_for(sub, cfg, parent_title="Most popular"), "manual")
        # a same-named override on the subsection itself still wins
        cfg2 = dict(CFG, sections={"Most popular": {"strategy": "manual"},
                                   "Apps": {"strategy": "stars"}})
        self.assertEqual(aw.sort_strategy_for(sub, cfg2, parent_title="Most popular"), "stars")

    def test_json_items_report_their_own_subsection_strategy(self):
        doc = aw.parse_readme(
            "## Cat\n"
            "- [A](https://github.com/a/a)![stars](https://img.shields.io/github/stars/a/a.svg?style=social) - a\n"
            "### Sub\n"
            "- [B](https://github.com/b/b)![stars](https://img.shields.io/github/stars/b/b.svg?style=social) - b\n"
        )
        aw.attach_children(doc)
        cfg = dict(CFG, sections={"Sub": {"strategy": "stars"}})
        for section in doc["sections"]:
            aw.sort_blocks(section, cfg, NOW)
            for sub in section.subsections:
                aw.sort_blocks(sub, cfg, NOW, parent_title=section.title)
        snap = aw.build_json(doc, "hybrid", NOW)
        cat = snap["categories"][0]
        self.assertEqual(cat["items"][0]["sort_strategy"], "hybrid")
        self.assertEqual(cat["subcategories"][0]["items"][0]["sort_strategy"], "stars")


class RepoExtractionTest(unittest.TestCase):
    def test_badge_svg_suffix(self):
        repo, forge = aw.extract_repo_from_badge(
            "https://img.shields.io/github/stars/atdixon/me.untethr.nostr-relay.svg?style=social"
        )
        self.assertEqual(repo, "atdixon/me.untethr.nostr-relay")
        self.assertEqual(forge, "github")


class DaysSinceTest(unittest.TestCase):
    def test_days_since(self):
        self.assertEqual(aw._days_since("2026-08-02T00:00:00Z", NOW), 30.0)
        self.assertEqual(aw._days_since(None, NOW), float("inf"))
        self.assertEqual(aw._days_since("not-a-date", NOW), float("inf"))


if __name__ == "__main__":
    unittest.main()
