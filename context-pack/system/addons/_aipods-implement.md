---
name: _aipods-implement
description: Always-on code-writing discipline for code steps — finish-the-loop, build/test gating, completion evidence, fidelity, surgical repair, file/token safety. Covers implementing-code, fixing-bugs, implementing-quick-change. Full mechanics live in each skill.
precedence: 10
scope: code
---
## Code-writing discipline (apply to all code you write, fix, or change)

Builds on _aipods — do not restate it. These are the code-loop rules that, forgotten mid-step, ship broken or incomplete code. Cover implementing-code, fixing-bugs, implementing-quick-change.

**Finish the loop — never report "done"/verified on a partial:**
- Apply ONLY the approved plan/spec/diffs — exactly. No extra files. No silent drop as "known limitation" without a documented blocker.
- Multi-phase (implementing-code): run every PENDING phase B (generate) → C (verify) → D (finalize); never skip Verify/Finalize; emit its deliverables (IMPL-STATE status, README.md, AGENTS.md final phase, Memory Bank).
- Single-apply (fixing-bugs / implementing-quick-change): apply → verify → set the apply verdict. No phases, no README/AGENTS.

**Build/tests gate — a failing suite BLOCKS "done":**
- Self-correct build/test max 3 attempts; budget spent != license to pass.
- Genuine FAIL after 3 → never report COMPLETED / APPLIED_VERIFIED. Route to repair (`stepwise session exec-fail` / `NEEDS_REDIAGNOSE` / `NEEDS_REPLAN`), status FAILED / APPLY_FAILED.
- Environmental FAIL (sandbox / no network / service down) → BLOCKED or APPLIED_UNVERIFIED (verification skipped), never a clean pass. Do NOT re-run past the 3-attempt cap.

**Prove completion — record a verdict; a missing one = self-fail before the human gate:**
- implementing-code: plan_adherence, plan_file_coverage, ac_coverage, artifact_fidelity (+ tdad when enabled). fixing-bugs / quick-change: the apply_verdict + its named verification. Any FAIL or missing verdict → self-fail (→ repair).

**Fidelity (sharpens _aipods):** cannot preserve an exact upstream literal (identifier, SQL predicate/order, config key, contract field, dependency pin, path) → STOP, log blocker/deviation. Never a quieter approximation.

**Repair / re-apply (failure_feedback present):** apply only the fixes the feedback names — surgical, not a rewrite. Re-run the full suite; never regress a passing test.

**File + token safety:**
- Read a file before you Edit/Write it. Never edit a path not read this session.
- Use plan/spec-pinned paths; consult `context-pack/codebase-map.md` before any repo-wide grep/glob.
- State files (e.g. IMPL-STATE): write skeleton once, then targeted anchored Edits only — never re-read in full, never replace_all.
- Run build/test in full but keep only verdict + failing slice; redirect verbose logs to a file. No full passing logs held in context.
- File wiped / truncated / unexpectedly replaced → git checkout first; never verify a wiped file's build; no bash scavenger hunts.

**TDAD (when enabled — incl. quick-fix red-green):** failing test first → green → refactor. Never xit / xdescribe / fit / fdescribe.

Full mechanics: each skill's SKILL.md + references. On conflict, the skill and the task/spec win over this summary.
