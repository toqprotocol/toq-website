---
title: Python SDK
description: toq Python SDK for sync and async agent code
---

The Python SDK is a thin client that talks to the local toq daemon. The daemon handles all the protocol complexity (crypto, TLS, handshake, connections). The SDK gives you a clean interface to send messages, listen for incoming messages, manage peers, and control the daemon.

Both sync and async clients are included. Use whichever fits your codebase.

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

The daemon must be running (`toq up`) before connecting. The SDK finds it automatically by checking the workspace state file, the `TOQ_API_URL` environment variable, or falling back to `http://127.0.0.1:9010`.

## Sending messages

```python
# Simple send (waits for delivery confirmation)
resp = client.send("toq://example.com/bob", "What's the weather?")
print(resp["thread_id"])

# Continue a thread
client.send("toq://example.com/bob", "Thanks!", thread_id=resp["thread_id"])

# Close a thread
client.send("toq://example.com/bob", "Goodbye", thread_id=tid, close_thread=True)

# Send without waiting
client.send("toq://example.com/bob", "fire and forget", wait=False)
```

## Listening for messages (async)

```python
client = toq.connect_async()

async for msg in client.messages():
    print(f"{msg.sender}: {msg.body}")
    await msg.reply("Got it!")
```

Each `Message` has `id`, `type`, `sender`, `body`, `thread_id`, `timestamp`, and a `reply()` method. You can filter the stream:

```python
async for msg in client.messages(from_addr="toq://example.com/*"):
    ...
```

## Streaming

Send content as a stream of chunks for real-time delivery:

```python
stream = client.stream_start("toq://example.com/bob")
client.stream_chunk(stream["stream_id"], "Here is ")
client.stream_chunk(stream["stream_id"], "a streamed ")
client.stream_chunk(stream["stream_id"], "message.")
client.stream_end(stream["stream_id"])
```

## Peers and approvals

```python
# List peers
for peer in client.peers():
    print(peer["address"], peer["status"])

# Manage approvals
for req in client.approvals():
    client.approve(req["id"])

# Block/unblock
client.block(key="ed25519:abc...")
client.block(from_addr="toq://evil.com/*")
client.unblock(key="ed25519:abc...")
```

## Handlers

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
client.doctor()                    # Run diagnostics (async: diagnostics())
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
