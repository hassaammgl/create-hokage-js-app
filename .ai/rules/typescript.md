# TypeScript Standards

Measurable rules for TypeScript. Apply **in addition to** `coding.md`. Every rule is **PASS** or **FAIL**.

---

## Compiler Strictness

| # | Rule | Pass | Fail |
|---|------|------|------|
| T1 | `strict` mode enabled in project | `strict: true` (or equivalent flags all on) | Loosening strict flags in the PR without approval |
| T2 | No `any` in new/changed code | Types are explicit or inferred safely | New `any`, `as any`, or untyped params |
| T3 | No silent `as` casts to unblock compile | Casts rare and justified in comment | `as UnknownType` to hide errors |
| T4 | `unknown` for external input before narrowing | Validate then narrow | Trusting JSON as typed object without guard |

**Exception:** `any` allowed only with `EXCEPTION: any` in PR + tracking issue.

---

## Types & Interfaces

| # | Rule | Pass/Fail |
|---|------|-----------|
| T5 | Shared shapes are `type` or `interface` in a types module or colocated file | FAIL: repeated inline object types copied 3+ times |
| T6 | Prefer discriminated unions over optional flag soup | FAIL: `type: string` + 8 optional fields when variants are known |
| T7 | Enums: prefer union of string literals unless project standard is `enum` | FAIL: numeric enums for API contracts |
| T8 | Public function params/returns typed at boundaries | FAIL: exported function with implicit `any` |

---

## Nullish Handling

| # | Rule | Pass/Fail |
|---|------|-----------|
| T9 | Prefer `??` over `\|\|` for nullish defaults | FAIL: `\|\|` when `0`/`""` are valid |
| T10 | No unchecked deep optional chains as control flow | FAIL: `a?.b?.c?.d?.e` without handling missing path |
| T11 | Non-null assertion `!` banned in app code | FAIL: `user!.id` without prior guard (tests may use sparingly) |

---

## Async

| # | Rule | Pass/Fail |
|---|------|-----------|
| T12 | No floating promises | PASS: `await`, `return`, or void-with-explicit handling; FAIL: bare `asyncCall()` |
| T13 | Use `AbortSignal` for cancellable I/O when API supports it | FAIL: ignoring cancellation on new long requests in UI/server |
| T14 | `try/catch` translates errors at boundaries | Per `coding.md` — no empty catch |

---

## Modules & Imports

| # | Rule | Pass/Fail |
|---|------|-----------|
| T15 | No unused imports | FAIL if ESLint/`tsc` unused reports in diff |
| T16 | Prefer named exports for app modules | Match repo; FAIL: default + named mix chaos in one folder |
| T17 | No circular imports in changed modules | FAIL: A↔B import cycle introduced |
| T18 | Path aliases match existing tsconfig | FAIL: inventing new alias style in one file |

---

## Functions & Objects

| # | Rule | Pass/Fail |
|---|------|-----------|
| T19 | Function length ≤ 30 lines | Per `coding.md` |
| T20 | Max 4 parameters; else options object | Per `coding.md` |
| T21 | Options objects use named fields | FAIL: boolean positional flags |
| T22 | `readonly` for data that must not mutate | FAIL: mutating args that are conceptually immutable inputs |

---

## Errors

| # | Rule | Pass/Fail |
|---|------|-----------|
| T23 | Throw `Error` subclasses (or project Result type) with messages | FAIL: `throw "string"` |
| T24 | Narrow `unknown` in catch | FAIL: `catch (e)` used as `any` without narrowing |
| T25 | Error messages actionable | Per `coding.md` |

---

## Logging & Debug

| # | Rule | Pass/Fail |
|---|------|-----------|
| T26 | No `console.log` in production paths | FAIL if left in committed app code |
| T27 | Use project logger | PASS |

---

## Testing (TypeScript)

| # | Rule | Pass/Fail |
|---|------|-----------|
| T28 | New logic has unit tests where pure | FAIL: untested branching business rules |
| T29 | No `.only` / `.skip` committed | FAIL |

---

## Self-Review Gate

- [ ] No new `any` / `as any` / non-null `!`
- [ ] External data validated before use
- [ ] No floating promises
- [ ] Unused imports removed
- [ ] Errors typed and messages actionable
- [ ] No `console.log` in prod paths
- [ ] Tests updated
