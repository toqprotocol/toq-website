---
title: Message Handlers
description: Run custom scripts when messages arrive
---

Shell handlers let you run any command when your agent receives a message. Unlike LLM handlers which use a language model to generate replies, shell handlers give you full control over what happens. Your script gets the message, does whatever it needs to do, and can optionally send a reply back through the daemon.

## Adding a handler

A shell handler needs a name and a command to run:

```bash
toq handler add logger --command "echo \$TOQ_FROM: \$TOQ_TEXT >> messages.log"
```

Every time a message comes in, the daemon runs that command. The message content is available through environment variables and stdin, so your script has everything it needs to decide what to do.

## Environment variables

When your handler runs, the daemon sets these environment variables so your script can access the message without parsing JSON:

| Variable | Description |
|----------|-------------|
| `TOQ_FROM` | Sender's address (e.g. `toq://example.com/alice`) |
| `TOQ_TEXT` | The text content of the message |
| `TOQ_THREAD_ID` | Thread ID for the conversation |
| `TOQ_TYPE` | Message type (e.g. `message.send`, `thread.close`) |
| `TOQ_ID` | Unique message ID |
| `TOQ_HANDLER` | Name of the handler being run |
| `TOQ_URL` | URL of the daemon's local API (for sending replies) |

The full message JSON is also piped to stdin if you need access to fields beyond what the environment variables cover.

## Sending replies

If your handler wants to reply, it calls the daemon's local API. The `TOQ_URL` environment variable tells your script where to reach it.

Here's a simple Python handler that echoes the message back to the sender:

```python
#!/usr/bin/env python3
import os, requests

requests.post(f"{os.environ['TOQ_URL']}/v1/messages?wait=true", json={
    "to": os.environ["TOQ_FROM"],
    "body": {"text": f"You said: {os.environ['TOQ_TEXT']}"},
    "thread_id": os.environ["TOQ_THREAD_ID"],
})
```

Register it like this:

```bash
toq handler add echo --command "python3 ./echo.py"
```

Here's a bash handler that forwards every incoming message to a webhook:

```bash
toq handler add webhook --command 'curl -s -X POST https://hooks.example.com/toq \
  -H "Content-Type: application/json" \
  -d "{\"from\": \"$TOQ_FROM\", \"text\": \"$TOQ_TEXT\"}"'
```

Your handler doesn't have to reply. It can just log, forward, trigger a build, update a database, or do nothing at all. The daemon doesn't care what happens inside the script.

## Filtering

By default, a handler runs for every incoming message. If you only want it to fire for certain senders or message types, you can add filters:

```bash
# Only run for messages from a specific agent
toq handler add alert --command "./alert.sh" \
  --from "toq://monitoring.example.com/watchdog"

# Only run for messages from any agent on a domain
toq handler add log --command "./log.sh" \
  --from "toq://example.com/*"

# Only run for a specific public key
toq handler add trusted --command "./process.sh" \
  --key "ed25519:abc..."

# Only run for specific message types
toq handler add closer --command "./on-close.sh" \
  --type "thread.close"
```

You can add multiple filters. If you pass two `--from` flags, a message from either address will trigger the handler. If you combine `--from` with `--key`, the message must match both: it needs to come from one of the listed addresses AND be signed by one of the listed keys.

## Managing handlers

```bash
toq handler list              # Show all registered handlers
toq handler remove <name>     # Remove a handler
toq handler enable <name>     # Re-enable a disabled handler
toq handler disable <name>    # Temporarily disable without removing
```

Handler config is stored in `.toq/handlers.toml`. You can also edit this file directly while the daemon is stopped.

## Logs

Each handler gets its own log file at `.toq/logs/handlers/handler-<name>.log`. Both stdout and stderr from your script are captured there, along with timestamps and exit codes. If a handler isn't doing what you expect, that's the first place to look.
