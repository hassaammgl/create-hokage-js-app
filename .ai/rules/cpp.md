# C++ Standards

Measurable rules for C++ (C++17/20 as used by the project). Apply **in addition to** `coding.md`. Every rule is **PASS** or **FAIL**.

---

## Language & Build

| # | Rule | Pass/Fail |
|---|------|-----------|
| C1 | Match the project's C++ standard (`CMAKE_CXX_STANDARD` / flags) | FAIL: using newer standard features than the build allows |
| C2 | Warnings treated per project policy | FAIL: introducing new warnings on touched files when `-Werror` or CI gate exists |
| C3 | No undefined behavior introduced knowingly | FAIL: signed overflow tricks, dangling refs, invalidated iterators |

---

## Memory & Ownership

| # | Rule | Pass/Fail |
|---|------|-----------|
| C4 | Prefer RAII; every resource has an owning type | FAIL: raw `new`/`delete` without owner in new code |
| C5 | Prefer `std::unique_ptr` for exclusive ownership | FAIL: owning raw pointer members in new types |
| C6 | Use `std::shared_ptr` only when shared ownership is real | FAIL: `shared_ptr` for convenience everywhere |
| C7 | No ownership transfer via raw pointers in public APIs | PASS: references, span, string_view (non-owning), or smart pointers |
| C8 | `std::string_view` / spans must not outlive their source | FAIL: returning `string_view` to temporaries |

```text
FAIL: Foo* create(); // caller must delete
PASS: std::unique_ptr<Foo> create();
```

---

## Classes & Special Members

| # | Rule | Pass/Fail |
|---|------|-----------|
| C9 | Follow rule of 0/3/5 | FAIL: custom destructor without matching copy/move handling |
| C10 | Prefer `=default` / `=delete` explicitly | FAIL: surprising copy of heavy/resource types left public unintentionally |
| C11 | Public method count ≤ 15 | Per `coding.md` |
| C12 | Class/file size ≤ 500 lines | Per `coding.md` |

---

## Functions

| # | Rule | Pass/Fail |
|---|------|-----------|
| C13 | Function body ≤ 30 lines | Per `coding.md` |
| C14 | Max 4 parameters; else param struct | Per `coding.md` |
| C15 | Nesting depth ≤ 3 | Per `coding.md` |
| C16 | Pass large objects as `const T&` or by view | FAIL: pass-by-value of large containers without intent to move |
| C17 | Use `[[nodiscard]]` on error-prone return values | FAIL: ignoring status codes from functions marked nodiscard |

---

## Const Correctness

| # | Rule | Pass/Fail |
|---|------|-----------|
| C18 | Mark methods `const` when they do not mutate observable state | FAIL: non-const getters that could be const |
| C19 | Prefer `constexpr` for compile-time known values | — |
| C20 | Locals `const` when never reassigned | Per `coding.md` immutability |

---

## Error Handling

| # | Rule | Pass/Fail |
|---|------|-----------|
| C21 | Use project strategy consistently (exceptions **or** `std::expected`/error codes) | FAIL: mixing throw and error codes in the same module without boundary |
| C22 | Never catch `(...)` and ignore | FAIL: empty catch-all |
| C23 | No `assert` as production input validation | FAIL: `assert(userInputValid)` as sole check |

---

## Headers & Includes

| # | Rule | Pass/Fail |
|---|------|-----------|
| C24 | Include guards or `#pragma once` on every header | FAIL: missing |
| C25 | Include what you use; remove unused includes | FAIL: dead includes in diff |
| C26 | No `using namespace std;` in headers | FAIL |
| C27 | Forward declare when sufficient in headers | FAIL: heavy includes pulled only for pointers/refs when fwd decl works |

---

## Concurrency

| # | Rule | Pass/Fail |
|---|------|-----------|
| C28 | Shared mutable state guarded | FAIL: data race introduced |
| C29 | Prefer standard `std::mutex` / atomics over home-rolled | — |
| C30 | No blocking locks held across I/O without documented need | FAIL: lock + network in same critical section in new code |

---

## Safety Ban List (Always Fail in New Code)

- `gets`, `strcpy`, `sprintf` (use bounded/`std::string` APIs)
- Unchecked C arrays decaying in public APIs when `std::array`/`span` is available
- VLAs (non-standard)

---

## Naming (C++)

| Kind | Convention | Fail |
|------|------------|------|
| Types | `PascalCase` or project style | Mixing styles in one module |
| Functions/vars | `snake_case` or `camelCase` per project | Mixing in one TU without reason |
| Macros | `SCREAMING_SNAKE` | Function-like macros when templates/inline work |

Follow the **existing** codebase casing; do not invent a third style.

---

## Self-Review Gate

- [ ] RAII / smart pointers; no new owning raw `new`/`delete`
- [ ] Const correctness applied
- [ ] Functions ≤ 30 lines; nesting ≤ 3
- [ ] Error strategy consistent
- [ ] No banned C APIs
- [ ] Headers clean (IWYU, no `using namespace std`)
- [ ] No data races introduced
- [ ] Tests/build warnings clean for touched targets
