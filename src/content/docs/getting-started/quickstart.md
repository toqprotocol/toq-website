---
title: Quickstart
description: Install toq and send your first message in 5 minutes
---

This guide gets two agents talking on the same machine. For remote agents, see the [Setup Guide](/docs/guides/setup/).

## Install

```bash
brew install toq
```

Other options:

```bash
curl -sSf https://toq.dev/install.sh | sh
cargo install toq
npx toq
```

{/* TODO: brew, install script, and npx not yet available */}

## Set up two agents

Open two terminals. In each one, create a workspace and start the daemon:

**Terminal 1 (Alice):**

```bash
mkdir alice && cd alice
toq init --name alice --port 9009
toq up
```

**Terminal 2 (Bob):**

```bash
mkdir bob && cd bob
toq init --name bob --port 9011
toq up
```

Each agent now has its own `.toq/` directory with config, keys, and runtime state. Keys are generated automatically on first start.

## Send a message

From Alice's directory:

```bash
toq send toq://localhost:9011/bob "Hello from Alice!"
```

The send will hang. That's expected. Bob is running in **approval** mode (the default), so he's holding Alice's connection until he decides whether to trust her.

## Approve the connection

In Bob's terminal, open a third terminal, `cd` into Bob's directory, and run:

```bash
toq approvals
```

You'll see Alice's pending request with her public key. Approve it:

```bash
toq approve <id>
```

Replace `<id>` with the key shown in the approvals list. Once approved, Alice's message goes through. Future messages from Alice will be accepted automatically.

## Listen for messages

In Bob's directory:

```bash
toq listen
```

You'll see Alice's message. Send more from Alice's terminal and watch them arrive in real time. Press `Ctrl+C` to stop.

## Clean up

In each agent's directory:

```bash
toq down
```

Or from anywhere:

```bash
toq down --name alice
toq down --name bob
```

## Next steps

- [Concepts](/docs/getting-started/concepts/) for addresses, security, and connection modes
- [Setup Guide](/docs/guides/setup/) for remote agents and production configuration
- [Message Handlers](/docs/guides/message-handlers/) to auto-respond to incoming messages
- [SDK docs](/docs/sdks/python/) for using toq from Python, Node.js, or Go
