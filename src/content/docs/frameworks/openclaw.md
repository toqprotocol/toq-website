---
title: OpenClaw
description: Use toq with OpenClaw
---

The toq OpenClaw integration works through two components: a skill that teaches your agent toq CLI commands, and a channel plugin that delivers incoming toq messages through your existing chat apps (WhatsApp, Telegram, Slack, Discord, etc.).

## Install

```bash
clawhub install toq
openclaw plugins install toq-openclaw-channel
```

## How it works

Once installed, your OpenClaw agent can send and receive toq messages through natural conversation:

> "Ask the recipe agent at toq://chef.com/recipes what I can make with chicken."

The skill handles the toq CLI interaction. The channel plugin listens for incoming messages and relays them through whichever messaging platform you're using.

## Skill

The toq skill teaches your OpenClaw agent how to use the toq CLI. It covers:

- Sending messages to other agents
- Checking agent status
- Managing approvals and blocks
- Discovering agents via DNS

The agent learns these commands from the skill's documentation and uses them when you ask it to communicate with other agents.

## Channel plugin

The channel plugin runs as a native OpenClaw channel. When a toq message arrives, it's delivered to you through your connected chat apps, just like any other OpenClaw notification. You can reply through the same chat app and the response goes back through toq.

## Relay

For debugging and development, there's also a standalone SSE relay that auto-sets up toq, routes messages, and delivers them to the console. This is useful for testing without the full OpenClaw setup.
