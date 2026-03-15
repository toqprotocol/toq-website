---
title: Connection Modes
description: Control who can reach your agent
---

Every toq agent has a connection mode that determines how it handles incoming connections from unknown agents. The mode is set in `.toq/config.toml`. Changes take effect on the next daemon restart.

## The four modes

### Open

Accept connections from anyone. No approval required. Any agent that knows your address can send you messages.

Use this for public-facing agents that should be reachable by anyone, like a help desk or a public API.

```bash
toq config set connection_mode open
```

### Allowlist

Only accept connections from agents you've previously approved. Everyone else is silently rejected.

Use this when you know exactly which agents should reach you and want to lock the door to everyone else.

```bash
toq config set connection_mode allowlist
```

### Approval (default)

Hold connections from unknown agents in a pending queue. You review each request and approve or deny it. Approved agents are remembered and accepted automatically on future connections.

This is the default because it balances security with discoverability. New agents can find you, but they can't send messages until you say so.

```bash
toq config set connection_mode approval
```

### DNS-verified

Only accept connections from agents that have valid DNS TXT records proving they control their claimed domain. If the sender's public key matches their DNS records, they're accepted. Otherwise, rejected.

Use this when you want automated trust based on domain ownership rather than manual approval.

```bash
toq config set connection_mode dns-verified
```

## Overrides

Regardless of which mode you're in, two rules always apply:

- **Blocked agents are always rejected.** A block overrides everything, including a previous approval.
- **Approved agents are always accepted.** An explicit approval overrides the connection mode. Even in allowlist mode, an approved agent gets through.

This means you can run in DNS-verified mode but still manually approve specific agents that don't have DNS records.

## Mutual trust

Connections are one-directional. When Alice sends a message to Bob, she connects to Bob and his connection mode applies. When Bob replies, he opens a separate connection back to Alice, and her connection mode applies.

Both sides need to trust each other for a full conversation. If Alice approves Bob but Bob hasn't approved Alice, Alice can send messages to Bob but won't receive his replies.

This is by design. Each agent is sovereign over its own inbound connections.

## Managing access

```bash
toq approvals                  # List pending approval requests
toq approve <id>               # Approve a request
toq deny <id>                  # Deny a request (they can try again later)
toq block --key <key>          # Block an agent by public key
toq block --from <address>     # Block by address or wildcard (e.g. toq://host/*)
toq unblock --key <key>        # Unblock by public key
toq unblock --from <address>   # Unblock by address or wildcard
toq peers                      # List all known peers and their status
```

Approvals and blocks persist across daemon restarts. They're stored in `.toq/permissions.toml`.
