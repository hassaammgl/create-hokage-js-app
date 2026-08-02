# Workflow: Debugging

Systematic procedure for AI agents diagnosing defects. Prefer evidence over speculation.

---

## Principles

- Reproduce before fixing.
- Change one variable at a time.
- Do not “fix” code you have not confirmed is causal.
- Read error messages, stacks, and logs fully.
- Never invent infra causes (e.g. “Redis must be down”) without evidence.

---

## Step 1 — Capture the Symptom

Record:

- Expected vs actual behavior
- Exact error message / status code
- Environment (local, CI, staging, prod)
- Timestamp, request id / correlation id if available
- Recent changes (git blame, recent deploys) when relevant

Ask for missing reproduction details when you cannot proceed.

---

## Step 2 — Reproduce

- Reproduce with the smallest input that fails.
- Automate reproduction with a test when possible (this becomes the regression test).
- For intermittent issues: note frequency, load, data shape, race conditions.

If unreproducible, gather more telemetry — do not apply speculative multi-file “fixes.”

---

## Step 3 — Localize

Narrow the fault domain:

1. Is it client, network, API, service logic, DB, or dependency?
2. Binary search with logs/breakpoints at boundaries.
3. Compare working vs broken paths (good request vs bad).
4. Check config/env differences between environments — only real documented vars.

Use repo search to find the handler/use case for the failing route or job.

---

## Step 4 — Form a Hypothesis

State: “X fails because Y under condition Z.”

Predict what evidence would confirm/refute it. Gather that evidence next.

Discard hypotheses that contradict observed logs/data.

---

## Step 5 — Fix

- Implement the smallest correct fix.
- Add a regression test that fails without the fix.
- Check for the same bug class nearby (same pattern, other endpoints) — fix or file follow-ups deliberately, without expanding scope silently.
- Consider security implications of the bug (auth bypass, data leak).

---

## Step 6 — Verify

- Regression test passes.
- Original reproduction steps pass.
- No new failures in related suites.
- For prod issues: verify metrics/logs after deploy; watch for recurrence.

---

## Common Root Cause Checklist

- [ ] Validation too loose/strict
- [ ] Authz IDOR / wrong principal
- [ ] Null/empty edge cases
- [ ] Timezones / clock skew
- [ ] N+1 / timeout under load
- [ ] Race without idempotency or locking
- [ ] Migration not applied / expand-contract mismatch
- [ ] Stale cache
- [ ] Incorrect env config (real keys only)
- [ ] Dependency version mismatch

---

## Logging While Debugging

- Temporary `debug` logs must be removed or gated before merge.
- Do not log secrets while debugging.
- Prefer enriching existing structured logs with ids.

---

## Escalation

Stop and ask the user when:

- You lack access to logs/environments needed to confirm
- The fix requires a product decision
- Data corruption repair is needed
- Prod-only issue without safe reproduction path

---

## Output Template

```markdown
## Diagnosis
- Symptom: ...
- Reproduction: ...
- Root cause: ...
- Evidence: ...
## Fix
- Change: ...
- Regression test: ...
## Verification
- ...
```
