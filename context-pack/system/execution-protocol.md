# Execution Protocol — Agent Runtime Standards

## Purpose

ROUTING: This file is self-routing. Read only the sections your skill needs,
in the order given by the routing rule below — do not preload the whole file.
Each skill discovers its sections from that rule, then reads each lazily as it
becomes relevant. Sections not selected for your skill are not required.

This file defines how agent sessions manage identity, state, context limits,
recovery, section-by-section generation, and the harness output sidecar
contract. All code-development and synthesize skills follow these patterns;
the routing rule below tells you which sections apply to yours.

---

## Skill → Required Sections (routing rule)

Skills self-route. Each SKILL.md declares its own **generation shape** inline
(`section-shape` = one multi-section spec; `list-shape` = many discrete files;
`hybrid` = section-shape manifest + list-shape per-item files) and references the
exact sections it applies at each step (`apply §10.2`, `§11`, …). Route by shape,
then layer on the role-based sections. Read in the listed order.

**Base route by shape:**
- **section-shape / hybrid** → §2 → §10 → §10.5 → §11
- **list-shape** → §2 → §10.5 → §11 — produces many files, so §10 (section generation) does not apply.

**Additive sections (layer onto the base route, in position):**
- **§1 (Session Identity)** — prepend for the code-development family, which mints/reuses a SESSION_ID in output filenames: `researching-code-design`, `planning-code-tasks`, `implementing-code`, `reviewing-code`, `fixing-bugs`, `automation-code-generation`, `automation-test-execution`.
- **§12 (Delegated Exploration)** — insert right after §2 for skills that do broad read-only input sweeps: every `researching-*` skill, plus `reviewing-code`, `planning-code-tasks`, `fixing-bugs`, and `producing-abap-archaeology` (phases 1/2/4 sweep ABAP source exports). Capability-gated and optional (see §12).
- **§13 (Code-Location Discipline)** — apply at the orientation / input-loading step for skills that locate code: every `researching-*` skill, plus `planning-code-tasks`, `implementing-code`, `reviewing-code`, `fixing-bugs`, `conducting-excursion`, and the quick-lane `defining-quick-story` + `implementing-quick-change`. Read `codebase-map.md` before any repository-wide discovery scan (consult-before-scan, not never-scan; see §13). Composes with §12 — map first, then delegate the residual sweep.
- **§14 (Parallel Fan-Out)** — insert at the step that owns a same-shape independent-unit loop, for skills that declare an independent unit set: `verifying-artifacts` (JUDGE-item samples), `reviewing-code` (per changed file / diff-hunk group), `generating-test-cases` + `generating-e2e-test-cases` (per epic — one suite file each), `implementing-user-stories` (per epic — one story-definition file each), `adversarial-platform-review` (per decision), `validating-architecture-compliance` (per story — compute-parallel/write-serial: workers evaluate, coordinator writes the single COMPLIANCE-SPEC), `generate-context-pack` (per normative context-pack file), `analyze-context-pack-inputs` (per input file — read-only extraction, coordinator synthesizes), `db-source-profiling` (per source table — profile one table each; coordinator concats into the catalog), `db-parity-execution` (per table source↔target diff — the pass/fail verdict stays coordinator-serial; cap connection concurrency), and the quick-lane `defining-quick-story` (per raw request in a batch intake — each request normalized into its own QUICK-STORY-SPEC with zero cross-request carry-forward; coordinator merges progress shards and emits the `stories[]` sidecar list serially). Capability-gated and optional — the runtime advertises `Parallel delegation: AVAILABLE/UNAVAILABLE`; on UNAVAILABLE, run the same units inline in declared order (see §14). Write-capable sibling of §12: compose them (map/locate units via §12, process via §14). **NOT `implementing-code`** — parallel code writes to a shared tree require per-worker git-worktree isolation (not available to subagents by default), so its plan-phase loop stays inline until that isolation is guaranteed.

**Special routes (override the base route):**
- `implementing-code` → §1 → §2 → §3 (IMPL-STATE schema) → §5 (FIC monitoring) → §7 (if REPAIR) → §10.5 (+ §10.5.3 tool-output retention for build/test/lint runs) → §11
- `fixing-bugs` → §1 → §2 → §12 → §7 (if REPAIR) → §9 (non-interactive) → §10.5 → §11
- `refining-artifact-consistency` (sandbox) → §10.5 only — Stepwise owns `_progress.json` (§2) and apply-back (§11), so both are skipped; read §10.5 + §10.5.1 before any sandbox `Edit`.
- `conducting-excursion` (sandbox / Manual Bay) → §10.5 + §12 (capability-gated, narrowly — see below) only — Stepwise owns `_progress.json` (§2), the exit gate, and apply-back (§11), so both are skipped. Multi-turn: read the skill's working-set note (`EXCURSION-NOTES.md`) first on resume turns and do NOT re-run the §2/pre-flight read or re-scan source; read §10.5 + §10.5.1 before any sandbox `Edit`, and apply §10.5.3 (tool-output retention) to every build/test/deploy/probe run. §12 applies only to the rarer turn whose message is a genuinely broad sweep (e.g. tracing a symptom across the whole app, finding every place a config value is set) — the common turn that already names or implicates a single file stays inline per the skill's own minimum-evidence discipline (§12.1 already excludes single-known-file delegation).
- `adversarial-platform-review` (discovery / conformance review) → §2 → §10.5 → §11 (+ §14 for per-decision fan-out) — list-shape: reads one bounded artifact + its declared target platform, adversarially web-verifies each load-bearing decision, and emits a single cited findings JSON + verdict (no multi-section spec, so §10 does not apply; no broad repo sweep, so §12 does not apply — the web grounding is this agent's own load-bearing work). Each load-bearing decision is an independent §14 unit (the coordinator merges + dedupes findings and decides the single verdict serially).
- `verifying-artifacts` (verification / checklist + program-verifier) → §2 → §10 → §10.5 → §11 (+ §7 if REPAIR) (+ §14 for judge-sample fan-out) — section-shape: produces one multi-section VERIFICATION-REPORT (checklist → program_verifiers → judge_scoring → aggregation → verdict). Scores SPEC items + consumed `adversarial-platform-review` findings + a universal anti-gaming item; generates/runs stdlib-only verifier programs for exactly-checkable items (RLCF Fig 6) and mean-of-N judge-samples the rest. The per-item JUDGE samples (and independent PROGRAM runs) are the §14 fan-out unit — the coordinator does the mean/bias/anti-gaming aggregation serially. No broad repo sweep, so §12 does not apply; no platform re-discovery (that is the discovery layer's job).
- **Catch-all** — any skill not otherwise classified → §2 → §10.5 → §11.

Per-skill specifics that are NOT routing (e.g. MCP/Deterministic-API tooling, manifest-vs-per-file split, approval-token gates) live in each skill's own SKILL.md, not here.

**Universal rules (apply to every skill, regardless of routing):**
- §2 `_progress.json` FIRST ACTION / LAST ACTION write — prevents orchestrator SIGINT. **Exception:** sandbox-mode skills (e.g., `refining-artifact-consistency`, `conducting-excursion`) run inside a Stepwise-managed sandbox where Stepwise owns `_progress.json`; those skills skip §2 and use §10.5 only.
- §10.5 tool discipline (incl. non-ASCII fallback) — applies whenever a skill writes or edits files, NOT only to section-shape skills. The destructive `edit` UTF-8 bug observed 2026-05-19 zeroed out a target file on encoding failure; the §10.5.1 fallback (use full-file replace instead of edit when non-ASCII content is present) is the workaround until the runtime tool is fixed.
- §11 harness output sidecar — last write before `final_response`. Without it the orchestrator records `outputs: {}` and downstream steps cannot pick up declared output parameters. **Exception:** sandbox-mode skills skip §11 because Stepwise owns the apply-back step; see the `refining-artifact-consistency` and `conducting-excursion` special routes above (`§10.5 only`).
- §4 Memory Bank session-end writes (`active-context.md`, `progress.md`) — only when the skill's SKILL.md explicitly opts in; otherwise skip.
- §7 REPAIR bookkeeping — when running in REPAIR mode (a `## ⚠️ Repair feedback` block is present), editing the artifact in place is NOT enough: you MUST also **bump the spec `version`** (semver patch, e.g. `1.0.0` → `1.0.1`) AND **record what changed in the AUDIT file** (set `mode: REPAIR` and append a `## Repair History` entry). Skipping this leaves the version and audit trail stale even though the content was fixed — the documented "iteration applied but version/audit not updated" defect. See §7.2 steps 7–8 for the exact fields and the mandatory self-check.

**REPAIR mode override:** if the prompt contains a `## ⚠️ Repair feedback` block, read §7 (REPAIR Mode) before any other section — even when §7 is not listed in your route. §7 carries the version-bump + audit-delta bookkeeping that is mandatory for every REPAIR (see the universal rule above); the routing rule above intentionally omits it to stay short, so this override is the authoritative trigger.

**REBUILD mode override (discard):** if the prompt contains a `## ♻️ Rebuild from scratch` block instead of `## ⚠️ Repair feedback`, read §7.3 (REBUILD Mode) before any other section. This is a DISCARD, not an iterate: the reviewer judged the artifact fundamentally wrong, so you must REGENERATE it from scratch (full BUILD) rather than surgically repair it — while still overwriting the SAME file/SESSION_ID (never duplicate) and doing the version-bump + audit bookkeeping (`mode: REBUILD`). REBUILD and REPAIR are mutually exclusive: only one of the two blocks is ever present.

## Section Index

- §1  — Session Identity (SESSION_ID format, REPAIR reuse rules)
- §2  — `_progress.json` early-signal write (FIRST ACTION / LAST ACTION)
- §3  — IMPL-STATE schema (implementing-code only)
- §4  — Memory Bank cross-session continuity (`active-context.md`, `progress.md`)
- §5  — FIC context monitoring and recovery checkpoint
- §6  — Dual-format input detection
- §7  — REPAIR mode (when `failure_feedback` is provided); §7.3 — REBUILD mode (discard → regenerate)
- §8  — Deviation taxonomy (Auto-Fix / Escalate / Defer)
- §9  — Non-interactive execution rules
- §10 — Section-by-section spec generation (skeleton-first + one-section-per-write)
  - §10.1 Section-shape `_progress.json` schema
  - §10.2 Source extraction pass
  - §10.3 Phase A — Skeleton-first
  - §10.4 Phase B — Populate, one section at a time
  - §10.5 Tool discipline (hard rules, includes non-ASCII fallback)
    - §10.5.3 Tool-output retention (context-budget: run full, retain only the verdict / failing slice / distilled evidence)
  - §10.6 CONTINUE on re-entry
- §11 — Harness output sidecar (required when running under Stepwise)
- §12 — Delegated exploration (read-only subagent fan-out, harness-agnostic, optional)
  - §12.1 When to delegate (and when not)
  - §12.2 The return contract (conclusions + `file:line`, never file dumps)
  - §12.3 Model selection (prefer the cheap/fast tier)
  - §12.4 Verify before use (subagent output is input, not ground truth)
- §13 — Code-location discipline (consult `codebase-map.md` before any discovery scan; code-searching skills only)
  - §13.1 The rule — consult before scan, not never scan
  - §13.2 When the map is insufficient — flag the gap
  - §13.3 Applies to (code-searching skills only)
  - §13.4 Composition with §12
  - §12.5 Fallback (no subagent capability → inline exploration)
  - §12.6 Skill-level enforcement
- §14 — Parallel fan-out (write-capable subagent fan-out over independent units; harness-agnostic, optional)
  - §14.1 When to fan out (and when not)
  - §14.2 Worker contract (incl. §14.2.1 sharded progress)
  - §14.3 Coordinator contract (shard → dispatch → merge → sidecar last)
  - §14.4 Verify before use
  - §14.5 Fallback (no delegation capability → inline unit loop)
  - §14.6 Skill-level enforcement

---


## Section files

Non-universal sections now live as individual files under `execution-protocol/`.
Read only those your route selects (see the routing rule above); each is readable
standalone with its original § numbering intact. The **universal** sections (§2,
§10.5, §11 — required by every skill) remain inlined below.

| § | Location |
|---|----------|
| §1  Session Identity | `execution-protocol/01-session-identity.md` |
| §2  `_progress.json` | inline below (universal) |
| §3  IMPL-STATE | `execution-protocol/03-impl-state.md` |
| §4  Memory Bank | `execution-protocol/04-memory-bank.md` |
| §5  FIC recovery | `execution-protocol/05-fic-recovery.md` |
| §6  Dual-format | `execution-protocol/06-dual-format.md` |
| §7  REPAIR / §7.3 REBUILD | `execution-protocol/07-repair-mode.md` |
| §8  Deviations | `execution-protocol/08-deviations.md` |
| §9  Non-interactive | `execution-protocol/09-non-interactive.md` |
| §10 Section generation | `execution-protocol/10-section-generation.md` |
| §10.5 Tool discipline | inline below (universal) |
| §11 Output sidecar | inline below (universal) |
| §12 Delegated exploration | `execution-protocol/12-delegated-exploration.md` |
| §13 Code-location | `execution-protocol/13-code-location.md` |
| §14 Parallel fan-out | `execution-protocol/14-parallel-fanout.md` |

A skill's route (e.g. `§2 → §10 → §10.5 → §11`) resolves each §N via this table:
universal sections are already here; the rest are one file-read away. Existing
"see execution-protocol.md §N" citations in the 123 skills keep working through
this one redirect hop — no skill edits required.

---

## 2. _progress.json — Early Signal Write

**Purpose:** Prevents the orchestrator coordinator from sending SIGINT to a running skill.

Write this as the **FIRST file action** in any skill execution (before creating any other outputs):

```json
{
  "skill": "{skill-name}",
  "session_id": "{SESSION_ID}",
  "status": "RUNNING",
  "started_at": "{ISO timestamp}",
  "completed_at": null,
  "total": 0,
  "completed": 0,
  "items": []
}
```

Write to: `{output_folder}/_progress.json`

**Update cadence:**
- On FIC trigger (Section 5): `"status": "COMPACTION_NEEDED"`
- On completion: `"status": "COMPLETED"`, `"completed_at": "{ISO timestamp}"`
- On failure: `"status": "FAILED"`, `"completed_at": "{ISO timestamp}"`

**Schema variants.** A skill picks ONE shape based on its work model. The common
envelope (`skill`, `session_id`, `status`, `started_at`, `completed_at`) is identical
across variants.

- **List shape (default — shown above)** — uses `total`, `completed`, `items[]`. Suits
  skills that produce many discrete artifacts (e.g. `implementing-code` writing source
  files; `planning-code-tasks` tracking task entries).
- **Section shape** — uses `skeleton_written` (bool) + `sections{}` map. Suits skills
  that produce a single multi-section spec file from large unstructured inputs. See
  **Section 10** for the full protocol (skeleton-first + one-section-per-write +
  source extraction + CONTINUE re-entry).

### Skill-Level Enforcement (FIRST ACTION / LAST ACTION)

Every skill MUST include these two inline callouts — agents do not reliably follow
protocol-only references for session bookend writes:

**At session start** (after folder creation, before any other file write):

> **FIRST ACTION — MANDATORY:** Write `_progress.json` to the output folder before any other file write.
> This prevents the orchestrator from sending SIGINT.

Include the minimal JSON schema inline in the skill so the agent can write immediately
without reading this file first. Use `"session_id": "initializing"` as placeholder.

**At session end** (after all spec files written, after Memory Bank writes):

> **LAST ACTION — MANDATORY:** Update `_progress.json` status to `COMPLETED` with `completed_at` timestamp.
> If the session failed, set status to `FAILED` instead.

These callouts are NOT infrastructure duplication — they are the minimum viable bridge
between protocol and agent behavior. The full lifecycle lives here; the callouts trigger it.

**For `implementing-code` only** — also include `output_contract` (survives compaction):

```json
{
  "skill": "implementing-code",
  "session_id": "{SESSION_ID}",
  "status": "RUNNING",
  "output_contract": {
    "progress_folder_path": "{progress_folder_path}",
    "impl_state_file": "IMPL-STATE-{session_id}.md",
    "source_path": "{source_path}",
    "expected_outputs": ["source_path", "impl_state_path"]
  }
}
```

Pin the same values in the IMPL-STATE header under `output_contract`. After context
compaction, read IMPL-STATE header (not filesystem) to recover the output path and format.

---


---

### 10.5 Tool Discipline (Hard Rules)

These rules exist because each one has been observed as a failure mode. Violations defeat the protocol even when the prose discipline appears to be followed.

- **Skeleton write: use `Write`.** Single tool call, single file creation. Do NOT compose the skeleton via `Bash` heredoc.
- **Section population: use `Edit`.** Targeted find-and-replace, one section per call. The `Edit` tool handles unicode natively and validates the prior content matches what you expect.
- **NEVER use `Bash` + `sed` / `awk` / `python3 <<EOF` / `cat >` to mutate SPEC_FILE.** These are bulk-rewrite paths disguised as targeted operations. They read the whole file into memory, transform it, and write it back — the exact pattern Phase B is designed to prevent. They also bypass `Edit`'s prior-content validation, so a bug in the script silently corrupts the spec.
- **If `Edit` fails on a section, fix the `Edit` call.** Provide more surrounding context to make `old_string` unique. Do NOT switch to `Bash` / `python3` as a workaround — that path has been observed to cascade: agent hits one snag, then rewrites all remaining sections in a single script, violating one-section-per-write.
- **NEVER compose multiple sections in memory before writing.**
- **NEVER emit more than one section per Write/Edit call.**
- **NEVER re-read raw sources during Phase B.** Read `_extractions/*.md` files, or SPEC_FILE for declared cross-section state.
- **Prefer ASCII punctuation in authored content.** Emit ASCII equivalents for *decorative* non-ASCII glyphs the model tends to insert: `-` or ` - ` for em/en dashes (`—`/`–`), `->` for `→`, straight quotes `"` / `'` for smart quotes (`“ ” ‘ ’`), `...` for `…`, `-`/`*` for `•`, `x` for `×`, plain space for non-breaking space. This keeps English-output specs on the fast, safe targeted-`Edit` path by avoiding the §10.5.1 non-ASCII fallback (which forces full-file replace). **This rule removes gratuitous glyphs only — it NEVER changes the output language or strips *required* non-ASCII.** Accented and localized characters in non-English output (`á é í ó ú ñ ü ç ã …`) are content, not decoration: preserve them exactly and let §10.5.1 handle the run. Do not transliterate them to "fix" the fallback.

If a section's content genuinely will not fit a single `Edit` call (extreme size), split that one section into sub-edits — but every sub-edit is still an `Edit` call against SPEC_FILE, never a Bash mutation.

---

#### 10.5.1 Non-ASCII Content Fallback (TEMPORARY — runtime workaround)

**Status:** TEMPORARY. Remove this fallback once the runtime's targeted-edit operation supports UTF-8 reliably.

**Why this exists.** Some runtimes' targeted-edit operations have been observed to fail with `'ascii' codec can't encode character ...` errors when the `new_string` contains non-ASCII codepoints (accented vowels in Spanish / French / Portuguese / German, em dashes, smart quotes, etc.). The same failure mode has been observed to **destroy the target file** (the tool truncates the file before catching the encode exception, so a failed edit zeroes out the prior content). Until the runtime is fixed, targeted-edit cannot be trusted for SPEC_FILEs that may contain non-ASCII text.

**Detection (at Phase B entry).** If ANY of the following is true, apply this fallback for **every** section write in the run:
- The detected output language (per Step 2) is not English.
- Any input source or `_extractions/*.md` file contains a character with codepoint > 127.
- Detection is unreliable / ambiguous — default to this fallback. The cost is bounded.

**Per-section flow under fallback:**

1. **Read** SPEC_FILE from disk — this is the current state (skeleton + sections populated so far).
2. **Generate** this section's body in working memory using the inputs from Phase B step 1.
3. **Compose** the full file payload in working memory:
   - header / metadata block (verbatim from disk)
   - all previously populated sections (verbatim from disk)
   - this section, freshly populated
   - remaining stubs (verbatim from disk)
4. **Write** the composed payload via the full-file replace operation (`Write` in Claude Code, `replace` in other harnesses). One call, full file content.
5. **Update** `_progress.json`: set `sections.{section_name}: complete`.
6. **Drop** everything from working memory before the next section. SPEC_FILE on disk is the source of truth; do not carry composed content forward.

The per-section discipline is unchanged: one section populated per inference call, working memory bounded, prior section bodies not held in context. What changes is the **tool** (full-file replace, not targeted-edit) and the **payload size** (the whole file rather than one section's diff).

**Tradeoffs:**
- Per-call output grows from ~2K tokens (first section) to ~30K tokens (last section). Cumulative ~5× the targeted-edit path. Still well within gateway limits — nowhere near the 1M-token failure mode Section 10 was designed to prevent.
- Full-file replace is **atomic**: a failed write leaves the prior file intact. This is *safer* than the destructive failure mode of the broken targeted-edit operation.
- No `old_string` validation. Mitigation: the agent reads SPEC_FILE immediately before composing the payload (step 1), so it rebuilds from disk truth, not stale working memory. Skipping step 1 is a violation — the read is what replaces validation.

**Hard rules under fallback (from §10.5, still in force):** one section per inference call; never `Bash` + `sed` / `awk` / `python3 <<EOF` / `cat >` to mutate SPEC_FILE (the full-file replace operation is allowed, shell-based mutations are not); never compose multiple sections in memory before the write.

**When the runtime issue is resolved:** delete this subsection and return to the targeted-edit path defined in 10.4 and 10.5. The runtime fix is a two-line change: (1) UTF-8 encoding in the edit tool's write path, (2) atomic-write semantics so failed edits leave the prior file intact.

---

#### 10.5.2 Safe-Write Protocol (mandatory defensive backup for SPEC files)

**Why this exists.** Even with the discipline in §10.5 and the fallback in §10.5.1, a single bad targeted-edit call has been observed to truncate a SPEC file to 0 bytes mid-run (authored work wiped). The Safe-Write Protocol adds a `.bak` snapshot and a destructive-edit refusal gate so a single bad call cannot destroy authored work.

**Applies to:** any skill writing to `RESEARCH-SPEC-*.md`, `PLAN-SPEC-*.md`, `IMPL-STATE-*.md`, `REVIEW-SPEC-*.md`, or any other SPEC-shaped artifact the skill declares.

**Rule 1 — Defensive backup before any large edit:**

Whenever you must edit a SPEC file larger than 20 KB AND the edit changes more than 30% of the file's lines:

1. Compute: `lines_to_change` (new content vs current).
2. If `lines_to_change > 0.30 * total_lines AND file_size_kb > 20`:
   - `cp {target_file} {target_file}.bak.{ISO_TIMESTAMP}` via a single Bash call.
   - Proceed with the edit.
   - On success (post-edit file is non-empty AND > 50% of pre-edit size): delete the `.bak` file.
   - On failure or suspected truncation (post-edit file is < 50% of pre-edit size): restore from `.bak`, then emit a structured event:
     ```json
     {"event":"safe_write_restore","file":"<path>","reason":"post_edit_too_small","pre_size":<N>,"post_size":<M>}
     ```

**Rule 2 — Never `replace_all=true` on SPEC files.** Reinforces §10.5 "Section population: use `Edit`." Use targeted, anchored Edits with non-empty `old_string`. If a full rewrite is genuinely needed, write to a new file first, then `mv` atomically.

**Rule 3 — Refuse destructive `replace` calls (empty / too-short `old_string`):**

Before any `replace` / `Edit` whose `old_string` is empty (`""`) or shorter than 10 characters: REFUSE the operation. Emit:

```json
{"event":"safe_write_refuse","reason":"old_string_too_short_or_empty","file":"<path>","old_string_length":<N>}
```

This is the direct guard for whole-file overwrites caused by under-specified anchors.

**Rule 4 — Stray `.bak` cleanup at FIRST ACTION:**

In each section-shape skill's FIRST ACTION step (the `_progress.json` write described in §2), also glob `{output_path}/*.bak.*` and delete any files older than 1 hour. This bounds disk overhead from crashes that leave a `.bak` on disk.

**Relationship to §10.5 and §10.5.1.**
- §10.5 prevents bulk-rewrite cascades from `Bash` / `sed` / `python3`.
- §10.5.1 covers the non-ASCII-truncation failure mode (full-file replace as a workaround).
- §10.5.2 (this section) is the last line of defense — even if the agent uses the correct tool with the correct intent, the `.bak` snapshot survives a runtime malfunction.

---

#### 10.5.3 Tool-Output Retention (context-budget hard rule)

**Why this exists.** Running a command is a one-time cost; the expense is that its raw output then sits in the conversation and is **re-sent on every subsequent model round-trip** in the turn (and across turns until compaction). In an observed code excursion, a single tool-heavy turn (build + `npm test` + 14 edits) reached **6.9M input tokens** — not from re-reading across turns, but because verbose build/test logs and re-read source files rode along on every one of ~70 round-trips inside that one turn. The fix is not to run or log less. It is to **always execute fully, then retain only what the next round-trip needs.**

**The rule is about retention, never about execution. Always run the full command.** What you keep resident is decided by the output's *role*:

| Regime | Examples | Keep resident | Rationale |
|--------|----------|---------------|-----------|
| **Success** | build OK, tests green, lint clean, deploy healthy, migration applied | the **verdict only** — counts, exit code, the one summary line | A passing log carries no actionable detail; the body is pure noise. Full output is never needed. |
| **Failure** | failing test, compile error, probe 5xx, healthcheck down | the **failing slice** — the error, the stack, the failing names | The signal is the failure (usually <5% of the log). The passing lines before it are noise. Trim to the failure, not the whole run. |
| **Output *is* the evidence** | stack trace under root-cause, grep map being built, scanner findings, coverage report, diff under review | full fidelity **for this turn only**, then distill → drop | Sampling here can lose correctness, so capture full once, write the conclusion to the note/artifact, then drop the raw bytes — do not let them ride into the next round-trip. |

**The mechanism that satisfies "I sometimes need the full log" without paying to re-send it — redirect to a file, summarize into context, read on demand:**

```
npm test > .runlogs/test.txt 2>&1; tail -40 .runlogs/test.txt      # context gets the tail + counts
grep -A30 "FAIL src/work-orders" .runlogs/test.txt                  # full detail ONLY when a failure needs it
```

You never lose the full log — you stop re-billing it. Prefer the tool's own quiet/summary mode at the source where one exists (`jest` summary reporter, `--silent`, `pytest -q`, `gradle --quiet`, `npm --silent`), and on a run you expect to pass do **not** enable the runner's verbose / per-case-expanding mode (`--verbose`, `-vv`, `--reporter=spec`, etc.) — that prints a line per assertion and is the exact opposite of retention. Reach for verbose only after a failure, scoped to the failing target.

**Hard rules:**

- Never paste a large raw log (build/test/scan/probe) into the transcript when its outcome is success — emit the verdict line instead.
- On failure, emit only the failing portion; redirect the full log to a file and `grep`/`tail` it on demand.
- After any verification run, **distill the result (pass/fail counts, the exit verdict) into the working-set note or the artifact, then drop the raw output from working memory** — the same discipline §10.4.1 / §10.6 apply to re-read source.
- Do not re-read a file you just edited in the same turn to "re-orient" — reason from the edit result. (Observed: one service file read 4× in a single turn.)

**Enumeration guardrail (do NOT trim these away).** When the output is an enumeration-complete deliverable — a security scan's findings, a coverage-gap list, a toolchain inventory — every item matters and must not be sampled. The rule still applies, but "full fidelity" lands in the **artifact/output file**, not the chat transcript: write all findings to the file, keep only the count + the file path resident. Full is retained where it is the deliverable; it is simply not re-sent on every round-trip.

**Applies to:** any skill that runs build/test/lint/deploy/probe/scan commands inside a multi-round-trip turn. Cited by `conducting-excursion`, `implementing-code`, `fixing-bugs`, and the quick-lane `implementing-quick-change` (the quick-fix playlist runs `fixing-bugs`, so both quick lanes are covered); other tool-running skills (`bootstrapping-runtime-environment`, `launching-app`, `launching-subscription`, `tearing-down-services`, `managing-releases`, `researching-bug-fixing`, `reviewing-code`, `api-smoke-probe`, `browser-smoke-probe`, and the security/enumeration skills with the guardrail above) adopt the §10.5.3 citation as they are next touched.

---


---

## 11. Harness Output Sidecar

**Purpose.** The Stepwise harness reads each step's declared outputs from a sidecar JSON file written at a path the harness controls. If this file is missing, the orchestrator records `outputs: {}` in `state.json`, the UI's artifact panel renders empty, and downstream steps cannot pick up output values via propagation. **Artifacts on disk are not enough** — the sidecar is the framework contract between the skill and the orchestrator.

**Applicability.** Any skill that may be invoked by Stepwise. Standalone invocations (no orchestrator) do not need the sidecar — see the trigger gate below.

**When this section applies.** The input prompt contains a `## Run metadata` block with an `output_file = '<absolute path>'` line. If that block is absent (e.g. standalone invocation outside Stepwise), skip the sidecar write entirely.

---

### 11.1 Mechanism

```
1. Re-read the prompt's `## Run metadata` block. Copy the path on the
   `output_file = '...'` line VERBATIM. Do NOT reconstruct it from runId,
   session name, project name, or any other source — the path the harness
   wrote there is the path the harness expects to read from.

2. Re-read the prompt's `## Output parameters` table. For EVERY row in that
   table, include a key in the JSON object:
     - key   = the parameter name from the table
     - value = the resolved value the skill produced for that output
               (typically the path to the artifact folder or file)

3. Write that JSON object to the `output_file` path. This is the FINAL file
   write of the run — strict ordering (see Section 11.4):
     - AFTER any skill-defined output verification (e.g. file-existence checks).
     - AFTER Memory Bank session-end writes (Section 4).
     - AFTER `_progress.json` flipped to `status: COMPLETED` (Section 2 LAST ACTION).

4. Do NOT emit any tool call after the sidecar write. The next event in the
   transcript should be the `final_response` summary.
```

---

### 11.1.1 Path Correctness Rule (mandatory)

The value reported for any output **path** parameter MUST be the **actual on-disk path the skill wrote
to** — never a re-derived input parameter, never a fresh `value_template` substitution, and never a
scope-/sibling-adjusted path that was NOT the one actually used for the write.

```
BEFORE writing the sidecar, for every path-typed output parameter:
  1. Confirm the artifact exists at the path you are about to report
     (e.g. `ls <PATH>/<EXPECTED-FILE>*` or a stat/existence check).
  2. If the path the skill actually wrote to differs from the input parameter
     for ANY reason — sibling-folder rule, scope adjustment, feature_id stripping,
     SESSION_ID derivation — report the ACTUAL written path, NOT the parameter.
  3. Reporting a parameter you did not write to is the documented cause of the
     duplicate-artifact-on-REPAIR defect: a later REPAIR run is handed the wrong
     folder, finds no prior artifact, and silently rebuilds a duplicate. (See §7.)
```

**Worked example (sibling rule).** A planning step receives `planning_output_path =
/base/code-development/code-task-planning` but, because `feature_id` was empty and the upstream research
was scoped, Step 1 actually wrote to `/base/code-development/TICKET-001/code-task-planning/`. The sidecar
MUST report the latter (the path that holds the files), never the flat input parameter.

> **Note for skill authors:** "report the parameter VERBATIM" guidance (used by some skills to avoid
> pre-resolution double-prefixing) means *do not re-prepend project/scope segments yourself* — it does
> NOT license reporting a path you did not write to. When your own logic diverges from the parameter,
> the actual written path always wins.

---

### 11.2 Example

For a skill that declares a single output parameter named `foo_output_path`:

```json
{ "foo_output_path": "/abs/path/to/artifacts/outputs/<capability>/<step>" }
```

For a skill with multiple output parameters, include every row from the `## Output parameters` table — one key per row. The skill-specific parameter names live in each SKILL.md (Section 11.5); this section does not enumerate them.

---

### 11.3 Violation

Ending a Stepwise run with a `final_response` summary that lists the generated artifacts but no sidecar write breaks output propagation. The harness MAY have a `value_template` fallback for specific outputs, but that fallback is not guaranteed for every skill / every output. Treat the sidecar write as **non-optional** whenever the `## Run metadata` block is present in the prompt — do not rely on the fallback.

Skills whose outputs lack a `value_template` fallback fail **silently** when the sidecar is missing: downstream steps see `outputs: {}` and propagate empty values; no error surfaces in the run. This is the failure mode this section prevents.

---

### 11.4 Composition with Section 2 LAST ACTION

The sidecar write extends Section 2's LAST ACTION; it does NOT replace it. Strict ordering for any Stepwise-invoked skill:

1. All skill-specific outputs written and verified.
2. Memory Bank writes (Section 4 — `active-context.md`, `progress.md`).
3. `_progress.json` flipped to `status: COMPLETED` (Section 2 LAST ACTION).
4. **Sidecar write** (this section) — final file write of the run.
5. `final_response` summary — no further tool calls.

If the skill is invoked standalone (no `## Run metadata` block), step 4 is skipped. Steps 1–3 and 5 still apply.

---

### 11.5 Skill-Level Enforcement

Section 11 cannot enumerate output parameter names — those are declared per-skill in the capability YAML's `outputs` block and surface in each prompt's `## Output parameters` table. Each SKILL.md MUST include a short inline callout naming its output parameters, so the agent knows which keys to put in the sidecar JSON without parsing the YAML.

Recommended SKILL.md callout shape:

> **Step N: Emit harness outputs sidecar — apply execution-protocol.md Section 11.**
>
> **Output parameters this skill produces** (one key per row of the prompt's `## Output parameters` table):
>
> - `<param_name_1>`: <one-line description of the resolved value, e.g. "the resolved output folder path written in earlier steps">
> - `<param_name_2>`: ...
>
> Example sidecar contents (illustrative):
>
> ```json
> { "<param_name_1>": "/abs/path/...", "<param_name_2>": "..." }
> ```

The callout is intentionally short. Trigger gate, mechanism, ordering, and violation rule all live in Section 11 — the SKILL.md only names the keys.

---

