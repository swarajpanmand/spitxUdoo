from typing import Dict, Any, List

from config import API_BASE_URL, get, post


WAREHOUSES: List[dict] = [
    {
        "name": "Central Warehouse",
        "address": "123 Main St, City Center",
        "locations": [
            {"name": "Receiving Dock", "aisle": "R1", "rack": "1", "bin": "01"},
            {"name": "Bulk Storage", "aisle": "B1", "rack": "1", "bin": "01"},
            {"name": "Picking Area", "aisle": "P1", "rack": "1", "bin": "01"},
            {"name": "Dispatch Zone", "aisle": "D1", "rack": "1", "bin": "01"},
        ],
    },
    {
        "name": "East Side Warehouse",
        "address": "45 Industrial Rd, East District",
        "locations": [
            {"name": "Cold Storage", "aisle": "C1", "rack": "1", "bin": "01"},
            {"name": "Dry Storage", "aisle": "D2", "rack": "1", "bin": "01"},
            {"name": "Overflow Area", "aisle": "O1", "rack": "1", "bin": "01"},
        ],
    },
]


def fetch_existing_warehouses() -> Dict[str, Any]:
    url = f"{API_BASE_URL}/warehouses"
    resp = get(url)
    resp.raise_for_status()
    data = resp.json()
    result = {}
    for wh in data.get("data", []):
        name = (wh.get("name") or "").strip().lower()
        if name:
            result[name] = wh
    return result


def create_warehouse(wh_def: dict) -> None:
    url = f"{API_BASE_URL}/warehouses"
    body = {
        "name": wh_def["name"],
        "address": wh_def.get("address"),
        "locations": wh_def.get("locations", []),
    }
    resp = post(url, json_body=body)
    if resp.status_code == 201:
        created = resp.json().get("data", {})
        print(f"[OK] Created warehouse '{created.get('name')}' (id={created.get('_id')})")
    else:
        print(f"[ERROR] Failed to create warehouse '{wh_def['name']}' "
              f"status={resp.status_code} body={resp.text}")


def main():
    existing = fetch_existing_warehouses()
    print(f"Found {len(existing)} existing warehouses")

    for wh in WAREHOUSES:
        key = wh["name"].strip().lower()
        if key in existing:
            print(f"[SKIP] Warehouse '{wh['name']}' already exists (id={existing[key].get('_id')})")
            continue
        create_warehouse(wh)


if __name__ == "__main__":
    main()