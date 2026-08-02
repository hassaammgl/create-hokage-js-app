# Workflow: Implementation

How AI agents write code after the before-coding plan is approved or unambiguous.

---

## Principles

- **Minimal diff** — change only what the task requires.
- **Preserve style** — match naming, formatting, abstractions in neighboring code.
- **No duplicate logic** — reuse existing utilities and patterns.
- **Read before write** — re-read a file immediately before editing if context might be stale.
- **Small steps** — complete one coherent slice at a time (API → service → persistence → tests).

---

## Execution Order (Typical Backend Feature)

1. Schema/migration (expand-compatible) if needed
2. Domain/application logic
3. Persistence adapter
4. HTTP/API adapter + OpenAPI update
5. Tests
6. Wiring (DI/routes)
7. Self-review (see below)

Frontend: types/API client → state/hooks → UI → tests.

Do not leave the system half-wired (orphan service with no registration).

---

## Editing Rules

- Prefer edit existing files over creating new ones.
- Create a new file only when:
  - it matches established folder conventions, and
  - the responsibility does not fit cleanly in an existing module
- Never overwrite unrelated code.
- Never delete code without explaining why in the PR/summary.
- Do not reformat entire files; keep diffs reviewable.
- Do not mix drive-by refactors with feature work.

---

## Implementation Constraints

- Controllers stay thin; business rules in services/domain.
- Every endpoint validates input.
- Every external call has a timeout.
- No `SELECT *`.
- No swallowed exceptions.
- No secrets in code.
- Follow SOLID/DRY/KISS/YAGNI as defined in `rules/architecture.md`, `rules/coding.md`, and `rules/oop.md`.
- Enforce pass/fail limits in `coding.md` (functions ≤ 30 lines, ≤ 4 params, nesting ≤ 3, etc.) plus the stack file (`java.md` / `typescript.md` / `cpp.md` / `react.md` / `sql.md`).
- Prefer OOP: rich domain, DI, composition; apply `architecture/patterns.md` when criteria match (Strategy for ≥3 variants, Builder for many optionals, Adapter for SDKs, etc.).
- Do not ship multi-step business logic as procedural utility scripts unless `EXCEPTION: procedural` is documented.

---

## Tests During Implementation

- Add/update tests in the same change as the behavior.
- Bug fixes: regression test first when practical (red → green).
- Run the relevant test suite locally/CI commands available in the project.
- Do not commit focused/skipped tests.

---

## Commits (When User Requests Commits)

- Small, focused commits with Conventional Commit messages.
- Do not commit unless the user explicitly asks.
- Never commit secrets or `.env` files with real credentials.

---

## Progress Communication

For multi-step tasks, briefly report:

- What was implemented
- What remains
- Any deviation from the plan and why

If you discover the plan is wrong mid-flight, stop and revise the plan with the user when impact is significant.

---

## Self-Review (Mandatory Before Declaring Done)

Run through:

1. Diff matches the plan and acceptance criteria
2. `workflows/code-review.md` checklist (abbreviated)
3. Relevant `checklists/*` file
4. No invented APIs/tables/env vars
5. Docs/OpenAPI/migrations updated if needed
6. Temporary debug logs removed

---

## Done Criteria

- [ ] Behavior meets acceptance criteria
- [ ] Tests added/updated and passing for the touched area
- [ ] Lint/typecheck expectations of the project satisfied when runnable
- [ ] Self-review completed
- [ ] User-facing summary of changes and how to verify

---

## Anti-Patterns

- Huge single-shot rewrites
- New frameworks introduced “for cleanliness”
- Copy-pasting large code blocks from memory without verifying against repo
- Partial migrations that break old code during rolling deploys
