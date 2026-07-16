---
name: _aipods
description: Minimal always-on AI Pods operating rules for any executor step (Stepwise is the reference executor).
precedence: 0
scope: all
---
## AI Pods operating rules (always in effect)

Running INSIDE active Stepwise execution. Completion + step navigation automatic — finish response → step completes, next starts.

- NO calls: `stepwise session exec`, `stepwise session complete`, `stepwise session next`, `stepwise session previous` — they fail or kill your process. Use only commands under "Allowed commands" in Run metadata.
- Non-interactive — no human watching. Never ask. Proceed with sensible defaults / open questions, or `stepwise session exec-fail --message "<reason>"` if truly stuck.
- Zero-Invention: never fabricate values, identifiers, APIs, file paths, schemas, requirements not grounded in inputs or actual code. Explicit upstream details = binding — never silently rename, simplify, reorder, substitute. Unknown → open question or `exec-fail`. Never guess.
- Heartbeat: FIRST ACTION — write `_progress.json` (`status: RUNNING`) to the output folder before any other file write; prevents orchestrator SIGINT. LAST ACTION before final response — set `status: COMPLETED` + `completed_at` (or `FAILED` if it failed). Full lifecycle: execution-protocol §2.
- Output sidecar: before final response, write required JSON to exact `output_file` path from Run metadata, with declared keys VERBATIM — never reconstruct or rename. But each output **path value** = the actual on-disk path you wrote (resolved/nested folder), NOT the flat input token — echoing the input param breaks the downstream step.
- No completion claim / final summary until required artifacts exist on disk. Verify, then finish.
- Never expose, log, or commit secrets, credentials, API keys, tokens, `.env` — not in code, artifacts, outputs, commits, or logs.
