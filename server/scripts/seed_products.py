from typing import Dict, Any, List

from config import API_BASE_URL, get, post


PRODUCTS: List[dict] = [
    {
        "name": "USB-C Cable 1m",
        "sku": "ELEC-USBC-1M",
        "barcode": "100000000001",
        "category": "Electronics",
        "uom": "PCS",
        "reorderPoint": 20,
        "costPrice": 2.0,
        "sellingPrice": 5.0,
        "dimensions": {"weight": 0.05, "volume": 0.0003},
        "metadata": {"brand": "Generic", "color": "Black"},
    },
    {
        "name": "Wireless Mouse",
        "sku": "ELEC-MOUSE-WL",
        "barcode": "100000000002",
        "category": "Electronics",
        "uom": "PCS",
        "reorderPoint": 15,
        "costPrice": 8.0,
        "sellingPrice": 15.0,
        "dimensions": {"weight": 0.2, "volume": 0.0008},
        "metadata": {"brand": "TechBrand", "color": "Grey"},
    },
    {
        "name": "A4 Printer Paper (500 sheets)",
        "sku": "OFFICE-A4-500",
        "barcode": "200000000001",
        "category": "Office Supplies",
        "uom": "REAM",
        "reorderPoint": 30,
        "costPrice": 3.5,
        "sellingPrice": 6.0,
        "dimensions": {"weight": 2.3, "volume": 0.004},
        "metadata": {"brand": "OfficePro", "gsm": "80"},
    },
    {
        "name": "Ballpoint Pen Blue (Box of 50)",
        "sku": "OFFICE-PEN-BLUE-50",
        "barcode": "200000000002",
        "category": "Office Supplies",
        "uom": "BOX",
        "reorderPoint": 25,
        "costPrice": 1.5,
        "sellingPrice": 3.0,
        "dimensions": {"weight": 0.4, "volume": 0.001},
        "metadata": {"brand": "WriteWell", "ink_color": "Blue"},
    },
    {
        "name": "Basmati Rice 5kg",
        "sku": "GROC-RICE-5KG",
        "barcode": "300000000001",
        "category": "Groceries",
        "uom": "BAG",
        "reorderPoint": 10,
        "costPrice": 6.0,
        "sellingPrice": 9.5,
        "dimensions": {"weight": 5.0, "volume": 0.008},
        "metadata": {"brand": "DailyGrain"},
    },
    {
        "name": "Olive Oil 1L",
        "sku": "GROC-OIL-1L",
        "barcode": "300000000002",
        "category": "Groceries",
        "uom": "BOTTLE",
        "reorderPoint": 15,
        "costPrice": 4.0,
        "sellingPrice": 7.0,
        "dimensions": {"weight": 1.05, "volume": 0.0012},
        "metadata": {"brand": "Mediterraneo"},
    },
    {
        "name": "Multivitamin Tablets (60)",
        "sku": "HEALTH-MV-60",
        "barcode": "400000000001",
        "category": "Health & Beauty",
        "uom": "BOTTLE",
        "reorderPoint": 20,
        "costPrice": 5.5,
        "sellingPrice": 10.0,
        "dimensions": {"weight": 0.15, "volume": 0.0005},
        "metadata": {"brand": "HealthPlus"},
    },
    {
        "name": "Shampoo 500ml",
        "sku": "HEALTH-SHAM-500",
        "barcode": "400000000002",
        "category": "Health & Beauty",
        "uom": "BOTTLE",
        "reorderPoint": 25,
        "costPrice": 3.0,
        "sellingPrice": 6.0,
        "dimensions": {"weight": 0.55, "volume": 0.0007},
        "metadata": {"brand": "CareSoft"},
    },
    {
        "name": "Laundry Detergent 2kg",
        "sku": "HOUSE-LAUND-2KG",
        "barcode": "500000000001",
        "category": "Household",
        "uom": "BAG",
        "reorderPoint": 18,
        "costPrice": 4.5,
        "sellingPrice": 8.0,
        "dimensions": {"weight": 2.0, "volume": 0.004},
        "metadata": {"brand": "CleanHome"},
    },
    {
        "name": "All-purpose Cleaner 1L",
        "sku": "HOUSE-CLEAN-1L",
        "barcode": "500000000002",
        "category": "Household",
        "uom": "BOTTLE",
        "reorderPoint": 20,
        "costPrice": 2.2,
        "sellingPrice": 4.2,
        "dimensions": {"weight": 1.1, "volume": 0.0014},
        "metadata": {"brand": "Sparkle"},
    },
]


def fetch_categories_by_name() -> Dict[str, str]:
    url = f"{API_BASE_URL}/categories"
    resp = get(url)
    resp.raise_for_status()
    cats = resp.json().get("data", [])
    mapping: Dict[str, str] = {}
    for c in cats:
        name = (c.get("name") or "").strip().lower()
        if name and c.get("_id"):
            mapping[name] = c["_id"]
    return mapping


def create_product(payload: dict) -> None:
    url = f"{API_BASE_URL}/products"
    resp = post(url, json_body=payload)

    if resp.status_code == 201:
        prod = resp.json().get("product") or resp.json().get("data") or {}
        print(f"[OK] Created product '{prod.get('name')}' (sku={prod.get('sku')}, id={prod.get('_id')})")
        return

    body_text = resp.text
    if resp.status_code in (400, 409) and "duplicate key" in body_text.lower():
        print(f"[SKIP] Product with SKU '{payload['sku']}' already exists (duplicate key)")
    else:
        print(f"[ERROR] Failed to create product '{payload['name']}' "
              f"status={resp.status_code} body={body_text}")


def main():
    category_map = fetch_categories_by_name()
    print(f"Loaded {len(category_map)} categories")

    for prod_def in PRODUCTS:
        cat_key = prod_def["category"].strip().lower()
        category_id = category_map.get(cat_key)
        if not category_id:
            print(f"[ERROR] Skipping '{prod_def['name']}' because category '{prod_def['category']}' not found")
            continue

        payload = {
            "name": prod_def["name"],
            "sku": prod_def["sku"],
            "barcode": prod_def.get("barcode"),
            "categoryId": category_id,
            "uom": prod_def.get("uom"),
            "reorderPoint": prod_def.get("reorderPoint", 0),
            "costPrice": prod_def.get("costPrice"),
            "sellingPrice": prod_def.get("sellingPrice"),
            "dimensions": prod_def.get("dimensions") or {},
            "metadata": prod_def.get("metadata") or {},
        }

        # Drop None values
        payload = {k: v for k, v in payload.items() if v is not None}

        create_product(payload)


if __name__ == "__main__":
    main()