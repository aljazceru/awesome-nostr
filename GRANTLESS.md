# grantless — zappable funding for every project on nostr.net

**One-liner:** nostr.net keeps being the curated awesome-list, but every project entry can now carry its own lightning address. Any visitor connects their wallet once (Bitcoin Connect / NWC), ticks the projects they want to support, and zaps them all in one go — with **full NIP-57 zap receipts**, so every payment shows up in feeds and on Zaplife. Nostr.NET itself is always pre-ticked as the curator/host. No middlemen, no grant committee, no "one size fits all" — just markdown, PRs, and sats.

---

## 1. The problem this solves

- People have wanted a no-gatekeeper alternative to Geyser/OpenSats for nostr projects *for a while*. `grantless.org` exists but gets no traction — it has no distribution. nostr.net already has the distribution: it's *the* list people link to.
- Projects on the list have no funding link at all today; discoverability ≠ support.
- The site itself (relay, curation work) has no obvious "fund this" path.

The insight: the list **is** the funding platform. Turn entries into zappable entities without changing the low-tech, markdown-PR workflow that made it the best list in the first place.

## 2. The markdown convention (single source of truth)

Keep the existing format, add optional standardized chips at the end of an entry:

```markdown
- [Amethyst](https://www.amethyst.social/) - Android-only app [⚡ zap](lightning:vitor@amethyst.social) [donate](https://geyser.fund/project/xyz)
- [Damus](https://damus.io/) - The OG nostr client for iOS [⚡ zap](lightning:jb55@damus.io)
```

Rules:

- **`[⚡ zap](lightning:...)`** — a `lightning:` URI holding an LN address (or LNURL). This is what makes an entry *zappable*. Parsed with `/\[⚡\s*zap\]\(lightning:([^)\s]+)\)/i`.
- **`[donate](https://...)`** — optional external funding link (Geyser, OpenSats, Patreon, whatever). Rendered as a second chip. No one-size-fits-all: the project picks.
- Everything else about entries stays exactly as it is. GitHub renders the chips as normal links, so the README stays perfectly readable on GitHub too.
- Adding/changing a zap address happens via PR — same review flow as today. That's the "grantless" model: anyone can walk in, but the curator merges.

## 3. Site integration (nostr.net itself)

1. **Zap chip on every card** — in `createResourceCard()`, parse the raw entry; if a lightning address exists, render a `⚡ Zap` button on the card:
   - Not connected: click opens the **zap dialog** — scannable LNURL QR (machine-verified with a real decoder), the LN address with copy button, an "Open wallet app" `lightning:` link, and a "connect a wallet" path. Zero connection required.
   - Connected: full in-page LNURL-pay + NIP-57 zap (see §5).
2. **`donate` chip** — simple external link chip.
3. **Nav zap button** — a small ⚡ in the top nav ("Fund nostr.net") zapping the site's own lightning address: **`aljaz@minibits.cash`** (the relay/curation tip jar).
4. **"Zappable projects" section on the homepage** — the homepage aggregates every entry carrying a zap chip into a dedicated sidebar section (nostr.net pinned at the top as curator & host). It grows automatically as PRs add addresses — the main list *is* the funding directory. The homepage banner links to this section.
5. Banner/link on the homepage pointing to the Grant page (§4) for the batch-zap flow.

## 4. The Grant page — the "grantless" experience

A single static page at **`nostr.net/grant`** (`grant.html` with a Jekyll permalink; no backend, deployable alongside the site; the `grantless.nostr.net` subdomain is a pure DNS/alias question — see §8).

UX flow:

1. **Load** — page fetches `README.md`, extracts all entries with lightning addresses → grid of zappable projects (name, favicon, category, description). Category filter chips ("clients", "relays", "libraries", …) since we know the section each entry lives in.
2. **Select** — checkbox per project. Pinned at the top: **nostr.net (curator & host) · `aljaz@minibits.cash`**, checked by default (uncheckable). Quick-select presets: "Select all", "Top projects", per-category.
3. **Amount** — one "sats per project" field (default 1000), live total = `N × amount`. (v2: per-project override.)
4. **Connect** — `<bc-button>` from Bitcoin Connect (NWC string, Alby Hub, extension, LNC…). 
5. **Zap** — "Zap 12 projects · 12,000 sats" → sequential loop with visible per-row progress (full NIP-57 flow per project):
   - fetch LNURL-pay params (`https://host/.well-known/lnurlp/user`)
   - build & sign a kind 9734 zap-request event (`p`-tag = recipient `nostrPubkey`; sender via NIP-07 or anonymous — see §5; comment if `commentAllowed`)
   - request invoice with the zap request in the `nostr` param at `amount` msat (clamp to recipient's min/max, surface any clamping)
   - pay via WebLN / NWC `pay_invoice`
   - recipient's server publishes the kind 9735 zap receipt → row shows ✅ with a link to the receipt, ❌ with a "retry" affordance
   - ~400ms pause between zaps (wallet friendliness)
6. **Summary** — "You zapped N projects, X sats sent, N zap receipts published." + **share on nostr** button (NIP-07): *"I just zapped N nostr projects via nostr.net/grant ⚡"* — the viral loop for the podcast shill.

Edge cases: recipient LNURL down or no CORS → fall back to the `lightning:` link (click-to-open-wallet). Recipient LNURL doesn't support zaps (`allowsNostr` false / no `nostrPubkey`) → degrade that row to a plain payment, explicitly labeled "no zap receipt". Invoice below minSendable → clamp with a note. Disconnect mid-batch → stop, keep state, resume after reconnect.

## 5. Wallet layer (all client-side)

- **Connection:** Bitcoin Connect (`@getalby/bitcoin-connect@3.12.3` via esm.sh, `<bc-button>` in the nav; namespace import → `window.bitcoinConnect`). **Important:** BC does *not* set `window.webln` for NWC/LNC/LNbits — the connected WebLN provider is delivered via `onConnected(provider)` (fires immediately for previously-connected wallets). Both provider sources (extension `window.webln` + BC provider) are unified behind `getProvider()`; `launchModal()` is preferred over clicking inside shadow DOM. **Shipped on the homepage** — this part of Phase 2 landed early. No backend, no custody, no accounts — the site never sees keys.
- **Full NIP-57 in-page, verified end-to-end** (kind 9734 zap request with `p`/`relays`/`amount`/`lnurl` tags → invoice with `nostr` param → WebLN `sendPayment`). Implementation notes: the UMD CDN build has externalized globals — use the esm.sh module import instead; there is no `bc:connected` window event, so connection is detected by `window.webln` presence (+poll after opening the modal); anonymous zap receipts are signed client-side with `@noble/curves/secp256k1` schnorr (lazy-loaded) when no NIP-07 signer exists.
- **Sender identity, in order of preference:** ① **anonymous by default** (fast — no signing prompt per zap): ephemeral key + `anon` tag, still a valid zap receipt; after an anon zap, a one-time "zap as me instead" link in the toast opts into ② **attributed zaps** via NIP-07 (remembered in localStorage). Nobody is blocked from receipt-grade zaps by lacking a signer, and extension users don't get a signer popup on every zap.
- **Payment:** we drive LNURL-pay ourselves (plain `fetch`es) and pay invoices through the WebLN/NWC provider (`window.webln.sendPayment` / direct NWC `pay_invoice`), which gives us per-zap control in the batch loop.
- **Fallback, not a mode:** a recipient LNURL without zap support degrades that single row to a plain payment (labeled). Everything else stays receipt-grade.
- **Dead-wallet recovery:** if the connected wallet fails to pay (e.g. NWC wallet asleep — `no info event (kind 13194)`), the zap holds its already-fetched invoice and offers **Retry** (resolving the *most recently connected* provider at click time, so a BC reconnect beats a dead extension) or **Pay by QR** — the invoice QR (zap receipt baked in) can be paid by *any* wallet, phone-scan included. Pure client-side, GitHub-Pages friendly.
- **Invoice validation (LUD-06 + NIP-57):** every invoice is fully decoded (`zap-core.js`, unit-tested in `test/zap-core.test.js`) before payment — bech32 checksum, mainnet-only hrp, parsed amount **must equal the requested msat** (hard fail; blocks a malicious callback returning a higher-value invoice), plus expiry. For zaps, the description hash is checked against the **serialized zap-request event** (the exact string sent to the callback): bound → UI claims a verified receipt; unbound (e.g. primal embeds a constant hash, minibits omits it) → payment proceeds but the UI honestly says "receipt unverified" / "no zap receipt" and never claims baking. rizful (Zapstore) binds correctly and is reported as verified. Untrusted invoices are never interpolated into HTML — assigned via DOM properties.
- **Payment-failure triage:** wallet rejections are classified — transient connection failures (`13194`, timeouts, "not connected") get the recovery panel (Retry with the most-recently-connected provider / Pay by QR); cancellations and terminal errors (insufficient balance, invalid invoice) go through the ordinary error toast with the provider's message. One recovery at a time: a second failed zap can't destroy the pending invoice's controls (blocked with a hint + dismissible via ✕).

## 6. Trust & moderation

- Zap addresses go through the same PR review as everything else; the curator pays extra attention to *changes* to existing addresses (impersonation vector: fake "Amethyst" with attacker's address).
- Nice-to-have badge: "verified" when the address was added by a PR from the project's own domain/maintainer — can come later, review is enough for v1.
- The curator default-zap is clearly labeled ("nostr.net — curator & host") and can be unchecked. Transparent, not sneaky.
- NIP-57 receipts double as **public auditability**: anyone can verify on Zaplife/relays which projects actually receive zaps — hard to run a silent skim.

## 7. Plan (deliberately vibe-codeable)

| Phase | Scope | Effort |
|---|---|---|
| **0** | Markdown convention + contributing docs + PR template + seed ~15–25 flagship entries with known-good addresses (via PRs/issues to owners) | ~½ day (mostly outreach) |
| **1** | Parser + zap/donate chips on cards + nav "Fund nostr.net" button | ~½ day |
| **2** | `/grant` page: checkboxes, presets, amount, Bitcoin Connect, sequential NIP-57 zap loop (zap requests + receipts, anonymous fallback), progress/retry/summary, share button | ~1.5–2 days |
| **3** | per-project amounts, verified badge, grantless subdomain alias, "Zap Day" event mode | later |

**"Live by Thursday" scope = Phases 0–2** (~2.5–3 days total — zap receipts are merged into launch scope, not deferred). Even Phase 1 alone is shillable on the podcast ("every project on nostr.net is now zappable, send a PR to add yours").

## 8. Open questions

1. ~~**Curator lightning address**~~ **Resolved:** `aljaz@minibits.cash` — tip jar for the relay/curation work, pinned + pre-checked on `/grant`.
2. **Subdomain or path?** `nostr.net/grant` is zero-infra; `grantless.nostr.net` is a better story on a podcast but GitHub Pages serves one custom domain per site → likely a redirect rule or tiny separate repo. Recommend: launch on `/grant`, alias later if the name sticks.
3. **Bootstrap addresses** — **Resolved for launch: 31 projects seeded** (see appendix). Confirmed so far via owner-PR: **Hivetalk → `bitkarrot@primal.net`**. The rest were harvested from projects' own sources (repo donation sections, official npub profiles, homepage links) and live-verified — see appendix. Still missing flagship addresses for: snort, Primal, Amethyst, YakiHonne, Iris, Habla, highlighter, zap.stream (owners should PR them).
4. **Sender identity default** — remember "identified via NIP-07" vs "anonymous" per visit (localStorage), or ask each batch?
5. **Batch amount defaults** — flat 1000 sats per project, or let each entry advertise a suggested amount in markdown?

---

## Appendix: seeded zap addresses & provenance

All addresses below are **live-verified** (lnurlp endpoint responds, zap-receipt support noted) and sourced from the project itself. Sources: `repo` = donation section in the project's own GitHub README · `npub` = lud16 on the project's official nostr profile (npub resolved from the project's own domain via `.well-known/nostr.json` or homepage) · `site` = project's own website.

| Project | Address | Source | NIP-57 receipts |
|---|---|---|---|
| nostr.net (curator) | aljaz@minibits.cash | owner | ✅ |
| Hivetalk | bitkarrot@primal.net | owner PR | ✅ |
| Damus | damus@sendsats.lol | npub + site (damus.io lightning: link → sendsats.lol/.well-known/lnurlp/damus) | ✅ |
| Coracle | hodlbod@getalby.com | npub (coracle.social) | ✅ |
| Zapstore | zapstore@rizful.com | npub (zapstore.dev) | ✅ |
| Nos | strongsnail1@primal.net | npub (nos.social) | ✅ |
| noStrudel | nostrudel@npub.cash | npub (nostrudel.ninja) | ✅ |
| Nostur | weathereddarkness25@getalby.com | npub (nostur.com) | ✅ |
| Jumble | codytseng@getalby.com | repo | ✅ |
| Vega | jure@getalby.com | repo | ✅ |
| Mostro | mostro_p2p@sats.mobi | npub (mostro.network) | ✅ |
| nostrich.love | nostrich@wallet.yakihonne.com | npub | ✅ |
| Decent Newsroom | decentnewsroom@rizful.com | npub | ✅ |
| Nuxstr | sebastian@lnd.sebastix.com | repo | ✅ |
| Fenrir-s | parkinghot99@walletofsatoshi.com | repo | ✅ |
| nostr-filter-relay | rifat@getalby.com | repo | ✅ |
| hunos.hu | hunosrelay@minibits.cash | npub | ✅ |
| nostress | hberaud@nostrcheck.me | repo | ✅ (redirects → primal) |
| noscrypt | chiptuner@coinos.io | repo | ✅ |
| nostr-hooks | sepehr@getalby.com | repo | ✅ |
| persian nostr book | kehiy@walletofsatoshi.com | repo | ✅ |
| NostrComments | slurpnc@coinos.io | repo | ✅ |
| cafe-society.news | cafe@getalby.com | repo | ✅ |
| Obsidian Nostr Writer | magoo@getalby.com | repo | ✅ |
| toll-booth | profusemeat89@walletofsatoshi.com | repo | ✅ |
| nostrcheck.me | public@nostrcheck.me | npub | ✅ (redirects → walletofsatoshi) |
| nostr.build | nostrbob@primal.net | npub | ✅ |
| NostrMedia.com | b0cc79@wallet.yakihonne.com | npub | ✅ |
| Zap Cooking | zapcooking@sats.zap.cooking | npub | ✅ |
| Zaplife | pablof7z@primal.net | npub | ✅ |
| Plebstr | passivebit94@walletofsatoshi.com | npub | ✅ |
| ZeusLN | tips@pay.zeusln.app | repo (BTCPay lnurl) | ❌ plain pay only |

**Found but dead** (address published by project but endpoint down — not added): LifPay hello@lifpay.me · Flamingo t4t5@t4t5.com · Openvibe matej@openvibe.social · nostr-fetch jiftechnify@eclair.c-stellar.net · Nostros nostros@getalby.com.

**Skipped** (example/placeholder addresses in repos, wrong owner, or project not on the list): nostr-to-rss, mostro-cli, gitnostr fork (address belongs to upstream author), Fountain app (not listed), aka-extension (not listed).
