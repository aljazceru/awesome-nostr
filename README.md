# awesome-nostr
nostr is an open protocol for censorship-resistant global networks created by [@fiatjaff](https://github.com/fiatjaf)

### Protocol
- [nostr](https://github.com/fiatjaf/nostr)
- [protocol specification](https://github.com/fiatjaf/nostr/blob/master/nips/01.md)
- [nostr, a basic tour](https://github.com/rajarshimaitra/rust-nostr/blob/main/VISION.md)


### Relays
  - [NNostr](https://github.com/Kukks/NNostr), a C# Nostr relay.
  - [nostr-rs-relay](https://sr.ht/~gheartsfield/nostr-rs-relay/), a minimalistic relay written in Rust that saves data on SQLite.
  - [Relayer Basic](https://github.com/fiatjaf/relayer/tree/master/basic), a simple relay based on _relayer_ backed by Postgres.
  - [rsslay](https://github.com/fiatjaf/rsslay), a bridge that puts RSS feeds into Nostr.
  - [nodestr](https://github.com/Dolu89/nodestr-relay), A Node.js implementation.
  - [expansive relay](https://github.com/fiatjaf/expensive-relay), a nostr relay that requires payment for registration 

### Clients

  - [branle](https://github.com/fiatjaf/branle), a Twitter-like client also with chat.
  - [noscl](https://github.com/fiatjaf/noscli), a basic command-line client written in Go.
  - [nostr-chat](https://github.com/emeceve/nostr-chat), a desktop app written in Rust for direct encrypted chat.
  - [chastr](https://github.com/dolu89/chastr), a mobile directed encrypted chat app written in Xamarin.
  - [nostr-twitter](https://github.com/arcbtc/nostr), a Twitter-like UI that also implements private direct messages.

### Libraries
  - [NNostr.Client](https://github.com/Kukks/NNostr), a C# Nostr library for use by clients.
  - [nostr-tools](https://github.com/fiatjaf/nostr-tools), a JavaScript client that abstracts the relay management code for use by clients.
  - [go-nostr](https://github.com/fiatjaf/go-nostr), a Go library that implements relay management, plus event encoding and signing utils.
  - [nostr-rs](https://github.com/futurepaul/nostr-rs), a Rust implementation of the nostr protocol.
  - [relayer](https://github.com/fiatjaf/relayer), a server framework for writing custom relays.

### Tools

  - [nostr relay registry](https://nostr-registry.netlify.app/), real-time checking of status of some known relays.
  - [nostr registry](https://codeberg.org/rsbondi/nostr-registry), a database of known relays with their uptime and NIP support tables.
  - [nostr-launch](https://codeberg.org/rsbondi/nostr-launch), a tool for launching a bunch of relays and clients locally for development and testing.
  - [nostr signer extension](https://github.com/fiatjaf/nos2x), browser extension for signing events on 3rd party site without sharing your private keys with them
