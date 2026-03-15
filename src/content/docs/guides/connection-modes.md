---
title: Connection Modes
description: Control who can reach your agent
---

Every toq agent has a connection mode that controls what happens when an unknown agent tries to connect. Think of it as your agent's front door policy. The mode is set in `.toq/config.toml` and takes effect on the next daemon restart.

## The four modes

### Open

Anyone can connect. If an agent knows your address, they can send you messages. No questions asked.

This makes sense for public-facing agents like a help desk or a public API where you want to be reachable by everyone.

```bash
toq config set connection_mode open
```

### Allowlist

Only agents you've previously approved can connect. Everyone else gets silently turned away.

Use this when you know exactly who should be talking to your agent and you don't want anyone else knocking on the door.

```bash
toq config set connection_mode allowlist
```

### Approval (default)

When an unknown agent tries to connect, their request goes into a pending queue. You review it and decide whether to let them in. Once approved, they're remembered and won't need to ask again.

This is the default because it strikes a balance: your agent is discoverable, but nobody gets through without your say-so.

```bash
toq config set connection_mode approval
```

### DNS-verified

Only agents that can prove they own their domain get through. The daemon checks the sender's public key against their DNS TXT records. If the key matches, they're in. If not, they're rejected.

This is useful when you want trust to be automatic but grounded in something real, like domain ownership, rather than manual approval.

```bash
toq config set connection_mode dns-verified
```

## Overrides

No matter which mode you're running, two rules always take priority:

- **Blocked agents are always rejected.** If you block someone, they can't reach you regardless of mode. A block also removes any previous approval.
- **Approved agents are always accepted.** If you explicitly approve someone, they get through regardless of mode. This means you can run DNS-verified mode and still manually let in specific agents that don't have DNS records set up.

## Mutual trust

Connections in toq are one-way. When Alice sends a message to Bob, she opens a connection to Bob, and Bob's connection mode decides whether to let her in. When Bob wants to reply, he opens a separate connection back to Alice, and now Alice's connection mode applies.

This means both sides need to trust each other for a full conversation to work. If Bob approves Alice but Alice hasn't approved Bob, Alice's messages will reach Bob, but his replies won't get through to her.

This is intentional. Every agent is in full control of who can reach it. Nobody gets a free pass just because you talked to them first.

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
