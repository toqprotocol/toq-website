---
title: Concepts
description: Core concepts of the toq protocol
---

## The daemon

toq runs as a daemon on your machine. Think of it as a mail room: it handles encryption, authentication, message delivery, and connection policies, but it doesn't read or respond to any of the messages itself. Your agent logic lives outside the daemon, connected through handlers, SDKs, or framework plugins.

Run `toq init` to create a workspace, then `toq up` to start the daemon in the background. Keys are generated automatically on first start. If you want to watch messages arrive in real time, use `toq up --foreground` instead.

## Workspaces

Each agent lives in its own workspace: a `.toq/` directory in the current folder containing config, keys, handler definitions, and logs. You create one with `toq init`. If you want to run multiple agents on the same machine, just use separate directories with different ports.

## Addresses

Every agent has an address that looks like `toq://hostname/agent-name`. The default port is 9009, so you can leave it out of addresses when using it.

If an agent has DNS records set up, the address is just `toq://yourdomain.com/agent-name`. No port, no IP address. The sender looks up the agent's port and public key from DNS TXT records automatically.

## Identity and keys

Every agent gets an Ed25519 keypair generated automatically on first start. The public key is the agent's identity. It's what other agents use to verify who they're talking to during the handshake, and it's what goes into DNS records for domain-based discovery.

Keys live in `.toq/keys/`. All connections are encrypted with TLS 1.3 using X25519 for key exchange and AES-256-GCM for message encryption.

## Connection modes

Every agent controls who can reach it. There are four modes, and you set yours in config:

- **Open**: anyone can connect, no questions asked.
- **Allowlist**: only agents you've previously approved can connect.
- **Approval** (default): unknown agents go into a pending queue until you approve or deny them.
- **DNS-verified**: only agents with valid DNS TXT records proving domain ownership get through.

Connections are bidirectional. When Alice sends a message to Bob, she connects to Bob and his policy applies. When Bob replies, he opens a separate connection back to Alice, and her policy applies. Both sides need to trust each other for a full conversation to work.

Blocked agents are always rejected, regardless of mode. Approved agents are always accepted, regardless of mode. A block overrides a previous approval.

## Messages

Messages are encrypted envelopes sent between agents. Each one has a type, a body, a sender address, and an optional thread ID. The types you'll encounter most:

- `message.send`: a regular text message
- `thread.close`: signals the end of a conversation thread
- `stream.chunk` / `stream.end`: pieces of a longer response, delivered as they're generated rather than all at once

## Threads

Messages can be grouped into threads using a shared thread ID. This is what makes multi-turn conversations possible. Either side can close a thread by sending `thread.close`. LLM handlers rely on threads to keep track of conversation history, so each reply has the full context of everything said before it.

## Handlers

Handlers are what make your agent do something when a message arrives. There are two types:

- **LLM handlers**: built-in conversational AI. You pick a provider (OpenAI, Anthropic, Ollama) and a model, and the daemon takes care of calling the LLM and sending the reply. No code required.
- **Shell handlers**: run any shell command you want when a message comes in. The message content is passed through environment variables (`TOQ_FROM`, `TOQ_TEXT`, `TOQ_THREAD_ID`, `TOQ_URL`). Your script can do whatever it needs to: query a database, call an external API, forward to Slack, run custom business logic. To send a reply, it calls the daemon's local API using `TOQ_URL`. This is how you build custom agent behavior beyond LLM conversations.

Handlers can be filtered by sender address, public key, or message type, so you can have different handlers respond to different agents.

## The local API

The daemon exposes an HTTP API on localhost that gives you programmatic access to everything. Handlers use it to send replies, SDKs use it to listen for messages, and framework plugins use it to wire into LangChain or CrewAI. It's only accessible from the local machine.

## Permissions

Every agent has a permission list that controls access at the individual agent level:

- **Approve**: let a specific agent through, regardless of your connection mode.
- **Block**: permanently reject a specific agent, regardless of mode. This also removes any previous approval for that agent.
- **Deny**: turn away a pending approval request without permanently blocking them. They can try again later.

Managed with `toq approve`, `toq deny`, and `toq block`. Approvals and blocks persist across daemon restarts.

## A2A compatibility

toq agents can optionally speak the A2A protocol alongside the native toq protocol, on the same port. This lets agents built with other A2A-compatible frameworks reach your toq agent over standard HTTP, and lets your toq agent send messages to any A2A agent by URL. Enable it with `toq a2a enable`. See [A2A Compatibility](/docs/bridge/a2a/) for details.
