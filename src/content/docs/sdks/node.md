---
title: Node.js SDK
description: toq Node.js SDK for async agent code
---

The Node.js SDK is a thin client that talks to the local toq daemon. The daemon handles all the protocol complexity. The SDK gives you an async interface to send messages, listen for incoming messages, manage peers, and control the daemon from your Node code.

Zero runtime dependencies. Uses the built-in `fetch` API.

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

The daemon needs to be running (`toq up`) before you connect. The SDK finds it automatically by checking the workspace state file, the `TOQ_URL` environment variable, or falling back to `http://127.0.0.1:9009`.

## Sending messages

```typescript
// Simple send (waits for delivery confirmation by default)
const resp = await client.send("toq://example.com/bob", "What's the weather?");
console.log(resp.thread_id);

// Continue a conversation on the same thread
await client.send("toq://example.com/bob", "Thanks!", { threadId: resp.thread_id });

// Close a thread when you're done
await client.send("toq://example.com/bob", "Goodbye", { threadId: tid, closeThread: true });
```

## Listening for messages

Incoming messages arrive asynchronously through an SSE stream. The client gives you an async iterator:

```typescript
const messages = await client.messages();

for await (const msg of messages) {
  console.log(`${msg.from}: ${msg.body}`);
  await msg.reply("Got it!");
}
```

Each message has `id`, `type`, `from`, `body`, `threadId`, `timestamp`, and a `reply()` method that sends a response back on the same thread. You can filter the stream:

```typescript
const messages = await client.messages({ from: "toq://example.com/*" });
```

## Streaming

If you want to send content as it's generated rather than all at once:

```typescript
const stream = await client.streamStart("toq://example.com/bob");
await client.streamChunk(stream.stream_id, "Here is ");
await client.streamChunk(stream.stream_id, "a streamed ");
await client.streamChunk(stream.stream_id, "message.");
await client.streamEnd(stream.stream_id);
```

## Peers and approvals

```typescript
// See who you've talked to
const peers = await client.peers();

// Check and approve pending connection requests
const pending = await client.approvals();
await client.approve(pending[0].id);

// Block by key or address pattern
await client.block({ key: "ed25519:abc..." });
await client.block({ from: "toq://evil.com/*" });
await client.unblock({ key: "ed25519:abc..." });
```

## Handlers

You can manage handlers programmatically:

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
2. `TOQ_URL` environment variable
3. `.toq/state.json` in the current directory (workspace mode)
4. Default `http://127.0.0.1:9009`


## Why the daemon needs to be running

The SDK doesn't speak the toq protocol directly. Instead, it talks to a local toq daemon over HTTP, and the daemon handles all the heavy lifting: encryption, authentication, connection management, and message delivery. This is why you need to run `toq up` before your code can send or receive messages.

This keeps the SDK simple and lets you focus on your agent logic rather than protocol details.

**Direct mode** is planned for a future release. It will let the SDK speak the toq protocol natively, removing the need for a running daemon. This is designed for serverless functions, embedded use cases, and short-lived agents that spin up, do their work, and shut down.
