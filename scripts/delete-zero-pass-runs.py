#!/usr/bin/env python3
"""
Delete ADO Test Runs that have a 0.00 % pass rate.

A run qualifies for deletion when:
  - passedTests == 0  AND  totalTests > 0    (real 0 % run)
  - OR totalTests == 0                        (empty run with no results)

Runs a dry-run by default; pass --confirm to actually delete.

Required env variable:
  ADO_PAT  -- Personal Access Token with scope: Test Management (Read & write)

Usage:
  python3 scripts/delete-zero-pass-runs.py            # dry-run (preview only)
  python3 scripts/delete-zero-pass-runs.py --confirm  # actually deletes
"""

import os
import sys
import json
import base64
import ssl
from urllib.request import urlopen, Request
from urllib.error import HTTPError
from urllib.parse import quote

# ---------------------------------------------------------------------------
# SSL context – bypasses corporate SSL-inspection proxy
# ---------------------------------------------------------------------------
_SSL_CTX = ssl.create_default_context()
_SSL_CTX.check_hostname = False
_SSL_CTX.verify_mode = ssl.CERT_NONE

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
ADO_ORG     = "LD2000DevTFS01"
ADO_PROJECT = "LD.com - Globant"

# ---------------------------------------------------------------------------
# ADO REST helpers
# ---------------------------------------------------------------------------
def _ado_pat() -> str:
    pat = os.environ.get("ADO_PAT", "")
    if not pat:
        print("ERROR: ADO_PAT environment variable is not set.")
        sys.exit(1)
    return pat

def _auth_header() -> dict:
    token = base64.b64encode(f":{_ado_pat()}".encode()).decode()
    return {"Authorization": f"Basic {token}"}

def _base_url() -> str:
    return f"https://dev.azure.com/{ADO_ORG}/{quote(ADO_PROJECT)}/_apis"

def _get(path: str, params: str = "") -> dict:
    url = f"{_base_url()}/{path}?api-version=7.0{params}"
    req = Request(url, headers=_auth_header(), method="GET")
    try:
        with urlopen(req, context=_SSL_CTX) as resp:
            return json.loads(resp.read())
    except HTTPError as exc:
        detail = exc.read().decode(errors="replace")
        print(f"ERROR: GET {url} -> HTTP {exc.code}\n{detail[:500]}")
        sys.exit(1)

def _delete(path: str) -> None:
    url = f"{_base_url()}/{path}?api-version=7.0"
    req = Request(url, headers=_auth_header(), method="DELETE")
    try:
        with urlopen(req, context=_SSL_CTX) as resp:
            resp.read()          # consume body (usually empty on 204)
    except HTTPError as exc:
        # 204 No Content is success; urllib raises on anything non-2xx
        if exc.code == 204:
            return
        detail = exc.read().decode(errors="replace")
        print(f"  ERROR: DELETE {url} -> HTTP {exc.code}: {detail[:300]}")

# ---------------------------------------------------------------------------
# Fetch all test runs (paginated, 100 per page)
# ---------------------------------------------------------------------------
def fetch_all_runs() -> list:
    all_runs = []
    top = 100
    skip = 0

    while True:
        data = _get("test/runs", f"&includeRunDetails=true&$top={top}&$skip={skip}")
        batch = data.get("value", [])
        all_runs.extend(batch)
        if len(batch) < top:
            break
        skip += top

    return all_runs

# ---------------------------------------------------------------------------
# Decide if a run qualifies for deletion
# ---------------------------------------------------------------------------
def _is_zero_pass(run: dict) -> bool:
    total  = run.get("totalTests", 0) or 0
    passed = run.get("passedTests", 0) or 0

    if total == 0:
        return True          # empty run (no results published)
    return passed == 0       # real 0 % pass rate

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def main():
    confirm = "--confirm" in sys.argv

    print(f"ADO org     : {ADO_ORG}")
    print(f"ADO project : {ADO_PROJECT}")
    print(f"Mode        : {'DELETE (confirmed)' if confirm else 'DRY-RUN (preview only)'}")
    print()

    print("Fetching test runs …")
    all_runs = fetch_all_runs()
    print(f"Found {len(all_runs)} total runs\n")

    targets = [r for r in all_runs if _is_zero_pass(r)]

    if not targets:
        print("No runs with 0.00 % pass rate found. Nothing to do.")
        return

    print(f"{'ID':<10} {'Pass%':>6}  {'Passed':>7} {'Total':>7}  Name")
    print("-" * 80)
    for run in targets:
        total  = run.get("totalTests", 0) or 0
        passed = run.get("passedTests", 0) or 0
        pct    = (passed / total * 100) if total else 0.0
        print(f"{run['id']:<10} {pct:>5.1f}%  {passed:>7} {total:>7}  {run['name'][:50]}")

    print()
    print(f"→ {len(targets)} run(s) will be deleted.")

    if not confirm:
        print(
            "\n[DRY-RUN] No changes made.\n"
            "Re-run with --confirm to permanently delete the runs above:\n\n"
            "  python3 scripts/delete-zero-pass-runs.py --confirm\n"
        )
        return

    print()
    deleted = 0
    for run in targets:
        run_id = run["id"]
        print(f"  Deleting run #{run_id} — {run['name'][:60]} …", end=" ")
        _delete(f"test/runs/{run_id}")
        print("✓")
        deleted += 1

    print(f"\nDeleted {deleted} run(s).")

if __name__ == "__main__":
    main()
