---
title: A2A Compatibility
description: Your toq agent speaks A2A out of the box
---

toq agents speak A2A natively. Enable it with one command and any agent that uses A2A can reach yours, on the same port it already uses for toq protocol. No separate process, no extra infrastructure.

Going the other direction works too. Your toq agent can send messages to any A2A agent just by using its URL.

## Turn it on

```bash
toq a2a enable --key "pick-a-secret"
toq down && toq up
```

That's it. Other A2A agents can now discover and talk to yours on port 9009. The `--key` flag is optional. Leave it out if you want open access.

Check the status anytime:

```bash
toq a2a status
```

To disable:

```bash
toq a2a disable
```

## Other agents reaching yours

From the outside, your toq agent looks like any standard A2A agent. Other agents discover it, send messages, and get responses. Your configured handlers (LLM, shell, SDK) process the messages and reply.

Here's a complete working example with the official A2A Python SDK (`pip install a2a-sdk`):

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

If the remote agent requires authentication, pass the token:

```bash
curl -X POST http://127.0.0.1:9009/v1/messages \
  -H "Content-Type: application/json" \
  -d '{"to": "https://some-a2a-agent.example.com", "body": {"text": "Hello"}, "a2a_auth": "their-token"}'
```

The daemon checks whether the target is an A2A agent before sending. If it is, the message goes through. If not, you get a clear error.

## Addressing

Each toq agent runs on its own port. In toq protocol, the agent name is part of the address (`toq://yourdomain.com/alice`), and DNS maps that name to the right port. In A2A, there's no agent name in the URL. The port is the identifier.

If you run one agent, A2A clients just use your domain and port: `http://yourdomain.com:9009`.

If you run multiple agents on the same machine, each one has a different port. Give A2A clients the right port for the agent they want:

| Agent | toq address | A2A URL |
|-------|------------|---------|
| alice | `toq://yourdomain.com/alice` | `http://yourdomain.com:9009` |
| bob | `toq://yourdomain.com/bob` | `http://yourdomain.com:9010` |

For a cleaner setup with path-based URLs (`http://yourdomain.com/alice`), you can put a reverse proxy like nginx in front. Set `a2a_public_url` in each agent's config so the agent card advertises the right URL:

```toml
a2a_public_url = "https://yourdomain.com/alice/a2a"
```

## Streaming

Streaming is supported out of the box. When another agent sends a streaming request, they get real-time updates as your handler works: status changes, the response text as it arrives, and a completion signal. You don't need to configure anything. The agent card advertises streaming support automatically.

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

## Security

- The A2A endpoint is accessible from any IP so remote agents can reach you. Your local API (`/v1/*`) stays localhost-only.
- Remote connections are rate-limited.
- If you set an API key with `toq a2a enable --key`, other agents need that key to send messages to you. When your agent sends to other A2A agents, you provide their key separately (via `a2a_auth`). The agent card stays public so agents can still discover you.
- Outbound A2A requests won't follow redirects or connect to internal network addresses.
