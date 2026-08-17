// ===== grantless: in-page zapping via Bitcoin Connect (WebLN / NWC) =====
// Loaded after script.js. Intercepts .zap-chip and #fundButton clicks:
//   - wallet connected  → LNURL-pay + NIP-57 zap receipt, paid in-page
//   - no wallet         → opens Bitcoin Connect modal, zaps pending target after connect
// Falls back to plain lightning: links if JS/zap flow fails (links are never broken).

(() => {
    const ZAP_SATS = 1000;               // default zap amount for chips
    const ZAP_RELAYS = ['wss://relay.nostr.net', 'wss://relay.damus.io', 'wss://nos.lol'];
    const NOBLE_URL = 'https://esm.sh/@noble/curves@1.4.0/secp256k1'; // lazy: only for anon zap receipts
    const CHARSET = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l';

    let pendingZap = null;               // { lnAddress, name, chip }
    let pollTimer = null;

    // ---------- small utils ----------
    const hex = (bytes) => [...bytes].map(b => b.toString(16).padStart(2, '0')).join('');
    const unhex = (h) => new Uint8Array(h.match(/../g).map(x => parseInt(x, 16)));

    async function sha256Hex(str) {
        const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
        return hex(new Uint8Array(buf));
    }

    // bech32 encode (for the optional lnurl tag in zap requests)
    function bech32Polymod(values) {
        const GEN = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];
        let chk = 1;
        for (const v of values) {
            const top = chk >> 25;
            chk = (chk & 0x1ffffff) << 5 ^ v;
            for (let i = 0; i < 5; i++) if ((top >> i) & 1) chk ^= GEN[i];
        }
        return chk;
    }
    function lnurlEncode(url) {
        const hrp = 'lnurl';
        const data = new TextEncoder().encode(url);
        const acc = { acc: 0, bits: 0, ret: [] };
        for (const b of data) {
            acc.acc = (acc.acc << 8) | b; acc.bits += 8;
            while (acc.bits >= 5) { acc.bits -= 5; acc.ret.push((acc.acc >> acc.bits) & 31); }
        }
        if (acc.bits) acc.ret.push((acc.acc << (5 - acc.bits)) & 31);
        const values = [...hrp].map(c => c.charCodeAt(0) >> 5)
            .concat([0], [...hrp].map(c => c.charCodeAt(0) & 31), acc.ret);
        const pm = bech32Polymod([...values, 0, 0, 0, 0, 0, 0]) ^ 1;
        const cs = [...Array(6)].map((_, i) => (pm >> 5 * (5 - i)) & 31);
        return hrp + '1' + [...acc.ret, ...cs].map(d => CHARSET[d]).join('');
    }

    // ---------- toast ----------
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
    function lnurlpUrl(address) {
        const [user, host] = address.split('@');
        return `https://${host}/.well-known/lnurlp/${encodeURIComponent(user)}`;
    }

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
        if (zapEvent) cb.searchParams.set('nostr', JSON.stringify(zapEvent));
        const r = await fetch(cb);
        const j = await r.json();
        if (j.status === 'ERROR') throw new Error(j.reason || 'invoice error');
        if (!j.pr) throw new Error('no invoice');
        return j;
    }

    // ---------- NIP-57 zap request ----------
    async function buildZapRequest(params, msat, address) {
        if (!params.allowsNostr || !params.nostrPubkey) return { event: null, anon: false };

        const tags = [
            ['p', params.nostrPubkey],
            ['relays', ...ZAP_RELAYS],
            ['amount', String(msat)],
            ['lnurl', lnurlEncode(lnurlpUrl(address))]
        ];

        // Prefer the user's real identity via NIP-07…
        if (window.nostr?.signEvent && window.nostr?.getPublicKey) {
            try {
                const pubkey = await window.nostr.getPublicKey();
                const ev = await window.nostr.signEvent({
                    kind: 9734, pubkey, created_at: Math.floor(Date.now() / 1000),
                    tags, content: ''
                });
                return { event: { ...ev, pubkey: ev.pubkey || pubkey }, anon: false };
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
            const event = { pubkey, created_at, kind: 9734, tags: [...tags, ['anon', '']], content: '' };
            const id = await sha256Hex(JSON.stringify([0, pubkey, created_at, 9734, event.tags, '']));
            event.id = id;
            event.sig = hex(schnorr.sign(unhex(id), priv));
            return { event, anon: true };
        } catch (e) {
            console.warn('anon signing unavailable, paying without receipt', e);
            return { event: null, anon: false };
        }
    }

    // ---------- payment ----------
    const weblnReady = () => !!(window.webln && typeof window.webln.sendPayment === 'function');

    async function payInvoice(pr) {
        if (!weblnReady()) throw new Error('wallet not connected');
        if (window.webln.enable) { try { await window.webln.enable(); } catch (e) { /* already enabled */ } }
        return window.webln.sendPayment(pr);
    }

    // ---------- main zap flow ----------
    async function zap(lnAddress, name, chip) {
        if (chip?.dataset.zapping === '1') return;
        if (chip) { chip.dataset.zapping = '1'; chip.dataset.state = 'zapping'; }

        try {
            toast(`⚡ Zapping <strong>${escapeHtml(name)}</strong>…`, 'info', 9000);
            const params = await fetchLnurlParams(lnAddress);

            let msat = ZAP_SATS * 1000;
            const min = params.minSendable || 1000, max = params.maxSendable || Infinity;
            const clamped = Math.min(Math.max(msat, min), max);
            if (clamped !== msat) { msat = clamped; toast(`Amount adjusted to ${msat / 1000} sats (wallet limits)`, 'info'); }

            const { event, anon } = await buildZapRequest(params, msat, lnAddress);
            const inv = await fetchInvoice(params, msat, event);
            await payInvoice(inv.pr);

            if (chip) { chip.dataset.state = 'zapped'; delete chip.dataset.zapping; }
            const sats = msat / 1000;
            toast(
                event
                    ? `⚡ Zapped <strong>${escapeHtml(name)}</strong> ${sats} sats${anon ? ' (anon zap receipt)' : ' · zap receipt published'}`
                    : `⚡ Sent <strong>${escapeHtml(name)}</strong> ${sats} sats (no zap receipt)`,
                'success', 6000
            );
        } catch (err) {
            console.error('zap failed:', err);
            if (chip) { chip.dataset.state = 'error'; delete chip.dataset.zapping; setTimeout(() => { if (chip.dataset.state === 'error') delete chip.dataset.state; }, 2500); }
            toast(`Couldn't zap ${escapeHtml(name)}: ${escapeHtml(err.message || 'failed')}`, 'error', 6000);
        }
    }

    const escapeHtml = (s) => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    // ---------- connect-modal path ----------
    function openConnectModal() {
        const btn = document.querySelector('bc-button');
        if (!btn) return false;
        const inner = btn.shadowRoot?.querySelector('bci-button');
        if (inner) inner.click(); else btn.click();
        return true;
    }

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
    async function loadQr() {
        if (!qrLibPromise) qrLibPromise = import('https://esm.sh/qrcode-generator@1.4.4').then(m => m.default || m);
        return qrLibPromise;
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

        // QR: LNURL-pay encoded as lightning: URI (static, zero network)
        try {
            const q = await loadQr();
            const qr = q(0, 'M');
            qr.addData('lightning:' + lnurlEncode(lnurlpUrl(lnAddress)).toUpperCase(), 'Byte');
            qr.make();
            backdrop.querySelector('.zap-qr').innerHTML = qr.createSvgTag({ cellSize: 4, margin: 0 });
        } catch (e) {
            console.warn('QR generation failed', e);
            backdrop.querySelector('.zap-qr-box')?.remove();
        }

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
})();
