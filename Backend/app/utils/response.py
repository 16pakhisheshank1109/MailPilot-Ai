"""Standard API response helpers (scaffold)."""

def ok(data=None):
    return {"ok": True, "data": data}
