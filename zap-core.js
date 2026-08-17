// zap-core.js — pure, dependency-free core for grantless zapping.
// Shared between the browser (zap.js) and node --test (test/zap-core.test.js).
// BOLT11 parsing per the reference decoder (bolt11 npm): data words are
// [timestamp:7 words][tagged fields…][signature:104 words]; each tagged field
// is [type:1 word][len:2 words BE, in 5-bit words][value:len words].
(function (root, factory) {
    if (typeof module === 'object' && module.exports) module.exports = factory();
    else root.zapCore = factory();
})(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    const CHARSET = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l';

    // ---------- bech32 primitives ----------
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
    function hrpExpand(hrp) {
        return [...hrp].map(c => c.charCodeAt(0) >> 5).concat([0], [...hrp].map(c => c.charCodeAt(0) & 31));
    }
    function convertBits(data, from, to) {
        let acc = 0, bits = 0;
        const ret = [], maxv = (1 << to) - 1;
        for (const v of data) {
            acc = (acc << from) | v; bits += from;
            while (bits >= to) { bits -= to; ret.push((acc >> bits) & maxv); }
        }
        if (bits) ret.push((acc << (to - bits)) & maxv);
        return ret;
    }

    // ---------- lnurl ----------
    function lnurlpUrl(address) {
        const [user, host] = address.split('@');
        return 'https://' + host + '/.well-known/lnurlp/' + encodeURIComponent(user);
    }
    function lnurlEncode(url) {
        const data = convertBits([...new TextEncoder().encode(url)], 8, 5);
        const values = hrpExpand('lnurl').concat(data);
        const pm = bech32Polymod(values.concat([0, 0, 0, 0, 0, 0])) ^ 1;
        const cs = [...Array(6)].map((_, i) => (pm >> 5 * (5 - i)) & 31);
        return 'lnurl' + '1' + [...data, ...cs].map(d => CHARSET[d]).join('');
    }

    // ---------- misc ----------
    const escapeHtml = (s) => String(s).replace(/[&<>"']/g, c =>
        ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    async function sha256Hex(str) {
        const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
        return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // ---------- BOLT11 decoding (validation only — no signature recovery) ----------
    // Amount must be exact; the wallet verifies the signature itself at payment
    // time, but only *we* can verify the invoice matches what we asked for
    // (LUD-06 requires the client to check amount + description hash).
    const AMOUNT_FACTORS = { '': 10n ** 11n, m: 10n ** 8n, u: 10n ** 5n, n: 10n ** 2n };

    function wordsToTrimmedHex(words) {
        // 5-bit words → bytes, dropping right-padding bits (bolt11 wordsToBuffer(trim));
        // only complete bytes are emitted — the trailing partial byte is pad noise
        let acc = 0, bits = 0;
        const bytes = [];
        for (const w of words) {
            acc = (acc << 5) | w; bits += 5;
            while (bits >= 8) { bits -= 8; bytes.push((acc >> bits) & 255); }
        }
        return bytes.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    async function decodeBolt11(invoice, expect) {
        const bad = (error) => ({ ok: false, error });
        try {
            if (typeof invoice !== 'string') return bad('not a string');
            const stripped = invoice.replace(/^lightning:/i, '').trim();
            // bech32: all-lower or all-upper only — mixed case is invalid
            if (/[a-z]/.test(stripped) && /[A-Z]/.test(stripped)) return bad('mixed case');
            const inv = stripped.toLowerCase();
            const sep = inv.lastIndexOf('1');
            if (sep < 4 || sep === inv.length - 1) return bad('missing separator');
            const hrp = inv.slice(0, sep);
            const dataStr = inv.slice(sep + 1);
            if (dataStr.length < 6 + 7 + 104) return bad('too short');
            const words = [...dataStr].map(c => CHARSET.indexOf(c));
            if (words.some(w => w < 0)) return bad('invalid characters');

            // network: only mainnet lnbc is accepted for zaps
            if (!/^lnbc/.test(hrp)) return bad('not a mainnet invoice');

            // bech32 checksum over hrp + data incl. 6 checksum words
            if (bech32Polymod(hrpExpand(hrp).concat(words)) !== 1) return bad('bad checksum');

            // amount from hrp (e.g. lnbc10u… = 1000 sats)
            const am = hrp.slice(4).match(/^(\d*)([munp]?)$/);
            if (!am) return bad('bad amount in prefix');
            let msat = null;
            if (am[1]) {
                const n = BigInt(am[1]);
                if (am[2] === 'p') {
                    if (n % 10n !== 0n) return bad('fractional msat amount');
                    msat = n / 10n;
                } else {
                    msat = n * AMOUNT_FACTORS[am[2]];
                }
            }

            // data: [timestamp:7 words][tagged fields…][signature:104 words]
            // (words includes the trailing 6 bech32 checksum words — excluded here)
            const sigAt = words.length - 6 - 104;
            const timestamp = parseInt(words.slice(0, 7).map(w => w.toString(2).padStart(5, '0')).join('') || '0', 2);
            let expiry = null, descriptionHash = null, hasPaymentHash = false;
            let pos = 7;
            while (pos + 3 <= sigAt) {
                const type = words[pos];
                const len = words[pos + 1] * 32 + words[pos + 2];
                if (pos + 3 + len > sigAt) return bad('truncated tag');
                const value = words.slice(pos + 3, pos + 3 + len);
                if (type === 1 && len === 52) hasPaymentHash = true;              // 'p' payment_hash (32 bytes)
                if (type === 23) descriptionHash = wordsToTrimmedHex(value);        // 'h' purpose_commit_hash
                else if (type === 6) expiry = parseInt(value.map(w => w.toString(2).padStart(5, '0')).join('') || '0', 2); // 'x' expire_time
                pos += 3 + len;
            }
            // a receivable BOLT11 invoice must commit to a payment hash —
            // wallets reject invoice without one, and we must not present
            // such QRs in recovery either
            if (!hasPaymentHash) return bad('missing payment hash');

            // expiry (default 3600) with a small clock-skew allowance
            const expiryAt = timestamp + (expiry ?? 3600) + 60;
            if (Date.now() / 1000 > expiryAt) return bad('invoice expired');

            if (expect) {
                if (expect.msat != null) {
                    if (msat === null || msat !== BigInt(Math.trunc(expect.msat))) return bad('invoice amount mismatch');
                }
                // Description hash: LUD-06 asks clients to verify it, but major
                // providers (e.g. primal) put a constant/non-committed hash in
                // their invoices, and the reference client (@getalby/lightning-
                // tools) does not enforce it either. Verify when compliant,
                // flag — but don't fail — when not. Amount stays a hard fail.
                let metadataHashOk = null;
                if (expect.metadata != null) {
                    metadataHashOk = !!descriptionHash && descriptionHash === await sha256Hex(expect.metadata);
                    if (!metadataHashOk && typeof console !== 'undefined' && console.warn) {
                        console.warn('zap-core: invoice description hash does not match the committed description (provider non-compliance) — amount check still enforced');
                    }
                }
                return { ok: true, msat: msat === null ? null : Number(msat), timestamp, expiry, descriptionHash, metadataHashOk };
            }
            return { ok: true, msat: msat === null ? null : Number(msat), timestamp, expiry, descriptionHash };
        } catch (e) {
            return bad('malformed invoice');
        }
    }

    // ---------- error classification ----------
    // transient = the wallet might answer later (retry/QR make sense);
    // cancellations, insufficient balance, invalid/expired invoices are terminal
    function isTransientPaymentError(e) {
        const pmsg = String((e && e.message) || e || '');
        return /no info event|13194|timeout|timed ?out|network|connection|econn|not connected|wallet not connected|failed to fetch/i.test(pmsg);
    }

    // ---------- zap lifecycle guard ----------
    // Serializes zap attempts and protects a pending recovery invoice from
    // being displaced (panel-existence check races two concurrent in-flight
    // zaps). DOM-free so the lifecycle is unit-testable; the caller supplies
    // a hasRecoveryPanel() probe.
    function createZapGuard({ hasRecoveryPanel }) {
        let zapBusy = false;
        let recoveryActive = false;
        const blocked = () => zapBusy || recoveryActive || hasRecoveryPanel();
        return {
            canStart: () => !blocked(),
            start: () => {
                if (blocked()) return false;
                zapBusy = true;
                return true;
            },
            finish: () => { zapBusy = false; },          // zap flow ended (any outcome)
            recoveryShown: () => {
                if (recoveryActive || hasRecoveryPanel()) return false; // never displace
                recoveryActive = true;
                return true;
            },
            recoveryCleared: () => { recoveryActive = false; },
            get state() { return { zapBusy, recoveryActive }; }
        };
    }

    // ---------- zap amount policy ----------
    // The recipient controls minSendable/maxSendable — never let it raise the
    // amount silently: a hostile "min" above the intended zap must abort, not
    // auto-pay more (the amount-vs-invoice check can't catch this on its own,
    // because the invoice would match the inflated request).
    function resolveZapAmount({ intendedMsat, minSendable, maxSendable }) {
        const min = Number(minSendable) || 0;
        const max = Number.isFinite(maxSendable) ? Number(maxSendable) : Infinity;
        if (min && max && min > max) return { error: 'recipient advertises an invalid amount range' };
        if (min && intendedMsat < min) {
            return { error: `recipient requires at least ${Math.ceil(min / 1000)} sats — more than this zap. Open the ⚡ dialog to pay them directly.` };
        }
        // clamping *down* is safe (never pays more than intended)
        if (max && intendedMsat > max) return { msat: Math.floor(max), adjustedDown: true };
        return { msat: Math.trunc(intendedMsat) };
    }

    // ---------- provider selection ----------
    // "Most recently connected provider wins". Covers: extension webln fails →
    // user reconnects via Bitcoin Connect → fresh bcProvider must be preferred.
    function createProviderSelector({ getWebln, getBc }) {
        const stack = [];
        let seenWebln, seenBc;
        const register = (p) => {
            if (p && typeof p.sendPayment === 'function') {
                const i = stack.indexOf(p);
                if (i !== -1) stack.splice(i, 1);
                stack.unshift(p);
            }
        };
        const get = () => {
            const w = getWebln();
            if (w !== seenWebln) { seenWebln = w; if (w) register(w); }
            const b = getBc();
            if (b !== seenBc) { seenBc = b; if (b) register(b); }
            // drop providers that are no longer reachable through either source
            for (let i = stack.length - 1; i >= 0; i--) {
                if (stack[i] !== getWebln() && stack[i] !== getBc()) stack.splice(i, 1);
            }
            return stack.find(p => typeof p?.sendPayment === 'function') || null;
        };
        return { get, register };
    }

    return {
        lnurlpUrl, lnurlEncode, escapeHtml, sha256Hex, decodeBolt11, createProviderSelector,
        isTransientPaymentError, createZapGuard, resolveZapAmount,
        __internals: { CHARSET, bech32Polymod, hrpExpand, convertBits, wordsToTrimmedHex }
    };
});
