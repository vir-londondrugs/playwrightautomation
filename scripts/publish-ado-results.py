#!/usr/bin/env python3
"""
Publish Playwright JUnit results to Azure DevOps Test Plans > Runs.

Required environment variable:
  ADO_PAT  -- Personal Access Token with scope: Test Management (Read & write)

Usage:
  python3 scripts/publish-ado-results.py
"""

import os
import sys
import json
import base64
import xml.etree.ElementTree as ET
from urllib.request import urlopen, Request
from urllib.error import HTTPError
from urllib.parse import quote
from datetime import datetime, timezone

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
ADO_ORG     = "LD2000DevTFS01"
ADO_PROJECT = "LD.com - Globant"
JUNIT_FILE  = "results.xml"
BATCH_SIZE  = 1000  # ADO max results per POST

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
        with urlopen(req) as resp:
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
# JUnit XML parser
# ---------------------------------------------------------------------------
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
            name      = tc.get("name", "Unknown test")
            classname = tc.get("classname", "")
            duration_s = float(tc.get("time", "0") or "0")

            failure = tc.find("failure")
            error   = tc.find("error")
            skipped = tc.find("skipped")

            if skipped is not None:
                outcome   = "NotExecuted"
                error_msg = None
            elif failure is not None or error is not None:
                outcome = "Failed"
                elem    = failure if failure is not None else error
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
            })

    return results

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

    results = parse_junit(JUNIT_FILE)
    total   = len(results)
    passed  = sum(1 for r in results if r["outcome"] == "Passed")
    failed  = sum(1 for r in results if r["outcome"] == "Failed")
    skipped = sum(1 for r in results if r["outcome"] == "NotExecuted")

    print(f"Parsed {total} test results: {passed} passed | {failed} failed | {skipped} skipped")

    # 1. Create test run
    now = datetime.now(timezone.utc).isoformat()
    run = ado_post("test/runs", {
        "name":         RUN_NAME,
        "isAutomated":  True,
        "startedDate":  now,
    })
    run_id = run["id"]
    print(f"Created ADO test run #{run_id}: '{RUN_NAME}'")

    # 2. Upload results in batches
    ado_results = []
    for r in results:
        entry = {
            "testCaseTitle":     r["testCaseTitle"],
            "automatedTestName": r["automatedTestName"],
            "outcome":           r["outcome"],
            "durationInMs":      r["durationInMs"],
            "state":             "Completed",
        }
        if r["errorMessage"]:
            entry["errorMessage"] = r["errorMessage"]
        ado_results.append(entry)

    for i in range(0, len(ado_results), BATCH_SIZE):
        batch = ado_results[i : i + BATCH_SIZE]
        ado_post(f"test/runs/{run_id}/results", batch)
        print(f"  Uploaded results {i + 1}--{min(i + BATCH_SIZE, total)}")

    # 3. Complete the run
    ado_patch(f"test/runs/{run_id}", {
        "state":         "Completed",
        "completedDate": datetime.now(timezone.utc).isoformat(),
    })

    run_url = (
        f"https://dev.azure.com/{ADO_ORG}/{quote(ADO_PROJECT)}"
        f"/_testManagement/runs?runId={run_id}"
    )
    print(f"Run #{run_id} completed  ({passed}/{total} passed)")
    print(f"View in ADO: {run_url}")

    # Exit with error code if there were failures (so CI marks the step red)
    if failed > 0:
        sys.exit(1)

if __name__ == "__main__":
    main()
