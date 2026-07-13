#!/usr/bin/env python3
"""
Publish Playwright JUnit results to Azure DevOps Test Plans > Runs.

Enhancements over basic version:
  - Reads test-case steps from the canonical CSV so each ADO result includes
    per-step pass / fail detail (iterationDetails).
  - Links each result to its ADO Test Case work-item (testCase.id) so the full
    step definition is rendered in the Test Plans UI.

Required environment variable:
  ADO_PAT  -- Personal Access Token with scope: Test Management (Read & write)

Usage:
  python3 scripts/publish-ado-results.py
"""

import csv
import os
import re
import shutil
import sys
import json
import base64
import ssl
import xml.etree.ElementTree as ET
from urllib.request import urlopen, Request
from urllib.error import HTTPError
from urllib.parse import quote
from datetime import datetime, timezone

# ---------------------------------------------------------------------------
# SSL context – bypasses corporate SSL-inspection proxy cert verification
# ---------------------------------------------------------------------------
_SSL_CTX = ssl.create_default_context()
_SSL_CTX.check_hostname = False
_SSL_CTX.verify_mode = ssl.CERT_NONE

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
ADO_ORG     = "LD2000DevTFS01"
ADO_PROJECT = "LD.com - Globant"
JUNIT_FILE  = "results.xml"
BATCH_SIZE  = 1000  # ADO max results per POST

# Archive directory – each published results.xml is moved here so it cannot
# be re-published accidentally and a full history is preserved locally.
ARCHIVE_DIR = "reports/archived"

# Canonical test-case CSV (source of truth per AGENTS.md)
TC_CSV_FILE = (
    "artifacts/inputs/"
    "UAT - Regression testing - Master plan_"
    "UAT - Regression testing - Master plan.csv"
)

# Optional: human-readable run name suffix (e.g. from CI env)
RUN_LABEL = os.environ.get("GITHUB_RUN_NUMBER", "")
RUN_NAME  = (
    f"Playwright Regression #{RUN_LABEL} -- "
    f"{datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M')} UTC"
    if RUN_LABEL else
    f"Playwright Regression -- "
    f"{datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M')} UTC"
)

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
    return {
        "Authorization": f"Basic {token}",
        "Content-Type": "application/json",
    }

def _base_url() -> str:
    return f"https://dev.azure.com/{ADO_ORG}/{quote(ADO_PROJECT)}/_apis"

def _request(method: str, path: str, body=None):
    url = f"{_base_url()}/{path}?api-version=7.0"
    data = json.dumps(body).encode() if body is not None else None
    req = Request(url, data=data, headers=_auth_header(), method=method)
    print(f"  --> {method} {url}")
    try:
        with urlopen(req, context=_SSL_CTX) as resp:
            return json.loads(resp.read())
    except HTTPError as exc:
        detail = exc.read().decode(errors="replace")
        print(f"ERROR: ADO API {method} {url} -> HTTP {exc.code}")
        print(detail[:1000])
        sys.exit(1)

def ado_post(path: str, body):
    return _request("POST", path, body)

def ado_patch(path: str, body):
    return _request("PATCH", path, body)

# ---------------------------------------------------------------------------
# CSV step loader
# ---------------------------------------------------------------------------
def load_tc_steps(csv_path: str) -> dict:
    """
    Parse the canonical test-case CSV and return a dict:
        { "83225": [ {"step": "1", "action": "...", "expected": "..."}, ... ] }

    Rows with an ID column start a new test case; rows without an ID but with
    a Test Step number belong to the most-recently seen test case.
    """
    if not os.path.exists(csv_path):
        print(f"WARNING: TC CSV not found at '{csv_path}' – step details will be omitted.")
        return {}

    tc_steps: dict = {}
    current_id: str | None = None

    with open(csv_path, encoding="utf-8-sig", newline="") as fh:
        reader = csv.DictReader(fh)
        for row in reader:
            tc_id = (row.get("ID") or "").strip()
            step_num = (row.get("Test Step") or "").strip()

            if tc_id:
                current_id = tc_id
                tc_steps[current_id] = []
            elif step_num and current_id:
                tc_steps[current_id].append({
                    "step":     step_num,
                    "action":   (row.get("Step Action") or "").strip(),
                    "expected": (row.get("Step Expected") or "").strip(),
                })

    total_steps = sum(len(v) for v in tc_steps.values())
    print(f"Loaded {len(tc_steps)} test cases with {total_steps} steps from CSV")
    return tc_steps

# ---------------------------------------------------------------------------
# JUnit XML parser
# ---------------------------------------------------------------------------
_TC_ID_RE = re.compile(r"TC-(\d+)", re.IGNORECASE)

def _extract_tc_id(test_name: str) -> str | None:
    """Extract numeric ADO test-case ID from a title like 'TC-83225 — …'."""
    match = _TC_ID_RE.search(test_name)
    return match.group(1) if match else None

def parse_junit(filepath: str) -> list:
    """Return a list of result dicts from a JUnit XML file."""
    if not os.path.exists(filepath):
        print(f"ERROR: JUnit file '{filepath}' not found.")
        sys.exit(1)

    tree = ET.parse(filepath)
    root = tree.getroot()

    # Support both <testsuites> wrapper and bare <testsuite> root
    suites = root.findall(".//testsuite") if root.tag == "testsuites" else [root]

    results = []
    for suite in suites:
        for tc in suite.findall("testcase"):
            name       = tc.get("name", "Unknown test")
            classname  = tc.get("classname", "")
            duration_s = float(tc.get("time", "0") or "0")

            failure = tc.find("failure")
            error   = tc.find("error")
            skipped = tc.find("skipped")

            if skipped is not None:
                outcome   = "NotExecuted"
                error_msg = None
            elif failure is not None or error is not None:
                outcome   = "Failed"
                elem      = failure if failure is not None else error
                error_msg = (elem.get("message") or elem.text or "")[:1024]
            else:
                outcome   = "Passed"
                error_msg = None

            results.append({
                "testCaseTitle":     name,
                "automatedTestName": f"{classname}.{name}" if classname else name,
                "outcome":           outcome,
                "durationInMs":      int(duration_s * 1000),
                "errorMessage":      error_msg,
                "tc_id":             _extract_tc_id(name),
            })

    return results

# ---------------------------------------------------------------------------
# Build iteration details (step-level results)
# ---------------------------------------------------------------------------
def _build_iteration_details(
    steps: list,
    overall_outcome: str,
    error_msg: str | None,
) -> list:
    """
    Build the iterationDetails payload for one test result.

    All steps are marked Passed when the test passes.
    On failure the last step is marked Failed with the error message; all
    preceding steps are marked Passed (Playwright doesn't expose which step
    failed, so this is a reasonable approximation).
    On NotExecuted every step is NotExecuted.
    """
    if not steps:
        return []

    action_results = []
    for index, step in enumerate(steps):
        step_num = step["step"]
        is_last  = (index == len(steps) - 1)

        if overall_outcome == "NotExecuted":
            step_outcome = "NotExecuted"
            step_error   = None
        elif overall_outcome == "Failed" and is_last:
            step_outcome = "Failed"
            step_error   = error_msg
        else:
            step_outcome = overall_outcome  # "Passed" or "Passed" for non-last failed steps

        action_entry: dict = {
            "actionPath":    step_num,
            "stepIdentifier": step_num,
            "iterationId":   1,
            "outcome":       step_outcome,
        }
        if step_error:
            action_entry["errorMessage"] = step_error

        action_results.append(action_entry)

    return [{
        "id":            1,
        "outcome":       overall_outcome,
        "actionResults": action_results,
    }]

# ---------------------------------------------------------------------------
# Archive helper
# ---------------------------------------------------------------------------
def _archive_junit(junit_path: str, run_id: int) -> str:
    """
    Move the published results.xml into ARCHIVE_DIR with a timestamped name
    so it cannot be re-published accidentally and a local history is kept.

    Returns the path of the archived file.
    """
    os.makedirs(ARCHIVE_DIR, exist_ok=True)
    timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
    archive_name = f"results_{timestamp}_run{run_id}.xml"
    archive_path = os.path.join(ARCHIVE_DIR, archive_name)
    shutil.move(junit_path, archive_path)
    return archive_path

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def main():
    print(f"Working directory : {os.getcwd()}")
    print(f"Looking for JUnit : {os.path.abspath(JUNIT_FILE)}")
    print(f"File exists       : {os.path.exists(JUNIT_FILE)}")
    print(f"ADO org           : {ADO_ORG}")
    print(f"ADO project       : {ADO_PROJECT}")
    print(f"PAT set           : {'YES' if os.environ.get('ADO_PAT') else 'NO'}")
    print()

    # Guard: refuse to run if results.xml is missing – prevents accidental
    # double-publish of the same file (the file is moved after a successful run).
    if not os.path.exists(JUNIT_FILE):
        print(
            f"ERROR: '{JUNIT_FILE}' not found.\n"
            "Run 'npx playwright test' first to generate fresh results,\n"
            f"or look for a previously archived file in '{ARCHIVE_DIR}/'."
        )
        sys.exit(1)

    # Load step definitions from the canonical CSV
    tc_steps = load_tc_steps(TC_CSV_FILE)
    print()

    results = parse_junit(JUNIT_FILE)
    total   = len(results)
    passed  = sum(1 for r in results if r["outcome"] == "Passed")
    failed  = sum(1 for r in results if r["outcome"] == "Failed")
    skipped = sum(1 for r in results if r["outcome"] == "NotExecuted")

    print(f"Parsed {total} test results: {passed} passed | {failed} failed | {skipped} skipped")
    print()

    # 1. Create test run
    now = datetime.now(timezone.utc).isoformat()
    run = ado_post("test/runs", {
        "name":        RUN_NAME,
        "isAutomated": True,
        "startedDate": now,
    })
    run_id = run["id"]
    print(f"Created ADO test run #{run_id}: '{RUN_NAME}'")

    # 2. Build result entries with linked test case + step details
    ado_results = []
    linked = 0

    for r in results:
        entry: dict = {
            "testCaseTitle":     r["testCaseTitle"],
            "automatedTestName": r["automatedTestName"],
            "outcome":           r["outcome"],
            "durationInMs":      r["durationInMs"],
            "state":             "Completed",
        }
        if r["errorMessage"]:
            entry["errorMessage"] = r["errorMessage"]

        # Link to ADO Test Case work item (enables step display in Test Plans)
        tc_id = r.get("tc_id")
        if tc_id:
            entry["testCase"] = {"id": tc_id}
            linked += 1

            # Add per-step results when the TC has steps defined in the CSV
            steps = tc_steps.get(tc_id, [])
            if steps:
                entry["iterationDetails"] = _build_iteration_details(
                    steps,
                    r["outcome"],
                    r["errorMessage"],
                )

        ado_results.append(entry)

    print(f"Linked {linked}/{total} results to ADO test-case work items")
    print()

    # 3. Upload results in batches
    for i in range(0, len(ado_results), BATCH_SIZE):
        batch = ado_results[i : i + BATCH_SIZE]
        ado_post(f"test/runs/{run_id}/results", batch)
        print(f"  Uploaded results {i + 1}–{min(i + BATCH_SIZE, total)}")

    # 4. Complete the run
    ado_patch(f"test/runs/{run_id}", {
        "state":         "Completed",
        "completedDate": datetime.now(timezone.utc).isoformat(),
    })

    run_url = (
        f"https://dev.azure.com/{ADO_ORG}/{quote(ADO_PROJECT)}"
        f"/_testManagement/runs?runId={run_id}"
    )

    # 5. Archive the JUnit file to prevent accidental re-publication
    archived_path = _archive_junit(JUNIT_FILE, run_id)
    print()
    print(f"Run #{run_id} completed  ({passed}/{total} passed)")
    print(f"View in ADO  : {run_url}")
    print(f"XML archived : {archived_path}")

    # Exit non-zero when there are failures (so CI marks the step red)
    if failed > 0:
        sys.exit(1)

if __name__ == "__main__":
    main()
