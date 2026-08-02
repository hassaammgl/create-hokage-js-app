# Frontend Checklist

Use before merging UI changes.

---

## UX States

- [ ] Loading state implemented
- [ ] Empty state implemented
- [ ] Error state implemented with actionable message
- [ ] Success feedback where users need confirmation

---

## Forms & Actions

- [ ] Client validation for UX; server remains source of truth
- [ ] Submit disabled while in-flight; double-submit prevented
- [ ] Server field errors mapped to inputs
- [ ] Destructive actions require confirmation when appropriate

---

## Data & API

- [ ] Uses existing API client/endpoints only (no invented contracts)
- [ ] Types match OpenAPI/shared schemas
- [ ] Stale requests aborted/ignored
- [ ] `401` / `429` handled per app patterns
- [ ] Server state not duplicated incorrectly in global store

---

## Security

- [ ] No unsanitized HTML injection
- [ ] Tokens not stored unsafely unless explicitly required and mitigated
- [ ] Redirect URLs allowlisted when used
- [ ] No secrets in frontend env bundles

---

## Accessibility

- [ ] Interactive elements reachable by keyboard
- [ ] Form controls have labels
- [ ] Images have appropriate `alt`
- [ ] Focus visible; modals trap focus and restore it
- [ ] Semantic HTML used before ARIA

---

## Performance

- [ ] Heavy routes code-split when appropriate
- [ ] Large lists paginated or virtualized
- [ ] Images sized/lazy-loaded appropriately
- [ ] No unnecessary re-render storms introduced

---

## Visual & Consistency

- [ ] Matches existing design system / styling approach
- [ ] Responsive on mobile and desktop viewports
- [ ] `prefers-reduced-motion` respected for non-essential motion

---

## Tests

- [ ] Component/hook tests for non-trivial logic
- [ ] E2E updated for critical flow changes
- [ ] No focused/skipped tests committed

---

## Final

- [ ] Self-review completed
- [ ] Screenshots or recording attached for visual changes when useful
- [ ] Diff free of unrelated churn
