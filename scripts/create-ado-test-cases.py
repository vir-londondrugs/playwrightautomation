#!/usr/bin/env python3
"""
create-ado-test-cases.py

1. CHECK MODE (default): verifica si los IDs 83251-83255 ya existen en ADO.
2. CREATE MODE (--create): crea los TCs que no existen.

Required environment variable:
  ADO_PAT  -- Personal Access Token con scope: Work Items (Read & write)

Usage:
  export ADO_PAT=<your-pat>
  python3 scripts/create-ado-test-cases.py           # solo verifica
  python3 scripts/create-ado-test-cases.py --create  # crea los que faltan
"""

import csv
import os
import sys
import json
import base64
import ssl
import xml.etree.ElementTree as ET
from urllib.request import urlopen, Request
from urllib.error import HTTPError
from urllib.parse import quote

# ---------------------------------------------------------------------------
# SSL context
# ---------------------------------------------------------------------------
_SSL_CTX = ssl.create_default_context()
_SSL_CTX.check_hostname = False
_SSL_CTX.verify_mode = ssl.CERT_NONE

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
ADO_ORG     = "LD2000DevTFS01"
ADO_PROJECT = "LD.com - Globant"

TC_CSV_FILE = (
    "artifacts/inputs/"
    "UAT - Regression testing - Master plan_"
    "UAT - Regression testing - Master plan.csv"
)

TC_IDS_TO_CHECK = ["83251", "83252", "83253", "83254", "83255"]

AREA_PATH = "LD.com - Globant"

# ---------------------------------------------------------------------------
# ADO REST helpers
# ---------------------------------------------------------------------------
def _pat() -> str:
    pat = os.environ.get("ADO_PAT", "")
    if not pat:
        print("ERROR: ADO_PAT environment variable is not set.")
        sys.exit(1)
    return pat

def _auth_header(patch: bool = False) -> dict:
    token = base64.b64encode(f":{_pat()}".encode()).decode()
    content_type = "application/json-patch+json" if patch else "application/json"
    return {"Authorization": f"Basic {token}", "Content-Type": content_type}

def _base_url() -> str:
    return f"https://dev.azure.com/{ADO_ORG}/{quote(ADO_PROJECT)}/_apis"

def _get(path: str):
    url = f"{_base_url()}/{path}?api-version=7.0"
    req = Request(url, headers=_auth_header(), method="GET")
    try:
        with urlopen(req, context=_SSL_CTX) as resp:
            return json.loads(resp.read())
    except HTTPError as exc:
        if exc.code == 404:
            return None
        detail = exc.read().decode(errors="replace")
        print(f"  ERROR: HTTP {exc.code} — {detail[:500]}")
        return None

def _post_patch(method: str, path: str, body, patch: bool = False):
    url = f"{_base_url()}/{path}?api-version=7.0"
    data = json.dumps(body).encode()
    req = Request(url, data=data, headers=_auth_header(patch=patch), method=method)
    try:
        with urlopen(req, context=_SSL_CTX) as resp:
            return json.loads(resp.read())
    except HTTPError as exc:
        detail = exc.read().decode(errors="replace")
        print(f"  ERROR: HTTP {exc.code} — {detail[:1000]}")
        return None

# ---------------------------------------------------------------------------
# Check if a work item ID exists in ADO
# ---------------------------------------------------------------------------
def check_work_item(ado_id: str) -> dict | None:
    """Returns the work item dict if it exists, None if 404."""
    return _get(f"wit/workitems/{ado_id}")

# ---------------------------------------------------------------------------
# CSV loader
# ---------------------------------------------------------------------------
def load_tcs_from_csv(csv_path: str, ids_to_load: list) -> dict:
    if not os.path.exists(csv_path):
        print(f"ERROR: CSV not found at '{csv_path}'")
        sys.exit(1)

    tcs: dict = {}
    current_id: str | None = None

    with open(csv_path, encoding="utf-8-sig", newline="") as fh:
        reader = csv.DictReader(fh)
        for row in reader:
            tc_id    = (row.get("ID") or "").strip()
            step_num = (row.get("Test Step") or "").strip()

            if tc_id:
                current_id = tc_id
                if tc_id in ids_to_load:
                    tcs[tc_id] = {
                        "title": (row.get("Title") or "").strip(),
                        "steps": [],
                    }
            elif step_num and current_id and current_id in ids_to_load:
                tcs[current_id]["steps"].append({
                    "action":   (row.get("Step Action") or "").strip(),
                    "expected": (row.get("Step Expected") or "").strip(),
                })
    return tcs

# ---------------------------------------------------------------------------
# Build ADO steps XML
# ---------------------------------------------------------------------------
def _build_steps_xml(steps: list) -> str:
    root = ET.Element("steps", {"id": "0", "last": str(len(steps) + 1)})
    for index, step in enumerate(steps):
        step_el = ET.SubElement(root, "step", {"id": str(index + 2), "type": "ActionStep"})
        action_el = ET.SubElement(step_el, "parameterizedString", {"isformatted": "true"})
        action_el.text = step["action"]
        expected_el = ET.SubElement(step_el, "parameterizedString", {"isformatted": "true"})
        expected_el.text = step["expected"]
        ET.SubElement(step_el, "description")
    return ET.tostring(root, encoding="unicode")

# ---------------------------------------------------------------------------
# Create one test case
# ---------------------------------------------------------------------------
def create_test_case(tc: dict) -> dict | None:
    steps_xml = _build_steps_xml(tc["steps"])
    patch_body = [
        {"op": "add", "path": "/fields/System.Title",                "value": tc["title"]},
        {"op": "add", "path": "/fields/System.AreaPath",             "value": AREA_PATH},
        {"op": "add", "path": "/fields/System.State",                "value": "Design"},
        {"op": "add", "path": "/fields/Microsoft.VSTS.TCM.Steps",    "value": steps_xml},
    ]
    return _post_patch("POST", "wit/workitems/$Test%20Case", patch_body, patch=True)

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def main():
    create_mode = "--create" in sys.argv

    print(f"ADO org       : {ADO_ORG}")
    print(f"ADO project   : {ADO_PROJECT}")
    print(f"PAT set       : {'YES' if os.environ.get('ADO_PAT') else 'NO'}")
    print(f"Mode          : {'CREATE (missing TCs will be created)' if create_mode else 'CHECK ONLY'}")
    print()

    # --- STEP 1: check which IDs exist in ADO ---
    print("Checking ADO for IDs:", TC_IDS_TO_CHECK)
    print()

    existing = {}
    missing  = []

    for ado_id in TC_IDS_TO_CHECK:
        item = check_work_item(ado_id)
        if item:
            title = item.get("fields", {}).get("System.Title", "")
            wtype = item.get("fields", {}).get("System.WorkItemType", "")
            print(f"  ✓ #{ado_id} EXISTS  [{wtype}] {title[:70]}")
            existing[ado_id] = item
        else:
            print(f"  ✗ #{ado_id} NOT FOUND in ADO")
            missing.append(ado_id)

    print()
    print(f"Existing : {len(existing)}  {list(existing.keys())}")
    print(f"Missing  : {len(missing)}  {missing}")

    if not missing:
        print()
        print("All TCs already exist in ADO. No action needed.")
        return

    if not create_mode:
        print()
        print("Run with --create to create the missing TCs:")
        print("  python3 scripts/create-ado-test-cases.py --create")
        return

    # --- STEP 2: create missing TCs ---
    print()
    print("Creating missing TCs in ADO...")
    print()

    tcs = load_tcs_from_csv(TC_CSV_FILE, missing)
    created = []
    failed  = []

    for csv_id in missing:
        if csv_id not in tcs:
            print(f"  SKIP {csv_id} — not found in CSV")
            continue

        tc = tcs[csv_id]
        print(f"Creating (CSV ref {csv_id}): {tc['title'][:70]}...")
        result = create_test_case(tc)

        if result and "id" in result:
            ado_id = result["id"]
            url    = result.get("_links", {}).get("html", {}).get("href", "")
            print(f"  ✓ Created ADO #{ado_id}  {url}")
            created.append({"csv_id": csv_id, "ado_id": ado_id, "url": url})
        else:
            print(f"  ✗ Failed to create TC for CSV ref {csv_id}")
            failed.append(csv_id)

    print()
    print("=" * 60)
    print(f"Created : {len(created)}")
    print(f"Failed  : {len(failed)}")

    if created:
        print()
        print("ADO asignó los siguientes IDs. Actualiza el CSV y plp.spec.ts si difieren:")
        print(f"  {'CSV ref':<10}  {'ADO ID nuevo':<14}  URL")
        for entry in created:
            match = "✓ coincide" if str(entry["csv_id"]) == str(entry["ado_id"]) else "⚠ DIFERENTE"
            print(f"  {entry['csv_id']:<10}  {entry['ado_id']:<14}  {match}  {entry['url']}")

    if failed:
        sys.exit(1)

if __name__ == "__main__":
    main()
