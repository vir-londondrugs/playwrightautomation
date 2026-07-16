> **Execution Protocol section file — §4 Memory Bank.** Routing + universal sections (§2, §10.5, §11) live in [`execution-protocol.md`](../execution-protocol.md). § numbering is preserved.

## 4. Memory Bank — Cross-Session Continuity

Two files in `./context-pack/` provide every session's agent with immediate context
about what happened before — without re-reading all prior session artifacts.

```
context-pack/
├── active-context.md    ← "What is happening NOW?" (overwritten each session)
└── progress.md          ← "What HAS been accomplished?" (append-only ledger)
```

Both live at the **project root** `./context-pack/` — shared across all capabilities
so `progress.md` becomes a unified cross-capability timeline.

### RULE 10 — active-context.md (Session Lifecycle)

At SESSION START: write `context-pack/active-context.md` with current session ID,
scope, and any prior session context loaded above. Status: `STARTING`.
At SESSION END: overwrite with final state (status, decisions, blockers, key artifacts).
If the session crashes before finalization, the SESSION START write provides
"where we were" context for the next session.

### RULE 11 — progress.md (Per-Phase Milestone Ledger)

After EVERY phase completes (NOT just the final phase): append one milestone row to
`context-pack/progress.md` (append-only — never overwrite, never delete prior rows).
Writing IMPL-STATE does NOT satisfy this write — they are different files with different
scopes. Skipping an intermediate phase write breaks per-phase crash recovery.

### Session Start

```
CONTEXT_PACK_PATH = ./context-pack

IF exists({CONTEXT_PACK_PATH}/active-context.md):
  READ active-context.md
  EXTRACT: prior_session_id, status, current_focus, open_blockers, decisions_log
  LOG: "Memory Bank: loaded active-context from session {prior_session_id}"
  # Use to: avoid re-discovering known blockers, continue from prior state,
  #         respect decisions already made (do not contradict them)
ELSE:
  LOG: "Memory Bank: No active-context.md found. First session."

IF exists({CONTEXT_PACK_PATH}/progress.md):
  READ progress.md
  EXTRACT: milestone_count, last_milestone
ELSE:
  LOG: "Memory Bank: No progress.md found. First session."

# Write active-context.md at session START (crash recovery — mandatory)
WRITE {CONTEXT_PACK_PATH}/active-context.md:
  ---
  document_type: active-context
  session_id: {SESSION_ID}
  capability: {capability_name}
  skill: {skill_name}
  project: {project_name}
  last_updated: {ISO timestamp}
  status: STARTING
  ---
  # Active Context: {project_name}
  ## Current Focus
  Session {SESSION_ID} initializing. Skill: {skill_name}. Mode: {BUILD | REPAIR}.
  ## Prior Session Context
  {IF prior loaded: Previous: {prior_session_id} — status: {prior_status}. Include blockers/decisions.}
  {ELSE: First session — no prior context.}
  ## Open Blockers
  {Copy from prior session if any, else "None."}
```

### Session End

```
# 1. Overwrite active-context.md with final state
WRITE {CONTEXT_PACK_PATH}/active-context.md:
  ---
  status: {COMPLETED | FAILED | BLOCKED}
  session_id: {SESSION_ID}
  last_updated: {ISO timestamp}
  ---
  # Active Context: {project_name}
  ## Current Focus
  {COMPLETED: "{skill_name} complete. Produced: {artifact summary with counts}."}
  {FAILED: "{skill_name} failed. Reason: {description}."}
  {BLOCKED: "{skill_name} blocked. Blocker: {description}. Required: {resolution}."}
  ## Decisions Log
  Append-only within a session. Preserve ALL rows from prior sessions.
  | ID | Decision | Rationale | Impact | Reversible | Session |
  |----|----------|-----------|--------|------------|---------|
  {Carry forward all prior rows. Append new decisions from this session.}
  {ID format: D-{NNN}, sequential across sessions, never reset.}
  {If no new decisions: keep prior rows, add nothing.}
  ## Open Blockers
  {Unresolved issues, or "No open blockers."}
  ## Key Artifacts
  | Artifact | Path | Status |
  |----------|------|--------|
  | {primary output} | {path} | written |

# 2. Append milestone to progress.md
IF NOT exists({CONTEXT_PACK_PATH}/progress.md):
  CREATE with header:
    ---
    document_type: progress-ledger
    project: {project_name}
    created_at: {ISO timestamp}
    ---
    # Progress Ledger: {project_name}
    | Session | Date | Capability | Skill | Status | Artifacts | Notes |
    |---------|------|------------|-------|--------|-----------|-------|

APPEND one row:
  | {SESSION_ID} | {date} | {capability} | {skill_name} | {STATUS} | {N <artifact-type>} | {1-line note} |
  # {N <artifact-type>} MUST use the specific type from the registry below.
  # Examples: "12 tasks (4 phases)", "48 files, 32 tests", "17 review-findings"
  # NEVER write: "1 artifact", "N artifacts", or leave blank.
```

Both writes are **MANDATORY** — even on failure, record the failure state.

### Verification After Writing progress.md

```
VERIFY exists(context-pack/progress.md)
IF NOT exists: LOG "ERROR: write FAILED. Retrying." → RETRY (mandatory tool call)
IF still fails: LOG "CRITICAL: Memory Bank write failed. Manual intervention required."

READ last line — VERIFY it contains SESSION_ID AND specific artifact count (not "N artifacts")
IF generic: REWRITE the row with the correct count from the registry.

LOG: "Memory Bank: progress.md verified — {N} rows. Last: {SESSION_ID} | {artifact_count}"
```

This verification is **NON-NEGOTIABLE**.

### Artifact Type Registry

| Skill | Artifact Type | Example |
|-------|--------------|---------|
| `researching-adrs` | ADRs | `12 ADRs` |
| `researching-bounded-contexts` | bounded-contexts | `7 bounded-contexts` |
| `establishing-architecture-foundation` | services | `9 services` |
| `specifying-architecture` | architecture-docs | `3 architecture-docs` |
| `researching-prd` | requirements | `24 requirements` |
| `planning-epics` | epics | `15 epics` |
| `implementing-user-stories` | user-stories | `48 user-stories` |
| `researching-code-design` | research-docs | `20 research-docs` |
| `planning-code-tasks` | tasks | `12 tasks (4 phases)` |
| `implementing-code` | source-files + tests | `48 files, 32 tests` |
| `reviewing-code` | review-findings | `17 review-findings` |
| `adversarial-platform-review` | conformance-findings | `4 conformance-findings (B1-B4 BLOCKER)` |
| `generating-test-cases` | test-cases | `35 test-cases` |
| `generating-e2e-test-cases` | E2E-test-cases | `22 E2E-test-cases` |
| `creating-qe-master-plan` | test-domains | `8 test-domains` |
| `benchmarking-execution` | benchmark-results | `1 benchmark-results` |
| `db-migration-quality-planning` | migration-test-domains | `5 migration-test-domains` |
| `db-parity-execution` | parity-diff-tables | `180 parity-diff-tables` |
| `db-source-profiling` | profiled-tables | `210 profiled-tables` |
| `query-log-analysis` | query-performance-sections | `7 query-performance-sections` |
| `defining-qe-strategy` | strategy-sections | `6 strategy-sections` |
| `formatting-platform-export` | work-items | `63 work-items` |
| `secreview-intake-validation` | validated-intake-package | `1 validated_intake_package` |
| `calibrating-catalog` | catalog-entries | `14 catalog-entries` |
| `creating-test-master-plan` | test-plan-sections | `10 test-plan-sections` |
| `analyzing-impact` | impacted-tests | `18 impacted-tests` |
| `developing-test-scripts` | test-scripts | `12 test-scripts` |
| `executing-automation` | executed-tests | `25 executed-tests` |
| `secreview-context-correlation` | service-graph-elements | `14 service-graph-elements` |
| `secreview-finding-enrichment` | validated-findings | `10 validated_finding records, P1–P4 register` |
| `secreview-report-generation` | report-pdfs | `2 report PDFs (technical + executive); case Closed` |
| `executing-tests` | executed-tests | `30 executed-tests` |
| `scoping-engagement-baseline` | scope-baseline-rows | `18 baseline rows across 4 capabilities` |
| `summarizing-feature-scope` | feature-scope-summary | `1 feature-scope-summary (14 fields)` |
| `estimating-supervision` | supervision-plan | `4.5 FTE across 5 roles, 6 months (pre_screening)` |
| `assembling-estimation-proposal` | proposal + internal-audit | `1 proposal + 1 internal-audit (margin 2.4x)` |
| `interviewing-code` | knowledge-graphs | `1 knowledge-graphs` |
| `validating-code-interview` | analysis-reports | `1 analysis-reports` |
| `designing-structure` | documentation-outlines | `1 documentation-outlines` |
| `discovering-kit-templates` | template-candidates | `5 template-candidates` |
| `scaffolding-kit-extensions` | resolved-extensions | `14 resolved-extensions` |
| `secreview-static-scanning` | consolidated-findings | `42 consolidated-findings across 3 repos` |
| `generating-omniverse-boilerplate` | source-files | `9 files, 3 tests` |
| `generating-content` | draft-documentation | `1 draft-documentation` |
| `refining-iteratively` | refined-documentation | `1 refined-documentation` |
| `reverse-engineering-product` | discovery-deliverables | `11 discovery-deliverables (FRD, intent, flows, data-model, tokens-raw, tokens-coverage, audit, selectors, text-inventory, behaviors-catalog, figma-tokens.json)` |
| `coverage-gap-analyzer` | coverage-reports | `2 coverage-reports (gap-report-{date}-{project}.md, recommended-tcs-{date}-{project}.md)` |
| `coverage-judge` | coverage-reports | `1 coverage-reports (final-coverage-report-{date}-{project}.md)` |
| `pentest-intake-normalization` | engagement-intake | `1 engagement-intake (10 sections)` |
| `pentest-scope-validation` | authorized-scope-register | `1 authorized-scope-register` |
| `pentest-asset-verification` | asset-verification-evidence | `1 asset-verification-evidence` |
| `pentest-roe-assembly` | roe-package | `1 roe-package (7-gate checklist)` |
| `pentest-recon-planning` | recon-plan | `1 recon-plan` |
| `pentest-surface-enumeration` | attack-surface-findings | `1 attack-surface-map + N findings` |
| `pentest-technology-fingerprinting` | technology-fingerprint | `1 technology-fingerprint` |
| `pentest-scope-boundary-flagging` | public-exposure-findings | `N public-exposure-findings` |
| `pentest-webapi-test-planning` | webapi-test-plan | `1 webapi-test-plan` |
| `pentest-auth-session-testing` | auth-session-findings | `N auth-session-findings` |
| `pentest-owasp-web-testing` | web-findings | `N web-findings` |
| `pentest-owasp-api-testing` | api-findings | `N api-findings` |
| `pentest-ai-asset-mapping` | ai-asset-map | `1 ai-asset-map` |
| `pentest-prompt-injection-testing` | prompt-injection-findings | `N prompt-injection-findings` |
| `pentest-rag-memory-testing` | rag-memory-findings | `N rag-memory-findings` |
| `pentest-tool-mcp-testing` | tool-mcp-findings | `N tool-mcp-findings` |
| `pentest-ai-resource-exhaustion-testing` | ai-resource-findings | `N ai-resource-findings` |
| `pentest-mobile-scoping` | mobile-asset-map | `1 mobile-asset-map` |
| `pentest-mobile-static-analysis` | binary-analysis-findings | `N binary-analysis-findings` |
| `pentest-mobile-dynamic-analysis` | mobile-runtime-findings | `N mobile-runtime-findings` |
| `pentest-mobile-auth-transport-testing` | platform-misconfig-findings | `N platform-misconfig-findings` |
| `pentest-infra-enumeration` | network-service-inventory | `1 network-service-inventory` |
| `pentest-infra-misconfig-testing` | infrastructure-exposure-findings | `N infrastructure-exposure-findings` |
| `pentest-infra-impact-summary` | perimeter-risk-summary | `1 perimeter-risk-summary` |
| `pentest-poc-planning` | poc-plan | `1 poc-plan` |
| `pentest-poc-execution` | validated-poc-evidence | `N validated-poc-evidence` |
| `pentest-exploit-chain-analysis` | exploit-chain-analysis | `N exploit-chain-analysis` |
| `pentest-post-exploitation` | post-exploitation-findings | `N post-exploitation-findings` |
| `pentest-blast-radius-assessment` | blast-radius-assessment | `1 blast-radius-assessment` |
| `pentest-poc-evidence-packaging` | signed-poc-package | `1 signed-poc-package + retest-scripts` |
| `pentest-finding-consolidation` | consolidated-findings | `1 consolidated-findings` |
| `pentest-severity-taxonomy-mapping` | cvss-cwe-owasp-mapping | `N cvss-cwe-owasp-mapping` |
| `pentest-compliance-mapping` | compliance-control-matrix | `1 compliance-control-matrix` |
| `pentest-report-generation` | security-report | `2 reports (executive, technical)` |
| `pentest-evidence-signing` | signed-evidence-package | `1 signed-evidence-package` |
| `pentest-remediation-prioritization` | remediation-roadmap | `1 remediation-roadmap` |
| `pentest-remediation-guidance` | remediation-guidance | `N remediation-guidance` |
| `pentest-remediation-register` | remediation-status-register | `1 remediation-status-register` |
| `pentest-retest-validation` | retest-results | `N retest-results` |
| `secreview-memory-synthesis` | scan-memory-entries | `N memory entries` |
| `verifying-artifacts` | verification-reports | `1 verification-reports` |
| `glob-presentation` | presentation-decks | `1 presentation-deck (14 slides)` |
| `rapid-prototyping` | prototype-deliverables | `5 prototype-deliverables (12 screens, 6 flows)` |
| `analyze-context-pack-inputs` | analysis-sections | `17 analysis-sections` |
| `generate-context-pack` | context-pack-files | `17 context-pack-files` |
| `producing-abap-archaeology` | archaeology-deliverables | `1 object-catalog (412 objects)` or `1 archaeology-package + 1 clean-core-inventory` (per phase) |

If your skill is not listed: count the PRIMARY deliverable artifacts and use a descriptive plural type.

### Adding a New Skill to the Registry

When creating a new skill (via `engineering-skills` or manually), add a row to this table:
1. Skill name (kebab-case, matches SKILL.md folder name)
2. Artifact type (descriptive plural noun)
3. Example count string

Also update the skill's session-end block with the matching artifact type one-liner.

---
