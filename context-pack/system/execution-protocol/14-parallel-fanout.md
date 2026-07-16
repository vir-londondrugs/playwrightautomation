> **Execution Protocol section file — §14 Parallel Fan-Out.** Routing + universal sections (§2, §10.5, §11) live in [`execution-protocol.md`](../execution-protocol.md). § numbering is preserved.

## 14. Parallel Fan-Out

**Purpose.** When a skill's work decomposes into **N independent units of the same shape** — judge samples for one checklist item, per-file review findings, per-story test generation, per-story implementation, files in a diff, decisions in a plan, logs to analyze — those units MAY be **dispatched to parallel workers** instead of processed one at a time inline. A coordinator (the main agent) shards the work, dispatches one bounded unit per worker, then performs the only serial writes: merging worker results, updating the shared trackers, running the aggregation, and emitting the §11 sidecar last. This is the **write-capable** sibling of §12 (which is read-only exploration): §12 workers only read and report; §14 workers may also produce bounded per-unit output within their scope.

**Why it helps.** Independent units have no carry-forward between them, so serial processing is latency the work does not require. Fanning them out collapses wall-clock from *sum-of-units* toward *slowest-single-unit*, and keeps each worker's context bounded to its one unit (the same context-hygiene goal as §5 / §12). The coordinator's context stays lean for the merge + aggregation it alone is accountable for.

**Applicability.** Any skill whose route includes §14 **and** that has declared a genuinely independent unit set (see §14.1). This section is **capability-gated and harness-agnostic**, exactly like §12: it applies *only if the running harness exposes a write-capable worker / task-spawn capability*. The runtime advertises this on one line in the Stepwise runtime-rules block:

- `Parallel delegation: AVAILABLE — …` → you MAY fan out per §14.
- `Parallel delegation: UNAVAILABLE — …` → use the §14.5 inline fallback.

**Never name a specific tool, agent, or model ID in a skill** — describe the capability and let each harness bind it. If the advertisement is absent or says UNAVAILABLE, follow §14.5 and change nothing else.

**Relationship to §12.** §12 = read-only exploration (workers return conclusions + `file:line`, never write). §14 = write-capable fan-out (workers may produce their one unit's bounded output). A skill can use both: §12 to locate the units, §14 to process them. Both share the Zero-Invention verify-before-use duty (§14.4).

---

### 14.1 When to fan out (and when not)

**Fan out when** all of these hold:
- The units are the **same shape** and **independent** — processing unit A does not depend on the result of unit B. **Independence must be declared, not assumed** (the skill states *why* the units share no carry-forward; see engineering-skills P11).
- There are enough units that parallelism pays for the coordination overhead (typically ≥ 3).
- Each unit's output is **bounded and mergeable** by a coordinator rule (mean, concat+dedupe, per-file section, per-story file).

**Do NOT fan out:**
- **Section-shape generation with real carry-forward** (§10). Sections that reference each other are sequential by default; only a skill's declared `independent_sections` whitelist (§10) may be parallelized, each worker editing its own pre-created stub.
- The **merge, aggregation, ranking, or verdict** — that is the coordinator's serial, accountable work (§14.3). Never let a worker decide the deliverable.
- Work that **mutates a shared file** (the canonical `_progress.json`, `00-index.md`, the carry-forward index, the §11 sidecar). Those are single-writer, coordinator-only (§14.2).
- Cases where units are **few or actually dependent** — just loop inline; the fan-out round-trip adds latency for no gain.

The **execution-path / scope constraint each skill already enforces still applies** to every worker. Fanning out does not grant a worker unrestricted repo access — pass it the same bounded scope the main agent would have used.

---

### 14.2 Worker contract

Each worker receives **one bounded unit** and the same scope constraint, and returns a **compact structured result** (the per-unit finding / score / file path / decision — not a narrative, not a file dump). Workers are **forbidden** from:

- Writing the canonical `_progress.json`, `00-index.md`, or the carry-forward index (single-writer, coordinator-only).
- Emitting the §11 harness output sidecar (exactly one sidecar per run, written last by the coordinator).
- Making a judgment the skill is accountable for (the verdict, the ranking, the final merge) — workers produce facts/units, the coordinator decides.

A worker MAY write **its own unit's bounded output** within scope (e.g. one story's test file, one section's stub body, one file's REVIEW fragment) and MAY write a **progress shard** (§14.2.1). Everything else is the coordinator's.

#### 14.2.1 Sharded progress

Workers may write `_progress.<worker-id>.json` shards (never the canonical `_progress.json`). The coordinator merges every shard into the canonical `_progress.json` as part of its serial write pass. On **cancel / CONTINUE re-entry**, the coordinator treats a unit with no shard result (or an incomplete shard) as **pending** and re-dispatches only those — the canonical `_progress.json` remains the single source of truth for what is done (§2 / §10.6).

---

### 14.3 Coordinator contract

The coordinator is the main agent. It performs, in order:

1. **Shard** — enumerate the independent units and their bounded inputs (declare the unit set; §14.1).
2. **Dispatch** — hand each worker one unit + the scope constraint + the compact return schema.
3. **Collect + verify** — gather worker results; re-verify any `file:line` or asserted fact before it enters the deliverable (§14.4).
4. **Merge (serial, coordinator-only)** — apply the declared **merge contract**: mean-of-N for judge samples, concat + dedupe for per-file findings, per-story files into the tree, per-section stubs into the spec. Apply any bias rules (e.g. bias-toward-FAILED, anti-gaming) here — never in a worker.
5. **Update trackers** — merge progress shards into the canonical `_progress.json`, update `00-index.md` / carry-forward index.
6. **Emit the §11 sidecar last** — exactly one, after all merges (§11.4 ordering is unchanged).

The merge contract is **declared by the skill** (engineering-skills P11) so the aggregation is auditable and identical whether the units ran in parallel or inline.

---

### 14.4 Verify before use

Worker output is **input, not ground truth** — identical to §12.4. The **Zero-Invention Policy governs the coordinator's deliverable**: before a worker's `file:line`, fact, or unit result enters the merged output, the coordinator confirms it (open it / re-check it). A worker hallucination that flows unverified into the deliverable is still an invention by the skill.

---

### 14.5 Fallback — no delegation capability

If the runtime advertises `Parallel delegation: UNAVAILABLE` (or no advertisement is present), the skill processes the **same unit set inline, in declared order**, exactly as before this section existed. §14 is **never a requirement and never changes the deliverable**: the output MUST be identical whether the units ran in parallel or in the inline loop. Do not block, warn, or degrade when the capability is absent — just loop.

---

### 14.6 Skill-Level Enforcement

Each SKILL.md routed to §14 includes a short callout at the step that owns the unit loop, pointing here. Recommended callout shape:

> **During <the unit-loop step> — apply execution-protocol.md Section 14 (Parallel Fan-Out) if your harness advertises it.**
>
> Independent units for this skill: <one or two skill-specific examples: "each JUDGE item's N samples", "each changed file's findings", "each Independent story">. Independence: <one line on why the units share no carry-forward>. Merge contract (coordinator, serial): <mean-of-N / concat+dedupe / per-file section / per-story file>. Workers return compact results only and never write `_progress.json`, `00-index.md`, or the §11 sidecar. If delegation is UNAVAILABLE, run the same units inline in declared order — output is identical either way. Verify any worker `file:line` before use (Zero-Invention, §14.4).

The callout is intentionally short. The when/when-not rules, worker + coordinator contracts, sharded progress, verify duty, and fallback all live in Section 14 — the SKILL.md only names the skill-specific unit, independence proof, and merge contract.

---
