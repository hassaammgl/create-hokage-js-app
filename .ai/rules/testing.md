# Testing Rules

Testing standards for unit, integration, and end-to-end tests. Pair with workflow `workflows/implementation.md`.

---

## Test Pyramid

| Layer | Purpose | Speed | When required |
|-------|---------|-------|---------------|
| Unit | Pure logic, domain rules, mappers | ms | New/changed business logic |
| Integration | DB, queues, HTTP adapters with real collaborators | seconds | Persistence, API contracts, transactions |
| E2E | Critical user journeys through the system | tens of seconds+ | Checkout, auth, permissions, money movement |

Prefer many unit tests, fewer integration tests, few E2E tests. Do not replace unit tests with slow E2E for logic that does not need the full stack.

---

## Unit Tests

- Test behavior and edge cases, not private implementation details.
- Cover: happy path, validation failures, boundary values, authorization denials, idempotent replays where relevant.
- Domain tests run without database or network.
- Deterministic: no real clock/network/random without injection; freeze time when asserting timestamps.
- One logical assertion theme per test (multiple asserts OK if they verify one behavior).

---

## Integration Tests

- Use real database when testing repositories/transactions (Testcontainers or project ephemeral DB).
- Prefer transactional rollback or isolated schemas per test for cleanup.
- Do not point integration tests at shared production or sticky staging data.
- Assert on persisted state and observable side effects (outbox rows, published messages in test double).

---

## E2E Tests

- Cover only critical paths; flaky E2E blocks the pipeline — prioritize stability.
- Isolate test data with unique IDs; never depend on manual seed left in an environment.
- Avoid screenshot-only assertions for business rules; assert DOM roles/text or API outcomes.
- Run against ephemeral environments in CI when possible.

---

## Naming

Pattern:

```text
should_<expected>_when_<condition>
```

or project equivalent:

```text
<unit>_<scenario>_<expected>
```

Examples:

- `should_reject_refund_when_order_already_refunded`
- `should_return_404_when_order_not_visible_to_user`

Names must describe behavior — not `test1` / `works`.

---

## Arrange–Act–Assert

Structure every test:

1. **Arrange** — fixtures, inputs, stubs
2. **Act** — single primary action
3. **Assert** — expected state/output

Avoid multiple unrelated acts in one test.

---

## Mocking

- Mock external boundaries (HTTP APIs, payment SDKs, email), not your own domain model.
- Do not mock the database for repository tests — that tests the mock.
- Prefer fakes (in-memory implementations of ports) over heavy mocks when practical.
- Verify critical interactions (e.g. “payment captured once”); avoid over-verifying every call.
- If a mock setup is longer than the logic under test, reconsider design.

---

## Fixtures

- Build fixtures via factories/builders with sensible defaults and overrides.
- Do not share mutable fixture state across tests.
- Keep fixture data minimal — only fields that affect the behavior under test.
- Store golden files for large payloads only when necessary; review them in PRs carefully.

---

## Coverage Expectations

| Area | Expectation |
|------|-------------|
| Domain / business rules | High coverage; critical paths near 100% of meaningful branches |
| Application services | Cover success and major failure modes |
| Controllers | Cover mapping/validation wiring; prefer integration tests for HTTP |
| UI presentational | Behavior tests for complex widgets; do not chase % for trivial components |

- Coverage % is a signal, not a goal. Do not write tautological tests to inflate numbers.
- Critical modules (auth, payments, permissions) require explicit test lists in the PR when changed.
- New code should not reduce coverage of critical packages without justification.

---

## Flakiness

- Quarantine is temporary — fix or delete flaky tests within a defined window.
- Common causes: time, randomness, shared state, real network, order dependence — eliminate them.
- Never retry E2E in CI as a permanent strategy without a ticket to fix root cause.

---

## What Not to Test

- Third-party library internals
- Framework routing itself (unless custom middleware)
- Private functions indirectly covered by public API tests (usually)

---

## Bug Fix Policy

Every production bug fix includes a regression test that fails before the fix and passes after, unless the bug is purely cosmetic and untestable — state that explicitly in the PR.

---

## CI Requirements

- Tests run on every PR.
- Do not commit `.only`, `.skip`, `xit`, `fdescribe` focusing.
- Failed tests block merge.
- Seed data and migrations apply cleanly in CI from empty DB.

---

## Testing Checklist (Inline)

- [ ] Right layer of test for the change
- [ ] Edge cases and auth failures covered for business logic
- [ ] Deterministic (time/random injected)
- [ ] No production network calls
- [ ] Regression test for bug fixes
- [ ] Names describe behavior
- [ ] No focused/skipped tests committed
