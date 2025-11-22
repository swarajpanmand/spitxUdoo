from typing import Dict

from config import API_BASE_URL, get, post


CATEGORIES = [
    {"name": "Electronics", "description": "Electronic devices and accessories"},
    {"name": "Office Supplies", "description": "Office stationery and supplies"},
    {"name": "Groceries", "description": "Food and daily consumables"},
    {"name": "Health & Beauty", "description": "Healthcare and personal care items"},
    {"name": "Household", "description": "Household and cleaning products"},
]


def fetch_existing_categories() -> Dict[str, str]:
    url = f"{API_BASE_URL}/categories"
    resp = get(url)
    resp.raise_for_status()
    data = resp.json()
    existing = {}
    for cat in data.get("data", []):
        name = (cat.get("name") or "").strip().lower()
        if name:
            existing[name] = cat.get("_id")
    return existing


def create_category(cat: dict) -> None:
    url = f"{API_BASE_URL}/categories"
    resp = post(url, json_body=cat)
    if resp.status_code == 201:
        created = resp.json().get("data", {})
        print(f"[OK] Created category '{created.get('name')}' (id={created.get('_id')})")
        return

    print(f"[ERROR] Failed to create category '{cat['name']}' "
          f"status={resp.status_code} body={resp.text}")


def main():
    existing = fetch_existing_categories()
    print(f"Found {len(existing)} existing categories")

    for cat in CATEGORIES:
        key = cat["name"].strip().lower()
        if key in existing:
            print(f"[SKIP] Category '{cat['name']}' already exists (id={existing[key]})")
            continue
        create_category(cat)


if __name__ == "__main__":
    main()