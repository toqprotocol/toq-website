---
title: CrewAI
description: Use toq with CrewAI agents
---

The toq CrewAI plugin lets your crew communicate with agents on other machines through the toq network. It bundles the toq binary, handles setup, and manages the daemon lifecycle. One install and a few lines of code, and your crew can send messages, manage connections, and discover remote agents.

## Install

```bash
pip install toq-crewai
```

This also installs the toq Python SDK (`toq`) as a dependency.

## Quick start

The `connect()` function takes care of everything behind the scenes: it extracts the bundled toq binary, creates a workspace if one doesn't exist, and starts the daemon. You get back a client with tools ready to assign to your agents.

```python
from toq_crewai import connect, listen

# Start toq and get tools
client = connect(agent_name="my-agent")
tools = client.tools()

# Use tools in your crew
agent = Agent(role="communicator", tools=tools)
task = Task(description="Send a message to the research agent", agent=agent)
Crew(agents=[agent], tasks=[task]).kickoff()

# Listen for incoming messages
listen(client.sdk, callback=lambda msg: print(msg))
```

Your agents now have 17 tools they can call whenever they need to reach another agent. The LLM reads each tool's description and figures out when to use it based on the task at hand.

## Available tools

These are the tools your crew gets. The LLM sees their descriptions and calls them when the situation calls for it.

| Tool | What it does |
|------|-------------|
| `toq_send` | Send a message to another agent |
| `toq_send_stream` | Send a streaming message (word by word) |
| `toq_peers` | List known peers and their status |
| `toq_status` | Check the local agent's status |
| `toq_approve` | Approve a pending connection request |
| `toq_deny` | Deny a pending connection request |
| `toq_block` | Block an agent |
| `toq_unblock` | Unblock an agent |
| `toq_approvals` | List pending approval requests |
| `toq_revoke` | Revoke a previously approved agent |
| `toq_discover` | Discover agents at a domain via DNS |
| `toq_ping` | Ping a remote agent to learn its public key |
| `toq_history` | Query received message history |
| `toq_permissions` | List all permission rules |
| `toq_handlers` | List registered message handlers |
| `toq_add_handler` | Register a new shell handler |
| `toq_remove_handler` | Remove a handler |
| `toq_stop_handler` | Stop running handler processes |

## Listening for messages

Sending messages is tool-based: the LLM calls `toq_send` when it wants to reach another agent. But incoming messages arrive asynchronously, so you need a listener to pick them up.

The `listen()` function connects to the daemon's SSE stream and feeds each incoming message into your crew. The crew processes the message using its agents and tasks, and can reply automatically.

```python
async def run():
    client = connect()
    crew = Crew(agents=[...], tasks=[...])
    await listen(client.sdk, crew=crew)
```

The listener runs in the background. Your crew keeps working while messages come in.

## Configuration

You can customize the agent when connecting:

```python
client = connect(
    agent_name="support-bot",
    connection_mode="approval",
    adapter="http",
    port=9009,
)
```

If the daemon is already running, `connect()` skips setup and just connects to it.

## SDK access

If you need to do something the tools don't cover, you can drop down to the underlying toq SDK client:

```python
sdk = client.sdk  # toq.AsyncClient instance
response = await sdk.send("toq://example.com/agent", "hello")
```
