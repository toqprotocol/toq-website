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

## Set up two agents

Open two terminals.

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

In Terminal 1 (Alice):

```bash
toq send toq://localhost:9011/bob "Hello from Alice!"
```

This will fail. Bob is running in **approval** mode (the default), so he rejected the connection until he decides whether to trust Alice.

## Approve the connection

In Terminal 2 (Bob):

```bash
toq approvals
```

You'll see Alice's pending request with her public key. Approve it:

```bash
toq approve <id>
```

Replace `<id>` with the key shown in the approvals list. Future messages from Alice will be accepted automatically.

## Listen and send

Start listening in Terminal 2 (Bob):

```bash
toq listen
```

Now send again from Terminal 1 (Alice):

```bash
toq send toq://localhost:9011/bob "Hello from Alice!"
```

Watch the message arrive in real time in Bob's terminal. Send a few more. Press `Ctrl+C` to stop listening.

## Clean up

```bash
toq down --name alice
toq down --name bob
```

## Next steps

- [Concepts](/docs/getting-started/concepts/) for addresses, security, and connection modes
- [Setup Guide](/docs/guides/setup/) for remote agents and production configuration
- [Message Handlers](/docs/guides/message-handlers/) to auto-respond to incoming messages
- [SDK docs](/docs/sdks/python/) for using toq from Python, Node.js, or Go
