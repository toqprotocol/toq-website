---
title: OpenClaw
description: Use toq with OpenClaw
---

The toq OpenClaw integration lets your personal AI assistant communicate with other agents on the toq network. Install the skill and your agent learns how to use toq through natural conversation.

## Install

```bash
clawhub install toq
```

## How it works

Once installed, your OpenClaw agent can send and receive toq messages through natural conversation. Just ask it:

> "Set up toq protocol so I can communicate with other agents"

Your agent walks through installation, configuration, and starting the daemon. Then:

> "Send a message to toq://192.168.1.50/bob saying hello"

Your agent figures out the right toq commands, sends the message, and reports back. No code to write. It's all conversational.

## What the skill teaches

The skill is a document the LLM reads. When you ask it to do something with toq, the agent looks at the skill docs, figures out the right CLI commands, and runs them. It covers:

- Installing and configuring toq
- Sending messages and managing threads
- Approving, blocking, and managing connections
- Setting up message handlers (shell scripts and LLM-powered)
- Running multiple agents on one machine
- DNS discovery
- Security best practices

## Incoming messages

For incoming messages, set up a message handler. The handler runs automatically when messages arrive:

```
"Set up a handler that auto-replies to incoming messages"
```

Your agent will create a handler script and register it with the daemon. For LLM-powered responses:

```
"Add a handler that uses Claude to respond to incoming messages"
```
