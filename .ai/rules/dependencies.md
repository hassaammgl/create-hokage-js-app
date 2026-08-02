# Dependency Rules

Rules for adding, updating, and removing third-party packages.

---

## Before Adding a Dependency

Answer all of the following:

1. Does the standard library or an **existing** project dependency already solve this?
2. Is the need recurring (not a one-off 15-line helper)?
3. Is the package actively maintained (recent commits/releases, responsive to CVEs)?
4. What is the license, and is it compatible with this project’s distribution model?
5. How large is the transitive dependency tree and install/runtime cost?
6. Does it require network permission, native binaries, or broad OS access?

If any answer is unsatisfactory, do not add it — implement the minimal code instead.

**Why:** Every dependency is supply-chain risk, upgrade burden, and attack surface.

---

## Adding Packages

- Use the project’s package manager only (`npm`/`pnpm`/`yarn`, `pip`/`poetry`/`uv`, `go get`, `cargo`, etc.).
- Pin versions according to project convention (lockfile committed).
- Add to the correct dependency class: runtime vs dev vs peer.
- Update lockfiles in the same PR.
- Document non-obvious why in the PR description for controversial additions.
- Prefer official SDKs over obscure wrappers for cloud/payment providers.

---

## Version Pinning

- Lockfiles are mandatory for applications.
- Libraries may use ranges carefully; applications should build from lockfiles in CI.
- Avoid `latest` tags in Docker base images for production — pin digests or minor versions.
- Dependabot/Renovate PRs: review changelogs; do not bulk-merge major upgrades without testing.

---

## Upgrades

- Read breaking changes for major bumps.
- Run the test suite and smoke critical paths.
- Upgrade one concern per PR when risk is high (e.g. framework major alone).
- After security advisories: patch promptly; prioritize critical/high CVEs on internet-facing services.

---

## Removals

- Remove unused dependencies in dedicated chores when found.
- Grep for imports before removing.
- Delete dead config related to the package.

---

## Security

- Run audit tooling in CI (`npm audit`, `pip-audit`, `cargo audit`, `govulncheck`, Snyk/OSV as configured).
- Do not add packages with unresolved critical vulnerabilities.
- Prefer packages with signed releases / verified publishers when available.
- Avoid `postinstall` scripts from untrusted packages; investigate install scripts on new deps.

---

## Vendoring & Copying

- Prefer package manager over copying source into `vendor/` unless the project already vendors for a reason (airgap, patching).
- If copying code, retain license headers and document provenance.

---

## Internal Packages

- Shared internal libraries need semantic versioning and changelogs.
- Do not import unpublished random paths from other services’ internals — use published APIs.

---

## Agent Constraints

- Never invent package names that are not real / not already in the lockfile without verifying registry existence.
- Do not upgrade unrelated packages while implementing a feature.
- Do not commit credentials for private registries; use existing auth mechanisms.

---

## Dependency Checklist (Inline)

- [ ] Necessity justified; no existing alternative
- [ ] License OK; maintenance OK
- [ ] Lockfile updated
- [ ] Correct dep class (prod/dev)
- [ ] Audit clean of critical issues
- [ ] No unrelated upgrades mixed in
