# React Standards

Measurable rules for React (and React + TypeScript). Apply **in addition to** `coding.md`, `typescript.md` (if TS), and `frontend.md`. Every rule is **PASS** or **FAIL**.

---

## Components

| # | Rule | Pass/Fail |
|---|------|-----------|
| R1 | Function components only in new code | FAIL: new class components (unless error boundary required and project lacks alternative) |
| R2 | One primary component per file | FAIL: multiple unrelated exported components in one file without project precedent |
| R3 | Component file ≤ 150 lines | FAIL: > 150 without extract or `EXCEPTION: component-size` |
| R4 | Name matches file | FAIL: `UserCard` in `helpers.tsx` |
| R5 | Props typed (TS) or PropTypes only if project requires | FAIL: untyped props in TS codebases |

---

## Hooks

| # | Rule | Pass/Fail |
|---|------|-----------|
| R6 | Hooks only at top level | FAIL: hooks in conditions/loops |
| R7 | Hook dependency arrays correct | FAIL: missing deps suppressed with eslint-disable without justification |
| R8 | Custom hooks named `useX` and encapsulate one concern | FAIL: `useData` that fetches, caches, and sends analytics |
| R9 | No `useEffect` for pure derived state | FAIL: effect that only sets state from props/state computable during render |
| R10 | Sync external systems in effects; cleanup subscriptions | FAIL: subscribe without unsubscribe |

```text
FAIL:
useEffect(() => setFullName(first + last), [first, last]);

PASS:
const fullName = `${first} ${last}`;
```

---

## State

| # | Rule | Pass/Fail |
|---|------|-----------|
| R11 | Local UI state stays local | FAIL: global store for ephemeral `isOpen` |
| R12 | Server state via project data library (Query/SWR/etc.) | FAIL: duplicate server cache in Redux/Zustand without reason |
| R13 | Do not store derived state | FAIL: state that is only a function of other state/props |
| R14 | Keys on lists: stable ids | FAIL: `key={index}` on reorderable/insertable lists |

---

## Rendering & Performance

| # | Rule | Pass/Fail |
|---|------|-----------|
| R15 | No state updates inside render | FAIL |
| R16 | Lists > 100 items: paginate or virtualize | FAIL: render 1000 DOM nodes without virtualization/pagination |
| R17 | `memo` / `useMemo` / `useCallback` only when measured or child cost is real | FAIL: wrapping every component/callback “just in case” |
| R18 | Heavy routes code-split | FAIL: bundling admin-only screens into main path when project already code-splits |

---

## Effects & Data Fetching

| # | Rule | Pass/Fail |
|---|------|-----------|
| R19 | Fetch in route loaders or dedicated hooks — not deep presentational leaves | FAIL: fetch inside pure UI leaf |
| R20 | Handle loading / empty / error | FAIL: missing any of the three for user-facing fetches |
| R21 | Abort or ignore stale responses | FAIL: setState after unmount / race without guard |
| R22 | No fetch waterfalls when parallel is possible | FAIL: sequential awaits that could be `Promise.all` without dependency |

---

## Forms & Events

| # | Rule | Pass/Fail |
|---|------|-----------|
| R23 | Prevent double submit | FAIL: button stays active while in-flight with duplicate POSTs possible |
| R24 | Labels associated with inputs | FAIL: placeholder-only inputs |
| R25 | Handler names: `onX` props / `handleX` locals per project | FAIL: vague `click()` |

---

## Security (React)

| # | Rule | Pass/Fail |
|---|------|-----------|
| R26 | No `dangerouslySetInnerHTML` with unsanitized user content | FAIL |
| R27 | Sanitize with allowlist library if HTML required | FAIL: manual regex sanitize |
| R28 | No secrets in client bundle | FAIL: API secrets in `REACT_APP_*` / `VITE_*` |

---

## Accessibility

| # | Rule | Pass/Fail |
|---|------|-----------|
| R29 | Interactive elements are `button`/`a` (not clickable `div`) | FAIL: `div onClick` without role/keyboard |
| R30 | Icon-only buttons have aria-label | FAIL: unlabeled |
| R31 | Modals trap focus and restore on close | FAIL: focus lost |

---

## Testing (React)

| # | Rule | Pass/Fail |
|---|------|-----------|
| R32 | Prefer Testing Library queries (`getByRole`, `getByLabelText`) | FAIL: brittle CSS-class selectors as primary |
| R33 | Assert behavior, not implementation details | FAIL: asserting internal state hooks directly |
| R34 | No committed `.only` / `.skip` | FAIL |

---

## Self-Review Gate

- [ ] Component ≤ 150 lines or exception documented
- [ ] Hooks rules satisfied; no derived-state effects
- [ ] Loading/empty/error handled
- [ ] No unsafe HTML
- [ ] Lists keyed correctly; large lists bounded
- [ ] A11y basics pass
- [ ] Tests assert user behavior
