"""Standard API response helpers (scaffold)."""

def ok(data: object | None = None) -> dict[str, object | None]:
    return {"ok": True, "data": data}
