# Frontend Rules

Rules for UI applications (web and similar client runtimes). Pair with `api.md`, `security.md`, and `performance.md`. Match the repository’s framework conventions (React, Vue, Svelte, etc.) when they are stricter or more specific.

---

## Component Structure

- One component = one primary responsibility (display a section, collect a form, orchestrate a view).
- Presentational components receive data/callbacks via props; they do not fetch on their own unless they are documented route-level containers.
- Keep components under ~150 lines; extract subcomponents or hooks when JSX or state grows.
- Colocate component, styles, and tests when the project uses colocation.
- Do not build generic “god” components with 15 boolean props — split variants.

---

## State Management

- Prefer local state for UI-only concerns (open/closed, input drafts).
- Lift state only when multiple siblings need it.
- Server state (remote data) uses the project’s data library (React Query, SWR, RTK Query, etc.) — do not duplicate cache in global stores.
- Global stores hold cross-route client state only (auth session mirror, theme, wizard progress).
- Never store secrets (API keys, raw refresh tokens) in `localStorage` unless the security model explicitly requires it and XSS mitigations are in place; prefer httpOnly cookies for session tokens when the stack allows.

**Why:** Duplicated server cache causes inconsistent UI and extra refetches.

---

## Data Fetching

- Fetch in route loaders or dedicated hooks — not in deeply nested presentational components.
- Handle loading, empty, error, and success states explicitly.
- Cancel or ignore stale responses on unmount / dependency change (AbortController or library defaults).
- Do not fetch in tight render loops; stabilize dependencies.
- Deduplicate identical in-flight requests via the data library.

---

## Forms

- Validate on the client for UX; never rely on client validation for security — server validates again.
- Disable submit while in-flight; prevent double submit.
- Show field-level errors from API `400` payloads mapped to inputs.
- Do not put passwords into URL query strings or uncontrolled analytics events.
- Preserve user input on recoverable errors.

---

## Routing

- Route definitions are the source of truth for navigation entry points.
- Protect authenticated routes with a single auth gate pattern used project-wide.
- 404 and error boundaries at layout level; do not crash the entire app on one panel failure.
- Do not put PII in path/query if avoidable; prefer IDs.

---

## Styling

- Follow the project’s styling system (CSS modules, Tailwind tokens, design system components).
- Do not introduce a second styling approach in a PR without an ADR.
- Use design tokens / CSS variables for colors and spacing; avoid hard-coding one-off hex values that duplicate tokens.
- Ensure interactive elements meet contrast and hit-target guidelines (min ~44×44px on touch UIs).
- Respect `prefers-reduced-motion` for non-essential animation.

---

## Accessibility

- All interactive elements are keyboard reachable.
- Images that convey meaning have `alt` text; decorative images have empty `alt`.
- Form inputs have associated labels (not placeholder-only).
- Do not remove focus outlines without providing a visible alternative.
- Modals: focus trap, `Escape` closes, restore focus on close.
- Use semantic HTML (`button`, `a`, `nav`, `main`) before ARIA. If using ARIA, match the required patterns.

**Why:** Accessibility bugs are product bugs and legal risk; they also improve keyboard power-user UX.

---

## Security (UI)

- Escape/encode output per framework defaults; do not use `dangerouslySetInnerHTML` / `v-html` / `innerHTML` with unsanitized user content.
- If HTML rendering is required, sanitize with a vetted library and an allowlist.
- Do not store sensitive tokens in places readable by JS if httpOnly cookies are available.
- Open redirects: validate return URLs against an allowlist.
- CSRF: for cookie-based sessions, send CSRF tokens on state-changing requests as required by the backend.

---

## Performance (UI)

- Avoid loading large libraries on every route; code-split heavy pages.
- Lists over ~100 items: virtualize or paginate.
- Images: appropriate size, modern formats, width/height to reduce CLS; lazy-load below-fold.
- Memoization (`memo`, `useMemo`, `useCallback`): only when measured or when passing unstable callbacks causes real child re-render cost — do not spray memo everywhere.
- Prefer CSS transitions for simple UI motion over JS animation loops.

---

## API Integration

- Call only documented API endpoints that exist in OpenAPI/repo clients — never invent paths or payloads.
- Use shared API client with base URL, auth header injection, and error mapping.
- Type response payloads from generated clients or shared schemas.
- Handle `401` by triggering the project’s session-expiry flow once (no retry storms).
- Handle `429` with backoff / user messaging.

---

## Errors & Observability

- User-facing errors are actionable (“Session expired — sign in again”), not raw stack traces.
- Report unexpected errors to the project’s client error tracker with release version and correlation id when available.
- Do not log PII to console in production builds.

---

## Testing (UI)

- Unit-test pure logic and complex hooks.
- Component tests assert behavior (user events), not implementation details (internal state).
- Critical flows (auth, checkout, permissions) get E2E coverage — see `testing.md`.
- Use Testing Library-style queries (`getByRole`, `getByLabelText`) over test IDs when possible.

---

## Frontend Checklist (Inline)

- [ ] Loading/empty/error states handled
- [ ] No unsanitized HTML injection
- [ ] Forms prevent double submit; server errors mapped
- [ ] Auth gates consistent; no secret tokens in unsafe storage without justification
- [ ] Accessibility basics: labels, keyboard, focus
- [ ] No invented API contracts
- [ ] Heavy routes code-split; large lists paginated/virtualized
- [ ] Matches existing styling system
