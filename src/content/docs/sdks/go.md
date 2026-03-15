---
title: Go SDK
description: toq Go SDK for agent code
---

The Go SDK is a thin client that talks to the local toq daemon. The daemon handles all the protocol complexity. The SDK gives you a clean interface to send messages, listen for incoming messages, manage peers, and control the daemon.

Zero dependencies beyond the standard library.

## Install

```bash
go get github.com/toqprotocol/toq-sdk-go
```

Requires Go 1.22+.

## Quick start

```go
import toq "github.com/toqprotocol/toq-sdk-go"

client := toq.Connect("")
resp, err := client.Send("toq://example.com/agent", "hello", nil)
```

The daemon must be running (`toq up`) before connecting. The SDK finds it automatically by checking the workspace state file, the `TOQ_API_URL` environment variable, or falling back to `http://127.0.0.1:9010`.

## Sending messages

```go
// Simple send (waits for delivery confirmation)
resp, _ := client.Send("toq://example.com/bob", "What's the weather?", nil)
fmt.Println(resp["thread_id"])

// Continue a thread
client.Send("toq://example.com/bob", "Thanks!", &toq.SendOptions{
    ThreadID: resp["thread_id"].(string),
})

// Close a thread
client.Send("toq://example.com/bob", "Goodbye", &toq.SendOptions{
    ThreadID:    tid,
    CloseThread: true,
})

// Send without waiting
client.Send("toq://example.com/bob", "fire and forget", &toq.SendOptions{
    Wait: toq.Bool(false),
})
```

## Listening for messages

```go
msgs, _ := client.Messages()
for msg := range msgs {
    fmt.Printf("%s: %v\n", msg.From, msg.Body)
    msg.Reply("Got it!")
}
```

Each `Message` has `ID`, `Type`, `From`, `Body`, `ThreadID`, `Timestamp`, and a `Reply()` method. You can filter the stream:

```go
msgs, _ := client.MessagesFiltered("toq://example.com/*", "")
```

## Streaming

```go
stream, _ := client.StreamStart("toq://example.com/bob", "")
client.StreamChunk(stream["stream_id"].(string), "Here is ")
client.StreamChunk(stream["stream_id"].(string), "a streamed ")
client.StreamChunk(stream["stream_id"].(string), "message.")
client.StreamEnd(stream["stream_id"].(string), false)
```

## Peers and approvals

```go
// List peers
peers, _ := client.Peers()

// Manage approvals
pending, _ := client.Approvals()
client.Approve(pending[0].(map[string]interface{})["id"].(string))

// Block/unblock
client.BlockByKey("ed25519:abc...")
client.BlockByAddress("toq://evil.com/*")
client.UnblockByKey("ed25519:abc...")
```

## Handlers

```go
// Add a shell handler
client.AddHandler("logger", toq.HandlerOptions{
    Command: "echo $TOQ_TEXT >> log.txt",
})

// Add an LLM handler
client.AddHandler("chat", toq.HandlerOptions{
    Provider: "openai",
    Model:    "gpt-4o",
    Prompt:   "Be helpful",
    MaxTurns: toq.Int(10),
})

// List and remove
client.Handlers()
client.RemoveHandler("logger")
```

## Other operations

```go
client.Status()                          // Daemon status
client.History(toq.HistoryOptions{Limit: 10})  // Recent messages
client.Discover("example.com")           // DNS discovery
client.Ping("toq://host/agent")          // Ping a remote agent
client.Config()                          // Read config
client.RotateKeys()                      // Rotate identity keys
client.ExportBackup("passphrase")        // Encrypted backup
```

## Connection resolution

The SDK finds the daemon in this order:

1. Explicit URL passed to `Connect("...")`
2. `TOQ_API_URL` environment variable
3. `.toq/state.json` in the current directory (workspace mode)
4. Default `http://127.0.0.1:9010`

## Helpers

```go
toq.Bool(true)  // *bool pointer, for SendOptions.Wait
toq.Int(10)     // *int pointer, for HandlerOptions.MaxTurns
```
