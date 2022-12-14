# awesome-nostr
"nostr" stands for "**N**otes and **O**ther **S**tuff **T**ransmitted by
**R**elays" and is an open protocol for censorship-resistant global networks
created by [@fiatjaf](https://github.com/fiatjaf).

## Protocol
- [nostr](https://github.com/nostr-protocol/nostr) - overview and FAQ
- [NIPs](https://github.com/nostr-protocol/nips) - the "**N**ostr **I**mplementation **P**ossibilities" describe the protocol in technical detail
- [nostr, a basic tour](https://github.com/rajarshimaitra/rust-nostr/blob/main/VISION.md) - an intro to nostr
- [Nostr: Solucionando la censura de una vez por todas](https://estudiobitcoin.com/nostr-solucionando-la-censura-de-una-vez-por-todas/)

## Relays
Relays are (so far) application agnostic. You can run your own or use any or all
of the public instances.

### Implementations
- [NNostr](https://github.com/Kukks/NNostr) - a C# relay
- [nostr-rs-relay](https://sr.ht/~gheartsfield/nostr-rs-relay/) - a minimalistic relay written in Rust that saves data on SQLite
- [Relayer Basic](https://github.com/fiatjaf/relayer/tree/master/basic) - a simple relay based on _relayer_ backed by Postgres
- [rsslay](https://github.com/fiatjaf/rsslay) - a bridge that puts RSS feeds into Nostr
- [nodestr](https://github.com/Dolu89/nodestr-relay) - a Node.js implementation
- [expensive relay](https://github.com/fiatjaf/expensive-relay) - a relay that requires payment for registration
- [me.untethr.nostr-relay](https://github.com/atdixon/me.untethr.nostr-relay) - a relay written in Clojure
- [Minds Nostr Relay](https://gitlab.com/minds/infrastructure/nostr-relay) - a relay for [Minds](https://www.minds.com), an open source social network
  - [Minds Engine - Nostr](https://gitlab.com/minds/engine/-/tree/master/Core/Nostr) - relevant Minds API code for reading/writing Minds posts using Nostr
- [NostrPostr Relay](https://github.com/Giszmo/NostrPostr/tree/master/NostrRelay) - a Kotlin Relay supporting both SQLite and Postgresql
- [nostrypy](https://github.com/monty888/nostrpy) - relay, client and other tooling in python 
- [nostr-ts-relay](https://github.com/Cameri/nostr-ts-relay) - a nostr relay written in Typescript backed by PostgreSQL

### Instances
Instances are plenty and their availability may vary but these projects track
them:
- [nostr relay registry](https://nostr-registry.netlify.app/) - real-time checking of status of some known relays
- [nostr.info](https://nostr.info/) - real-time checking of status of some known relays
- [nostr.watch](https://nostr.watch) - real-time checking of status of some known relays with advanced checks.

## Clients
- [branle](https://github.com/fiatjaf/branle) - a Twitter-like client with chat. Some instances:
  - [branle.netlify.app](https://branle.netlify.app/) - by fiatjaf
  - [nostr.rocks](https://nostr.rocks/)
  - [branle.wlvs.space](https://branle.wlvs.space/)
  - [branle tor](http://hbn4yzl3qkzi3qpse6nvljbduzcdecaq76tbcfjfzmoaik3q3uryxuad.onion/3bf0c63fcb93463407af97a5e5ee64fa883d107ef9e558472c4eb9aaaefa459d) - on tor
- [astral](https://github.com/monlovesmango/astral) - a branle fork with global feed and UI makeover
  - [astral.ninja](https://astral.ninja/)
- [damus](https://github.com/damus-io/damus) - a twitter-like nostr client for iOS and MacOS
  - [damus on testflight](https://testflight.apple.com/join/CLwjLxWl)
- [more-speech](https://github.com/unclebob/more-speech) - desktop client for nostr written in Clojure 
- [futr](https://github.com/prolic/futr) - nostr client desktop app written in Haskell
- [nvote](https://github.com/rdbell/nvote), Nvote is a decentralized, vote-driven community similar to services like Reddit and HackerNews. Nvote is powered by nostr
  - [nvote.co](https://nvote.co/)
- [Minds](https://www.minds.com/) - open source social network. Supports reading and creating posts using the Nostr protocol
- [alphaama](https://alphaama.com/) - playground by [Tiago Balas](https://github.com/eskema)
- [Jester](https://jesterui.github.io/) - Chess over nostr
- [Sendstr](https://sendstr.com/) - shared clipboard between devices over nostr
- [noscl](https://github.com/fiatjaf/noscl) - a basic command-line client written in Go
- [loquaz](https://github.com/emeceve/loquaz) - a desktop app written in Rust for direct encrypted chat
- [nostr console](https://github.com/vishalxl/nostr_console) - a nostr command line client written in Dart. Binaries available for Windows, Linux and MacOS.
- [anigma](https://github.com/brilliancebitcoin/nostrgram) - A clone of telegram built on nostr
- [ArcadeCity](https://github.com/ArcadeCity/app) - Public group chats and P2P services (WIP) over nostr
- [second exchange](https://github.com/cynsar-foundation/second.exchange) - an experiment to work out something of like medium , something of creator economy where users are rewarded for engaging quality discussion and most importantly engaging in governance related discussion.
- [scalastr](https://github.com/benthecarman/scalastr) - A barebones nostr client written in scala
- [Nostros](https://github.com/KoalaSat/nostros) - A nostr mobile client for Android
- [NostrEmitter](https://github.com/cmdruid/nostr-emitter)- Simple E2E encrypted client and EventEmitter object.
- [Lightning.Pub](https://github.com/shocknet/Lightning.Pub)- A nostr daemon for Lightning nodes.
- [shockwallet](https://github.com/shocknet/wallet2)- A Lightning wallet that uses nostr and lnurl to connect to nodes.
- [coracle](https://github.com/staab/coracle) - A nostr web client
- [nostrweb](https://git.qcode.ch/nostr/nostrweb) - another nostr web client in vanilla JS
  - [nostr.ch](https://nostr.ch/) - live instance
- [Bija](https://github.com/BrightonBTC/bija) - A desktop client written python. Currently Linux only.

### Client reviews and/or comparisons
- Feature [comparison of Nostr clients as of mid-2022](https://github.com/vishalxl/Nostr-Clients-Features-List)

## Libraries
- [NNostr.Client](https://github.com/Kukks/NNostr) - a C# Nostr library for use by clients
- [nostr-tools](https://github.com/fiatjaf/nostr-tools) - a JavaScript client that abstracts the relay management code for use by clients
- [go-nostr](https://github.com/fiatjaf/go-nostr) - a Go library that implements relay management, plus event encoding and signing utils
- [nostr_rust](https://github.com/0xtlt/nostr_rust) - Functional Rust implementation of the nostr protocol
- [nostr-js](https://github.com/jb55/nostr-js) - a javascript implementation of the nostr protocol
- [nostr-rs](https://github.com/futurepaul/nostr-rs) - a Rust implementation of the nostr protocol
- [nostr-rs-sdk](https://github.com/yukibtc/nostr-rs-sdk) - Nostr `protocol` implementation, `SDK` and `FFI` written in Rust
- [relayer](https://github.com/fiatjaf/relayer) - a server framework for writing custom relays
- [NostrPostr](https://github.com/Giszmo/NostrPostr) - a Kotlin Nostr library for clients or relays
- [python-nostr](https://github.com/jeffthibault/python-nostr) - a python library for making clients
- [nostr-bot](https://github.com/slaninas/nostr-bot) - a Rust library for writing bots
- [NostrKit](https://github.com/cnixbtc/NostrKit) - a Swift library for interacting with relays
- [nostr-relay-inspector](https://github.com/dskvr/nostr-relay-inspector) - A library that returns useful information about relays based on nostr-js

## Tools
- [git-nostr-tools](http://git.jb55.com/git-nostr-tools) - A cli tool for sending code patches over nostr
- [nostr-cln-events](http://git.jb55.com/nostr-cln-events) - A CLN plugin to push clightning node events to nostr
- [nostr registry](https://codeberg.org/rsbondi/nostr-registry) - a database of known relays with their uptime and NIP support tables
- [nostr-fzf](https://github.com/Cameri/nostr-fzf) - Nostr Directory; a tool for searching usernames and channels
- [nostr-notify](https://github.com/jb55/nostr-notify) - desktop nostr notifications using libnotify
- [nostr-launch](https://codeberg.org/rsbondi/nostr-launch) - a tool for launching a bunch of relays and clients locally for development and testing
- [nos2x - nostr signer extension](https://github.com/fiatjaf/nos2x) - a browser extension for signing events on 3rd party site without sharing your private keys with them
- [nostr GitHub Action](https://github.com/theborakompanioni/nostr-action) - send events from GitHub Actions
- [wen](https://github.com/fiatjaf/wen) - browser extension for website enhancer with nostr
- [nostrefresh](https://github.com/melvincarvalho/nostrefresh) - simple refresh function for nostr web pages
- [anonroom](https://github.com/vinliao/anonroom) - anonymous chat room inside nostr
- [nostril](https://github.com/jb55/nostril) - C cli tool for creating nostr events
- [nostr-rs-relay-compose](https://github.com/vdo/nostr-rs-relay-compose) - a Docker compose deployment for nostr-rs-relay with SSL support based on Traefik
- [tostr](https://github.com/slaninas/tostr) - a twitter to nostr bot
- [nostr.com](https://nostr.com/) - a nostr web gateway for viewing events by their ID
- [nostrandom.netlify.app](https://nostrandom.netlify.app/) - generate publish-able Nostr event with random keys
- [nashboard](https://github.com/vinliao/nashboard) and [here](https://nashboard.space/) - a Nostr network dashboard with network statistics
- [nostr army knife](https://nostr-army-knife.netlify.app/) - nostr army knife by fiatjaf
- [joinstr](https://github.com/1440000bytes/joinstr) - coinjoin implementation using nostr
- [smtp nostr gateway ](https://github.com/Cameri/smtp-nostr-gateway) - a bridge that forwards emails to pubkeys as encrypted direct messages
- [ndxstr](https://github.com/ArcadeCity/ndxstr) - nostr's layer 2 indexing nodes, with more advanced querying capability than currently supported by relays
- [nostrillery](https://github.com/Cameri/nostrillery) - a tool for running performance tests against Nostr relays
- [nostr-terminal](https://github.com/cmdruid/nostr-terminal) - SSH-like access to your machine via web terminal, powered by Nostr.
- [nostcat](https://github.com/blakejakopovic/nostcat) - cat-like nostr client for scripting and debugging written in Rust
- [rana](https://github.com/grunch/rana) - Nostr mining pubkey with multi threading
- [nostreq](https://github.com/blakejakopovic/nostreq) - Nostr relay event request generator
- [nostr.io](https://nostr.io/) - network statistics with last published notes, top 50 publishers and top 50 followed users
- [nostr-commander](https://github.com/8go/nostr-commander-rs) - simple but convenient CLI-based Nostr app for following users, sending DMs, etc.

## Community
Outside of nostr itself, you find the community on:
- [nostr telegram group](https://t.me/nostr_protocol) - a telegram group for nostr protocol discussion
- [nostr reddit](https://www.reddit.com/r/nostr/) - a sub reddit for nostr related discussion

## Other links
- [nostr on YouTube](https://www.youtube.com/results?search_query=nostr+protocol)
- [vanilla-js-nostr](https://github.com/supertestnet/vanilla-js-nostr) - a demo of posting and viewing a feed in nostr using vanilla javascript
- [nostr workshop with super testnet](https://www.youtube.com/watch?v=HbicnlCXg_Y) 
