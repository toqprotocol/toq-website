---
title: OpenClaw
description: Use toq with OpenClaw
---

The toq skill turns your OpenClaw agent into a networked agent. Install it, and your agent learns the entire toq protocol. From there, everything happens through conversation.

## Install

```bash
clawhub install toq
```

> "Set up toq so I can communicate with other agents"

Your agent handles installation, configuration, and startup. Two minutes and you're on the network.

## Send and receive

The basics. Your agent knows how to reach other agents and manage conversations.

> "Send a message to toq://192.168.1.50/bob asking if he's available"
>
> "Check my recent messages"
>
> "Reply to Bob's last message saying I'll be there at 3"
>
> "Close the thread with Bob"

Threads are tracked automatically. Your agent knows which conversation is which and can reply in context or start new ones.

## Monitor your endpoint

Your agent keeps you informed about what's happening on your endpoint.

> "Is toq running?"
>
> "Who are my known peers?"
>
> "Show me my connections"
>
> "Run diagnostics"
>
> "What's my toq address?"

No need to remember commands. Your agent translates plain questions into the right CLI calls and reports back conversationally.

## Control who gets in

Security is a conversation, not a config file. Your agent understands connection modes, wildcards, and the difference between blocking by address versus by public key.

> "Show me who's tried to connect"
>
> "Approve the agent that just pinged us"
>
> "Only allow agents from our company domain"
>
> "Block everything from that IP"
>
> "Revoke access for the agent we approved yesterday"

Your agent manages the full permission system: approvals, blocks, wildcards, and revocations. It can also switch connection modes on the fly.

> "Switch to open mode for the next hour, then lock it back down"

## Discover other agents

Finding agents on the network is conversational too.

> "Find agents at example.com"
>
> "Ping toq://192.168.1.50/bob and tell me if he's reachable"
>
> "Who's out there on the local network?"

## Automate with handlers

This is where things start to get powerful. Handlers let your endpoint respond to incoming messages automatically, and your OpenClaw agent creates them for you.

> "Set up a handler that auto-replies with my availability when someone asks"

Your agent writes a script, saves it, registers it with the daemon, and tests it. If something breaks, it checks the handler logs and fixes the issue.

For smarter responses, handlers can use LLM providers directly:

> "Add a handler that uses Claude to respond to incoming questions about our product"

The agent registers an LLM-powered handler with a custom system prompt. Multi-turn conversations work naturally because handlers maintain thread context.

Managing handlers is just as easy:

> "Show me my active handlers"
>
> "Disable the auto-reply handler for now"
>
> "Check the logs for the support handler"
>
> "Remove the old notification handler"

## Run multiple agents

Need to test a workflow locally or run several agents on one machine? Your agent sets it up.

> "Set up three agents on this machine: alice, bob, and charlie"

Each agent gets its own workspace, port, and security policy. Your agent keeps track of which is which and can manage all of them from one conversation.

## Build real workflows

Everything above is a building block. When you combine messaging, handlers, approvals, and multiple agents, your OpenClaw agent can construct sophisticated multi-agent systems from a single conversation.

We tested this extensively across real machines. Every scenario below was built entirely through natural conversation with an OpenClaw agent. No code written by the user. No configuration files edited by hand.

**Task pipelines.** A user asked their agent to set up a three-stage approval chain across three machines. The agent created handlers on each machine that processed incoming proposals, added assessments, and forwarded them to the next stage. It embedded the original sender and thread ID in each forwarded message so the final decision routed back to the person who submitted the proposal. The full chain ran without manual intervention.

**Broadcast and tracking.** A user asked their agent to send an urgent notification to every known peer and track acknowledgments. The agent broadcast the message, set up a handler to collect responses, maintained a checklist, and could report at any time who had responded and who was still outstanding.

**Collaborative assembly.** A user asked three agents to each write a section of a report. The coordinating agent sent specific assignments, collected the responses, assembled them in order, and presented the complete document. It worked on the first attempt because the agent specified the expected format in each outgoing request.

**Escalation chains.** A user asked their agent to build a tiered incident response system. The agent created handlers with severity-based routing: incoming alerts went to a first responder for triage, critical issues escalated to a specialist, and unresolved issues escalated to a manager. Each tier had its own logic and the messages flowed automatically based on content.

**Reputation tracking.** A user asked their agent to track how reliable each peer was. The agent set up a handler that maintained persistent stats across sessions, tracking response times and completion rates per agent, queryable as a leaderboard at any time.

In every case, the user described what they wanted in a few sentences. The agent figured out the handlers, the message formats, the approval flows, and the error handling on its own.

## Getting started

1. Install the skill: `clawhub install toq`
2. Tell your agent: "Set up toq protocol"
3. Start with a message. Build from there.
