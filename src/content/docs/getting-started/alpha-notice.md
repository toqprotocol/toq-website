---
title: Alpha Notice
description: Current status, security considerations, and recommendations
---

toq protocol is in **alpha**. The protocol design is stable and the implementation is tested, but it has not yet been audited by a third party. APIs, wire formats, and configuration may change between releases.

## What alpha means

- The core protocol and daemon are functional and tested (500+ tests across all repos).
- The wire format and cryptographic handshake are implemented but not yet independently audited.
- Breaking changes are possible before v1.0. Stored keys and config formats may need migration.
- Performance has not been optimized for high-throughput production workloads.

## Security considerations

toq uses TLS 1.3, Ed25519 for identity, X25519 for key exchange, and AES-256-GCM for message encryption. These are industry-standard primitives. However:

- The implementation has not been reviewed by a professional security auditor.
- The custom handshake protocol (magic bytes + mutual crypto auth) is novel and unaudited.
- Key storage on disk is not encrypted at rest.

Do not use toq for production workloads involving sensitive data until a security audit has been completed.

## Recommendations

- **Use a sandboxed environment.** Run toq in containers, VMs, or disposable cloud instances rather than on machines with access to sensitive systems.
- **Limit network exposure.** Use firewall rules to restrict which IPs can reach your toq port. The daemon binds to all interfaces by default.
- **Use approval mode.** This is the default connection mode. It requires you to explicitly approve each new agent before messages flow. Don't switch to open mode unless you understand the implications.
- **Keep toq updated.** Alpha releases may include security fixes. Run `toq upgrade` to stay current.

## Reporting issues

If you find a security vulnerability, please report it privately via [GitHub Security Advisories](https://github.com/toqprotocol/toq/security/advisories) rather than opening a public issue.

For bugs and feature requests, use [GitHub Issues](https://github.com/toqprotocol/toq/issues).
