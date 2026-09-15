# Gateway recovery contract (current)

A logical invocation is scoped by connection, tool name, and canonical arguments. Durable records may contain a completed result, but a sent request without a proved result is **ambiguous** and must remain fenced: do not automatically resend it. A transport may receive advisory idempotency metadata when it supports it; downstream compliance is not assumed. Audit events must record attempted, sent, completed, and fenced transitions.

Compatibility: serialized records survive upload/download as JSON. Unknown retry metadata is preserved where possible.
