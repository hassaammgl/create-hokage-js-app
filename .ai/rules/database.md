# Database Rules

Primary focus: PostgreSQL. Apply the same principles to other relational stores unless the project documents exceptions. Pair with `backend.md` and `performance.md`.

---

## General Principles

- The database is the source of truth for durable business state (unless a designated store owns a specific dataset).
- Enforce integrity in the database with constraints — application checks are necessary but not sufficient.
- Every table has a primary key.
- Prefer explicit column lists in all queries — never `SELECT *` in application SQL.
- Every query that returns lists in production paths must have a bounded result set (`LIMIT` / cursor).

---

## PostgreSQL Specifics

- Use `TIMESTAMPTZ` for absolute timestamps, not `TIMESTAMP` without time zone.
- Use `TEXT` over `VARCHAR(n)` unless a hard business length constraint exists; enforce length with `CHECK` when needed.
- Prefer `BOOLEAN`, enums (`CREATE TYPE ... AS ENUM`) or lookup tables over magic integers.
- Use `JSONB` for genuinely schemaless attributes; do not use JSONB as an excuse to skip modeling core relational data.
- Partial indexes and expression indexes are preferred over indexing unused columns “just in case.”
- Enable constraints that match reality: `NOT NULL`, `UNIQUE`, `CHECK`, foreign keys.

---

## Primary Keys & UUID Strategy

| Strategy | When to use |
|----------|-------------|
| UUIDv7 / ULID / time-ordered UUID | Default for distributed IDs, friendly to B-tree locality |
| UUIDv4 | Acceptable when already standard in the project; be aware of index fragmentation |
| Bigserial / identity | Fine for internal-only tables and high-write single-node workloads |

Rules:

- Do not expose auto-increment IDs publicly if enumeration is a security concern — use opaque IDs.
- Generate IDs in the application or DB consistently per table; do not mix strategies randomly inside one aggregate.
- Store UUIDs in native `UUID` type, not `TEXT`, unless forced by legacy.

---

## Foreign Keys & Constraints

- Declare foreign keys for real relationships. `ON DELETE` must be explicit: `RESTRICT`/`NO ACTION` (default safe), `CASCADE` only when child rows must disappear with parent and that is intended.
- Index foreign key columns on the referencing table — PostgreSQL does not auto-index them.
- Use `UNIQUE` for natural business keys (email per tenant, SKU, etc.).
- Soft deletes (`deleted_at`): unique constraints must be partial (`WHERE deleted_at IS NULL`) when soft-deleted rows would otherwise conflict.

**Why:** Missing FKs allow orphan rows; missing FK indexes cause slow joins and locks.

---

## Normalization & Denormalization

- Start at 3NF for transactional data.
- Denormalize only with a measured reason (read performance, snapshot history) and document the sync mechanism (trigger, application write, materialized view refresh).
- Store money as integer minor units (`BIGINT` cents) or `NUMERIC` with explicit scale — never IEEE floats.
- Do not duplicate derived totals without defining which write path updates them.

---

## Indexing

- Index columns used in `WHERE`, `JOIN`, and high-cardinality `ORDER BY` that appear in hot queries.
- Composite indexes: leftmost prefix rule — design column order for actual query patterns.
- Do not create redundant indexes (e.g. `(a,b)` makes `(a)` often unnecessary).
- Avoid over-indexing write-heavy tables; each index slows inserts/updates.
- Use `EXPLAIN (ANALYZE, BUFFERS)` on slow queries before adding indexes.
- Partial indexes for filtered subsets (`WHERE status = 'active'`).
- Monitor unused indexes in production periodically and drop them via migration.

---

## Query Optimization

- Eliminate N+1 queries: batch loads, joins, or `WHERE id IN (...)` with known bounds.
- Select only needed columns for list endpoints.
- Avoid functions on indexed columns in `WHERE` (`WHERE DATE(created_at) = ...` prevents index use) — rewrite as range predicates.
- Prefer `EXISTS` over `COUNT(*) > 0` for existence checks.
- Beware of ORM lazy loading in request loops — see `performance.md`.
- Large updates/deletes: batch in chunks to avoid long locks and huge WAL spikes.

---

## Migrations

- All schema changes go through versioned migrations — never manual prod DDL as the only record.
- Migrations must be reviewable and runnable in CI.
- Prefer expand/contract for zero-downtime:
  1. Expand: add nullable column / new table / dual-write
  2. Migrate data
  3. Switch reads
  4. Contract: remove old column after verification
- Do not rename/remove columns in the same release that still has old code reading them.
- Avoid long `ACCESS EXCLUSIVE` locks during peak traffic; use techniques like `CREATE INDEX CONCURRENTLY` (with migration tool support) when required.
- Every migration has a tested rollback plan or forward-fix strategy documented when rollback is unsafe.
- Never invent tables or columns that are not created by migrations in the repo.

**Why:** Expand/contract prevents downtime and dual-version deploy failures.

---

## Transactions & Locking

- Keep transactions short.
- Access tables in a consistent order across code paths to reduce deadlocks.
- Use `SELECT ... FOR UPDATE` only when necessary; prefer `FOR UPDATE SKIP LOCKED` for work queues.
- Know isolation levels: `READ COMMITTED` (Postgres default) vs `REPEATABLE READ` vs `SERIALIZABLE` — choose consciously for inventory/ledger flows.
- Optimistic concurrency: version column / `updated_at` check on update (`UPDATE ... WHERE id = $1 AND version = $2`).

---

## Connection Pooling

- Use a pooler (app pool + PgBouncer/Managed pooler in production).
- Size pools relative to DB `max_connections` and number of app instances: `(instances × pool_size) ≪ max_connections`.
- Set statement/query timeouts at the DB or session level for web requests (e.g. `statement_timeout`).
- Do not hold connections during external HTTP calls.
- Serverless: prefer external pooler; avoid opening a new DB connection per invocation without pooling.

---

## Soft Deletes, Auditing, History

- Soft delete only when business requires revive/history; otherwise hard delete with FK rules.
- Audit tables for security-sensitive mutations: who, when, before/after or event type.
- Immutable ledger tables: append-only; corrections via reversing entries.

---

## Multi-Tenancy

- Every tenant-owned table includes `tenant_id` (or equivalent).
- Every query filters by tenant. Prefer row-level security (RLS) in Postgres when the threat model requires defense-in-depth.
- Unique constraints are scoped per tenant.

**Why:** Missing tenant filters are critical data-leak bugs.

---

## Backups & Safety

- Agents never run `DROP TABLE`, `TRUNCATE`, or mass `DELETE` against shared environments without explicit human approval.
- Destructive migrations require extra review and a backup verification note in the PR.
- Test migrations against a realistic dataset size when possible.

---

## Database Checklist (Inline)

- [ ] PK, needed FKs, and UNIQUE/CHECK constraints present
- [ ] FK columns indexed
- [ ] No `SELECT *` in app SQL
- [ ] List queries bounded
- [ ] Money not stored as float
- [ ] Timestamps use `TIMESTAMPTZ`
- [ ] Migration is expand/contract safe for prod deploys
- [ ] Hot queries considered for indexes; `EXPLAIN` for new heavy queries
- [ ] Tenant filters present when multi-tenant
- [ ] No invented tables/columns
