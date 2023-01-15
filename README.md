"nostr" stands for "**N**otes and **O**ther **S**tuff **T**ransmitted by
**R**elays" and is an open protocol for censorship-resistant global networks
created by [@fiatjaf](https://github.com/fiatjaf).

## Protocol

- [nostr](https://github.com/nostr-protocol/nostr)![stars](https://img.shields.io/github/stars/nostr-protocol/nostr.svg?style=social) - overview and FAQ
- [NIPs](https://github.com/nostr-protocol/nips)![stars](https://img.shields.io/github/stars/nostr-protocol/nips.svg?style=social) - the "**N**ostr **I**mplementation **P**ossibilities" describe the protocol in technical detail
- [nostr, a basic tour](https://github.com/rajarshimaitra/rust-nostr/blob/main/VISION.md) - an intro to nostr
- [Nostr: Solucionando la censura de una vez por todas](https://estudiobitcoin.com/nostr-solucionando-la-censura-de-una-vez-por-todas/)
- [UseNostr](https://usenostr.org) - A small guide for anyone who wants to learn more about how nostr works and what it can do.
- [nostr.how](https://nostr.how) - Quick-start to onboard desktop users with Alby & Astral

## Relays

Relays are (so far) application agnostic. You can run your own or use any or all
of the public instances.

### Implementations

- [NNostr](https://github.com/Kukks/NNostr)![stars](https://img.shields.io/github/stars/Kukks/NNostr.svg?style=social) - a C# relay
- [nostr-rs-relay](https://sr.ht/~gheartsfield/nostr-rs-relay/)  - a minimalistic relay written in Rust that saves data on SQLite
- [Relayer Basic](https://github.com/fiatjaf/relayer/tree/master/basic) - a simple relay based on _relayer_ backed by Postgres
- [nodestr](https://github.com/Dolu89/nodestr-relay)![stars](https://img.shields.io/github/stars/Dolu89/nodestr-relay.svg?style=social) - a Node.js implementation
- [sovereign-stack](https://www.sovereign-stack.org) - a tool that helps you deploy nostr relays and create self-hosted (bitcoin-only) Value4Value websites.
- [expensive relay](https://github.com/fiatjaf/expensive-relay)![stars](https://img.shields.io/github/stars/fiatjaf/expensive-relay.svg?style=social)- a relay that requires payment for registration
- [me.untethr.nostr-relay](https://github.com/atdixon/me.untethr.nostr-relay)![stars](https://img.shields.io/github/stars/atdixon/me.untethr.nostr-relay.svg?style=social) - a relay written in Clojure
- [Minds Nostr Relay](https://gitlab.com/minds/infrastructure/nostr-relay) - a relay for [Minds](https://www.minds.com), an open-source social network
  - [Minds Engine - Nostr](https://gitlab.com/minds/engine/-/tree/master/Core/Nostr) - relevant Minds API code for reading/writing Minds posts using Nostr
- [NostrPostr Relay](https://github.com/Giszmo/NostrPostr/tree/master/NostrRelay) - a Kotlin Relay supporting both SQLite and Postgresql
- [nostrypy](https://github.com/monty888/nostrpy)![stars](https://img.shields.io/github/stars/monty888/nostrpy.svg?style=social) - relay, client, and other tooling in python
- [nostream](https://github.com/Cameri/nostream)![stars](https://img.shields.io/github/stars/Cameri/nostream.svg?style=social) - a nostr relay written in Typescript backed by PostgreSQL (renamed from nostr-ts-relay)
- [nostr_relay](https://code.pobblelabs.org/fossil/nostr_relay/) – a nostr relay written in python, backed by SQLite
- [søstr](https://github.com/metasikander/s0str)![stars](https://img.shields.io/github/stars/metasikander/s0str.svg?style=social) – a private nostr relay written in rust, saves all notes from one pubkey and publish them to anyone that requests them
- [knostr](https://github.com/lpicanco/knostr)![stars](https://img.shields.io/github/stars/lpicanco/knostr.svg?style=social) – a nostr relay implemented in Kotlin with support for Postgres and metrics(micrometer).


### Instances

Instances are plenty and their availability may vary but these projects track
them:

- [nostr relay registry](https://nostr-registry.netlify.app/) - real-time checking of status of some known relays
- [nostr.info](https://nostr.info/) - real-time checking of status of some known relays
- [nostr.watch](https://nostr.watch) - real-time checking of status of some known relays

## Clients

- [branle](https://github.com/fiatjaf/branle)![stars](https://img.shields.io/github/stars/fiatjaf/branle.svg?style=social) - a Twitter-like client with chat. Some instances:
  - [branle.netlify.app](https://branle.netlify.app/) - by fiatjaf
  - [nostr.rocks](https://nostr.rocks/)
  - [branle.wlvs.space](https://branle.wlvs.space/)
  - [branle tor](http://hbn4yzl3qkzi3qpse6nvljbduzcdecaq76tbcfjfzmoaik3q3uryxuad.onion/3bf0c63fcb93463407af97a5e5ee64fa883d107ef9e558472c4eb9aaaefa459d) - on tor
- [astral](https://github.com/monlovesmango/astral)![stars](https://img.shields.io/github/stars/monlovesmango/astral.svg?style=social) - a branle fork with global feed and UI makeover
  - [astral.ninja](https://astral.ninja/)
- [damus](https://github.com/damus-io/damus)![stars](https://img.shields.io/github/stars/damus-io/damus.svg?style=social) - a twitter-like nostr client for iOS and MacOS
  - [damus on testflight](https://testflight.apple.com/join/CLwjLxWl)
- [more-speech](https://github.com/unclebob/more-speech)![stars](https://img.shields.io/github/stars/unclebob/more-speech.svg?style=social) - desktop client for nostr written in Clojure
- [futr](https://github.com/prolic/futr)![stars](https://img.shields.io/github/stars/prolic/futr.svg?style=social) - nostr client desktop app written in Haskell
- [Minds](https://www.minds.com/) - open source social network. Supports reading and creating posts using the Nostr protocol
- [Jester](https://jesterui.github.io/) - Chess over nostr
- [Sendstr](https://sendstr.com/) - shared clipboard between devices over nostr
- [nosbin](https://nosbin.com/)![stars](https://img.shields.io/github/stars/jacany/nosbin.svg?style=social) - pastebin over nostr
- [noscl](https://github.com/fiatjaf/noscl)![stars](https://img.shields.io/github/stars/fiatjaf/noscl.svg?style=social) - a basic command-line client written in Go
- [loquaz](https://github.com/emeceve/loquaz)![stars](https://img.shields.io/github/stars/emeceve/loquaz.svg?style=social) - a desktop app written in Rust for direct encrypted chat
- [nostr console](https://github.com/vishalxl/nostr_console)![stars](https://img.shields.io/github/stars/vishalxl/nostr_console.svg?style=social) - a nostr command line client written in Dart. Binaries available for Windows, Linux, and MacOS
- [ArcadeCity](https://github.com/ArcadeCity/app)![stars](https://img.shields.io/github/stars/ArcadeCity/app.svg?style=social) - Public group chats and P2P services (WIP) over nostr
- [second exchange](https://github.com/cynsar-foundation/second.exchange)![stars](https://img.shields.io/github/stars/cynsar-foundation/second.exchange.svg?style=social) - an experiment to work out something of like medium, something of creator economy where users are rewarded for engaging in quality discussion and most importantly engaging in governance-related discussion
- [scalastr](https://github.com/benthecarman/scalastr)![stars](https://img.shields.io/github/stars/benthecarman/scalastr.svg?style=social) - A barebones nostr client written in scala
- [Nostros](https://github.com/KoalaSat/nostros)![stars](https://img.shields.io/github/stars/KoalaSat/nostros.svg?style=social) - A nostr mobile client for Android
- [NostrEmitter](https://github.com/cmdruid/nostr-emitter)![stars](https://img.shields.io/github/stars/cmdruid/nostr-emitter.svg?style=social) - Simple E2E encrypted client and EventEmitter object
- [Lightning.Pub](https://github.com/shocknet/Lightning.Pub)![stars](https://img.shields.io/github/stars/shocknet/Lightning.Pub.svg?style=social) - A nostr daemon for Lightning nodes
- [shockwallet](https://github.com/shocknet/wallet2)![stars](https://img.shields.io/github/stars/shocknet/wallet2.svg?style=social) - A Lightning wallet that uses nostr and lnurl to connect to nodes
- [coracle](https://github.com/staab/coracle)![stars](https://img.shields.io/github/stars/staab/coracle.svg?style=social) - A nostr web client
- [nostrweb](https://git.qcode.ch/nostr/nostrweb) - another nostr web client in vanilla JS
  - [nostr.ch](https://nostr.ch/) - live instance
- [Bija](https://github.com/BrightonBTC/bija)![stars](https://img.shields.io/github/stars/BrightonBTC/bija.svg?style=social) - A desktop client written in python. Currently Linux only
- [Nosky](https://github.com/KotlinGeekDev/Nosky)![stars](https://img.shields.io/github/stars/KotlinGeekDev/Nosky.svg?style=social) - A native Android client for Nostr. Still in development
- [Stackerstan](https://stackerstan.org) - ![stars](https://img.shields.io/github/stars/stackerstan/mindmachine.svg?style=social)A decentralised organisation built on Bitcoin and Nostr, implemented as a replicated state machine in Golang
- [nostr-java](https://github.com/tcheeric/nostr-java)![stars](https://img.shields.io/github/stars/tcheeric/nostr-java.svg?style=social) - A nostr client API written in java, for generating, signing and publishing events to relays
- [bolt.fun](https://makers.bolt.fun/feed) - A bitcoin lightning makers community that supports reading and creating comments using Nostr
- [iris](https://iris.to) - A nostr web client
- [gossip](https://github.com/mikedilger/gossip)![stars](https://img.shields.io/github/stars/mikedilger/gossip.svg?style=social) - A desktop client in rust presented with egui
- [Attached](https://github.com/dyegolara/nostr-attached)![stars](https://img.shields.io/github/stars/dyegolara/nostr-attached.svg?style=social) - Open-Source ReactNative Expo app for Nostr (iOS, Android). Currently under app stores review.
- [Member](https://github.com/memberapp/memberapp.github.io)![stars](https://img.shields.io/github/stars/memberapp/memberapp.github.io.svg?style=social) - Progressive Web App Client. Works on desktop and mobile.
  - [member.cash](https://member.cash/) - live instance
- [dispute](https://github.com/ethicnology/dispute)![stars](https://img.shields.io/github/stars/ethicnology/dispute.svg?style=social) -  A cross-platform (Linux, Android, iOS, MacOs, Windows and Web) client for NOSTR
- [Snort](https://github.com/v0l/snort)![stars](https://img.shields.io/github/stars/v0l/snort.svg?style=social) - Nostr UI written in react
  - [snort.social](https://snort.social)
- [Hamstr](https://github.com/styppo/hamstr)![stars](https://img.shields.io/github/stars/styppo/hamstr.svg?style=social) - A twitter-style web client based on astral
  - [hamstr.to](https://hamstr.to)
- [Nozzle](https://github.com/kaiwolfram/Nozzle)![stars](https://img.shields.io/github/stars/kaiwolfram/Nozzle.svg?style=social) - A Twitter-like native Android client written with Jetpack Compose
- [electron-nostr](https://github.com/wds4/electron-react-boilerplate-nostr)![stars](https://img.shields.io/github/stars/wds4/electron-react-boilerplate-nostr?style=social) - A bare-bones desktop nostr client using electron-react-boilerplate. Goal is to be an easy template for people to experiment with different ideas on decentralized ratings, reputation, and web of trust
- [Nostrid](https://github.com/lapulpeta/Nostrid)![stars](https://img.shields.io/github/stars/lapulpeta/Nostrid.svg?style=social) - Multi-platform client currently offering binaries for Android and Windows.
  - [Nostrid.Web](https://web.nostrid.app/) - A preview version of Nostrid running completely on the browser. It can be installed locally as PWA.

### Client reviews and/or comparisons

- Feature [comparison list of Nostr clients](https://github.com/vishalxl/Nostr-Clients-Features-List)![stars](https://img.shields.io/github/stars/vishalxl/Nostr-Clients-Features-List.svg?style=social)

## Libraries

- [nostr-ruby](https://github.com/dtonon/nostr-ruby)![stars](https://img.shields.io/github/stars/dtonon/nostr-ruby.svg?style=social) - a Ruby implementation of the nostr protocol
- [NNostr.Client](https://github.com/Kukks/NNostr)![stars](https://img.shields.io/github/stars/Kukks/NNostr.svg?style=social) - a C# Nostr library for use by clients
- [nostr-tools](https://github.com/fiatjaf/nostr-tools)![stars](https://img.shields.io/github/stars/fiatjaf/nostr-tools.svg?style=social) - a JavaScript client that abstracts the relay management code for use by clients
- [nostr-relaypool-ts](https://github.com/adamritter/nostr-relaypool-ts)![stars](https://img.shields.io/github/stars/adamritter/nostr-relaypool-ts.svg?style=social) - a TypeScript relay pool library on top of nostr-tools that simplifies handling subscriptions to multiple servers
- [nostr-react](https://github.com/t4t5/nostr-react)![stars](https://img.shields.io/github/stars/t4t5/nostr-react.svg?style=social) - React Hooks for Nostr
- [go-nostr](https://github.com/fiatjaf/go-nostr)![stars](https://img.shields.io/github/stars/fiatjaf/go-nostr.svg?style=social) - a Go library that implements relay management, plus event encoding and signing utils
- [nostr_rust](https://github.com/0xtlt/nostr_rust)![stars](https://img.shields.io/github/stars/0xtlt/nostr_rust.svg?style=social) - Functional Rust implementation of the nostr protocol
- [nostr-js](https://github.com/jb55/nostr-js)![stars](https://img.shields.io/github/stars/jb55/nostr-js.svg?style=social) - a javascript implementation of the nostr protocol
- [nostr-rs](https://github.com/futurepaul/nostr-rs)![stars](https://img.shields.io/github/stars/futurepaul/nostr-rs.svg?style=social) - a Rust implementation of the nostr protocol
- [nostr-rs-sdk](https://github.com/yukibtc/nostr-rs-sdk)![stars](https://img.shields.io/github/stars/yukibtc/nostr-rs-sdk.svg?style=social) - Nostr `protocol` implementation, `SDK`, and `FFI` written in Rust
- [relayer](https://github.com/fiatjaf/relayer)![stars](https://img.shields.io/github/stars/fiatjaf/relayer.svg?style=social) - a server framework for writing custom relays
- [NostrPostr](https://github.com/Giszmo/NostrPostr)![stars](https://img.shields.io/github/stars/Giszmo/NostrPostr.svg?style=social) - a Kotlin Nostr library for clients or relays
- [python-nostr](https://github.com/jeffthibault/python-nostr)![stars](https://img.shields.io/github/stars/jeffthibault/python-nostr.svg?style=social) - a python library for making clients
- [nostr-bot](https://github.com/slaninas/nostr-bot)![stars](https://img.shields.io/github/stars/slaninas/nostr-bot.svg?style=social) - a Rust library for writing bots
- [NostrKit](https://github.com/cnixbtc/NostrKit)![stars](https://img.shields.io/github/stars/cnixbtc/NostrKit.svg?style=social) - a Swift library for interacting with relays
- [nostr-relay-inspector](https://github.com/dskvr/nostr-relay-inspector)![stars](https://img.shields.io/github/stars/dskvr/nostr-relay-inspector.svg?style=social - A library that returns useful information about relays based on nostr-js
- [schorr_snap](https://github.com/neeboo/schnorr_snap)![stars](https://img.shields.io/github/stars/neeboo/schnorr_snap.svg?style=social) - A snap plugin for Metamask Flask, supports nostr
- [nostr-deno](https://github.com/KiPSOFT/nostr-deno)![stars](https://img.shields.io/github/stars/KiPSOFT/nostr-deno.svg?style=social) - a client library for Deno javascript runtime.
- [nostr-types](https://github.com/mikedilger/nostr-types)![stars](https://img.shields.io/github/stars/mikedilger/nostr-types.svg?style=social) - a rust library defining types useful for the nostr protocol
- [dart-nostr](https://github.com/ethicnology/dart-nostr)![stars](https://img.shields.io/github/stars/ethicnology/dart-nostr.svg?style=social) - a Dart library for Flutter

## Bridges and Gateways

- [rsslay](https://github.com/fiatjaf/rsslay)![stars](https://img.shields.io/github/stars/fiatjaf/rsslay.svg?style=social) - a bridge that puts RSS feeds into Nostr
- [smtp nostr gateway ](https://github.com/Cameri/smtp-nostr-gateway)![stars](https://img.shields.io/github/stars/Cameri/smtp-nostr-gateway.svg?style=social) - a bridge that forwards emails to pubkeys as encrypted direct messages
- [matrix-nostr-bridge](https://github.com/8go/matrix-nostr-bridge)![stars](https://img.shields.io/github/stars/8go/matrix-nostr-bridge.svg?style=social) a simple Matrix-to-Nostr or Nostr-to-Matrix bridge

## Tools

- [git-nostr-tools](http://git.jb55.com/git-nostr-tools) - A cli tool for sending code patches over nostr
- [nostr-cln-events](http://git.jb55.com/nostr-cln-events) - A CLN plugin to push clightning node events to nostr
- [nostr registry](https://codeberg.org/rsbondi/nostr-registry) - a database of known relays with their uptime and NIP support tables
- [nostr-fzf](https://github.com/Cameri/nostr-fzf)![stars](https://img.shields.io/github/stars/Cameri/nostr-fzf.svg?style=social) - Nostr Directory; a tool for searching usernames and channels
- [nostr-notify](https://github.com/jb55/nostr-notify)![stars](https://img.shields.io/github/stars/jb55/nostr-notify.svg?style=social) - desktop nostr notifications using libnotify
- [nostr-launch](https://codeberg.org/rsbondi/nostr-launch) - a tool for launching a bunch of relays and clients locally for development and testing
- [nos2x - nostr signer extension](https://github.com/fiatjaf/nos2x)![stars](https://img.shields.io/github/stars/fiatjaf/nos2x.svg?style=social) - a browser extension for signing events on 3rd party site without sharing your private keys with them
- [nostr GitHub Action](https://github.com/theborakompanioni/nostr-action)![stars](https://img.shields.io/github/stars/theborakompanioni/nostr-action.svg?style=social) - send events from GitHub Actions
- [nostrefresh](https://github.com/melvincarvalho/nostrefresh)![stars](https://img.shields.io/github/stars/melvincarvalho/nostrefresh.svg?style=social) - simple refresh function for nostr web pages
- [anonroom](https://github.com/vinliao/anonroom)![stars](https://img.shields.io/github/stars/vinliao/anonroom.svg?style=social) - anonymous chat room inside nostr
- [nostril](https://github.com/jb55/nostril)![stars](https://img.shields.io/github/stars/jb55/nostril.svg?style=social) - C cli tool for creating nostr events
- [nostr-rs-relay-compose](https://github.com/vdo/nostr-rs-relay-compose)![stars](https://img.shields.io/github/stars/vdo/nostr-rs-relay-compose.svg?style=social) - a Docker compose deployment for nostr-rs-relay with SSL support based on Traefik
- [tostr](https://github.com/slaninas/tostr)![stars](https://img.shields.io/github/stars/slaninas/tostr.svg?style=social - a twitter to nostr bot
- [nostr.guru](https://nostr.guru/) - a nostr web gateway for viewing events by their ID
- [nostrandom.netlify.app](https://nostrandom.netlify.app/) - generate publish-able Nostr event with random keys
- [nashboard](https://github.com/vinliao/nashboard)![stars](https://img.shields.io/github/stars/vinliao/nashboard.svg?style=social) - a Nostr network dashboard with network statistics, reachable [here](https://nashboard.space/)
- [nostr army knife](https://nostr-army-knife.netlify.app/) - nostr army knife by fiatjaf
- [joinstr](https://github.com/1440000bytes/joinstr)![stars](https://img.shields.io/github/stars/1440000bytes/joinstr.svg?style=social) - coinjoin implementation using nostr
- [ndxstr](https://github.com/ArcadeCity/ndxstr)![stars](https://img.shields.io/github/stars/ArcadeCity/ndxstr.svg?style=social) - nostr's layer 2 indexing nodes, with more advanced querying capability than currently supported by relays
- [nostrillery](https://github.com/Cameri/nostrillery)![stars](https://img.shields.io/github/stars/Cameri/nostrillery.svg?style=social) - a tool for running performance tests against Nostr relays
- [nostr-terminal](https://github.com/cmdruid/nostr-terminal)![stars](https://img.shields.io/github/stars/cmdruid/nostr-terminal.svg?style=social) - SSH-like access to your machine via web terminal, powered by Nostr.
- [nostcat](https://github.com/blakejakopovic/nostcat)![stars](https://img.shields.io/github/stars/blakejakopovic/nostcat.svg?style=social) - cat-like nostr client for scripting and debugging written in Rust
- [rana](https://github.com/grunch/rana)![stars](https://img.shields.io/github/stars/grunch/rana.svg?style=social) - Nostr mining pubkey with multi threading
- [nostreq](https://github.com/blakejakopovic/nostreq)![stars](https://img.shields.io/github/stars/blakejakopovic/nostreq.svg?style=social) - Nostr relay event request generator
- [nostr.io](https://nostr.io/) - network statistics with last published notes, top 50 publishers, and top 50 followed users
- [nostr-commander](https://github.com/8go/nostr-commander-rs)![stars](https://img.shields.io/github/stars/8go/nostr-commander-rs.svg?style=social) - simple but convenient CLI-based Nostr app for following users, sending DMs, etc.
- [nostr.directory](https://github.com/pseudozach/nostr.directory)![stars](https://img.shields.io/github/stars/pseudozach/nostr.directory.svg?style=social) - searchable database of nostr users and their other social media links.
- [nostr-tool](https://github.com/0xtrr/nostr-tool)![stars](https://img.shields.io/github/stars/0xtrr/nostr-tool.svg?style=social) - Rust CLI tool to generate and publish events
- [nostrplebs](https://nostrplebs.com) - A NIP-05 ID registration service.
- [frostr](https://github.com/nickfarrow/frostr)![stars](https://img.shields.io/github/stars/nickfarrow/frostr.svg?style=social) - Create joint nostr identities and require t-of-n signatures to post
- [plebs.place](https://plebs.place) - A NIP-05 ID registration service (in portuguese).
- [nostr.rest](https://nostr.rest) - Mine proof of work public keys with user specified prefixes
- [lnpass](https://lnpass.github.io)![stars](https://img.shields.io/github/stars/lnpass/lnpass-web.svg?style=social) - A key manager for Lightning and nostr.
- [sb.nostr.band](https://sb.nostr.band) - Search bots that you can create and follow to receive new posts matching a keyword right into your feed.

## Browser extensions

Allow you to sign Nostr events on web-apps without having to give them your keys

- [Alby](https://getalby.com)![stars](https://img.shields.io/github/stars/getAlby/lightning-browser-extension.svg?style=social) - Bitcoin Lightning app with nostr support
- [nos2x](https://github.com/fiatjaf/nos2x)![stars](https://img.shields.io/github/stars/fiatjaf/nos2x.svg?style=social) - Nostr Signer Extension
- [wen](https://github.com/fiatjaf/wen)![stars](https://img.shields.io/github/stars/fiatjaf/wen.svg?style=social) - browser extension for website enhancer with nostr
- [Blockcore](https://github.com/block-core/blockcore-wallet)![stars](https://img.shields.io/github/stars/block-core/blockcore-wallet.svg?style=social) - Multi wallet browser extension with nostr support

## Community

Outside of nostr itself, you find the community on:

- [nostr telegram group](https://t.me/nostr_protocol) - a telegram group for nostr protocol discussion
- [nostr reddit](https://www.reddit.com/r/nostr/) - a subreddit for nostr related discussion

## Tutorials

- [Step-by-Step guide to set up a relay on your server](https://github.com/BlockChainCaffe/Nostr-Relay-Setup-Guide) (AWS, DigitalOcean, RaspBerry...  )
- [Set up a nostr relay server in under 5 minutes ](https://andreneves.xyz/p/set-up-a-nostr-relay-server-in-under)
- [nostr workshop with super testnet](https://www.youtube.com/watch?v=HbicnlCXg_Y)
- [Nostr Newcomers Most Common Questions and Answers](https://uselessshit.co/resources/nostr/)

## Deprecated

- [anigma.io](https://anigma.io) - has known xss attack vulnerabilities, which can put private key at risk, or risk signing events you may not want to send.
- [nvote](https://nvote.co) - it does server side processing, and even private key is handled server side, and as such is deprecated for normal use.
- [alphaama.com](https://alphaama.com) - is *under maintenance* as of late 2022.

## Other links

- [nostr on YouTube](https://www.youtube.com/results?search_query=nostr+protocol)
- [vanilla-js-nostr](https://github.com/supertestnet/vanilla-js-nostr)![stars](https://img.shields.io/github/stars/supertestnet/vanilla-js-nostr.svg?style=social) - a demo of posting and viewing a feed in nostr using vanilla javascript
- [nostr playground in Ruby](https://github.com/dtonon/nostr-ruby-playground)![stars](https://img.shields.io/github/stars/dtonon/nostr-ruby-playground.svg?style=social)
- [search posts/profiles by keyword](https://nostr.band) - posts from major relays indexed and searchable in real-time
- [nostr.build](https://nostr.build/) - nostr image uploader
- [wellorder nostr datasets](https://wiki.wellorder.net/wiki/nostr-datasets/) - Public standardized nostr datasets for benchmarking, data science, or other analysis.  
- [Nostrovia Podcast](https://nostrovia.org/) - A Nostr podcast covering all the new projects, all the new cool stuff, all the new NIPs
- [Summaries of all Nostr Improvements Proposals](https://anchor.fm/s/d8e8d5a4/podcast/rss) - ChatGPT generated summaries of all NIPs by k00b

Data for this list is contributed by the community and curated by [@aaaljaz](https://twitter.com/aaaljaz).
