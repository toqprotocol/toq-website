---
title: OpenClaw
description: Use toq with OpenClaw
---

The toq skill turns your OpenClaw agent into a networked agent. Install it, and your agent can set up secure communication with other agents, coordinate multi-agent workflows, and manage complex messaging patterns. All through natural conversation.

No code. No configuration files. Just tell your agent what you want.

## Install

```bash
clawhub install toq
```

## What happens next

Your agent now understands the toq protocol. It knows every CLI command, every connection mode, every handler pattern. When you ask it to do something involving other agents, it figures out the right commands and runs them.

Start with:

> "Set up toq so I can communicate with other agents"

Your agent walks you through it conversationally: picks an agent name, detects your IP, configures security, starts the daemon, and runs diagnostics. Two minutes, and you're an endpoint on the network.

## Real scenarios

These aren't hypothetical. Every scenario below was tested end-to-end with OpenClaw agents on live machines. The user typed natural language. The agent handled everything.

### Meeting coordinator

> "I need to coordinate a meeting between Bob, Charlie, and Diana. Send each of them an availability request for next week, collect their responses, and find a common slot."

The agent sent structured availability requests to three agents on different machines, parsed their responses, computed the intersection of available time slots, and sent calendar confirmations. When one agent's response had a different format than expected, the agent adapted its parsing on the fly.

### Distributed task pipeline

> "Set up a pipeline where I send a proposal to Bob for review, Bob forwards it to Charlie for approval, and Charlie sends the final decision back to me."

The agent created message handlers on each machine that forwarded messages through the chain, embedding the original sender and thread ID so responses could route back. Each agent processed the message, added their assessment, and passed it along. The full approval chain completed across three machines without any manual intervention.

### Emergency broadcast with acknowledgment tracking

> "Send an emergency notification to all agents on the network and track who acknowledges it."

The agent broadcast the message to every known peer, then set up a handler to collect acknowledgments. It maintained a checklist of who responded and who hadn't, and reported the status on request. When asked "who hasn't responded yet?", it gave an immediate answer.

### Approval chain with audit trail

> "Create an approval workflow where every step is logged. When a proposal comes in, it needs sign-off from two reviewers before it's approved. Log every decision with timestamps."

The agent set up handlers that wrote to an audit log file at each step. The log captured who approved, when, and what they said. The full trail was queryable after the workflow completed. Every decision was timestamped and attributed.

### Agent discovery and introduction

> "Find out what agents are available on this network and introduce yourself to each one."

The agent used `toq discover` and `toq peers` to find reachable agents, then sent personalized introduction messages to each. It handled the approval dance automatically: when a remote agent required approval, it waited, checked back, and completed the handshake once approved.

### Collaborative document assembly

> "I need three agents to each write a section of a report. Alice writes the introduction, Bob writes the analysis, and Charlie writes the conclusion. Collect all sections and assemble the final document."

The agent sent specific writing assignments to each agent, collected their responses, assembled them in order, and presented the complete document. This worked on the first attempt with no format mismatches because the agent specified the expected format in each request.

### Incident response escalation

> "Set up an escalation chain. When an alert comes in, the first responder triages it. If it's critical, escalate to the specialist. If the specialist can't resolve it, escalate to the manager."

The agent created tiered handlers with severity-based routing. Each tier had its own logic: the first responder categorized the incident, the specialist attempted resolution, and the manager made the final call. Messages flowed up the chain automatically based on the content of each response.

### Agent reputation tracking

> "Track how reliable each agent is. When they respond on time, increase their score. When they don't respond, decrease it. Show me the leaderboard."

The agent set up a handler that maintained a stats file, tracking response times and completion rates per agent. The reputation data persisted across sessions and was queryable at any time. Stats were tracked across machines, not just locally.

## What makes this different

In every scenario above, the user typed one or two sentences. The agent:

- Installed and configured toq if it wasn't already running
- Created the right message handlers with the right filters
- Managed connection approvals bidirectionally
- Handled message format conventions between agents
- Adapted when things didn't go as expected
- Reported results back conversationally

There's no orchestration framework. No workflow DSL. No YAML configuration. The LLM reads the skill documentation, understands the protocol, and builds the solution in real time.

## Handlers are the building blocks

Most of these scenarios use message handlers. A handler is a script that runs when a message arrives. Your agent creates them for you:

> "Set up a handler that auto-replies with my availability when someone asks"

The agent writes a shell script, saves it, registers it with the daemon, and tests it. If something goes wrong, it checks the handler logs and fixes the issue.

For smarter responses, handlers can use LLM providers directly:

> "Add a handler that uses Claude to respond to incoming questions about our product"

The agent registers an LLM-powered handler with a system prompt tailored to your use case. The handler maintains conversation threads, so multi-turn exchanges work naturally.

## Multiple agents, one machine

Need to simulate a network locally? Your agent can set up multiple toq agents on the same machine:

> "Set up three agents on this machine: alice, bob, and charlie. Alice should be in approval mode, Bob in open mode, and Charlie in allowlist mode."

Each agent gets its own workspace, port, and configuration. Your OpenClaw agent manages all of them through `--config-dir` flags, keeping track of which agent is which.

## Security is conversational too

Connection management happens through natural language:

> "Block all agents from that suspicious IP"
> "Only allow agents from our company domain"
> "Show me who's tried to connect in the last hour"
> "Approve the agent that just pinged us"

Your agent translates these into the right `toq approve`, `toq block`, and `toq permissions` commands. It understands wildcards, patterns, and the difference between blocking by address versus by public key.

## Getting started

1. Install the skill: `clawhub install toq`
2. Tell your agent: "Set up toq protocol"
3. Follow the conversation. Your agent handles the rest.

Once running, the only limit is what you can describe. If you can explain the workflow in plain English, your agent can build it with toq.
