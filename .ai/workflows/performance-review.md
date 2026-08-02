# Workflow: Performance Review

Procedure for reviewing or improving performance characteristics of a change or hotspot.

---

## When to Run

- New list/search/report endpoints
- Changes to hot-path queries or serializers
- Caching introduced/changed
- User reports slowness / SLO burn
- Large batch jobs added

---

## Step 1 — Define the Budget

State the target:

- API p95 latency budget
- Throughput (RPS) expectation
- Payload size limits
- Memory ceiling for workers
- Frontend: LCP/INP budgets if applicable

Without a budget, “faster” is undefined.

---

## Step 2 — Measure

Gather evidence:

- APM traces / flame graphs
- DB `EXPLAIN (ANALYZE, BUFFERS)`
- Query counts per request
- Allocation profiles when memory-bound
- Realistically sized data (prod-like volume)

Do not optimize based on guesses alone.

---

## Step 3 — Identify Dominant Cost

Classify the top cost:

| Class | Typical fix |
|-------|-------------|
| Too many queries (N+1) | Batch / join / dataloader |
| Slow query | Index, rewrite, denormalize carefully |
| Overfetching | Select fewer columns; paginate |
| External dependency latency | Timeout, parallelize, cache, async |
| CPU serialization / templates | Cache, simplify payload, streaming |
| Lock contention | Shorter transactions, queue, optimistic concurrency |
| Unbounded work in request | Move to async job |

Fix the top consumer first.

---

## Step 4 — Apply Fix Safely

- Prefer simpler fixes (index, limit) over new caches.
- Every cache needs TTL + invalidation/key design + tenant isolation.
- Every external call retains timeout + resilience policy.
- Validate correctness with tests; performance work that changes results is a bug.

---

## Step 5 — Re-measure

- Compare p50/p95 and query counts before/after
- Watch error rates — timeouts may increase if you tighten budgets incorrectly
- Document results in the PR

---

## Performance Review Checklist

- [ ] Budget stated
- [ ] Measurement attached (EXPLAIN, trace screenshot/numbers)
- [ ] No N+1
- [ ] Result sets bounded
- [ ] Indexes justified (not speculative shotgun indexing)
- [ ] Cache correctness reviewed (if any)
- [ ] Timeouts/bulkheads present
- [ ] No large sync work left on request thread without justification
- [ ] Regression risk assessed

---

## Red Flags in PRs

- `findAll()` without pagination
- Queries inside loops
- Remote calls inside DB transactions
- Cache keys missing tenant/user
- Loading full ORM graphs to compute one field
- `SELECT *` on wide tables for lists

---

## Output Template

```markdown
## Performance Review
- Budget: ...
- Before: ...
- Bottleneck: ...
- Change: ...
- After: ...
- Residual risk: ...
```
