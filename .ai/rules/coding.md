# Coding Standards

Language-agnostic rules. Every rule is **pass/fail**. Related strict standards:

- `oop.md` — Object-Oriented design (prefer over procedural)
- `../architecture/patterns.md` — when to use Factory, Strategy, Builder, etc.
- `java.md` — Spring Boot / Java
- `typescript.md` — TypeScript
- `cpp.md` — C++
- `react.md` — React
- `sql.md` — SQL
- `performance.md` — performance
- `security.md` — security

**OOP default:** Prefer maintainable object-oriented design over procedural implementations. See `oop.md` before writing multi-step business logic as free functions.

When repository conventions conflict with this file, follow the **repository**, document the exception in the PR, and still apply every rule that does not conflict.

**Enforcement:** A reviewer or AI must mark each applicable rule `PASS` or `FAIL`. `FAIL` blocks merge unless a documented exception is present in the PR.

---

## General Principles (Enforceable)

| # | Rule | Pass | Fail |
|---|------|------|------|
| G1 | Match existing project conventions before introducing a new pattern | New code mirrors neighboring files | Introduces a second pattern for the same concern without ADR/PR justification |
| G2 | Prefer consistency over personal preference | Same naming/structure as local module | Mixes styles in the same module |
| G3 | Every added line has a clear purpose tied to the task | Diff only contains required changes | Drive-by rewrites, speculative code, or unused scaffolding |
| G4 | Readability over cleverness | Straightforward control flow | Dense one-liners, golfed logic, or unnecessary metaprogramming |
| G5 | Maintainability before micro-performance | No micro-opts without measurement | Unreadable “optimizations” without profile evidence |

---

## Function Length

| Metric | Target | Hard limit |
|--------|--------|------------|
| Function / method body | 10–20 lines | **30 lines** |

- Count every line in the function body including blank lines, comments, and braces.
- **PASS:** ≤ 30 lines.
- **FAIL:** > 30 lines without a PR comment titled `EXCEPTION: function-length` stating why split is worse.
- Split functions that exceed 30 lines unless that exception is documented.

---

## Single Responsibility (Functions)

Each function performs **exactly one** logical operation.

**FAIL** if one function does two or more of: validate input, query DB, send email, mutate unrelated state, publish analytics.

**PASS** when each concern is a separate named function, e.g.:

- `validateInput()`
- `createUser()`
- `sendWelcomeEmail()`
- `publishAnalytics()`

---

## Function Naming

Names must be verb phrases that describe behavior.

| PASS examples | FAIL examples |
|---------------|---------------|
| `calculateInvoiceTotal()` | `process()` |
| `validatePasswordStrength()` | `run()` |
| `generateAccessToken()` | `doStuff()` |
| `fetchUserProfile()` | `helper()` |
| `publishNotification()` | `execute()` / `data()` |

**FAIL:** name is a vague verb (`process`, `handle`, `do`, `run`, `execute`) with no domain object, or a noun alone (`data`, `helper`, `utils`).

---

## Parameters

| Metric | Hard limit |
|--------|------------|
| Parameters per function | **4** |

- **PASS:** ≤ 4 parameters.
- **FAIL:** ≥ 5 scalar/positional parameters.
- **Required fix:** introduce a DTO / options / config object.

```text
FAIL: createUser(name, email, age, address, city, phone)
PASS: createUser(CreateUserRequest request)
```

---

## Return Values

- **PASS:** returns one cohesive result (single value, entity, DTO, or typed Result/Either).
- **FAIL:** returns multiple unrelated values packed only for convenience (e.g. tuple of `user`, `emailSent`, `metricsFlushOk`) without a named type that represents one concept.

---

## Nesting Depth

| Metric | Hard limit |
|--------|------------|
| Control-flow nesting (`if`/`for`/`while`/`switch`) | **3** |

- **PASS:** depth ≤ 3.
- **FAIL:** depth ≥ 4.
- Required fix: guard clauses, early returns, or extract function.

---

## Early Returns

- **PASS:** invalid/edge cases return or throw at the top; happy path is de-indented.
- **FAIL:** “pyramid” nesting where the main logic sits inside 3+ levels of `if`.

```text
PASS:
if (!user) return;
// happy path

FAIL:
if (user) {
  if (user.active) {
    if (user.hasEmail) {
      // ...
    }
  }
}
```

---

## Boolean Parameters

- **FAIL:** boolean flag parameter that selects behavior (`generateReport(true)`).
- **PASS:** separate named functions or an options object with named fields.

```text
FAIL: generateReport(true)
PASS: generateDetailedReport() / generateSummaryReport()
```

Exception: a boolean that **is** domain data (e.g. `isActive` on an entity) and does not flip control paths inside the callee — still prefer named options when it selects algorithms.

---

## Comments

| Rule | Pass | Fail |
|------|------|------|
| Comments explain **why** | Legal, business, or non-obvious constraint documented | Restates the next line |
| No narrating comments | — | `// increment i` above `i++` |

```text
FAIL: // increment i
      i++;

PASS: // Required because invoices are numbered sequentially by law.
```

---

## Variables

### Naming

| PASS | FAIL |
|------|------|
| `customerEmail` | `tmp` |
| `invoiceTotal` | `data` |
| `createdAt` | `obj` |
| `expiresAt` | `x` / `value` / `abc` |

**FAIL:** single-letter names outside loop indices `i/j/k` or mathematical formulas; names `tmp`, `data`, `obj`, `val`, `value`, `item` without domain meaning.

### Scope

- **PASS:** declared at the innermost useful scope, immediately before first use.
- **FAIL:** declared at file/class top when used only inside one block, or long-lived mutable vars reused for unrelated purposes.

### Immutability

- **PASS:** locals that never reassign are `const` / `final` / equivalent.
- **FAIL:** mutable binding used when reassignment never occurs.

---

## Classes

### Single Responsibility

- **PASS:** one primary reason to change; PR description does not require two unrelated motivations for the same class.
- **FAIL:** class owns unrelated domains (e.g. `UserService` also sends invoices and writes analytics schemas).

### Class Size

| Metric | Recommended | Hard limit |
|--------|-------------|------------|
| Lines per class/file for a type | 100–300 | **500** |

- **PASS:** ≤ 500 lines.
- **FAIL:** > 500 lines without `EXCEPTION: class-size` in the PR.

### Public Method Count

| Metric | Hard limit |
|--------|------------|
| Public methods per class | **15** |

- **PASS:** ≤ 15 public methods.
- **FAIL:** ≥ 16 public methods — split by responsibility.

---

## Files

- **PASS:** one file → one primary type/responsibility; filename matches the primary type.
- **FAIL:** dump files named `Utils`, `Helpers`, `Common`, `Misc`, `SharedStuff` that accumulate unrelated functions.
- Before adding to an existing util file: **FAIL** if the file already mixes ≥ 3 unrelated domains.

---

## Complexity

| Metric | Hard limit |
|--------|------------|
| Cyclomatic complexity per function | **10** |

- **PASS:** ≤ 10.
- **FAIL:** ≥ 11 — extract branches or replace with polymorphism/strategy.
- **FAIL:** `switch` / long `if-else` chains with ≥ 6 domain variants when a strategy map or polymorphic type exists as a cleaner fit (document exception if exhaustive codegen switch is required).

---

## Magic Numbers

- **PASS:** numeric literals only for `0`, `1`, `-1`, and obvious loop increments; all other numbers are named constants.
- **FAIL:** `if (status == 7)` or bare timeouts/sizes/limits in code.

```text
FAIL: if (attempts > 5)
PASS: const MAX_LOGIN_ATTEMPTS = 5;
      if (attempts > MAX_LOGIN_ATTEMPTS)
```

---

## Strings

- **PASS:** user-facing or repeated string literals (≥ 2 occurrences) are named constants or i18n keys.
- **FAIL:** same literal duplicated in two or more places; magic role/status strings without constants/enums.

---

## Duplication

| Occurrences of same logic | Verdict |
|---------------------------|---------|
| 1 | PASS (no extract required) |
| 2 | PASS if extraction would create a wrong abstraction; otherwise prefer extract |
| **3+** | **FAIL** until extracted to one shared function/module |

**FAIL:** creating a second utility that duplicates an existing one (search the repo first).

---

## Exceptions

Every `catch` / equivalent error branch must do **at least one** of:

1. Recover
2. Retry (with policy)
3. Translate to a domain/application error
4. Rethrow (optionally wrapping with context)

| Verdict | Behavior |
|---------|----------|
| PASS | One of the four above |
| FAIL | Empty catch, catch-and-ignore, or catch that only logs and continues when the operation actually failed |

---

## Logging

| Rule | Pass | Fail |
|------|------|------|
| No print debugging | Uses project logger | `print` / `console.log` / `printf` left in production paths |
| Structured logging | Key-value / JSON fields | Unstructured string soup for new logs |
| No secrets | Redacted | Logs passwords, tokens, API keys, secrets |

---

## Dependencies & Imports

- **PASS:** no unused imports; no unused packages added.
- **FAIL:** unused imports in the diff; new external library when the standard library or existing dependency already covers it (justify in PR if added).

---

## Error Messages

- **PASS:** includes what failed + relevant ids/context (`User 123 not found while generating invoice`).
- **FAIL:** generic messages only (`Error occurred.`, `Something went wrong.`, `Failed.`).

---

## Formatting

- **PASS:** project formatter applied; no formatter violations in CI.
- **FAIL:** manual column-alignment wars; trailing whitespace; formatter not run.
- One blank line between logical sections; do not reformat unrelated code.

---

## Dead Code

**FAIL** if the diff introduces or leaves:

- Commented-out code blocks
- Unused methods
- Unused variables
- Unused imports

**PASS:** dead code deleted (git retains history).

---

## TODOs

Every `TODO` / `FIXME` must include **all three**:

1. Owner
2. Reason
3. Tracking issue

```text
PASS: TODO(hassan): Replace polling with WebSockets. Issue #124
FAIL: TODO: fix later
FAIL: TODO: improve this
```

---

## AI Rules (Hard Fail)

The AI / author must **never**:

- Invent APIs
- Invent classes as if they already exist
- Invent environment variables
- Invent database tables or columns

**PASS:** referenced symbols exist in the repo (or are added in the same change with migrations/specs).
**FAIL:** references to unverified APIs, files, tables, or env vars.

Always search/verify before using.

---

## Self-Review Gate (All Must Pass)

Before finishing, mark each item PASS/FAIL:

- [ ] Functions ≤ 30 lines (or documented exception)
- [ ] Meaningful function and variable names
- [ ] No 3× duplicate logic left unextracted
- [ ] No dead code
- [ ] No unused imports
- [ ] Exceptions handled (no swallow)
- [ ] Input validation present at boundaries touched
- [ ] Logging appropriate; no secrets
- [ ] Tests updated for behavior changes
- [ ] Docs/OpenAPI/migrations updated when contracts change
- [ ] No invented APIs/tables/env vars

**Merge rule:** any FAIL without an explicit PR exception ⇒ not done.
