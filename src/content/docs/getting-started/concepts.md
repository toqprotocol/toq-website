---
title: Concepts
description: Core concepts of the toq protocol
---

## The daemon

toq runs as a daemon on your machine. It handles encryption, authentication, message delivery, and connection policies. It does not process or understand messages. Your agent logic lives outside the daemon, connected via handlers, SDKs, or framework plugins.

Run `toq init` to create a workspace, then `toq up` to start the daemon in the background. Keys are generated automatically on first start. Use `toq up --foreground` to run in the foreground and watch messages arrive in real time.

## Workspaces

Each agent lives in its own workspace: a `.toq/` directory in the current folder, containing config, keys, handler definitions, and logs. Create one with `toq init`. You can run multiple agents on the same machine by using separate directories with different ports.

## Addresses

Every agent has an address: `toq://hostname/agent-name`. The default port is 9009 and can be omitted from addresses when using it.

For agents with DNS records, the address is just `toq://yourdomain.com/agent-name`. No port needed. The sender looks up the agent's port and public key from DNS TXT records automatically.

## Identity and keys

Each agent has an Ed25519 keypair generated automatically on first start. The public key is the agent's identity. It's used for mutual authentication during the handshake and included in DNS records for domain-based discovery.

Keys are stored in `.toq/keys/`. Connections are encrypted with TLS 1.3 using X25519 key exchange and AES-256-GCM.

## Connection modes

Every agent controls who can reach it. Four modes, set in config:

- **Open**: accept connections from anyone.
- **Allowlist**: only accept from previously approved agents.
- **Approval** (default): hold connections from unknown agents until you explicitly approve or deny them.
- **DNS-verified**: only accept agents with valid DNS TXT records proving they control their claimed domain.

Connections are bidirectional. When Alice sends a message to Bob, she connects to Bob and his policy applies. When Bob replies, he opens a separate connection back to Alice, and her policy applies. Both sides need to trust each other for a full conversation to work.

Blocked agents are always rejected, regardless of mode. Approved agents are always accepted, regardless of mode. A block overrides a previous approval.

## Messages

Messages are encrypted envelopes sent between agents. Each has a type, a body, a sender address, and an optional thread ID. The main types:

- `message.send`: a text message
- `thread.close`: ends a conversation thread
- `stream.chunk` / `stream.end`: streaming content in pieces, for long responses where waiting for the full message would be too slow

## Threads

Messages can be grouped into threads using a shared thread ID. This enables multi-turn conversations. Either side can close a thread with `thread.close`. LLM handlers use threads to maintain conversation context across multiple exchanges.

## Handlers

Handlers run automatically when a message arrives. There are two types:

- **LLM handlers**: built-in conversational AI. Configure a provider (OpenAI, Anthropic, Ollama) and model, and the daemon calls the LLM and replies on your behalf. No code required.
- **Shell handlers**: run any shell command when a message arrives. The message is passed via stdin and environment variables (`TOQ_FROM`, `TOQ_TEXT`, `TOQ_THREAD_ID`). Your script can do anything: query a database, call an API, forward to Slack, run custom logic. To reply, it calls the daemon's local API. This is how you build custom agent behavior beyond LLM conversations.

Handlers can be filtered by sender address, public key, or message type.

## The local API

The daemon exposes an HTTP API on localhost for programmatic access. Handlers, SDKs, and framework plugins all use it to send messages, check status, list peers, and manage the agent. It's only accessible from the local machine.

## Permissions

Every agent has a permission list that controls access at the agent level. Three rules:

- **Approve**: let a specific agent through, regardless of connection mode.
- **Block**: reject a specific agent, regardless of connection mode. Overrides a previous approval.
- **Deny**: reject a pending approval request without blocking future attempts.

Managed with `toq approve`, `toq deny`, and `toq block`. Approvals and blocks persist across daemon restarts.
