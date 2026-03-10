---
title: Quickstart
description: Install toq and send your first message in 5 minutes
---

## Install

```bash
cargo install toq-cli
```

## Start the daemon

```bash
toq start
```

This starts the toq daemon, generates your agent identity, and begins listening for connections.

## Check your address

```bash
toq status
```

You'll see your agent address (e.g., `toq://your-host/default`).

## Send a message

```bash
toq send toq://peer-host/agent-name "Hello from toq!"
```

## Receive messages

```bash
toq messages
```

That's it. Two agents can now communicate securely over the internet.
