# Database Checklist

Use before merging schema or query changes.

---

## Schema

- [ ] Table has a primary key
- [ ] `NOT NULL` / `CHECK` / `UNIQUE` constraints enforce real invariants
- [ ] Foreign keys declared with intentional `ON DELETE` behavior
- [ ] FK columns indexed on referencing tables
- [ ] Soft-delete uniques are partial when required
- [ ] `TIMESTAMPTZ` used for absolute times
- [ ] Money uses `NUMERIC` or integer minor units — not float
- [ ] Enums/lookups used instead of magic integers where appropriate

---

## Migrations

- [ ] Versioned migration added (no manual-only prod DDL)
- [ ] Expand/contract compatible with rolling deploys
- [ ] No unsafe rename/drop of columns still read by live code
- [ ] Long locks avoided (`CONCURRENTLY` where required and supported)
- [ ] Rollback or forward-fix plan documented
- [ ] Migration tested against empty DB and against a data-shaped sample when risky

---

## Queries

- [ ] No `SELECT *` in application SQL
- [ ] Explicit column lists for writes that need them
- [ ] List queries have `LIMIT` / cursor bounds
- [ ] Hot filters/joins considered for indexes
- [ ] `EXPLAIN (ANALYZE, BUFFERS)` reviewed for new heavy queries
- [ ] No functions on indexed columns that defeat index use in hot `WHERE`s
- [ ] N+1 eliminated in the calling code path

---

## Transactions & Concurrency

- [ ] Transactions kept short
- [ ] Isolation level intentional for contested resources
- [ ] Optimistic versioning or locks used where race-prone
- [ ] Consistent lock ordering to reduce deadlocks

---

## Multi-Tenancy & Security

- [ ] `tenant_id` (or equivalent) present and filtered everywhere needed
- [ ] No client-controlled table/column identifiers
- [ ] Parameterized queries only

---

## Operations

- [ ] Connection pool impact considered
- [ ] `statement_timeout` expectations respected for web requests
- [ ] Large backfills planned as batched jobs, not one giant transaction

---

## Final

- [ ] No invented tables/columns — all represented in migrations
- [ ] Self-review completed
