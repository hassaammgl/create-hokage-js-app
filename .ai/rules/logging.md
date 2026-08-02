# Logging Rules

Standards for application logs, audit logs, and correlation. Pair with `security.md`.

---

## Structured Logging

- Emit structured logs (JSON or key-value) in production — not unstructured printf soup.
- Include consistent fields: `timestamp`, `level`, `message` (stable event name), `service`, `env`.
- Prefer event names like `order.placed` / `payment.capture_failed` over prose sentences as the primary message.
- Attach context as fields: `orderId`, `customerId`, `durationMs`, `error.code`.

```json
{
  "level": "error",
  "msg": "order.place_failed",
  "orderId": "ord_01H...",
  "requestId": "req_01H...",
  "error": { "type": "PaymentDeclined", "code": "card_declined" },
  "durationMs": 842
}
```

**Why:** Structured logs are queryable; string concatenation is not.

---

## Correlation IDs

- Accept inbound `X-Request-Id` / `traceparent` when present; otherwise generate a unique id.
- Propagate correlation/trace ids to downstream HTTP calls, jobs, and logs.
- Echo request id on API error responses.
- For async jobs, pass `requestId` / `causationId` in the message payload.

---

## Log Levels

| Level | Use |
|-------|-----|
| `error` | Operation failed; needs attention if sustained |
| `warn` | Unexpected but handled; degraded mode; auth denials; retries |
| `info` | Significant business or lifecycle events (request completed, job started) |
| `debug` | Detailed diagnostics; disabled or sampled in prod by default |
| `trace` | Extremely verbose; local only |

Rules:

- Do not log every function entry at `info`.
- Do not use `error` for expected validation failures on user input — use `info`/`warn` with reason codes.
- Unexpected exceptions at the edge: `error` with stack/cause fields.

---

## What Never to Log

- Passwords, password hashes, API keys, private keys, session tokens, refresh tokens, OTP codes
- Full credit card numbers / CVV; bank account numbers
- Raw authorization headers
- Personal secrets (SSN/national id) unless a dedicated audited vault path requires it — default deny
- Full request bodies when they may contain sensitive fields — redact

Mask patterns: show last 4 of PAN if needed; hash tokens for correlation.

---

## Audit Logs

Security- and compliance-sensitive actions require audit records (separate from debug logs when possible):

- Login success/failure (careful with user enumeration in messages)
- Permission / role changes
- Access to sensitive data exports
- Billing changes, refunds, entitlement grants
- Admin impersonation

Audit fields: `actorId`, `action`, `resourceType`, `resourceId`, `timestamp`, `outcome`, `ip` (if available), `requestId`.

Audit logs are append-only and retained per policy.

---

## Request Logging

- Log method, path template (not raw IDs if high cardinality is a problem — follow project metrics guidelines), status, duration.
- Prefer low-cardinality route templates: `/orders/:id` not `/orders/ord_123`.
- Sample high-volume successful health checks (`/health`) at lower rates.

---

## Error Logging

- Log once at the boundary with full context; avoid re-logging the same exception at every layer at `error`.
- Inner layers may attach context and rethrow without logging, or log at `debug`.
- Include `cause` chain / stack in structured fields for unexpected errors.

---

## Performance of Logging

- Logging must not block hot paths excessively; use async appenders when the platform provides them.
- Do not `JSON.stringify` huge objects into logs.
- Avoid DEBUG logging in tight loops in production.

---

## Agent Rules for Logging Changes

- When adding features, add useful failure logs with ids — not `console.log("here")`.
- Remove temporary debug logs before merging.
- Never invent new log sink env vars; use existing logger configuration.

---

## Logging Checklist (Inline)

- [ ] Structured fields; stable event names
- [ ] Correlation id propagated
- [ ] Correct level
- [ ] Secrets/PII redacted
- [ ] Audit events for sensitive actions
- [ ] No duplicate error spam across layers
- [ ] Temporary debug removed
