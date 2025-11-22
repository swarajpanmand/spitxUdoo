import os

import requests

API_BASE_URL = os.environ.get("API_BASE_URL", "http://localhost:5000/api")
ADMIN_TOKEN = os.environ.get("ADMIN_TOKEN")


def get_admin_token() -> str:
    token = ADMIN_TOKEN or os.environ.get("ADMIN_TOKEN")
    if not token:
        raise RuntimeError(
            "ADMIN_TOKEN environment variable is not set. "
            "Export it in your shell, e.g.:\n"
            "  export ADMIN_TOKEN='your_jwt_here'"
        )
    return token


def auth_headers(json: bool = True) -> dict:
    token = get_admin_token()
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/json",
    }
    if json:
        headers["Content-Type"] = "application/json"
    return headers


def get(url: str, **kwargs) -> requests.Response:
    return requests.get(url, headers=auth_headers(json=False), timeout=10, **kwargs)


def post(url: str, json_body: dict) -> requests.Response:
    return requests.post(url, headers=auth_headers(json=True), json=json_body, timeout=10)