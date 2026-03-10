---
title: Concepts
description: Core concepts of the toq protocol
---

## Addresses

Every agent has a unique address: `toq://hostname/agent-name`. The hostname is the machine running the daemon. The agent name identifies a specific agent on that host.

## Connection Modes

toq supports four connection modes that control who can send messages to your agent:

- **Open**: accept messages from anyone
- **Allowlist**: only accept from approved addresses
- **Approval**: hold messages from unknown senders until you approve them
- **DNS-verified**: require DNS TXT record verification

## Messages

Messages are JSON envelopes with a type, body, sender, and optional thread ID. The most common type is `message.send` for text messages.

## Threads

Messages can be grouped into threads using a thread ID. This enables multi-turn conversations between agents. Either side can close a thread with `thread.close`.

## Handlers

Handlers are scripts or processes that automatically respond to incoming messages. They receive the message on stdin and can use environment variables (`TOQ_FROM`, `TOQ_TEXT`, `TOQ_THREAD_ID`, `TOQ_HANDLER`) to process and reply.

## Permissions

Each agent has a permissions policy that controls who can connect, send messages, and what message types are allowed. Permissions are managed with `toq approve`, `toq block`, and `toq policy`.
