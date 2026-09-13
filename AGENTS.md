# AGENTS.md

## Project overview

`awesome-nostr` is the source for nostr.net: a curated Nostr resource list plus a dependency-light static website and Lightning/Nostr zap flow.

- `README.md`: canonical curated resource list.
- `index.html`, `styles.css`, `script.js`: static site UI.
- `zap.js`: browser-side wallet, LNURL-pay, and NIP-57 orchestration.
- `zap-core.js`: dependency-free payment-critical logic shared by the browser and Node tests.
- `test/zap-core.test.js`: regression tests using Node's built-in test runner.
- `_config.yml`: GitHub Pages/Jekyll configuration.
- `.well-known/nostr.json`: NIP-05 metadata; preserve the leading-dot directory when serving or deploying.

## Repository and environment

The persistent checkout is `/home/exedev/workspace/awesome-nostr`. The `origin` remote uses the VM's attached GitHub integration:

```sh
git remote -v
git pull --ff-only
git push
```

Keep the integration URL (`https://github.int.exe.xyz/aljazceru/awesome-nostr.git`) as the remote; do not replace it with a raw GitHub URL or add credentials to files.

The devbox provides Node LTS, Python/uv, Go, Rust, Ruby/Jekyll, Java 21, Docker, Git/GitHub CLI, build tools, SQLite/PostgreSQL/Redis clients, and common shell utilities. User-installed runtimes are initialized by `~/.bashrc` and `~/.profile`.

## Build and run

The browser application has no compile step and no package install step.

Fast static preview:

```sh
python3 -m http.server 8000 --bind 0.0.0.0
```

Open `https://zwischenzug-or-kelpie.exe.xyz/` from outside the VM.

GitHub Pages/Jekyll preview:

```sh
jekyll serve --host 0.0.0.0 --port 8000
```

If port 8000 is occupied, use a port from 3000-9999 and open the matching exe.dev proxy URL.

## Test and validate

Run the complete automated suite:

```sh
node --test
```

Useful focused checks:

```sh
node --test test/zap-core.test.js
node --check script.js
node --check zap-core.js
node --check zap.js
```

For site changes, also preview in a browser and verify:

- desktop and narrow/mobile layouts;
- search, sidebar/menu, and dark-mode behavior;
- internal links and static assets;
- `.well-known/nostr.json` remains reachable;
- zap links still have a plain `lightning:` fallback;
- wallet connect, error, cancellation, and invoice-recovery states when zap code changes.

## Conventions

- Preserve the dependency-light, progressively enhanced static architecture. Do not introduce a framework or build system without a clear need.
- Use four-space indentation in JavaScript, HTML, and CSS, matching existing files.
- Keep browser JavaScript compatible with direct `<script>` loading; `zap-core.js` must continue to work in both browsers and CommonJS tests.
- Put payment/invoice parsing and state-machine logic in `zap-core.js` so it can be unit tested. Keep DOM and provider orchestration in `zap.js`.
- Treat zap code as payment-critical: validate untrusted endpoint data, escape injected content, preserve amount and description-hash checks, and never silently increase a payment amount.
- Add regression tests for every payment/security bug fix. Use dependency-free fixtures where practical.
- Keep `README.md` entries concise: `- [Name](URL) - description`; add a stars badge for GitHub projects when consistent with the surrounding section.
- Place resources in the most specific existing section and avoid duplicate entries. Preserve intentional section ordering; do not reformat the entire large README for a small edit.
- Do not commit secrets, private keys, wallet connection strings, generated `_site/` output, or `node_modules/`.
- Keep changes focused and reviewable. Before pushing, run `node --test` and inspect `git diff --check` plus `git status`.

## Git workflow

```sh
git switch -c <short-topic-name>
# edit and test
git diff --check
git status --short
git add <files>
git commit -m "<type>: <concise summary>"
git push
```

Use conventional, imperative commit subjects such as `docs:`, `fix:`, `feat:`, `test:`, or `chore:`. Do not force-push shared branches or rewrite unrelated history.
