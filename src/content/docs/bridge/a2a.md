---
title: A2A Compatibility
description: Your toq agent speaks A2A out of the box
---

toq agents speak A2A natively. Enable it with one config line and any agent that uses A2A can reach yours, on the same port it already uses for toq protocol. No separate process, no extra infrastructure.

Going the other direction works too. Your toq agent can send messages to any A2A agent by using its HTTPS URL instead of a toq address.

## Turn it on

```bash
toq a2a enable --key "pick-a-secret"
toq down && toq up
```

That's it. Your agent now has an agent card at `/.well-known/agent-card.json` and a JSON-RPC endpoint at `/a2a`, both on port 9009. The `--key` flag is optional. Leave it out if you want open access.

Check the status anytime:

```bash
toq a2a status
```

To disable:

```bash
toq a2a disable
```

## Other agents reaching yours

From the outside, your toq agent looks like any standard A2A agent. Other agents discover it through the agent card, send JSON-RPC requests, and get responses. Your configured handlers (LLM, shell, SDK) process the messages and reply.

Here's what it looks like with the official A2A Python SDK:

```python
import asyncio, httpx
from uuid import uuid4
from a2a.client import A2ACardResolver, A2AClient
from a2a.types import MessageSendParams, SendMessageRequest

async def main():
    async with httpx.AsyncClient(
        headers={"Authorization": "Bearer pick-a-secret"}
    ) as hc:
        resolver = A2ACardResolver(
            httpx_client=hc, base_url="http://your-host:9009"
        )
        card = await resolver.get_agent_card()

        client = A2AClient(httpx_client=hc, agent_card=card)
        response = await client.send_message(
            SendMessageRequest(
                id=str(uuid4()),
                params=MessageSendParams(**{
                    "message": {
                        "role": "user",
                        "parts": [{"kind": "text", "text": "Plan me a trip to Tokyo"}],
                        "messageId": uuid4().hex,
                    }
                })
            )
        )
        print(response.model_dump(mode="json", exclude_none=True))

asyncio.run(main())
```

If your agent has an LLM handler configured, the other agent gets a real conversational response. If it has a shell handler, it gets whatever your script produces. The calling agent doesn't know or care that toq is underneath.

## Your agent reaching others

Send to any A2A agent by using its URL as the recipient:

```bash
curl -X POST http://127.0.0.1:9009/v1/messages \
  -H "Content-Type: application/json" \
  -d '{"to": "https://some-a2a-agent.example.com", "body": {"text": "Hello"}}'
```

The daemon fetches the agent card from `/.well-known/agent-card.json` at that URL. If it finds one, it sends via A2A. If not, it tells you the target isn't an A2A agent. No guessing.

## Streaming

Streaming works over Server-Sent Events. An agent calling `message/stream` gets real-time task lifecycle events: the task being created, status changing to working, artifact chunks arriving, and the final completion.

The agent card advertises `streaming: true` so clients know it's available.

## What's supported

All core A2A methods work, in both the v0.3 format (what the current SDK sends) and v1.0 format (the latest spec):

| What | v0.3 name | v1.0 name |
|------|-----------|-----------|
| Send a message | `message/send` | `SendMessage` |
| Stream a message | `message/stream` | `SendStreamingMessage` |
| Check a task | `tasks/get` | `GetTask` |
| List tasks | `tasks/list` | `ListTasks` |
| Cancel a task | `tasks/cancel` | `CancelTask` |
| Subscribe to updates | `tasks/resubscribe` | `SubscribeToTask` |

Push notifications are not supported. The agent card honestly advertises this.

## Agent card customization

The agent card is generated automatically from your config. If your agent is behind a reverse proxy or NAT, override the public URL:

```toml
a2a_public_url = "https://my-agent.example.com/a2a"
```

## Security notes

The A2A endpoint (`/a2a`) is accessible from any IP. Your local API (`/v1/*`) is not. These are on the same port but the daemon routes them to different handlers based on the source IP.

Remote connections are rate-limited. Bearer token auth is constant-time compared to prevent timing attacks. Outbound A2A requests block cloud metadata and link-local addresses.
