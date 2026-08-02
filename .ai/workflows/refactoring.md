# Workflow: Refactoring

Safe refactoring of production code without changing intended behavior (unless the task explicitly includes behavior change).

---

## Definition

**Refactor** = improve structure while preserving observable behavior.

If behavior must change, treat it as a feature/fix with separate tests and PR description — do not hide behavior changes inside “refactor” commits.

---

## Preconditions

- [ ] Tests exist for the area, **or** you add characterization tests before restructuring
- [ ] Scope is agreed (files/modules)
- [ ] No unrelated feature work mixed in
- [ ] Branch is short-lived

If coverage is missing, write characterization tests first that lock current behavior.

---

## Allowed Refactors (Prefer in This Order)

1. Rename for clarity (with tool-assisted rename when available)
2. Extract function/method
3. Extract class/module at established boundaries
4. Move file to match folder conventions
5. Replace conditional with polymorphism when adding a third+ variant
6. Remove dead code after proving dead (search + metrics/flags)
7. Tighten types/interfaces without changing runtime behavior

---

## Forbidden During Refactor PRs

- Changing public API contracts without versioning/migration
- Quietly fixing unrelated bugs (split into another commit/PR unless tiny and tested)
- Introducing new frameworks or architectural styles without ADR + approval
- Mass formatting combined with logic moves
- Rewriting working modules from scratch “to be clean”

---

## Safety Technique: Mikado / Vertical Slices

For large refactors:

1. Identify the end state
2. List prerequisites
3. Apply small steps, each leaving tests green
4. Commit after each green step (when user wants commits)

Never leave `main` red.

---

## Behavior Preservation Checks

- Run unit/integration tests for the module
- Compare API responses for representative fixtures
- For UI: critical flows still pass
- For SQL: compare results of old vs new queries on sample data when optimizing queries

---

## Performance Refactors

- Measure before and after (`EXPLAIN`, benchmarks, APM)
- Keep old path behind a flag if risk is high until verified
- See `workflows/performance-review.md`

---

## Database Refactors

- Expand/contract only
- Dual-write / dual-read periods when changing data shape
- Never rename columns in place under rolling deploy without compatibility layer

---

## Agent Rules

- Explain the refactor plan before large structural edits
- Prefer mechanical, reviewable diffs
- Do not invent new folder hierarchies that contradict `conventions/folder-structure.md` or repo reality
- After refactor, run code-review workflow focusing on accidental behavior change

---

## Done Criteria

- [ ] Tests green; characterization coverage retained
- [ ] Public behavior unchanged (or explicitly documented if changed)
- [ ] Diff is understandable in review
- [ ] Dead code removed only when proven
- [ ] Docs/imports/paths updated
