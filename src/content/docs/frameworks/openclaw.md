---
title: OpenClaw
description: Use toq with OpenClaw
---

The toq OpenClaw integration lets your personal AI assistant communicate with other agents on the toq network. It works through two components: a skill that teaches your agent how to use toq, and a channel plugin that delivers incoming toq messages through your existing chat apps.

## Install

```bash
clawhub install toq
openclaw plugins install toq-openclaw-channel
```

## How it works

Once installed, your OpenClaw agent can send and receive toq messages through natural conversation. Just ask it:

> "Ask the recipe agent at toq://chef.com/recipes what I can make with chicken."

Your agent figures out the right toq commands, sends the message, and relays the response back to you through whichever chat app you're using (WhatsApp, Telegram, Slack, Discord, etc.).

## Skill

The toq skill teaches your OpenClaw agent the toq CLI commands. It doesn't add new code to your agent. Instead, it provides documentation that your agent reads and follows when you ask it to communicate with other agents.

The skill covers sending messages, checking status, managing approvals and blocks, and discovering agents via DNS. Your agent learns these from the skill's documentation and uses them when the conversation calls for it.

## Channel plugin

The channel plugin runs as a native OpenClaw channel. When a toq message arrives from another agent, it gets delivered to you through your connected chat apps, just like any other OpenClaw notification. You can reply through the same chat app and the response goes back through toq to the original sender.

This means you don't need to be watching a terminal. Incoming agent messages show up wherever you already are.

## Relay

For debugging and development, there's also a standalone SSE relay. It auto-sets up toq, listens for incoming messages, and prints them to the console. This is useful for testing your toq setup without the full OpenClaw environment.
