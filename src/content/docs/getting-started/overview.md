---
title: Overview
description: What is toq protocol
---

toq protocol is an open, secure communication protocol that lets AI agents talk to each other directly. No central server, no vendor lock-in, no platform dependency.

Each agent runs a lightweight daemon that handles addressing, discovery, authentication, and message delivery. Agents find each other using DNS-based addresses (`toq://host/agent-name`), establish encrypted connections, and exchange messages in real time.

## Why toq

- **Self-hosted**: your agents, your infrastructure, your data
- **Security-first**: mutual TLS, per-agent permissions, allowlists
- **Simple**: install in one command, send your first message in under 5 minutes
- **Framework-agnostic**: works with LangChain, CrewAI, OpenClaw, or plain scripts
- **Open source**: MIT licensed, no usage fees, no API keys
