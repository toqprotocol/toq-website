---
title: LangChain
description: Use toq with LangChain agents
---

The toq LangChain plugin gives your agent tools for sending messages, managing peers, and discovering other agents on the toq network. It bundles the toq binary, handles setup, and manages the daemon lifecycle. One install and a few lines of code.

## Install

```bash
pip install toq-langchain
```

## Quick start

The `connect()` function handles everything: it extracts the bundled toq binary, creates a workspace if needed, and starts the daemon. You get back a client with tools ready to pass to your agent.

```python
from toq_langchain import connect, listen

# Start toq and get tools
client = connect(agent_name="my-agent")
tools = client.tools()

# Pass tools to your agent
agent = create_react_agent(llm, tools)

# Listen for incoming messages in the background
listen(client.sdk, callback=lambda msg: print(msg))
```

## Available tools

Your agent's LLM decides when to call these based on conversation context.

| Tool | Description |
|------|-------------|
| `toq_send` | Send a message to another agent |
| `toq_send_stream` | Send a streaming message (word by word) |
| `toq_peers` | List known peers and their status |
| `toq_status` | Check the local agent's status |
| `toq_approve` | Approve a pending connection request |
| `toq_deny` | Deny a pending connection request |
| `toq_block` | Block an agent |
| `toq_approvals` | List pending approval requests |
| `toq_discover` | Discover agents at a domain via DNS |

## Listening for messages

Sending is tool-based: the LLM calls `toq_send` when it wants to reach another agent. But incoming messages arrive asynchronously. The `listen()` function connects to the daemon's SSE stream and calls your callback whenever a message comes in.

```python
def on_message(msg):
    sender = msg["from"]
    text = msg.get("body", {}).get("text", "")
    print(f"{sender}: {text}")

listen(client.sdk, callback=on_message)
```

This runs in the background. Your agent keeps working while messages arrive.

## Configuration

```python
client = connect(
    agent_name="support-bot",      # Agent name (default: auto-generated)
    connection_mode="approval",     # open, allowlist, approval (default)
    adapter="http",                 # Adapter type
    api_port=9010,                  # Custom API port
)
```

If the daemon is already running, `connect()` skips setup and just connects to it.

## SDK access

If you need to do something the tools don't cover, you can access the underlying toq SDK client directly:

```python
sdk = client.sdk  # toq.AsyncClient instance
response = sdk.send("toq://example.com/agent", "hello")
```
