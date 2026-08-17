// ===== grantless: in-page zapping via Bitcoin Connect (WebLN / NWC) =====
// Loaded after script.js. Intercepts .zap-chip and #fundButton clicks:
//   - wallet connected  → LNURL-pay + NIP-57 zap receipt, paid in-page
//   - no wallet         → opens Bitcoin Connect modal, zaps pending target after connect
// Falls back to plain lightning: links if JS/zap flow fails (links are never broken).

(() => {
    // shared, unit-tested core (zap-core.js must load before this script)
    const { lnurlpUrl, lnurlEncode, escapeHtml, sha256Hex, decodeBolt11, createProviderSelector,
            isTransientPaymentError, createZapGuard, resolveZapAmount } = zapCore;

    const ZAP_SATS = 1000;               // default zap amount for chips
    const ZAP_MEMO = 'nostr.net zap';    // so recipients know where it came from
    const ZAP_RELAYS = ['wss://relay.nostr.net', 'wss://relay.damus.io', 'wss://nos.lol'];
    const NOBLE_URL = 'https://esm.sh/@noble/curves@1.4.0/secp256k1'; // lazy: only for anon zap receipts

    let pendingZap = null;               // { lnAddress, name, chip }
    let pollTimer = null;
    // serializes zaps + protects a pending recovery invoice (lifecycle in zap-core, unit-tested)
    const guard = createZapGuard({ hasRecoveryPanel: () => !!document.querySelector('.zap-recovery') });

    // clear a chip's transient UI state (used on every recovery exit)
    const clearChip = (chip) => { if (chip) { delete chip.dataset.state; delete chip.dataset.zapping; } };

    // ---------- small utils ----------
    const hex = (bytes) => [...bytes].map(b => b.toString(16).padStart(2, '0')).join('');
    const unhex = (h) => new Uint8Array(h.match(/../g).map(x => parseInt(x, 16)));
    function toast(msg, type = 'info', ms = 4200) {
        document.querySelectorAll('.zap-toast').forEach(t => t.remove());
        const el = document.createElement('div');
        el.className = `zap-toast zap-toast-${type}`;
        el.setAttribute('role', 'status');
        el.innerHTML = msg;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), ms);
    }

    // ---------- LNURL ----------
    async function fetchLnurlParams(address) {
        const r = await fetch(lnurlpUrl(address));
        if (!r.ok) throw new Error(`lnurlp ${r.status}`);
        const j = await r.json();
        if (j.status === 'ERROR') throw new Error(j.reason || 'lnurlp error');
        if (j.tag !== 'payRequest') throw new Error('not a pay request');
        return j;
    }

    async function fetchInvoice(params, msat, zapEvent) {
        const cb = new URL(params.callback);
        cb.searchParams.set('amount', String(msat));
        if (zapEvent) {
            cb.searchParams.set('nostr', JSON.stringify(zapEvent));
        } else if (params.commentAllowed) {
            // plain payment (no zap support): memo via LNURL comment param
            cb.searchParams.set('comment', ZAP_MEMO.slice(0, params.commentAllowed));
        }
        const r = await fetch(cb);
        const j = await r.json();
        if (j.status === 'ERROR') throw new Error(j.reason || 'invoice error');
        if (!j.pr) throw new Error('no invoice');
        // LUD-06: amount must match what we asked for (hard fail).
        // NIP-57: for zaps the description hash must commit to the serialized
        // zap-request event (the exact string sent above) — when it does, the
        // receipt is verifiably baked in; when a provider doesn't comply we
        // still send/pay but must not claim a guaranteed receipt.
        const committedDesc = zapEvent ? JSON.stringify(zapEvent) : params.metadata;
        const check = await decodeBolt11(j.pr, { msat, metadata: committedDesc });
        if (!check.ok) throw new Error(check.error);
        // receiptBound only for actual zaps whose invoice commits to the zap
        // request — a plain (metadata-bound) invoice must never claim one
        return { pr: j.pr, receiptBound: !!zapEvent && check.metadataHashOk === true };
    }

    // ---------- NIP-57 zap request ----------
    // Anonymous by default (fast: no extension signing prompt per zap).
    // Users can opt in to attributed zaps via the "zap as me" link — remembered.
    const SIGN_AS_ME_KEY = 'grantless:signAsMe';
    const signAsMe = () =>
        localStorage.getItem(SIGN_AS_ME_KEY) === '1' &&
        !!(window.nostr?.signEvent && window.nostr?.getPublicKey);

    async function buildZapRequest(params, msat, address) {
        if (!params.allowsNostr || !params.nostrPubkey) return { event: null, anon: false };

        const tags = [
            ['p', params.nostrPubkey],
            ['relays', ...ZAP_RELAYS],
            ['amount', String(msat)],
            ['lnurl', lnurlEncode(lnurlpUrl(address))]
        ];

        // Attributed zap — only when the user opted in (avoids a signer prompt per zap)
        if (signAsMe()) {
            try {
                const pubkey = await window.nostr.getPublicKey();
                const ev = await window.nostr.signEvent({
                    kind: 9734, pubkey, created_at: Math.floor(Date.now() / 1000),
                    tags, content: ZAP_MEMO
                });
                return { event: { ...ev, pubkey: ev.pubkey || pubkey }, anon: false, attributed: true };
            } catch (e) {
                console.warn('NIP-07 signing failed, falling back to anon zap', e);
            }
        }

        // …otherwise an ephemeral key → still a valid (anonymous) zap receipt
        try {
            const { schnorr } = await import(NOBLE_URL);
            const priv = hex(crypto.getRandomValues(new Uint8Array(32)));
            const pubkey = hex(schnorr.getPublicKey(priv));
            const created_at = Math.floor(Date.now() / 1000);
            const event = { pubkey, created_at, kind: 9734, tags: [...tags, ['anon', '']], content: ZAP_MEMO };
            const id = await sha256Hex(JSON.stringify([0, pubkey, created_at, 9734, event.tags, event.content]));
            event.id = id;
            event.sig = hex(schnorr.sign(unhex(id), priv));
            return { event, anon: true };
        } catch (e) {
            console.warn('anon signing unavailable, paying without receipt', e);
            return { event: null, anon: false };
        }
    }

    // ---------- payment ----------
    // Provider sources: ① window.webln (extension) ② Bitcoin Connect's
    // connected provider (NWC / LNC / LNbits) — handed to us via onConnected(),
    // it is NOT set on window.webln. The selector prefers whichever provider
    // connected most recently, so a BC reconnect after a dead extension wins.
    let bcProvider = null;
    const selector = createProviderSelector({ getWebln: () => window.webln, getBc: () => bcProvider });
    const getProvider = selector.get;
    const weblnReady = () => !!getProvider();

    // enable() once per provider+session, started as early as possible (prompt
    // shows immediately on click instead of after the lnurlp/invoice round trips)
    let enablePromise = null;
    let enabledFor = null;
    const ensureEnabled = (provider) => {
        if (enabledFor !== provider) { enablePromise = null; enabledFor = provider; }
        if (!enablePromise) {
            enablePromise = (async () => {
                if (provider?.enable) { try { await provider.enable(); } catch (e) { /* already enabled */ } }
            })();
        }
        return enablePromise;
    };

    async function payInvoice(pr, provider) {
        if (!provider?.sendPayment) throw new Error('wallet not connected');
        await ensureEnabled(provider);
        return provider.sendPayment(pr);
    }

    // ---------- lnurlp params (cached + prefetched on hover) ----------
    const lnurlCache = new Map(); // address → Promise<params>
    function fetchLnurlParamsCached(address) {
        if (!lnurlCache.has(address)) {
            lnurlCache.set(address, fetchLnurlParams(address).catch(e => { lnurlCache.delete(address); throw e; }));
        }
        return lnurlCache.get(address);
    }

    // ---------- success / payment-recovery helpers ----------
    function finishZap({ chip, msat, event, anon, name, receiptBound }) {
        if (chip) { chip.dataset.state = 'zapped'; delete chip.dataset.zapping; }
        const sats = msat / 1000;
        // claims match what the invoice actually proves:
        //  bound  → the invoice commits to this zap request (receipt-bound);
        //           publishing still depends on the recipient's server
        //  unbound → zap request was sent, but the provider didn't commit it
        //  none   → plain payment
        let msg;
        if (event && receiptBound) {
            msg = `⚡ Zapped <strong>${escapeHtml(name)}</strong> ${sats} sats${anon ? ' (anon zap receipt bound)' : ' · zap receipt bound'}`;
        } else if (event) {
            msg = `⚡ Zapped <strong>${escapeHtml(name)}</strong> ${sats} sats (receipt unverified)`;
        } else {
            msg = `⚡ Sent <strong>${escapeHtml(name)}</strong> ${sats} sats (no zap receipt)`;
        }
        toast(msg, 'success', 6000);
        // one-time opt-in for attributed zaps — preference handling must never
        // be able to report a successful payment as failed
        try {
            if (anon && receiptBound && window.nostr?.signEvent && localStorage.getItem(SIGN_AS_ME_KEY) !== '1') {
                const t = document.querySelector('.zap-toast');
                if (t) {
                    const a = document.createElement('a');
                    a.href = '#';
                    a.className = 'zap-as-me';
                    a.textContent = 'zap as me instead';
                    a.addEventListener('click', (ev) => {
                        ev.preventDefault();
                        try { localStorage.setItem(SIGN_AS_ME_KEY, '1'); } catch (e) { /* non-fatal */ }
                        toast('Zaps will now be signed with your npub ⚡', 'success', 3000);
                    });
                    t.appendChild(document.createTextNode(' · '));
                    t.appendChild(a);
                }
            }
        } catch (prefErr) {
            console.warn('post-payment preference handling failed (payment already sent):', prefErr);
        }
    }

    // (invoice validation lives in zap-core.decodeBolt11 — full BOLT11 parse
    // with amount/description-hash checks; nothing untrusted reaches HTML)

    // wallet failed to pay, but we already hold a valid invoice: offer recovery.
    // NOTE: intentionally NOT using the .zap-toast class — toast() removes those,
    // and the recovery controls must survive reconnect notifications.
    function showPayRecovery({ name, invoice, msat, chip, event, anon, receiptBound }) {
        // defensive: never displace an existing recovery panel (zapBusy should
        // already prevent this, but the invoice controls are too costly to lose)
        if (document.querySelector('.zap-recovery')) {
            toast('A payment is still waiting — retry it, pay by QR, or dismiss it first.', 'info', 4500);
            return;
        }
        document.querySelectorAll('.zap-toast').forEach(t => t.remove());
        const el = document.createElement('div');
        el.className = 'zap-recovery';
        el.setAttribute('role', 'alert');
        // every exit path must clear the guard and the chip's error state
        const closeRecovery = () => { el.remove(); guard.recoveryCleared(); clearChip(chip); };
        el.innerHTML = `
            <button class="zap-recovery-close" aria-label="Dismiss pending payment">✕</button>
            <div class="zap-recovery-msg"><strong>${escapeHtml(name)}</strong> · ${Math.round(msat / 1000)} sats — your wallet didn’t answer over NWC.
            Open the wallet app (or reconnect via the ⚡ button), then retry — or pay the invoice with any wallet.</div>
            <div class="zap-toast-actions">
                <button class="zap-toast-btn" type="button" data-act="retry"><i class="fas fa-redo" aria-hidden="true"></i> Retry</button>
                <button class="zap-toast-btn zap-toast-btn-primary" type="button" data-act="qr"><i class="fas fa-qrcode" aria-hidden="true"></i> Pay by QR</button>
            </div>`;
        document.body.appendChild(el);

        el.querySelector('.zap-recovery-close').addEventListener('click', closeRecovery);

        el.querySelector('[data-act="retry"]').addEventListener('click', async (e) => {
            const btn = e.currentTarget;
            // resolve the provider at retry time: a reconnect (e.g. via the ⚡
            // button) creates a fresh bcProvider that must be used, not the
            // stale one captured when the zap first failed
            const provider = getProvider();
            const msg = el.querySelector('.zap-recovery-msg');
            if (!provider) {
                if (msg) msg.textContent = 'No wallet connected — reconnect via the ⚡ button, or use “Pay by QR”.';
                return;
            }
            btn.disabled = true;
            if (chip) { chip.dataset.zapping = '1'; chip.dataset.state = 'zapping'; }
            try {
                await payInvoice(invoice, provider);
            } catch (retryErr) {
                console.error('retry failed:', retryErr);
                btn.disabled = false;
                if (chip) { chip.dataset.state = 'error'; delete chip.dataset.zapping; }
                if (isTransientPaymentError(retryErr)) {
                    if (msg) msg.textContent = 'Still no answer from the wallet — try “Pay by QR”, or reconnect via the ⚡ button.';
                } else {
                    // terminal (canceled, insufficient balance, expired…):
                    // drop the panel, surface the provider's own message
                    closeRecovery();
                    toast(`Couldn\u2019t zap ${escapeHtml(name)}: ${escapeHtml(String(retryErr?.message || retryErr).slice(0, 140))}`, 'error', 7000);
                }
                return;
            }
            // paid — same rule as the direct path: never report failure now
            el.remove();
            guard.recoveryCleared();
            try {
                finishZap({ chip, msat, event, anon, name, receiptBound });
            } catch (uiErr) {
                console.error('post-payment UI failed (payment WAS sent):', uiErr);
                toast(`⚡ Payment sent — ${(msat / 1000)} sats to <strong>${escapeHtml(name)}</strong>.`, 'success', 8000);
            }
        });

        el.querySelector('[data-act="qr"]').addEventListener('click', () => {
            closeRecovery();
            showInvoiceModal({ name, invoice, msat, receiptBound });
        });
    }

    // pay an existing invoice with any wallet (QR / lightning: link)
    async function showInvoiceModal({ name, invoice, msat, receiptBound }) {
        const check = await decodeBolt11(invoice);
        if (!check.ok) {
            console.warn('refusing to show invalid invoice', check.error);
            toast(`Couldn’t build a payment link for ${escapeHtml(name)}: the server returned an invalid invoice (${check.error}).`, 'error', 7000);
            return;
        }
        closeZapModal();
        const backdrop = document.createElement('div');
        backdrop.className = 'zap-modal-backdrop';
        backdrop.innerHTML = `
            <div class="zap-modal" role="dialog" aria-modal="true" aria-label="Complete zap for ${escapeHtml(name)}">
                <button class="zap-modal-close" aria-label="Close">✕</button>
                <h3 class="zap-modal-title"><i class="fas fa-bolt" aria-hidden="true"></i> ${Math.round(msat / 1000)} sats → ${escapeHtml(name)}</h3>
                <div class="zap-qr-box"><div class="zap-qr" aria-hidden="true"></div></div>
                <p class="zap-modal-hint">${receiptBound
                    ? 'Scan with any wallet — this invoice is bound to the zap request; payment should publish the receipt via the recipient\u2019s server. Valid for a few minutes.'
                    : 'Scan with any wallet to pay. This provider doesn’t bind zap receipts to invoices, so the zap may not appear in feeds.'}</p>
                <div class="zap-modal-line">
                    <a class="zap-modal-btn zap-modal-btn-primary">
                        <i class="fas fa-wallet" aria-hidden="true"></i> Open wallet
                    </a>
                </div>
            </div>`;
        document.body.appendChild(backdrop);
        // assign the untrusted invoice via the DOM property (no HTML interpolation)
        backdrop.querySelector('.zap-modal-btn-primary').href = 'lightning:' + invoice;
        backdrop.querySelector('.zap-modal-close').addEventListener('click', closeZapModal);
        backdrop.addEventListener('click', (e) => { if (e.target === backdrop) closeZapModal(); });
        qrSvgForContent('lightning:' + invoice)
            .then(svg => { const box = backdrop.querySelector('.zap-qr'); if (box) box.innerHTML = svg; })
            .catch(e => { console.warn('invoice QR failed', e); backdrop.querySelector('.zap-qr-box')?.remove(); });
    }

    // ---------- main zap flow ----------
    async function zap(lnAddress, name, chip) {
        if (chip?.dataset.zapping === '1') return;
        // one payment at a time: an in-flight zap or a pending recovery invoice
        // must never be displaced by a second zap
        if (!guard.canStart()) {
            toast('A payment is still waiting — retry it, pay by QR, or dismiss it first.', 'info', 4500);
            return;
        }
        guard.start();
        if (chip) { chip.dataset.zapping = '1'; chip.dataset.state = 'zapping'; }

        try {
            toast(`⚡ Zapping <strong>${escapeHtml(name)}</strong>…`, 'info', 9000);
            const provider = getProvider();
            if (!provider) throw new Error('wallet not connected');
            // kick off wallet permission + lnurlp in parallel — the wallet's
            // approval prompt (if any) shows right away, not after the fetches
            const [params] = await Promise.all([
                fetchLnurlParamsCached(lnAddress),
                ensureEnabled(provider)
            ]);

            let msat = ZAP_SATS * 1000;
            // recipient-controlled range: never raise the amount silently —
            // a hostile minimum above the intended zap aborts (no auto-pay)
            const amt = resolveZapAmount({
                intendedMsat: msat,
                minSendable: params.minSendable,
                maxSendable: params.maxSendable
            });
            if (amt.error) throw new Error(amt.error);
            msat = amt.msat;
            if (amt.adjustedDown) toast(`Amount adjusted to ${msat / 1000} sats (recipient's maximum)`, 'info', 4000);

            const { event, anon } = await buildZapRequest(params, msat, lnAddress);
            const inv = await fetchInvoice(params, msat, event);

            try {
                await payInvoice(inv.pr, provider);
            } catch (payErr) {
                console.error('payment failed:', payErr);
                // Recovery (retry/QR) only makes sense for transient connection
                // failures — a wallet that might answer later. Cancellations,
                // insufficient balance, invalid/already-paid invoices are
                // terminal: report them through the ordinary error path.
                const transient = isTransientPaymentError(payErr);
                if (!transient) throw payErr;
                if (chip) { chip.dataset.state = 'error'; delete chip.dataset.zapping; }
                if (guard.recoveryShown()) {
                    showPayRecovery({ name, invoice: inv.pr, msat, chip, event, anon, receiptBound: inv.receiptBound });
                }
                return;
            }
            // payment succeeded — from here on, NO failure path may claim the
            // zap failed (that invites double-payment); UI hiccups degrade to
            // a plain success notice
            try {
                finishZap({ chip, msat, event, anon, name, receiptBound: inv.receiptBound });
            } catch (uiErr) {
                console.error('post-payment UI failed (payment WAS sent):', uiErr);
                toast(`⚡ Payment sent — ${(msat / 1000)} sats to <strong>${escapeHtml(name)}</strong>.`, 'success', 8000);
            }
        } catch (err) {
            console.error('zap failed:', err);
            if (chip) { chip.dataset.state = 'error'; delete chip.dataset.zapping; setTimeout(() => { if (chip.dataset.state === 'error') delete chip.dataset.state; }, 2500); }
            const msg = err?.message || 'failed';
            let hint;
            if (/cancel|denied|aborted|dismissed|rejected/i.test(msg)) {
                hint = 'canceled in the wallet';
            } else if (/no info event|13194/i.test(msg)) {
                hint = 'your wallet didn\u2019t answer over NWC — make sure the wallet app is running and connected, then try again';
            } else if (/Failed to fetch/i.test(msg)) {
                // CORS-masking: the recipient's server returned an error we can't read
                hint = 'the recipient\u2019s server rejected the request (often temporary) — try again in a moment';
            } else {
                hint = msg.slice(0, 140);
            }
            toast(`Couldn\u2019t zap ${escapeHtml(name)}: ${escapeHtml(hint)}`, 'error', 7000);
        } finally {
            guard.finish();
        }
    }


    // ---------- connect-modal path ----------
    function openConnectModal() {
        // preferred: the library's own API (module sets window.bitcoinConnect)
        if (typeof window.bitcoinConnect?.launchModal === 'function') {
            window.bitcoinConnect.launchModal();
            return true;
        }
        const btn = document.querySelector('bc-button');
        if (!btn) return false;
        const inner = btn.shadowRoot?.querySelector('bci-button');
        if (inner) inner.click(); else btn.click();
        return true;
    }

    // polls for extension-provided window.webln (Bitcoin Connect's NWC path
    // is handled by the onConnected subscription instead)
    function watchForConnection() {
        clearInterval(pollTimer);
        pollTimer = setInterval(() => {
            if (weblnReady()) {
                clearInterval(pollTimer);
                toast('Wallet connected ⚡', 'success', 2500);
                if (pendingZap) {
                    const p = pendingZap; pendingZap = null;
                    setTimeout(() => zap(p.lnAddress, p.name, p.chip), 300);
                }
            }
        }, 600);
        setTimeout(() => clearInterval(pollTimer), 180000); // stop watching after 3 min
    }

    // ---------- QR fallback dialog (no wallet connection required) ----------
    let qrLibPromise = null;
    const qrCache = new Map(); // address → svg string
    async function loadQr() {
        if (!qrLibPromise) qrLibPromise = import('https://esm.sh/qrcode-generator@1.4.4').then(m => m.default || m);
        return qrLibPromise;
    }

    async function qrSvgForContent(content) {
        const q = await loadQr();
        const qr = q(0, 'M');
        qr.addData(content, 'Byte');
        qr.make();
        return qr.createSvgTag({ cellSize: 4, margin: 0 });
    }

    async function qrSvgFor(address) {
        if (qrCache.has(address)) return qrCache.get(address);
        const svg = await qrSvgForContent('lightning:' + lnurlEncode(lnurlpUrl(address)).toUpperCase());
        qrCache.set(address, svg);
        return svg;
    }

    const closeZapModal = () => document.querySelector('.zap-modal-backdrop')?.remove();

    async function showZapModal({ lnAddress, name, chip }) {
        closeZapModal();
        const backdrop = document.createElement('div');
        backdrop.className = 'zap-modal-backdrop';
        backdrop.innerHTML = `
            <div class="zap-modal" role="dialog" aria-modal="true" aria-label="Zap ${escapeHtml(name)}">
                <button class="zap-modal-close" aria-label="Close">✕</button>
                <h3 class="zap-modal-title"><i class="fas fa-bolt" aria-hidden="true"></i> Zap ${escapeHtml(name)}</h3>
                <div class="zap-qr-box"><div class="zap-qr" aria-hidden="true"></div></div>
                <p class="zap-modal-hint">Scan with any Lightning wallet — no connection needed.</p>
                <div class="zap-modal-line">
                    <code class="zap-modal-addr" title="${escapeHtml(lnAddress)}">${escapeHtml(lnAddress)}</code>
                    <button class="zap-modal-copy" type="button" title="Copy lightning address" aria-label="Copy lightning address">
                        <i class="fas fa-copy" aria-hidden="true"></i>
                    </button>
                    <a class="zap-modal-btn zap-modal-btn-primary" href="lightning:${escapeHtml(lnAddress)}" title="Open in your Lightning wallet">
                        <i class="fas fa-wallet" aria-hidden="true"></i> Open wallet
                    </a>
                </div>
                <button class="zap-modal-connect" type="button">
                    or connect a wallet once and zap right here →
                </button>
            </div>`;
        document.body.appendChild(backdrop);

        // QR: LNURL-pay encoded as lightning: URI (static, zero network, cached per address)
        qrSvgFor(lnAddress)
            .then(svg => { const box = backdrop.querySelector('.zap-qr'); if (box) box.innerHTML = svg; })
            .catch(e => { console.warn('QR generation failed', e); backdrop.querySelector('.zap-qr-box')?.remove(); });

        // wiring
        backdrop.querySelector('.zap-modal-close').addEventListener('click', closeZapModal);
        backdrop.addEventListener('click', (e) => { if (e.target === backdrop) closeZapModal(); });

        const copyBtn = backdrop.querySelector('.zap-modal-copy');
        copyBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(lnAddress);
            } catch (e) {
                const ta = document.createElement('textarea');
                ta.value = lnAddress; document.body.appendChild(ta);
                ta.select(); document.execCommand('copy'); ta.remove();
            }
            copyBtn.innerHTML = '<i class="fas fa-check" aria-hidden="true"></i>';
            copyBtn.classList.add('copied');
            setTimeout(() => {
                copyBtn.innerHTML = '<i class="fas fa-copy" aria-hidden="true"></i>';
                copyBtn.classList.remove('copied');
            }, 1600);
        });

        backdrop.querySelector('.zap-modal-connect').addEventListener('click', () => {
            closeZapModal();
            pendingZap = { lnAddress, name, chip };
            if (openConnectModal()) {
                toast('Connect your wallet once — then zap any project without leaving the page.', 'info', 5000);
                watchForConnection();
            } else {
                toast('No WebLN wallet found. Install <a href="https://getalby.com" target="_blank" rel="noopener">Alby</a>, or zap via the QR above.', 'info', 6000);
            }
        });
    }

    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeZapModal(); });

    // ---------- click delegation ----------
    document.addEventListener('click', (e) => {
        const chip = e.target.closest('a.zap-chip, #fundButton');
        if (!chip) return;

        const href = chip.getAttribute('href') || '';
        if (!href.startsWith('lightning:')) return;

        e.preventDefault();
        const lnAddress = chip.dataset.lnAddress || href.replace(/^lightning:/i, '');
        const name = chip.dataset.name || chip.closest('.resource-card')?.querySelector('.resource-title a')?.textContent.trim() || 'nostr.net';

        if (weblnReady()) {
            zap(lnAddress, name, chip);
        } else {
            showZapModal({ lnAddress, name, chip });
        }
    });

    // extension-provided WebLN (e.g. Alby without BC): chips become "ready" style
    const markReady = () => { if (weblnReady()) document.body.classList.add('webln-ready'); };
    markReady();
    setTimeout(markReady, 1500);
    window.addEventListener('bc:onpaid', markReady);

    // ---------- Bitcoin Connect wiring (NWC / LNC / LNbits) ----------
    // BC never sets window.webln — the connected provider arrives via
    // onConnected(provider). The module (loaded as type=module, after this
    // classic script) exposes window.bitcoinConnect, so retry until it lands.
    let bcSubscribed = false;
    function trySubscribeBc() {
        if (bcSubscribed) return;
        const api = window.bitcoinConnect;
        if (!api || typeof api.onConnected !== 'function') return;
        bcSubscribed = true;
        try {
            // fires immediately if a wallet is already connected (page reload),
            // and again on every new connection
            api.onConnected(provider => {
                if (provider && typeof provider.sendPayment === 'function') {
                    bcProvider = provider;
                    selector.register(provider); // most-recently-connected wins for retries
                    enabledFor = null; // re-enable for the new provider
                    document.body.classList.add('webln-ready');
                    toast('Wallet connected ⚡', 'success', 2500);
                    if (pendingZap) {
                        const p = pendingZap; pendingZap = null;
                        setTimeout(() => zap(p.lnAddress, p.name, p.chip), 200);
                    }
                }
            });
            if (typeof api.onDisconnected === 'function') {
                api.onDisconnected(() => {
                    bcProvider = null;
                    enabledFor = null;
                    document.body.classList.remove('webln-ready');
                });
            }
        } catch (e) {
            console.warn('Bitcoin Connect subscription failed', e);
            bcSubscribed = false;
        }
    }
    let bcTries = 0;
    const bcWatch = setInterval(() => {
        trySubscribeBc();
        if (bcSubscribed || ++bcTries > 80) clearInterval(bcWatch); // ~20s max
    }, 250);

    // ---------- warm the caches so first zap / first dialog are instant ----------
    const warmup = () => {
        loadQr().catch(() => {});            // QR generator (tiny)
        import(NOBLE_URL).catch(() => {});  // schnorr signer for anon receipts
    };
    warmup(); // immediately — modules are tiny and this keeps the first click instant

    // prefetch lnurlp params on hover so the invoice request starts instantly on click
    document.addEventListener('pointerover', (e) => {
        const chip = e.target.closest?.('a.zap-chip, #fundButton');
        if (!chip) return;
        const href = chip.getAttribute('href') || '';
        if (!href.startsWith('lightning:')) return;
        const addr = chip.dataset.lnAddress || href.replace(/^lightning:/i, '');
        if (addr.includes('@')) fetchLnurlParamsCached(addr).catch(() => {});
    }, { passive: true });
})();
