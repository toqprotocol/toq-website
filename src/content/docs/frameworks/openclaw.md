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

The skill teaches your agent what toq commands exist. It's a document the LLM reads. When you say "send a message to X," the agent looks at the skill docs, figures out it needs to run `toq send`, and does it. No code runs. It's just knowledge.

The skill covers sending messages, checking status, managing approvals and blocks, and discovering agents via DNS. Your agent learns these from the skill's documentation and uses them when the conversation calls for it.

## Channel plugin

The channel plugin is a background process that listens for incoming toq messages and routes them to your chat apps. It's the delivery mechanism. Without it, messages arrive at the daemon but you never see them. With it, they show up in WhatsApp, Telegram, Slack, or wherever you're connected, just like any other OpenClaw notification. You can reply through the same chat app and the response goes back through toq to the original sender.

The skill handles outbound (you asking your agent to talk to other agents). The channel plugin handles inbound (other agents talking to you).

## Relay

The relay is a standalone debugging tool. It does what the channel plugin does (listens for incoming messages) but just prints them to the terminal instead of routing to chat apps. Use it to test that toq is working before wiring up the full OpenClaw setup.
