---
title: API Reference
description: toq daemon HTTP API
---

The daemon exposes an HTTP API on `http://127.0.0.1:9009` for SDKs, handlers, and tooling. These endpoints (`/v1/*`) are only accessible from the local machine since they control the daemon.

The A2A endpoints (`/.well-known/agent-card.json` and `/a2a`) are accessible from any IP so that remote agents can reach yours. They're only active when A2A is enabled.

Full OpenAPI 3.1 spec: [`api/openapi.yaml`](https://github.com/toqprotocol/toq/blob/main/api/openapi.yaml)

---

## Messages

`POST /v1/messages` -- Send a message to one or more agents.

```bash
# Send to a toq agent
curl -X POST http://127.0.0.1:9009/v1/messages \
  -H "Content-Type: application/json" \
  -d '{"to": "toq://host/agent", "body": {"text": "hello"}}'

# Send to an A2A agent
curl -X POST http://127.0.0.1:9009/v1/messages \
  -H "Content-Type: application/json" \
  -d '{"to": "https://a2a-agent.example.com", "body": {"text": "hello"}, "a2a_auth": "their-token"}'

# Wait for acknowledgement
curl -X POST "http://127.0.0.1:9009/v1/messages?wait=true&timeout=10" \
  -H "Content-Type: application/json" \
  -d '{"to": "toq://host/agent", "body": {"text": "hello"}}'
```

Request body:

| Field | Type | Description |
|-------|------|-------------|
| `to` | string or string[] | toq address or HTTPS URL. Array for multi-send. |
| `body` | object | Message content, e.g. `{"text": "hello"}`. |
| `thread_id` | string | Conversation thread. Auto-generated if omitted. |
| `reply_to` | string | ID of the message being replied to. |
| `content_type` | string | MIME type. Default: `text/plain`. |
| `close_thread` | bool | Close the thread after sending. |
| `a2a_auth` | string | Bearer token for outbound A2A sends. |

`GET /v1/messages` -- Stream incoming messages via SSE. Filter with `?from=` and `?type=`.

`GET /v1/messages/history` -- Query stored messages. Params: `?limit=50`, `?from=`, `?since=`.

---

## Streaming

Open a persistent connection to a remote agent and send content incrementally.

`POST /v1/stream/start` -- Open a stream. Body: `{"to": "toq://host/agent"}`. Returns `stream_id`.

`POST /v1/stream/chunk` -- Send a chunk. Body: `{"stream_id": "...", "text": "..."}`.

`POST /v1/stream/end` -- End the stream. Body: `{"stream_id": "...", "close_thread": false}`.

---

## Peers and permissions

`GET /v1/peers` -- List known peers with public key, address, status, last seen.

`POST /v1/peers/{public_key}/block` -- Block by public key.
`DELETE /v1/peers/{public_key}/block` -- Unblock.

`POST /v1/block` -- Block by rule. Body: `{"key": "ed25519:..."}` or `{"from": "toq://host/*"}`.
`DELETE /v1/block` -- Remove block rule.

`POST /v1/approve` -- Approve by rule. Same body format.
`POST /v1/revoke` -- Remove approve rule.

`GET /v1/permissions` -- List all approved and blocked rules.

---

## Approvals

`GET /v1/approvals` -- List pending approval requests.

`POST /v1/approvals/{id}` -- Decide on a request. Body: `{"decision": "approve"}` or `{"decision": "deny"}`.

`POST /v1/approvals/{id}/revoke` -- Revoke a previously approved agent.

---

## Discovery

`POST /v1/ping` -- Ping a remote agent. Body: `{"address": "toq://host/agent"}`. Returns the agent's public key.

`GET /v1/discover?host=example.com` -- Find agents at a domain via DNS TXT records.

`GET /v1/discover/local` -- Find agents on the local network via mDNS.

---

## Handlers

`GET /v1/handlers` -- List all handlers with active process counts.

`POST /v1/handlers` -- Register a handler.

```bash
# Shell handler
curl -X POST http://127.0.0.1:9009/v1/handlers \
  -H "Content-Type: application/json" \
  -d '{"name": "logger", "command": "echo $TOQ_TEXT >> log.txt"}'

# LLM handler
curl -X POST http://127.0.0.1:9009/v1/handlers \
  -H "Content-Type: application/json" \
  -d '{"name": "chat", "provider": "openai", "model": "gpt-4o"}'
```

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Handler name (required). |
| `command` | string | Shell command. |
| `provider` | string | `openai`, `anthropic`, `bedrock`, or `ollama`. |
| `model` | string | Model name (required with provider). |
| `prompt` | string | System prompt. |
| `max_turns` | int | Max conversation turns. |
| `auto_close` | bool | Let the LLM decide when to close. |
| `filter_from` | string[] | Trigger only for these senders. |
| `filter_key` | string[] | Trigger only for these public keys. |
| `filter_type` | string[] | Trigger only for these message types. |

`PUT /v1/handlers/{name}` -- Update a handler (same fields, all optional).
`DELETE /v1/handlers/{name}` -- Remove a handler.
`POST /v1/handlers/reload` -- Reload from `handlers.toml`.
`POST /v1/handlers/stop` -- Stop processes. Body: `{"name": "handler-name"}`.

---

## Daemon

`GET /v1/health` -- Returns `ok`.

`GET /v1/status` -- Address, connection mode, connections, message counts, version, public key.

`POST /v1/daemon/shutdown` -- Shut down. Body: `{"graceful": true}`.

`GET /v1/logs` -- Log entries. `?follow=true` streams via SSE.
`DELETE /v1/logs` -- Clear logs.

`GET /v1/diagnostics` -- Port, DNS, keys, disk checks.

`GET /v1/upgrade/check` -- Check for newer version.

---

## Config, keys, backup

`GET /v1/config` -- Read current config.
`PATCH /v1/config` -- Update fields. Body: `{"connection_mode": "open"}`.

`GET /v1/card` -- This agent's toq protocol card.

`POST /v1/keys/rotate` -- Generate new keypair. Restart required.

`POST /v1/backup/export` -- Encrypted backup. Body: `{"passphrase": "..."}`.
`POST /v1/backup/import` -- Restore. Body: `{"passphrase": "...", "data": "..."}`.

---

## A2A

Available when `a2a_enabled = true`. Accessible from any IP.

`GET /.well-known/agent-card.json` -- Agent card for discovery. Public, no auth.

`POST /a2a` -- A2A JSON-RPC 2.0 endpoint. All A2A methods (send, stream, get task, list, cancel, subscribe) go through this single URL via JSON-RPC. See [A2A Compatibility](/bridge/a2a/) for methods, examples, and auth.

---

## Errors

All error responses use this format:

```json
{
  "error": {
    "code": "not_reachable",
    "message": "no agent running at toq://host/agent"
  }
}
```

| Code | When |
|------|------|
| `invalid_request` | Malformed request or missing required fields |
| `invalid_address` | Unrecognized toq address format |
| `not_found` | Resource doesn't exist (stream, handler, approval) |
| `not_reachable` | Remote agent is offline or unreachable |
| `delivery_timeout` | No acknowledgement within timeout |
| `message_too_large` | Body exceeds `max_message_size` |
| `invalid_passphrase` | Wrong passphrase for backup decrypt |
| `invalid_config` | Config value rejected |
| `a2a_send_failed` | Outbound A2A send failed (no agent card, auth rejected, network error) |
