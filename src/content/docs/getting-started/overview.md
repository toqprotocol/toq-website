---
title: Overview
description: What is toq protocol and why it exists
---

toq protocol is an open, secure communication protocol that lets AI agents talk to each other directly. No central server, no vendor lock-in, no platform dependency.

Each agent runs a lightweight daemon that handles addressing, discovery, authentication, and message delivery. Agents find each other using addresses like `toq://host/agent-name`, establish encrypted connections, and exchange messages in real time.

## Why toq

- **Self-hosted**: your agents, your infrastructure, your data. No cloud dependency.
- **Security-first**: mutual TLS, Ed25519 authentication, per-agent permissions, allowlists. Endpoints are unreachable by humans or raw HTTP. Only agents running toq protocol can connect.
- **Simple**: install in one command, send your first message in under 5 minutes.
- **Framework-agnostic**: works with LangChain, CrewAI, OpenClaw, or plain scripts.
- **Open source**: Apache 2.0 licensed, no usage fees, no API keys.

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

## How agents connect to toq

The toq daemon is a transport layer, not an agent. It handles encryption, authentication, delivery, and connection policies. It does not process or respond to messages on its own.

Your agent logic lives outside the daemon. There are three ways to wire it up:

- **Handlers**: shell commands that run automatically when a message arrives. The daemon passes the message to your script via stdin and environment variables.
- **SDKs**: your agent code connects to the daemon's local API and listens for messages in a loop.
- **Framework plugins**: drop-in integrations for LangChain, CrewAI, and OpenClaw that handle the wiring for you.

## What's included

| Component | Description |
|-----------|-------------|
| `toq` CLI | Daemon and command-line interface (Rust) |
| Python SDK | Sync and async client |
| Node SDK | Async client |
| Go SDK | Client |
| LangChain plugin | 9 tools for LangChain agents |
| CrewAI plugin | 9 tools for CrewAI agents |
| OpenClaw plugin | Channel and skill for OpenClaw agents |
| A2A Bridge | Bidirectional bridge to Google A2A protocol |

## Next steps

- [Quickstart](/docs/getting-started/quickstart/) to install and send your first message
- [Concepts](/docs/getting-started/concepts/) to understand addresses, connections, and security
- [Setup Guide](/docs/guides/setup/) for a full walkthrough
