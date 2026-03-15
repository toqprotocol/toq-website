---
title: Overview
description: What is toq protocol and why it exists
---

toq protocol is an open, secure communication protocol that lets AI agents talk to each other directly. No central server, no vendor lock-in, no platform dependency.

Each agent runs a lightweight daemon that handles addressing, discovery, authentication, and message delivery. Agents find each other using addresses like `toq://example.com/agent-name`, establish encrypted connections, and exchange messages in real time, including streaming.

## Why toq

- **Self-hosted**: your agents, your infrastructure, your data. No cloud dependency.
- **Security-first**: mutual TLS, Ed25519 authentication, per-agent connection policies. Endpoints are unreachable by humans or raw HTTP. Only agents running toq protocol can connect.
- **Simple**: install in one command, send your first message in under 5 minutes. Add a built-in LLM handler and your agent holds conversations with zero code.
- **DNS discovery**: agents are reachable at `toq://yourdomain.com/agent` with no port numbers, no reverse proxy, no cloud service. Just two DNS records.
- **Framework-agnostic**: works with LangChain, CrewAI, OpenClaw, or plain scripts.
- **Open source**: Apache 2.0 licensed, no usage fees, no API keys.

## Connection modes

Every agent controls who can reach it. Four modes, configurable per agent:

- **Open**: accept messages from anyone.
- **Allowlist**: only accept from approved addresses.
- **Approval** (default): hold messages from unknown senders until you approve them.
- **DNS-verified**: only accept connections from agents with valid DNS TXT records proving they control their claimed domain. No approval step. If the DNS checks out, they're in.

## Why not MCP?

MCP connects an LLM to tools and data sources. It's a vertical integration: one model calling functions on one server. It doesn't handle two autonomous agents having a conversation.

toq protocol is horizontal. Agent A sends a message to Agent B, and Agent B decides what to do with it. There are threads, streaming, connection policies, and mutual authentication. MCP has none of these because it wasn't designed for peer-to-peer agent communication.

If your agents need to call tools, use MCP. If your agents need to talk to each other, use toq.

## Why not plain HTTP?

You could expose your agent as an HTTP endpoint and have other agents call it. But then you're building a protocol from scratch:

- **No identity.** Anyone can hit your endpoint. Humans, bots, scanners. There's no way to verify the caller is a legitimate agent.
- **No mutual auth.** HTTP gives you server-side TLS at best. The caller doesn't prove who they are at the protocol level.
- **No connection policies.** You'd need to build allowlists, approval workflows, and blocklists yourself.
- **No prompt injection boundary.** HTTP mixes transport, headers, and body into one stream. toq separates protocol control from message content at the wire level.
- **No threading or streaming.** You'd need to design your own conversation model, thread management, and streaming protocol on top of HTTP.

toq handles all of this out of the box. Your agent code just sends and receives messages.

## Why not A2A?

Google's A2A protocol is the enterprise standard for agent-to-agent communication. It's powerful, but it's built for organizations with infrastructure teams. Setup involves agent cards, OAuth flows, task lifecycle management, and JSON-RPC endpoints.

toq is built for everyone else. One install command, one init, one `toq up`. No agent cards to write, no OAuth to configure, no task state machines to manage. And if you need A2A interop, toq has it [built in](/docs/bridge/a2a/). Enable it with one config line and your agent speaks both protocols on the same port.

## How it works

The toq daemon is a transport layer, not an agent. It handles encryption, authentication, delivery, and connection policies. It does not process or respond to messages on its own.

Your agent logic lives outside the daemon. There are four ways to wire it up:

- **LLM handlers**: built-in conversational AI. Add a handler with `toq handler add chat --provider openai --model gpt-4o` and your agent replies to messages using an LLM. Supports OpenAI, Anthropic, AWS Bedrock, and Ollama. No code required.
- **Shell handlers**: shell commands that run automatically when a message arrives. The daemon passes the message to your script via stdin and environment variables.
- **SDKs**: your agent code connects to the daemon's local API and listens for messages in a loop.
- **Framework plugins**: drop-in integrations for LangChain, CrewAI, and OpenClaw that handle the wiring for you.

## What's included

| Component | Description |
|-----------|-------------|
| `toq` CLI | Daemon, CLI, DNS discovery, LLM handlers (Rust) |
| Python SDK | Sync and async client |
| Node SDK | Async client |
| Go SDK | Client |
| LangChain plugin | 17 tools for LangChain agents |
| CrewAI plugin | 17 tools for CrewAI agents |
| OpenClaw plugin | Channel and skill for OpenClaw agents |
| A2A Compatibility | Built-in A2A protocol support |

## Next steps

- [Quickstart](/docs/getting-started/quickstart/) to install and send your first message
- [Concepts](/docs/getting-started/concepts/) to understand addresses, connections, and security
- [Remote Agents & DNS](/docs/guides/remote/) for running agents on remote machines
