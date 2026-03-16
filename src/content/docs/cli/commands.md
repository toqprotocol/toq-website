---
title: CLI Commands
description: Complete reference for the toq command-line interface
---

## Getting started

### toq init

Create a new workspace in the current directory.

```bash
toq init [--name <name>] [--host <host>] [--port <port>]
```

| Option | Default | Description |
|--------|---------|-------------|
| `--name` | `agent` | Agent name |
| `--host` | `localhost` | Host for this agent's address (domain or IP) |
| `--port` | `auto` | Port to listen on. Use `auto` for automatic assignment |

Creates a `.toq/` directory with config, handler, and permission files. Keys are generated on first `toq up`.

### toq setup

Interactive guided setup. Generates keys and creates config.

```bash
toq setup [--non-interactive] [--agent-name <name>] [--host <host>]
           [--connection-mode <mode>] [--adapter <adapter>] [--framework <framework>]
```

Use `--non-interactive` with flags for scripted setup. `--framework` prints integration instructions for `langchain`, `crewai`, or `openclaw`.

### toq whoami

Show your agent's address, public key, and connection mode.

```bash
toq whoami
```

## Daemon

### toq up

Start the agent daemon.

```bash
toq up [--foreground]
```

Starts in the background by default. Use `--foreground` to run in the foreground with live message output. Keys are auto-generated on first start if they don't exist.

### toq down

Stop the agent daemon.

```bash
toq down [--graceful] [--name <name>]
```

| Option | Description |
|--------|-------------|
| `--graceful` | Defined for planned shutdowns but currently behaves the same as `toq down` |
| `--name` | Stop a specific named agent from any directory |

Persists policy state (approved, blocked, pending rules) and peer metadata before exiting.

### toq status

Show running state, connections, and message counts.

```bash
toq status
```

### toq agents

List all registered agents on this machine.

```bash
toq agents
```

## Messaging

### toq send

Send a message to another agent.

```bash
toq send <address> <message> [--thread-id <id>] [--close-thread]
```

| Option | Description |
|--------|-------------|
| `--thread-id` | Continue an existing conversation thread |
| `--close-thread` | Close the thread after sending |

The address can include a port (`toq://localhost:9011/bob`) or omit it for DNS-resolved domains (`toq://example.com/bob`).

### toq messages

Show recent received messages. Requires a running daemon.

```bash
toq messages [--from <address>] [--limit <n>]
```

| Option | Default | Description |
|--------|---------|-------------|
| `--from` | | Filter by sender address |
| `--limit` | `20` | Max messages to show |

### toq peers

List known peers with their status and last seen time.

```bash
toq peers
```

### toq ping

Ping a remote agent to discover its public key.

```bash
toq ping <address>
```

Connects, completes the handshake, reports the public key, then disconnects. Creates a pending approval on the remote if it's in approval mode.

### toq discover

Discover agents at a domain via DNS TXT records.

```bash
toq discover <domain>
```

Queries `_toq._tcp.<domain>` for TXT records and lists all agents found with their addresses and ports.

## Handlers

### toq handler add

Register a new message handler.

```bash
# Shell handler
toq handler add <name> --command <command>

# LLM handler
toq handler add <name> --provider <provider> --model <model>
```

| Option | Description |
|--------|-------------|
| `--command` | Shell command to run (for shell handlers) |
| `--provider` | LLM provider: `openai`, `anthropic`, `bedrock`, `ollama` |
| `--model` | LLM model name (required with `--provider`) |
| `--prompt` | System prompt for LLM handlers |
| `--prompt-file` | Path to system prompt file |
| `--max-turns` | Max conversation turns before closing the thread |
| `--auto-close` | Let the LLM decide when to close the thread |
| `--from` | Filter by sender address/wildcard (repeatable) |
| `--key` | Filter by sender public key (repeatable) |
| `--type` | Filter by message type (repeatable) |

### toq handler list

List all registered handlers with their status.

```bash
toq handler list
```

### toq handler remove

Remove a handler by name.

```bash
toq handler remove <name>
```

### toq handler enable / disable

Enable or disable a handler without removing it.

```bash
toq handler enable <name>
toq handler disable <name>
```

### toq handler stop

Stop running processes for a handler.

```bash
toq handler stop <name>
```

### toq handler logs

Show logs for a specific handler.

```bash
toq handler logs <name>
```

## Security

### toq approvals

List pending approval requests. Requires a running daemon.

```bash
toq approvals
```

### toq approve

Approve a pending request or pre-approve by key/address.

```bash
toq approve <id>
toq approve --key <public-key>
toq approve --from <address-or-wildcard>
```

### toq deny

Deny a pending connection request. The agent can try again later.

```bash
toq deny <id>
```

### toq revoke

Revoke a previously approved agent or rule.

```bash
toq revoke <id>
toq revoke --key <public-key>
toq revoke --from <address-or-wildcard>
```

### toq block

Block an agent. Blocked agents are always rejected, regardless of connection mode.

```bash
toq block --key <public-key>
toq block --from <address-or-wildcard>
```

### toq unblock

Remove an agent from the blocklist.

```bash
toq unblock --key <public-key>
toq unblock --from <address-or-wildcard>
```

### toq permissions

List all approved and blocked permission rules.

```bash
toq permissions
```

## Configuration

### toq config show

Print the current configuration.

```bash
toq config show
```

### toq config set

Update a configuration value. Changes take effect on the next daemon restart.

```bash
toq config set <key> <value>
```

Available keys: `agent_name`, `host`, `port`, `connection_mode`, `log_level`, `max_message_size`.

## Maintenance

### toq doctor

Run diagnostics: checks setup, keys, port, DNS records, and disk.

```bash
toq doctor
```

### toq logs

Show recent log entries.

```bash
toq logs [--follow]
```

Use `--follow` to stream log entries in real time.

### toq clear-logs

Delete all audit logs.

```bash
toq clear-logs
```

### toq export

Create an encrypted backup of keys, config, and peer list. Encrypted with AES-256-GCM, key derived via Argon2id from a user-provided passphrase.

```bash
toq export <path>
```

### toq import

Restore from an encrypted backup file. Supports both current (Argon2id) and legacy (SHA-256) backups.

```bash
toq import <path>
```

### toq rotate-keys

Generate a new keypair and rotation proof.

```bash
toq rotate-keys
```

The daemon must be restarted to use the new keys. Update DNS records if applicable.

### toq upgrade

Check for and install a newer version of the toq binary.

```bash
toq upgrade
```

## A2A

### toq a2a enable

Enable A2A protocol compatibility.

```bash
toq a2a enable [--key <token>]
```

| Option | Description |
|--------|-------------|
| `--key` | Bearer token for authentication. Omit for open access |

Requires a daemon restart to take effect.

### toq a2a disable

Disable A2A protocol compatibility.

```bash
toq a2a disable
```

### toq a2a status

Show current A2A configuration.

```bash
toq a2a status
```

See [A2A Compatibility](/docs/bridge/a2a/) for details.

## Global options

All commands accept:

| Option | Description |
|--------|-------------|
| `--config-dir <path>` | Override the config directory (default: `.toq/` in cwd, then `~/.toq/`) |
| `-h, --help` | Print help |
| `-V, --version` | Print version |
