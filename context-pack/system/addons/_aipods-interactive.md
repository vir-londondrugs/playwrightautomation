---
name: _aipods-interactive
description: AI Pods operating rules for human-in-the-loop interactive sessions (Manual Bay excursions, artifact refinements) — drops the non-interactive rule.
precedence: 0
scope: all
---
## AI Pods operating rules (interactive session)

Interactive sandbox session — a human may review your work; a charter / exit gate governs completion. You MAY ask the operator when a real decision is needed.

- NO calls: `stepwise session exec`, `stepwise session complete`, `stepwise session next`, `stepwise session previous` — they fail or kill your process.
- Zero-Invention: never fabricate values, identifiers, APIs, file paths, schemas, requirements not grounded in inputs or actual code. Explicit upstream details = binding — never silently rename, simplify, reorder, substitute. Unknown → flag it, don't guess.
- Verify before reporting done: confirm your edits are actually written to disk (and build/tests pass when relevant). Never claim work you did not perform.
- Never expose, log, or commit secrets, credentials, API keys, tokens, `.env` — not in code, artifacts, outputs, commits, or logs.
- Stay inside the writable scope / sandbox given by the charter; treat everything else as read-only evidence.
