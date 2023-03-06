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
- [nostr.guide](https://nostr.guide) - A guide to all things nostr
- [nostr address book](https://github.com/aitechguy/nostr-address-book) - A directory of twitter users accounts and their NOSTR addresses
- [tinkering with nostr without any client](https://medium.com/@p2w34/tinkering-with-the-nostr-protocol-will-it-take-twitter-over-74c4bf0fea66)

## Relays

Relays are (so far) application agnostic. You can run your own or use any or all
of the public instances.

### Implementations

- [NNostr](https://github.com/Kukks/NNostr)![stars](https://img.shields.io/github/stars/Kukks/NNostr.svg?style=social) - a C# relay
- [nostr-rs-relay](https://sr.ht/~gheartsfield/nostr-rs-relay/) - a minimalistic relay written in Rust that saves data on SQLite
- [Relayer Basic](https://github.com/fiatjaf/relayer/tree/master/basic) - a simple relay based on _relayer_ backed by Postgres
- [nodestr](https://github.com/Dolu89/nodestr-relay)![stars](https://img.shields.io/github/stars/Dolu89/nodestr-relay.svg?style=social) - a Node.js implementation
- [sovereign-stack](https://www.sovereign-stack.org) - a tool that helps you deploy nostr relays and create self-hosted (bitcoin-only) Value4Value websites.
- [expensive relay](https://github.com/fiatjaf/expensive-relay)![stars](https://img.shields.io/github/stars/fiatjaf/expensive-relay.svg?style=social)- a relay that requires payment for registration
- [me.untethr.nostr-relay](https://github.com/atdixon/me.untethr.nostr-relay)![stars](https://img.shields.io/github/stars/atdixon/me.untethr.nostr-relay.svg?style=social) - a relay written in Clojure
- [Minds Nostr Relay](https://gitlab.com/minds/infrastructure/nostr-relay) - a relay for [Minds](https://www.minds.com), an open-source social network
  - [Minds Engine - Nostr](https://gitlab.com/minds/engine/-/tree/master/Core/Nostr) - relevant Minds API code for reading/writing Minds posts using Nostr
- [NostrPostr Relay](https://github.com/Giszmo/NostrPostr/tree/master/NostrRelay) - a Kotlin Relay supporting both SQLite and Postgresql
- [nostrpy](https://github.com/monty888/nostrpy)![stars](https://img.shields.io/github/stars/monty888/nostrpy.svg?style=social) - relay, client, and other tooling in python
- [nostream](https://github.com/Cameri/nostream)![stars](https://img.shields.io/github/stars/Cameri/nostream.svg?style=social) - a nostr relay written in Typescript backed by PostgreSQL (renamed from nostr-ts-relay)
- [nostr_relay](https://code.pobblelabs.org/fossil/nostr_relay/) – a nostr relay written in python, backed by SQLite
- [søstr](https://github.com/metasikander/s0str)![stars](https://img.shields.io/github/stars/metasikander/s0str.svg?style=social) – a private nostr relay written in rust, saves all notes from one pubkey and publish them to anyone that requests them
- [knostr](https://github.com/lpicanco/knostr)![stars](https://img.shields.io/github/stars/lpicanco/knostr.svg?style=social) – a nostr relay implemented in Kotlin with support for Postgres and metrics(micrometer).
- [PyRelay](https://github.com/johnny423/pyrelay)![stars](https://img.shields.io/github/stars/johnny423/pyrelay.svg?style=social) – a python implementation of a nostr relay, using asyncio.
- [strfry](https://github.com/hoytech/strfry)![stars](https://img.shields.io/github/stars/hoytech/strfry.svg?style=social) – C++ implementation backed by LMDB with efficient syncing of events using merkle trees
- [Astro](https://github.com/Nostrology/astro)![stars](https://img.shields.io/github/stars/Nostrology/astro.svg?style=social)– Elixir based implementation built to be performant and highly distributed.
- [Nex](https://github.com/lebrunel/nex) ![stars](https://img.shields.io/github/stars/lebrunel/nex.svg?style=social) - A powerful and scalable Nostr relay written in Elixir with Postgres DB.
- [gnost-relay](https://github.com/barkyq/gnost-relay) ![stars](https://img.shields.io/github/stars/barkyq/gnost-relay.svg?style=social) - nostr relay written in go backed by postgresql database.
- [nostring](https://github.com/xbol0/nostring)![stars](https://img.shields.io/github/stars/xbol0/nostring.svg?style=social) - A Nostr relay written in Deno.

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
  - [client.nostr.guide](https://client.nostr.guide/)
- [damus](https://github.com/damus-io/damus)![stars](https://img.shields.io/github/stars/damus-io/damus.svg?style=social) - a twitter-like nostr client for iOS and MacOS
  - [damus on testflight](https://testflight.apple.com/join/CLwjLxWl)
- [more-speech](https://github.com/unclebob/more-speech)![stars](https://img.shields.io/github/stars/unclebob/more-speech.svg?style=social) - desktop client for nostr written in Clojure
- [futr](https://github.com/prolic/futr)![stars](https://img.shields.io/github/stars/prolic/futr.svg?style=social) - nostr client desktop app written in Haskell
- [Minds](https://www.minds.com/) - open source social network. Supports reading and creating posts using the Nostr protocol
- [Jester](https://jesterui.github.io/) - Chess over nostr
- [Sendstr](https://sendstr.com/) ![stars](https://img.shields.io/github/stars/vilm3r/sendstr-web.svg?style=social) - shared clipboard between devices over nostr
- [nosbin](https://nosbin.com/)![stars](https://img.shields.io/github/stars/jacany/nosbin.svg?style=social) - pastebin over nostr
- [noscl](https://github.com/fiatjaf/noscl)![stars](https://img.shields.io/github/stars/fiatjaf/noscl.svg?style=social) - a basic command-line client written in Go
- [loquaz](https://github.com/emeceve/loquaz)![stars](https://img.shields.io/github/stars/emeceve/loquaz.svg?style=social) - a desktop app written in Rust for direct encrypted chat
- [nostr console](https://github.com/vishalxl/nostr_console)![stars](https://img.shields.io/github/stars/vishalxl/nostr_console.svg?style=social) - a nostr command line client written in Dart. Binaries available for Windows, Linux, and MacOS
- [ArcadeCity](https://github.com/ArcadeCity/app)![stars](https://img.shields.io/github/stars/ArcadeCity/app.svg?style=social) - Public group chats and P2P services (WIP) over nostr
- [second exchange](https://github.com/cynsar-foundation/second.exchange)![stars](https://img.shields.io/github/stars/cynsar-foundation/second.exchange.svg?style=social) - an experiment to work out something of like medium, something of creator economy where users are rewarded for engaging in quality discussion and most importantly engaging in governance-related discussion
- [scalastr](https://github.com/benthecarman/scalastr)![stars](https://img.shields.io/github/stars/benthecarman/scalastr.svg?style=social) - A barebones nostr client written in scala
- [Nostros](https://github.com/KoalaSat/nostros)![stars](https://img.shields.io/github/stars/KoalaSat/nostros.svg?style=social) - A nostr mobile client for Android
- [Nostrify.me](https://github.com/lightningorb/nostrify.me)![stars](https://img.shields.io/github/stars/lightningorb/nostrify.me.svg?style=social) - Nostr client built in SvelteKit.
  - [Nostrify.me](https://nostrify.me) - Live instance.
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
- [iris](https://github.com/irislib/iris-messenger)![stars](https://img.shields.io/github/stars/irislib/iris-messenger.svg?style=social) - A nostr web client
  - [iris.to](https://iris.to) - live instance
  - [Android app](https://play.google.com/store/apps/details?id=to.iris.twa)
- [gossip](https://github.com/mikedilger/gossip)![stars](https://img.shields.io/github/stars/mikedilger/gossip.svg?style=social) - A desktop client in rust presented with egui
- [Attached](https://github.com/dyegolara/nostr-attached)![stars](https://img.shields.io/github/stars/dyegolara/nostr-attached.svg?style=social) - Open-Source ReactNative Expo app for Nostr (iOS, Android). Currently under app stores review.
- [Member](https://github.com/memberapp/memberapp.github.io)![stars](https://img.shields.io/github/stars/memberapp/memberapp.github.io.svg?style=social) - Progressive Web App Client. Works on desktop and mobile.
  - [member.cash](https://member.cash/) - live instance
- [dispute](https://github.com/ethicnology/dispute)![stars](https://img.shields.io/github/stars/ethicnology/dispute.svg?style=social) - A cross-platform (Linux, Android, iOS, MacOs, Windows and Web) client for NOSTR
- [Snort](https://github.com/v0l/snort)![stars](https://img.shields.io/github/stars/v0l/snort.svg?style=social) - Nostr UI written in react
  - [snort.social](https://snort.social)
- [Hamstr](https://github.com/styppo/hamstr)![stars](https://img.shields.io/github/stars/styppo/hamstr.svg?style=social) - A twitter-style web client built with Vue.js
  - [hamstr.to](https://hamstr.to)
- [Nozzle](https://github.com/kaiwolfram/Nozzle)![stars](https://img.shields.io/github/stars/kaiwolfram/Nozzle.svg?style=social) - A Twitter-like native Android client written with Jetpack Compose
- [electron-nostr](https://github.com/wds4/electron-react-boilerplate-nostr)![stars](https://img.shields.io/github/stars/wds4/electron-react-boilerplate-nostr?style=social) - A bare-bones desktop nostr client using electron-react-boilerplate. Goal is to be an easy template for people to experiment with different ideas on decentralized ratings, reputation, and web of trust
- [Nostrid](https://github.com/lapulpeta/Nostrid)![stars](https://img.shields.io/github/stars/lapulpeta/Nostrid.svg?style=social) - Multi-platform client currently offering binaries for Android, Windows, MacOS and Linux.
  - [Nostrid.Web](https://web.nostrid.app/) - Web version running completely on the browser. It can be installed locally as PWA.
- [nostr-chat-widget-react](https://www.npmjs.com/package/nostr-chat-widget-react?activeTab=readme) - A React component that provides a live-chat widget over nostr that can be embedded into any website.
- [Blockcore Notes](https://github.com/block-core/blockcore-notes) ![stars](https://img.shields.io/github/stars/block-core/blockcore-notes.svg?style=social) - Progressive Web App that can be installed on mobile and desktop, organize following in circles and have both public and private following lists. Dynamic interface for different uses, such as optimized for photograph viewing.
  - [notes.blockcore.net](https://notes.blockcore.net/)
- [Noteon](https://github.com/ShawnCN/cinny_nostsr2/tree/dev)![stars](https://img.shields.io/github/stars/ShawnCN/cinny_nostsr2.svg?style=social) - Yet another nostr client focused on private chat and group chat with a simple, elegant and secure interface.
  - [nostr.noteon.io](https://nostr.noteon.io/)
- [emon](https://github.com/sebastiaanwouters/emon)![stars](https://img.shields.io/github/stars/sebastiaanwouters/emon.svg?style=social) - Encrypted DMs over nostr with lightning payments integrated (WIP).
  - [emon.chat](https://emon.chat)
- [notebin.org](https://notebin.org)![stars](https://img.shields.io/github/stars/nodetec/notebin.svg?style=social) - Nostr UI created with NextJS, support for markdown and code highlighting
- [Daisy](https://github.com/neb-b/daisy) - Mobile client for Android and iOS
  - [testflight + android builds](https://neb.lol/nostr)
- [Flycat](https://github.com/digi-monkey/flycat-web)![stars](https://img.shields.io/github/stars/digi-monkey/flycat-web.svg?style=social) - A 2000s old-school style web client which support blogging on Nostr
- [Amethyst](https://github.com/vitorpamplona/amethyst)![stars](https://img.shields.io/github/stars/vitorpamplona/amethyst.svg?style=social) - An Android client for nostr written in Kotlin
- [MeShell](https://github.com/BEEBSDONE/MeShell_Nodejs)![stars](https://img.shields.io/github/stars/BEEBSDONE/MeShell_Nodejs.svg?style=social) - Web, iOS and Android blog type client destined to publish articles and researches for independent journalists.
  - [MeShell.io](https://meshell.io) - Landing page for more information
- [Disgus](https://github.com/carlitoplatanito/disgus)![stars](https://img.shields.io/github/stars/carlitoplatanito/disgus.svg?style=social) - A comment widget like Disqus, but for Nostr.
- [Tamga](https://github.com/erdaltoprak/tamga)![stars](https://img.shields.io/github/stars/erdaltoprak/tamga.svg?style=social) - An offline first nostr contact & profile manager for iOS!
- [nostromat](https://github.com/ekimber/nostromat)![stars](https://img.shields.io/github/stars/ekimber/nostromat.svg?style=social) - A Twitter-style Nostr web client, written in Clojurescript/React
  - [nostrom.at](https://nostrom.at) - live instance
- [blogstack.io](https://blogstack.io)![stars](https://img.shields.io/github/stars/nodetec/blogstack.svg?style=social) - Blogging site for nostr, supports markdown
- [Votestr](https://votestr.com/)![stars](https://img.shields.io/github/stars/vilm3r/votestr.svg?style=social) - Poll web app with nostr authentication and blind signature unlinkability
- [gnost-deflate-client](https://github.com/barkyq/gnost-deflate-client)![stars](https://img.shields.io/github/stars/barkyq/gnost-deflate-client?style=social) CLI nostr client written in go implementing permessage-deflate websocket compression.
- [algia](https://github.com/mattn/algia)![stars](https://img.shields.io/github/stars/mattn/algia.svg?style=social) - A cli application for nostr.
- [algia-web](https://github.com/ryogrid/algia-web)![stars](https://img.shields.io/github/stars/ryogrid/algia-web.svg?style=social) - A small resource consumption oriented Nostr web client.

### Client reviews and/or comparisons

- Feature [comparison list of Nostr clients](https://github.com/vishalxl/Nostr-Clients-Features-List)![stars](https://img.shields.io/github/stars/vishalxl/Nostr-Clients-Features-List.svg?style=social)

## Libraries

- [nostr-ruby](https://github.com/dtonon/nostr-ruby)![stars](https://img.shields.io/github/stars/dtonon/nostr-ruby.svg?style=social) - a Ruby implementation of the nostr protocol
- [nostr](https://github.com/wilsonsilva/nostr)![stars](https://img.shields.io/github/stars/wilsonsilva/nostr.svg?style=social) - a Ruby Nostr gem for use by clients
- [NNostr.Client](https://github.com/Kukks/NNostr)![stars](https://img.shields.io/github/stars/Kukks/NNostr.svg?style=social) - a C# Nostr library for use by clients
- [nostr-tools](https://github.com/fiatjaf/nostr-tools)![stars](https://img.shields.io/github/stars/fiatjaf/nostr-tools.svg?style=social) - a JavaScript client that abstracts the relay management code for use by clients
- [nostr-relaypool-ts](https://github.com/adamritter/nostr-relaypool-ts)![stars](https://img.shields.io/github/stars/adamritter/nostr-relaypool-ts.svg?style=social) - a TypeScript relay pool library on top of nostr-tools that simplifies handling subscriptions to multiple servers
- [nostr-react](https://github.com/t4t5/nostr-react)![stars](https://img.shields.io/github/stars/t4t5/nostr-react.svg?style=social) - React Hooks for Nostr
- [go-nostr](https://github.com/fiatjaf/go-nostr)![stars](https://img.shields.io/github/stars/fiatjaf/go-nostr.svg?style=social) - a Go library that implements relay management, plus event encoding and signing utils
- [nostr_rust](https://github.com/0xtlt/nostr_rust)![stars](https://img.shields.io/github/stars/0xtlt/nostr_rust.svg?style=social) - Functional Rust implementation of the nostr protocol
- [nostr-js](https://github.com/jb55/nostr-js)![stars](https://img.shields.io/github/stars/jb55/nostr-js.svg?style=social) - a javascript implementation of the nostr protocol
- [nostr-rs](https://github.com/futurepaul/nostr-rs)![stars](https://img.shields.io/github/stars/futurepaul/nostr-rs.svg?style=social) - a Rust implementation of the nostr protocol
- [nostr](https://github.com/rust-nostr/nostr)![stars](https://img.shields.io/github/stars/rust-nostr/nostr.svg?style=social):
    - [nostr](https://github.com/rust-nostr/nostr/tree/master/crates/nostr): Rust implementation of Nostr protocol.
    - [nostr-sdk](https://github.com/rust-nostr/nostr/tree/master/crates/nostr-sdk): High level client library.
    - [bindings](https://github.com/rust-nostr/nostr/tree/master/bindings): UniFFI (Kotlin, Swift, Python, Ruby) bindings
- [relayer](https://github.com/fiatjaf/relayer)![stars](https://img.shields.io/github/stars/fiatjaf/relayer.svg?style=social) - a server framework for writing custom relays
- [NostrPostr](https://github.com/Giszmo/NostrPostr)![stars](https://img.shields.io/github/stars/Giszmo/NostrPostr.svg?style=social) - a Kotlin Nostr library for clients or relays
- [python-nostr](https://github.com/jeffthibault/python-nostr)![stars](https://img.shields.io/github/stars/jeffthibault/python-nostr.svg?style=social) - a python library for making clients
- [nostr-bot](https://github.com/slaninas/nostr-bot)![stars](https://img.shields.io/github/stars/slaninas/nostr-bot.svg?style=social) - a Rust library for writing bots
- [NostrKit](https://github.com/cnixbtc/NostrKit)![stars](https://img.shields.io/github/stars/cnixbtc/NostrKit.svg?style=social) - a Swift library for interacting with relays
- [nostr-relay-inspector](https://github.com/dskvr/nostr-relay-inspector)![stars](https://img.shields.io/github/stars/dskvr/nostr-relay-inspector.svg?style=social) - A library that returns useful information about relays based on nostr-js
- [schorr_snap](https://github.com/neeboo/schnorr_snap)![stars](https://img.shields.io/github/stars/neeboo/schnorr_snap.svg?style=social) - A snap plugin for Metamask Flask, supports nostr
- [nostr-deno](https://github.com/KiPSOFT/nostr-deno)![stars](https://img.shields.io/github/stars/KiPSOFT/nostr-deno.svg?style=social) - a client library for Deno javascript runtime.
- [nostr-types](https://github.com/mikedilger/nostr-types)![stars](https://img.shields.io/github/stars/mikedilger/nostr-types.svg?style=social) - a rust library defining types useful for the nostr protocol
- [dart-nostr](https://github.com/ethicnology/dart-nostr)![stars](https://img.shields.io/github/stars/ethicnology/dart-nostr.svg?style=social) - a Dart library for Flutter
- [nostr-connect](https://github.com/nostr-connect/connect)![stars](https://img.shields.io/github/stars/nostr-connect/connect.svg?style=social) - Nostr Connect SDK for TypeScript is a library that allows you to easily integrate Nostr Connect into your web application 
- [pynostr](https://github.com/holgern/pynostr)![stars](https://img.shields.io/github/stars/holgern/pynostr.svg?style=social) - a python library for nostr
- [nostr-php](https://github.com/swentel/nostr-php)![stars](https://img.shields.io/github/stars/swentel/nostr-php.svg?style=social) - a PHP library for nostr

## Bridges and Gateways

- [rsslay](https://github.com/piraces/rsslay)![stars](https://img.shields.io/github/stars/piraces/rsslay.svg?style=social) - fork of the rsslay by @fiatjaf. a bridge that puts RSS feeds into Nostr optimized, more funcionalities and UI improvements. Live at [rsslay.nostr.moe](https://rsslay.nostr.moe/)
- [smtp nostr gateway ](https://github.com/Cameri/smtp-nostr-gateway)![stars](https://img.shields.io/github/stars/Cameri/smtp-nostr-gateway.svg?style=social) - a bridge that forwards emails to pubkeys as encrypted direct messages
- [matrix-nostr-bridge](https://github.com/8go/matrix-nostr-bridge)![stars](https://img.shields.io/github/stars/8go/matrix-nostr-bridge.svg?style=social) a simple Matrix-to-Nostr or Nostr-to-Matrix bridge
- [Mostr](https://gitlab.com/soapbox-pub/mostr)![stars](https://img.shields.io/github/stars/soapbox-pub/mostr.svg?style=social) - a bridge between Nostr and the Fediverse (Mastodon, ActivityPub, etc.)

## Tools

- [nostrich.fun](https://nostrich.fun)![stars](https://img.shields.io/github/stars/lightningnetworkstores/lightningnetworkstores.github.io.svg?style=social) - A feature-rich directory of nostr projects. A fork of [LightningNetworkStores.com](https://lightningnetworkstores.com)
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
- [tostr](https://github.com/slaninas/tostr)![stars](https://img.shields.io/github/stars/slaninas/tostr.svg?style=social) - a twitter to nostr bot
- [nostr.guru](https://nostr.guru/) - a nostr web gateway for viewing events by their ID
- [nostrandom.netlify.app](https://nostrandom.netlify.app/) - generate publish-able Nostr event with random keys
- [nashboard](https://github.com/vinliao/nashboard)![stars](https://img.shields.io/github/stars/vinliao/nashboard.svg?style=social) - a Nostr network dashboard with network statistics, reachable [here](https://nashboard.space/)
- [nostr army knife](https://nostr-army-knife.netlify.app/) - nostr army knife by fiatjaf
- [joinstr](https://github.com/1440000bytes/joinstr)![stars](https://img.shields.io/github/stars/1440000bytes/joinstr.svg?style=social) - coinjoin implementation using nostr
- [ndxstr](https://github.com/ArcadeCity/ndxstr)![stars](https://img.shields.io/github/stars/ArcadeCity/ndxstr.svg?style=social) - nostr's layer 2 indexing nodes, with more advanced querying capability than currently supported by relays
- [nostrillery](https://github.com/Cameri/nostrillery)![stars](https://img.shields.io/github/stars/Cameri/nostrillery.svg?style=social) - a tool for running performance tests against Nostr relays
- [nostr-terminal](https://github.com/cmdruid/nostr-terminal)![stars](https://img.shields.io/github/stars/cmdruid/nostr-terminal.svg?style=social) - SSH-like access to your machine via web terminal, powered by Nostr.
- [nostcat](https://github.com/blakejakopovic/nostcat)![stars](https://img.shields.io/github/stars/blakejakopovic/nostcat.svg?style=social) - cat-like nostr client for scripting and debugging written in Rust
- [nostreq](https://github.com/blakejakopovic/nostreq)![stars](https://img.shields.io/github/stars/blakejakopovic/nostreq.svg?style=social) - Nostr relay event request generator
- [nostr.io](https://nostr.io/) - network statistics with last published notes, top 50 publishers, and top 50 followed users
- [nostr-commander](https://github.com/8go/nostr-commander-rs)![stars](https://img.shields.io/github/stars/8go/nostr-commander-rs.svg?style=social) - simple but convenient CLI-based Nostr app for following users, sending DMs, etc.
- [nostr.directory](https://github.com/pseudozach/nostr.directory)![stars](https://img.shields.io/github/stars/pseudozach/nostr.directory.svg?style=social) - searchable database of nostr users and their other social media links.
- [nostr-tool](https://github.com/0xtrr/nostr-tool)![stars](https://img.shields.io/github/stars/0xtrr/nostr-tool.svg?style=social) - Rust CLI tool to generate and publish events
- [frostr](https://github.com/nickfarrow/frostr)![stars](https://img.shields.io/github/stars/nickfarrow/frostr.svg?style=social) - Create joint nostr identities and require t-of-n signatures to post
- [nostr.rest](https://nostr.rest) - Mine proof of work public keys with user specified prefixes
- [lnpass](https://lnpass.github.io)![stars](https://img.shields.io/github/stars/lnpass/lnpass-web.svg?style=social) - A key manager for Lightning and nostr.
- [sb.nostr.band](https://sb.nostr.band) - Search bots that you can create and follow to receive new posts matching a keyword right into your feed.
- [rss.nostr.band](https://rss.nostr.band) - Create custom RSS feeds with posts matching your keywords and consume using your favorite RSS reader.
- [nostrview](https://nostrview.com) - A nostr search engine. Search by content, tags, events or pub keys.
- [nostr-bulk-dms](https://github.com/leesalminen/nostr-bulk-dm)![stars](https://img.shields.io/github/stars/leesalminen/nostr-bulk-dm.svg?style=social) - A tool that allows you to send DMs over nostr to many recipients in bulk.
- [nostrify](https://github.com/joelklabo/nostrify)![stars](https://img.shields.io/github/stars/joelklabo/nostrify.svg?style=social) - A Core Lightning plugin that sends events (forwards, connect, disconnect, etc.) to nostr. 
- [nip06-web](https://github.com/jaonoctus/nip06-web)![stars](https://img.shields.io/github/stars/jaonoctus/nip06-web.svg?style=social) - a website to generate or restore NIP-06 seed phrases
  - [nip06.jaonoct.us](https://nip06.jaonoct.us) - by jaonoctus
- [nip06-cli](https://github.com/jaonoctus/nip06-cli)![stars](https://img.shields.io/github/stars/jaonoctus/nip06-cli.svg?style=social) - a Node.js CLI to generate or restore NIP-06 seed phrases
- [nostr-broadcast](https://github.com/leesalminen/nostr-broadcast)![stars](https://img.shields.io/github/stars/leesalminen/nostr-broadcast.svg?style=social) This tool lets you take your events from some relays and broadcast them to another relay. Could be helpful for backing up your notes to a private relay.
- [nostr-follow-bundler](https://github.com/leesalminen/nostr-follow-bundler)![stars](https://img.shields.io/github/stars/leesalminen/nostr-follow-bundler.svg?style=social) This tool lets you create lists of profiles that other users can then see and follow themselves.
- [nostr-proxy](https://github.com/dolu89/nostr-proxy)![stars](https://img.shields.io/github/stars/dolu89/nostr-proxy?style=social) - Push and get events to your Proxy, get results from multiple Nostr relays.
- [nostrends](https://github.com/akiomik/nostrends)![stars](https://img.shields.io/github/stars/akiomik/nostrends?style=social) - Trending on Nostr, like Twitter trends. Live at [nostrends.vercel.app](https://nostrends.vercel.app).
- [homebrew-nostr](https://github.com/0xbabo/homebrew-nostr)![stars](https://img.shields.io/github/stars/0xbabo/homebrew-nostr?style=social) - Homebrew tap for Nostr software.
- [heyxynip5](https://github.com/bennyhodl/hexynip5)![stars](https://img.shields.io/github/stars/bennyhodl/hexynip5?style=social) - A CLI helper for converting nostr npub/nsec to their hex format for NIP-05 verification.
- [http-nostr-publisher](https://github.com/getAlby/http-nostr-publisher)![stars](https://img.shields.io/github/stars/getAlby/http-nostr-publisher?style=social) -  A Cloudflare worker to publish Nostr events to relays through a non-blocking HTTP interface .
- [blastr](https://github.com/MutinyWallet/blastr)![stars](https://img.shields.io/github/stars/MutinyWallet/blastr?style=social) - A nostr cloudflare workers proxy relay that publishes to all known relays.
- [keystr-rs](https://github.com/keystr/keystr-rs)![stars](https://img.shields.io/github/stars/keystr/keystr-rs?style=social) - An application for managing Nostr keys. Written in Rust, with simple UI (Iced).
- [nostr_simple_publish](https://www.drupal.org/project/nostr_simple_publish/)- Drupal module to publish content to Nostr.
- [nostr-spam-detection](https://github.com/blakejakopovic/nostr-spam-detection)![stars](https://img.shields.io/github/stars/blakejakopovic/nostr-spam-detection.svg?style=social) -  An experiment in building a machine learning model to label Nostr spam content for filtering and relay rejection.
- [blogsync](https://github.com/canostrical/blogsync)![stars](https://img.shields.io/github/stars/canostrical/blogsync.svg?style=social) - Self-host blog articles from long-form notes e.g. via Caddy server.


## NIP-05 identity services

- [nostrcheck.me](https://nostrcheck.me/) - A NIP-05 ID registration service.
- [nostrplebs](https://nostrplebs.com) - A NIP-05 ID registration service.
- [plebs.place](https://plebs.place) - A NIP-05 ID registration service (in portuguese).
- [nanostr](https://github.com/xbol0/nanostr)![stars](https://img.shields.io/github/stars/xbol0/nanostr?style=social) A NIP-05 name server written in Deno.
- [nostr.industries](https://nostr.industries) - A free NIP-05 ID registration service.
- [NIP-05 on LNBits](https://github.com/lnbits/lnbits/tree/main/lnbits/extensions/nostrnip5) - Sell NIP-05 verification for your domain using LNBits.
- [younostr.com](https://younostr.com) - A NIP-05 ID registration service (in portuguese).
- [nostrprotocol.net](https://github.com/KiPSOFT/nostr-nip05-service)![stars](https://img.shields.io/github/stars/KiPSOFT/nostr-nip05-service?style=social) - A free NIP-05 identifier service.
- [nostr.ly/easyNostr](https://nostr.ly) - NIP-05 ID provider on domains: nostr.ly, mynostr.io, easyNostr.com. Free. Coming soon: NIP-05 on your own domain.
- [getalby.com](https://getalby.com/) - Lightning wallet with NIP-05 ID registration service.
- [iris.to](https://iris.to) — A Nostr client that provides a free NIP-05 ID
- [bitcoiner.chat](https://bitcoiner.chat) - A free NIP-05 ID registration service.
- [pleroma2nip05](https://code.taurix.net/guy/pleroma2nip05) - A Python based service to link pleroma ID's to nostr keys.

## Offline signer

- [keechain](https://github.com/yukibtc/keechain)![stars](https://img.shields.io/github/stars/yukibtc/keechain.svg?style=social) - Bitcoin application to transform your offline computer in an AirGap Signing Device (aka Hardware Wallet) with support to `NIP-06` and `NIP-26`.
- [nostrum](https://github.com/nostr-connect/nostrum)![stars](https://img.shields.io/github/stars/nostr-connect/nostrum.svg?style=social) - Nostrum it's a mobile app that allows you to sign transactions and messages with your Nostr keys. Nostrum is the reference implementation for a remote signer app (ie. Wallet) of the Nostr Connect protocol.

## Vanity pubkey mining

- [nostr-pubminer](https://github.com/lacaulac/nostr-pubminer)![stars](https://img.shields.io/github/stars/lacaulac/nostr-pubminer.svg?style=social) - A simple tool to mine nostr vanity pubkeys
- [rana](https://github.com/grunch/rana)![stars](https://img.shields.io/github/stars/grunch/rana.svg?style=social) - Vanity pubkey miner based on nip13
- [glasnostr](https://github.com/eyelight/glasnostr) ![stars](https://img.shields.io/github/stars/eyelight/glasnostr.svg?style=social) - CLI tool to mine a vanity prefix for your nostr npub
- [nostrogen](https://github.com/tonyinit/nostrogen)![stars](https://img.shields.io/github/stars/tonyinit/nostrogen.svg?style=social)  -  simple web based nostr vanity address generator 
- [nostr-vanity-address-generator](https://github.com/chawyehsu/nostr-vanity-address-generator) ![stars](https://img.shields.io/github/stars/chawyehsu/nostr-vanity-address-generator.svg?style=social) - Cross-platform nostr vanity address generator
- [go-pubmine](https://github.com/tenkoh/go-pubmine) ![stars](https://img.shields.io/github/stars/tenkoh/go-pubmine.svg?style=social) - Multithreading nostr keypair generator which gives pretty (vanity) public keys. Both cli and web app are available.

## Browser extensions

Allow you to sign Nostr events on web-apps without having to give them your keys

- [Alby](https://getalby.com)![stars](https://img.shields.io/github/stars/getAlby/lightning-browser-extension.svg?style=social) - Bitcoin Lightning app with nostr support
- [Flamingo](https://www.getflamingo.org) - Nostr browser extension with a focus on UX
- [nos2x](https://github.com/fiatjaf/nos2x)![stars](https://img.shields.io/github/stars/fiatjaf/nos2x.svg?style=social) - Nostr Signer Extension
- [wen](https://github.com/fiatjaf/wen)![stars](https://img.shields.io/github/stars/fiatjaf/wen.svg?style=social) - browser extension for website enhancer with nostr
- [Blockcore](https://github.com/block-core/blockcore-wallet)![stars](https://img.shields.io/github/stars/block-core/blockcore-wallet.svg?style=social) - Multi wallet browser extension with nostr support
- [Nostore](https://testflight.apple.com/join/ouPWAQAV) - Nostr Signer Extension for iOS/macOS Safari
- [nostr-keyx](https://github.com/susumuota/nostr-keyx)![stars](https://img.shields.io/github/stars/susumuota/nostr-keyx.svg?style=social) - A NIP-07 browser extension that uses the OS's native keychain application (e.g. Keychain Access on macOS) to protect your private keys

## Community

Outside of nostr itself, you find the community on:

- [nostr telegram group](https://t.me/nostr_protocol) - a telegram group for nostr protocol discussion
- [nostr español/spanish telegram group](https://t.me/nostr_es) - a spanish telegram group for nostr
- [nostr reddit](https://www.reddit.com/r/nostr/) - a subreddit for nostr related discussion
- [nostr discord](https://discord.gg/Pxkcgt9sMj) - a discord server for nostr enthusiasts and developers

## Tutorials

- [Step-by-Step guide to set up a relay on your server](https://github.com/BlockChainCaffe/Nostr-Relay-Setup-Guide) (AWS, DigitalOcean, RaspBerry... )
- [Set up a nostr relay server in under 5 minutes ](https://andreneves.xyz/p/set-up-a-nostr-relay-server-in-under)
- [nostr workshop with super testnet](https://www.youtube.com/watch?v=HbicnlCXg_Y)
- [Nostr Newcomers Most Common Questions and Answers](https://uselessshit.co/resources/nostr/)
- [How to: Run your own nostr relay](https://nutcroft.com/blog/how-to-run-your-own-nostr-relay/) (nostr-rs-relay, Caddy, no Docker)
- [How to set up a paid nostr relay](https://andreneves.xyz/p/how-to-setup-a-paid-nostr-relay)

## Deprecated

- [anigma.io](https://anigma.io) - has known xss attack vulnerabilities, which can put private key at risk, or risk signing events you may not want to send.
- [nvote](https://nvote.co) - it does server side processing, and even private key is handled server side, and as such is deprecated for normal use.
- [alphaama.com](https://alphaama.com) - is _under maintenance_ as of late 2022.
- [rsslay](https://github.com/fiatjaf/rsslay)![stars](https://img.shields.io/github/stars/fiatjaf/rsslay.svg?style=social) - a bridge that puts RSS feeds into Nostr


## Other links

- [nostr on YouTube](https://www.youtube.com/results?search_query=nostr+protocol)
- [vanilla-js-nostr](https://github.com/supertestnet/vanilla-js-nostr)![stars](https://img.shields.io/github/stars/supertestnet/vanilla-js-nostr.svg?style=social) - a demo of posting and viewing a feed in nostr using vanilla javascript
- [nostr playground in Ruby](https://github.com/dtonon/nostr-ruby-playground)![stars](https://img.shields.io/github/stars/dtonon/nostr-ruby-playground.svg?style=social)
- [search posts/profiles by keyword](https://nostr.band) - posts from major relays indexed and searchable in real-time
- [nostr.build](https://nostr.build/) - nostr image uploader
- [inosta api](https://github.com/johnongit/INOSTA-Nostr-Img-Service)![stars](https://img.shields.io/github/stars/johnongit/INOSTA-Nostr-Img-Service.svg?style=social) - Expensive Image Hosting Service
   - [api.inosta.cc](https://api.inosta.cc) - Backend live instance
   - [inosta.cc](https://inosta.cc)-  Demonstrator live instance
- [wellorder nostr datasets](https://wiki.wellorder.net/wiki/nostr-datasets/) - Public standardized nostr datasets for benchmarking, data science, or other analysis.
- [Nostrovia Podcast](https://nostrovia.org/) - A Nostr podcast covering all the new projects, all the new cool stuff, all the new NIPs
- [Summaries of all Nostr Improvements Proposals](https://anchor.fm/s/d8e8d5a4/podcast/rss) - ChatGPT generated summaries of all NIPs by k00b
- [Media caching server for Nostr](https://media.nostr.band) - caches resized profile pictures and banners to save bandwidth for clients
- [nostr icons](https://github.com/satscoffee/nostr_icons)![stars](https://img.shields.io/github/stars/satscoffee/nostr_icons.svg?style=social) -  Purple, white, and black icons in various formats designed for nostr.

Data for this list is contributed by the community and curated by [@aaaljaz](https://twitter.com/aaaljaz) ( npub1aljazgxlpnpfp7n5sunlk3dvfp72456x6nezjw4sd850q879rxqsthg9jp)

