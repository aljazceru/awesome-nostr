// Regression tests for zap-core (node --test).
// Covers the production bugs from review: malicious/mismatched invoices
// (LUD-06 amount + description-hash validation), and provider-selection
// after reconnect. DOM-level behaviors (recovery panel surviving toast
// removal) remain covered by manual browser verification — this repo has
// no DOM test infrastructure, so the payment-critical logic lives here,
// dependency-free.
'use strict';

const test = require('node:test');
const assert = require('node:assert');
const crypto = require('node:crypto');
const core = require('../zap-core.js');

const { CHARSET, bech32Polymod, hrpExpand } = core.__internals;

// ---------- helpers ----------

function sha256Hex(s) {
    return crypto.createHash('sha256').update(s, 'utf8').digest('hex');
}

// craft a structurally-valid BOLT11 invoice (valid bech32 checksum) with a
// chosen hrp amount, timestamp, 'h' (23) and 'x' (6) tags, and a zero
// signature — good enough to exercise our validation-only decoder
function craftInvoice({ amountHrp = '10u', timestamp = Math.floor(Date.now() / 1000), hHex = null, expiry = null }) {
    const words = [];
    const pushInt = (n, wordCount) => {
        const bin = n.toString(2).padStart(wordCount * 5, '0');
        for (let i = 0; i < wordCount; i++) words.push(parseInt(bin.slice(i * 5, i * 5 + 5), 2));
    };
    pushInt(timestamp, 7); // timestamp: 7 words
    if (hHex) {
        const value = Buffer.from(hHex, 'hex');
        // bytes → 5-bit words, right-padded
        let acc = 0, bits = 0;
        const vwords = [];
        for (const b of value) { acc = (acc << 8) | b; bits += 8; while (bits >= 5) { bits -= 5; vwords.push((acc >> bits) & 31); } }
        if (bits) vwords.push((acc << (5 - bits)) & 31);
        words.push(23);            // 'h'
        pushInt(vwords.length, 2); // length in 5-bit words (2 words BE)
        words.push(...vwords);
    }
    if (expiry != null) {
        words.push(6);             // 'x'
        pushInt(1, 2);             // one word of value
        pushInt(expiry, 1);
    }
    for (let i = 0; i < 104; i++) words.push(0); // dummy signature
    // bech32 checksum
    const hrp = 'lnbc' + amountHrp;
    const pm = bech32Polymod(hrpExpand(hrp).concat(words, [0, 0, 0, 0, 0, 0])) ^ 1;
    const cs = [...Array(6)].map((_, i) => (pm >> 5 * (5 - i)) & 31);
    return hrp + '1' + [...words, ...cs].map(d => CHARSET[d]).join('');
}

// ---------- malicious / malformed invoices ----------

test('attribute-injection payload is rejected', async () => {
    const evil = 'lnbc10u1p4g9elc" onmouseover="alert(1)" data-x="';
    const r = await core.decodeBolt11(evil);
    assert.strictEqual(r.ok, false);
});

test('garbage string with lnbc prefix is rejected', async () => {
    const r = await core.decodeBolt11('lnbcnotaninvoicenotaninvoicenotaninvoice');
    assert.strictEqual(r.ok, false);
});

test('crafted valid invoice passes with matching amount and metadata hash', async () => {
    const metadata = JSON.stringify([['text/plain', 'nostr.net zap'], ['text/identifier', 'user@host']]);
    const inv = craftInvoice({ amountHrp: '10u', hHex: sha256Hex(metadata) });
    const r = await core.decodeBolt11(inv, { msat: 1000 * 1000, metadata });
    assert.strictEqual(r.ok, true, r.error);
    assert.strictEqual(r.msat, 1000000);
});

test('LUD-06: invoice amount higher than requested is rejected', async () => {
    const metadata = '[]';
    // server asked for 1000 sats but returns an invoice for 2000 sats (20u)
    const inv = craftInvoice({ amountHrp: '20u', hHex: sha256Hex(metadata) });
    const r = await core.decodeBolt11(inv, { msat: 1000 * 1000, metadata });
    assert.strictEqual(r.ok, false);
    assert.match(r.error, /amount mismatch/);
});

test('description hash mismatch is flagged, not fatal (primal-style non-compliance)', async () => {
    const metadata = '[]';
    const inv = craftInvoice({ amountHrp: '10u', hHex: sha256Hex('{"different":"metadata"}') });
    const r = await core.decodeBolt11(inv, { msat: 1000 * 1000, metadata });
    assert.strictEqual(r.ok, true, r.error);
    assert.strictEqual(r.metadataHashOk, false);
});

test('missing description hash is flagged, not fatal', async () => {
    const inv = craftInvoice({ amountHrp: '10u' });
    const r = await core.decodeBolt11(inv, { msat: 1000 * 1000, metadata: '[]' });
    assert.strictEqual(r.ok, true, r.error);
    assert.strictEqual(r.metadataHashOk, false);
});

test('compliant description hash is reported as verified', async () => {
    const metadata = '[]';
    const inv = craftInvoice({ amountHrp: '10u', hHex: sha256Hex(metadata) });
    const r = await core.decodeBolt11(inv, { msat: 1000 * 1000, metadata });
    assert.strictEqual(r.ok, true, r.error);
    assert.strictEqual(r.metadataHashOk, true);
});

test('zap invoices: description hash must commit to the serialized zap request (NIP-57)', async () => {
    // NIP-57 protocol flow: for zaps the invoice description commits to the
    // JSON-serialized kind 9734 event — NOT the LNURL metadata
    const zapEvent = JSON.stringify({
        kind: 9734, pubkey: 'ab'.repeat(32), created_at: 1786970000,
        tags: [['p', 'cd'.repeat(32)], ['amount', '1000000']], content: 'nostr.net zap'
    });
    const bound = craftInvoice({ amountHrp: '10u', hHex: sha256Hex(zapEvent) });
    const ok = await core.decodeBolt11(bound, { msat: 1000 * 1000, metadata: zapEvent });
    assert.strictEqual(ok.ok, true, ok.error);
    assert.strictEqual(ok.metadataHashOk, true);

    // an invoice bound to the LNURL metadata instead of the event is NOT a
    // receipt-grade zap — must be flagged so the caller downgrades its claims
    const metadataBound = craftInvoice({ amountHrp: '10u', hHex: sha256Hex('[["text/plain","x"]]') });
    const notBound = await core.decodeBolt11(metadataBound, { msat: 1000 * 1000, metadata: zapEvent });
    assert.strictEqual(notBound.ok, true, notBound.error);
    assert.strictEqual(notBound.metadataHashOk, false);
});

test('expired invoice is rejected', async () => {
    const inv = craftInvoice({ amountHrp: '10u', timestamp: Math.floor(Date.now() / 1000) - 7200, expiry: 60 });
    const r = await core.decodeBolt11(inv);
    assert.strictEqual(r.ok, false);
    assert.match(r.error, /expired/);
});

test('zero-amount invoice is rejected when an amount is expected', async () => {
    const inv = craftInvoice({ amountHrp: '' }); // lnbc1…
    const r = await core.decodeBolt11(inv, { msat: 1000 * 1000 });
    assert.strictEqual(r.ok, false);
    assert.match(r.error, /amount/);
});

test('non-mainnet hrp is rejected', async () => {
    const words = [];
    const pushInt = (n, c) => { const b = n.toString(2).padStart(c * 5, '0'); for (let i = 0; i < c; i++) words.push(parseInt(b.slice(i * 5, i * 5 + 5), 2)); };
    pushInt(Math.floor(Date.now() / 1000), 7);
    for (let i = 0; i < 104; i++) words.push(0);
    const hrp = 'lntb10u';
    const pm = bech32Polymod(hrpExpand(hrp).concat(words, [0, 0, 0, 0, 0, 0])) ^ 1;
    const cs = [...Array(6)].map((_, i) => (pm >> 5 * (5 - i)) & 31);
    const inv = hrp + '1' + [...words, ...cs].map(d => CHARSET[d]).join('');
    const r = await core.decodeBolt11(inv);
    assert.strictEqual(r.ok, false);
    assert.match(r.error, /mainnet/);
});

// ---------- error classification ----------

test('transient payment errors are classified for recovery', () => {
    const transient = [
        'no info event (kind 13194) returned from relay',
        'Request timed out',
        'network error',
        'Connection closed',
        'wallet not connected',
        new Error('Failed to fetch'),
    ];
    for (const t of transient) assert.ok(core.isTransientPaymentError(t), String(t));
});

test('terminal payment errors bypass recovery', () => {
    const terminal = [
        'User rejected the request',
        'Insufficient balance',
        'invoice expired',
        'Invoice is already paid',
        '',
        undefined,
    ];
    for (const t of terminal) assert.ok(!core.isTransientPaymentError(t), String(t));
});

// ---------- zap lifecycle guard ----------
// (the DOM-side rendering of recovery remains browser-verified; the state
// machine it depends on is exercised here)

test('guard serializes zaps and protects a pending recovery', () => {
    let panel = false;
    const g = core.createZapGuard({ hasRecoveryPanel: () => panel });

    assert.ok(g.canStart());
    assert.strictEqual(g.start(), true);           // zap 1 begins
    assert.ok(!g.canStart());                       // zap 2 blocked while in flight
    assert.strictEqual(g.start(), false);

    g.recoveryShown();                              // zap 1 failed transiently
    g.finish();                                     // zap()'s finally releases busy; recovery keeps the lock
    panel = true;
    assert.ok(!g.canStart());                       // blocked while recovery holds the invoice
    assert.strictEqual(g.recoveryShown(), false);   // a concurrent second failure must not displace it

    panel = false;                                  // simulate the panel check racing the DOM removal
    g.recoveryCleared();                            // user dismissed (✕ / QR / terminal)
    assert.ok(g.canStart());
    assert.deepStrictEqual(g.state, { zapBusy: false, recoveryActive: false });
});

test('guard.finish releases the busy state on every zap outcome', () => {
    const g = core.createZapGuard({ hasRecoveryPanel: () => false });
    g.start();
    g.finish();                                     // success / terminal error / thrown path
    assert.ok(g.canStart());
});

test('guard treats an existing panel as occupied even if recoveryActive was lost', () => {
    let panel = true;
    const g = core.createZapGuard({ hasRecoveryPanel: () => panel });
    assert.ok(!g.canStart());                       // panel presence alone blocks
    assert.strictEqual(g.recoveryShown(), false);   // and cannot be displaced
});


test('most recently connected provider wins', () => {
    let webln = { id: 'A', sendPayment: async () => {} };
    let bc = null;
    const sel = core.createProviderSelector({ getWebln: () => webln, getBc: () => bc });

    // only the extension: A is used
    assert.strictEqual(sel.get().id, 'A');

    // extension failed; user reconnects via Bitcoin Connect → B must win
    bc = { id: 'B', sendPayment: async () => {} };
    sel.register(bc);
    assert.strictEqual(sel.get().id, 'B');

    // extension updates itself (new object) → C wins
    webln = { id: 'C', sendPayment: async () => {} };
    assert.strictEqual(sel.get().id, 'C');

    // webln disappears → falls back to still-registered B
    webln = undefined;
    assert.strictEqual(sel.get().id, 'B');

    // everything gone → null
    bc = null;
    assert.strictEqual(sel.get(), null);
});

test('non-provider objects are never selected', () => {
    const sel = core.createProviderSelector({ getWebln: () => ({}), getBc: () => null });
    sel.register(null);
    sel.register({ sendPayment: 'not-a-function' });
    assert.strictEqual(sel.get(), null);
});

// ---------- misc ----------

test('lnurlEncode round-trips to the lnurlp endpoint', () => {
    const url = core.lnurlpUrl('damus@sendsats.lol');
    const ln = core.lnurlEncode(url).toUpperCase();
    const pos = ln.lastIndexOf('1');
    const hrp = 'lnurl';
    const words = [...ln.slice(pos + 1)].map(c => CHARSET.indexOf(c.toLowerCase()));
    assert.strictEqual(bech32Polymod(hrpExpand(hrp).concat(words)), 1, 'checksum');
    assert.ok(url.startsWith('https://sendsats.lol/.well-known/lnurlp/damus'));
});

test('escapeHtml neutralizes markup', () => {
    assert.ok(!/[<>"']/.test(core.escapeHtml('<img src=x onerror="alert(1)">')));
});
