# Security Checklist

Use for any change touching auth, user input, data access, uploads, payments, admin, or dependencies. A single failure here is a merge blocker.

---

## Input / Output

- [ ] All untrusted input validated (type, length, range, format)
- [ ] Parameterized SQL / bind variables only
- [ ] No shell invocation with unsanitized input
- [ ] HTML output escaped; rich text sanitized with allowlist
- [ ] CSV exports neutralized against formula injection when applicable
- [ ] URL schemes allowlisted for redirects and fetches

---

## Authentication

- [ ] Passwords hashed with Argon2id/bcrypt (no new weak hashing)
- [ ] Session cookies `HttpOnly` + `Secure` + appropriate `SameSite`
- [ ] Session regenerated on login
- [ ] JWT `alg` pinned; `exp`/`iss`/`aud` validated
- [ ] Login/reset/OTP endpoints rate-limited

---

## Authorization

- [ ] Deny-by-default policies
- [ ] Object-level checks on every resource ID
- [ ] Admin actions restricted and audited
- [ ] No security through obscurity (hidden URLs)

---

## Web Security

- [ ] CSRF defenses correct for cookie-based sessions
- [ ] CORS origins allowlisted; no `*` with credentials
- [ ] Security headers present/unchanged appropriately (CSP, HSTS, nosniff, frame protections)
- [ ] XSS sinks reviewed (`innerHTML`, markdown renderers, PDF generators)

---

## Secrets & Config

- [ ] No secrets in source, images, or logs
- [ ] Env var names match documented real variables only
- [ ] `.env.example` has placeholders only
- [ ] Secret rotation considered if exposure occurred

---

## Files & SSRF

- [ ] Upload size/type (magic bytes) validated
- [ ] Stored outside web root; safe keys; signed download URLs
- [ ] Server-side fetches of user URLs blocked from link-local/private ranges unless explicitly required and gated

---

## Privacy & Logging

- [ ] No passwords/tokens/PANs in logs
- [ ] PII minimized; audit logs for sensitive actions
- [ ] Error messages safe for clients

---

## Dependencies

- [ ] New packages reviewed (license, maintenance, install scripts)
- [ ] Audit tooling clean of unresolved critical issues on touched tree

---

## Final

- [ ] Threat model considered for new trust boundaries
- [ ] Findings from `.ai/workflows/code-review.md` security section addressed
- [ ] Security reviewer pinged when CODEOWNERS requires it
