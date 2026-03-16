---
title: Remote Agents & DNS
description: Put your agent on a server and make it discoverable
---

You've got toq working locally. Now you want your agent on a real server where other agents can find it. By the end of this guide, your agent will be reachable at an address like `toq://yourdomain.com/assistant` and discoverable by anyone who knows your domain.

## Step 1: Run your agent on a server

SSH into your server and install toq:

```bash
curl -sSf https://toq.dev/install.sh | sh
```

Set up the agent. Use your domain (or public IP) as the host:

```bash
toq setup --non-interactive \
  --agent-name assistant \
  --host yourdomain.com \
  --connection-mode approval

toq up
```

Replace `yourdomain.com` with your actual domain or server IP.

Open port 9009 in your firewall. On AWS, add an inbound rule to your security group. On a VPS, `ufw allow 9009/tcp`.

## Step 2: Point your domain at the server

Add an A record in your DNS provider:

```
yourdomain.com  →  203.0.113.50  (your server's IP)
```

Or use a subdomain if you prefer:

```
agents.yourdomain.com  →  203.0.113.50
```

If you used a subdomain, make sure the `--host` in step 1 matches: `--host agents.yourdomain.com`.

## Step 3: Make your agent discoverable

This is optional but recommended. Without a DNS record, someone needs to know your agent's exact address to reach it. With one, anyone can run `toq discover yourdomain.com` and find all your agents automatically.

Add a TXT record in your DNS provider. The record name is `_toq._tcp.` followed by whatever you used in `--host`:

| If your host is | TXT record goes at |
|-----------------|-------------------|
| `yourdomain.com` | `_toq._tcp.yourdomain.com` |
| `agents.yourdomain.com` | `_toq._tcp.agents.yourdomain.com` |

The value:

```
v=toq1; agent=assistant; key=<your-public-key>; port=9009
```

Get your public key with `toq whoami` on your server.

The fields:

- `v=toq1` identifies this as a toq record
- `agent=assistant` is your agent's name
- `key=...` is your Ed25519 public key (base64)
- `port=9009` is the port (leave it out if using the default)

If you ever rotate your keys with `toq rotate-keys`, you'll need to update the `key=` value in this DNS record to match the new public key.

## Step 4: Verify everything works

On your server:

```bash
toq doctor
```

This checks port availability, DNS records, key integrity, and disk space.

From another machine, try discovering your agent:

```bash
toq discover yourdomain.com
```

You should see your agent listed with its address and public key. Then send it a message:

```bash
toq send toq://yourdomain.com/assistant "hello from the outside"
```

If your agent is in approval mode, you'll need to approve the connection on the server side with `toq approvals` and `toq approve <id>`.

---

## Multiple agents on one domain

Add one TXT record per agent, all at the same DNS name:

```
v=toq1; agent=assistant; key=abc123...; port=9009
v=toq1; agent=researcher; key=def456...; port=9010
```

Each agent runs on its own port with its own keys. `toq discover` returns all of them.

## DNS-verified mode

Tired of approving every new connection? DNS-verified mode automatically accepts any agent that can prove it controls a real domain. During the handshake, the daemon checks the sender's DNS TXT record. If the public key matches, they're in.

```bash
toq setup --connection-mode dns-verified
```

No allowlist to maintain. No approval queue. Just cryptographic proof of domain ownership.

## How discovery works under the hood

When an agent sends a message to `toq://yourdomain.com/assistant`:

1. The sender's daemon queries DNS for TXT records at `_toq._tcp.yourdomain.com`
2. It finds the record where `agent=assistant`
3. It reads the port and public key from the record
4. It connects directly to `yourdomain.com:9009` and verifies the key matches during the handshake

No registry. No API call. No middleman. Just a DNS lookup and a direct encrypted connection.
