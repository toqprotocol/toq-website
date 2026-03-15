---
title: Node.js SDK
description: toq Node.js SDK for async agent code
---

The Node.js SDK is a thin client that talks to the local toq daemon. The daemon handles all the protocol complexity. The SDK gives you an async interface to send messages, listen for incoming messages, manage peers, and control the daemon.

Zero runtime dependencies. Uses the built-in `fetch` API (Node 18+).

## Install

```bash
npm install toq
```

Requires Node 18+.

## Quick start

```typescript
import { connect } from "toq";

const client = connect();
await client.send("toq://example.com/agent", "hello");
```

The daemon must be running (`toq up`) before connecting. The SDK finds it automatically by checking the workspace state file, the `TOQ_API_URL` environment variable, or falling back to `http://127.0.0.1:9010`.

## Sending messages

```typescript
// Simple send (waits for delivery confirmation)
const resp = await client.send("toq://example.com/bob", "What's the weather?");
console.log(resp.thread_id);

// Continue a thread
await client.send("toq://example.com/bob", "Thanks!", { threadId: resp.thread_id });

// Close a thread
await client.send("toq://example.com/bob", "Goodbye", { threadId: tid, closeThread: true });
```

## Listening for messages

```typescript
const messages = await client.messages();

for await (const msg of messages) {
  console.log(`${msg.from}: ${msg.body}`);
  await msg.reply("Got it!");
}
```

Each message has `id`, `type`, `from`, `body`, `threadId`, `timestamp`, and a `reply()` method. You can filter the stream:

```typescript
const messages = await client.messages({ from: "toq://example.com/*" });
```

## Streaming

```typescript
const stream = await client.streamStart("toq://example.com/bob");
await client.streamChunk(stream.stream_id, "Here is ");
await client.streamChunk(stream.stream_id, "a streamed ");
await client.streamChunk(stream.stream_id, "message.");
await client.streamEnd(stream.stream_id);
```

## Peers and approvals

```typescript
// List peers
const peers = await client.peers();

// Manage approvals
const pending = await client.approvals();
await client.approve(pending[0].id);

// Block/unblock
await client.block({ key: "ed25519:abc..." });
await client.block({ from: "toq://evil.com/*" });
await client.unblock({ key: "ed25519:abc..." });
```

## Handlers

```typescript
// Add a shell handler
await client.addHandler("logger", "echo $TOQ_TEXT >> log.txt");

// Add an LLM handler
await client.addHandler("chat", "", {
  provider: "openai",
  model: "gpt-4o",
  prompt: "Be helpful",
});

// List and remove
await client.handlers();
await client.removeHandler("logger");
```

## Other operations

```typescript
await client.status();                     // Daemon status
await client.history({ limit: 10 });       // Recent messages
await client.discover("example.com");      // DNS discovery
await client.ping("toq://host/agent");     // Ping a remote agent
await client.config();                     // Read config
await client.updateConfig({ log_level: "debug" });
await client.rotateKeys();                 // Rotate identity keys
await client.exportBackup("passphrase");   // Encrypted backup
```

## Connection resolution

The SDK finds the daemon in this order:

1. Explicit URL passed to `connect("...")`
2. `TOQ_API_URL` environment variable
3. `.toq/state.json` in the current directory (workspace mode)
4. Default `http://127.0.0.1:9010`
