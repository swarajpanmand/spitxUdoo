import random
import json
from faker import Faker
from bson import ObjectId  # pip install bson

fake = Faker()

# ---- CONFIG ---- #
NUM_MANAGERS = random.randint(4, 5)
NUM_STAFF = random.randint(10, 15)

# Example warehouse IDs — replace with your real DB IDs later
WAREHOUSE_IDS = [
    str(ObjectId()),
    str(ObjectId()),
    str(ObjectId())
]

ROLES = {
    "ADMIN": "ADMIN",
    "MANAGER": "MANAGER",
    "WAREHOUSE_STAFF": "WAREHOUSE_STAFF"
}

users = []

# ---------------------------
# Helper: create fake user
# ---------------------------
def create_user(role, assignedWarehouse=None):
    return {
        "_id": str(ObjectId()),
        "name": fake.name(),
        "email": fake.unique.email(),
        "password": "Pass@123",   # raw password (your backend will hash)
        "role": role,
        "assignedWarehouse": assignedWarehouse,
        "isActive": True
    }


# ---------------------------
# 1) SUPER ADMIN
# ---------------------------
admin_user = {
    "_id": str(ObjectId()),
    "name": "Super Admin",
    "email": "admin@stockmaster.com",
    "password": "Admin@123",
    "role": ROLES["ADMIN"],
    "assignedWarehouse": None,
    "isActive": True
}
users.append(admin_user)


# ---------------------------
# 2) MANAGERS
# ---------------------------
for _ in range(NUM_MANAGERS):
    wid = random.choice(WAREHOUSE_IDS)
    users.append(create_user(ROLES["MANAGER"], assignedWarehouse=wid))


# ---------------------------
# 3) WAREHOUSE STAFF
# ---------------------------
for _ in range(NUM_STAFF):
    wid = random.choice(WAREHOUSE_IDS)
    users.append(create_user(ROLES["WAREHOUSE_STAFF"], assignedWarehouse=wid))


# ---------------------------
# SAVE TO JSON
# ---------------------------
with open("fake_users.json", "w") as f:
    json.dump(users, f, indent=4)

print(f"Generated {len(users)} fake users and saved to fake_users.json!")
