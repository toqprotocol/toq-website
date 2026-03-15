---
title: Python SDK
description: toq Python SDK for sync and async agent code
---

The Python SDK is a thin client that talks to the local toq daemon. The daemon handles all the protocol complexity (crypto, TLS, handshake, connections). The SDK just gives you a clean way to send messages, listen for incoming messages, manage peers, and control the daemon from your Python code.

Both sync and async clients are included, so you can use whichever fits your codebase.

## Install

```bash
pip install toq
```

Requires Python 3.9+. Dependencies: `httpx`, `httpx-sse`.

## Quick start

```python
import toq

# Sync
client = toq.connect()
client.send("toq://example.com/agent", "hello")

# Async
client = toq.connect_async()
await client.send("toq://example.com/agent", "hello")
```

The daemon needs to be running (`toq up`) before you connect. The SDK finds it automatically by checking the workspace state file, the `TOQ_API_URL` environment variable, or falling back to `http://127.0.0.1:9010`.

## Sending messages

```python
# Simple send (waits for delivery confirmation by default)
resp = client.send("toq://example.com/bob", "What's the weather?")
print(resp["thread_id"])

# Continue a conversation on the same thread
client.send("toq://example.com/bob", "Thanks!", thread_id=resp["thread_id"])

# Close a thread when you're done
client.send("toq://example.com/bob", "Goodbye", thread_id=tid, close_thread=True)

# Fire and forget (don't wait for confirmation)
client.send("toq://example.com/bob", "just letting you know", wait=False)
```

## Listening for messages (async)

Incoming messages arrive asynchronously through an SSE stream. The async client gives you an iterator that yields messages as they come in:

```python
client = toq.connect_async()

async for msg in client.messages():
    print(f"{msg.sender}: {msg.body}")
    await msg.reply("Got it!")
```

Each `Message` has `id`, `type`, `sender`, `body`, `thread_id`, `timestamp`, and a `reply()` method that sends a response back on the same thread. You can filter the stream to only see messages from certain senders:

```python
async for msg in client.messages(from_addr="toq://example.com/*"):
    ...
```

## Streaming

If you want to send content as it's generated rather than all at once, use the streaming API:

```python
stream = client.stream_start("toq://example.com/bob")
client.stream_chunk(stream["stream_id"], "Here is ")
client.stream_chunk(stream["stream_id"], "a streamed ")
client.stream_chunk(stream["stream_id"], "message.")
client.stream_end(stream["stream_id"])
```

The receiver sees each chunk as it arrives.

## Peers and approvals

```python
# See who you've talked to
for peer in client.peers():
    print(peer["address"], peer["status"])

# Check and approve pending connection requests
for req in client.approvals():
    client.approve(req["id"])

# Block by key or address pattern
client.block(key="ed25519:abc...")
client.block(from_addr="toq://evil.com/*")
client.unblock(key="ed25519:abc...")
```

## Handlers

You can manage handlers programmatically, which is useful for setting up agents in code rather than through the CLI:

```python
# Add a shell handler
client.add_handler("logger", "echo $TOQ_TEXT >> log.txt")

# Add an LLM handler
client.add_handler("chat", provider="openai", model="gpt-4o", prompt="Be helpful")

# List and remove
client.handlers()
client.remove_handler("logger")
```

## Other operations

```python
client.status()                    # Daemon status
client.history(limit=10)           # Recent messages
client.discover("example.com")     # DNS discovery
client.ping("toq://host/agent")   # Ping a remote agent
client.config()                    # Read config
client.update_config(log_level="debug")
client.rotate_keys()               # Rotate identity keys
client.export_backup("passphrase") # Encrypted backup
client.import_backup("passphrase", data)
```

## Connection resolution

The SDK finds the daemon in this order:

1. Explicit URL passed to `connect(url="...")`
2. `TOQ_API_URL` environment variable
3. `.toq/state.json` in the current directory (workspace mode)
4. Default `http://127.0.0.1:9010`


## Why the daemon needs to be running

The SDK doesn't speak the toq protocol directly. Instead, it talks to a local toq daemon over HTTP, and the daemon handles all the heavy lifting: encryption, authentication, connection management, and message delivery. This is why you need to run `toq up` before your code can send or receive messages.

This keeps the SDK simple and lets you focus on your agent logic rather than protocol details.

**Direct mode** is planned for a future release. It will let the SDK speak the toq protocol natively, removing the need for a running daemon. This is designed for serverless functions, embedded use cases, and short-lived agents that spin up, do their work, and shut down.
