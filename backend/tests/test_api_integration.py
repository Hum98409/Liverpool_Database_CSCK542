import os
from fastapi.testclient import TestClient


def _make_fake_pool(rows_map):
    """Return a fake AsyncConnectionPool-like object that yields connections/cursors
    which return predetermined rows based on the last executed query.
    This lets tests run without a real database.
    """

    class FakeCursor:
        def __init__(self, rows):
            # description should be a sequence where each item is a sequence
            # whose first element is the column name (psycopg cursor.description shape)
            self.description = [(k,) for k in (rows[0].keys() if rows else [])]
            # store rows as tuples (matching _rows_to_dicts usage)
            self._rows = [tuple(r.values()) for r in rows]

        async def execute(self, query, params=None):
            # noop - rows are preselected
            self._last_query = query

        async def fetchall(self):
            return self._rows

        async def fetchone(self):
            return self._rows[0] if self._rows else None

        async def __aenter__(self):
            return self

        async def __aexit__(self, exc_type, exc, tb):
            return False

    class FakeConn:
        def __init__(self, rows):
            self._rows = rows

        def cursor(self):
            return FakeCursor(self._rows)

        async def __aenter__(self):
            return self

        async def __aexit__(self, exc_type, exc, tb):
            return False

    class FakePool:
        def __init__(self, rows_map):
            self._rows_map = rows_map

        async def open(self, wait=True):
            return None

        async def close(self):
            return None

        def connection(self):
            # return connection context manager; pick rows by a simple key
            # For our tests we only need lookups/students which we map under 'lookups/students'
            rows = self._rows_map.get('lookups/students', [])
            return FakeConn(rows)

    return FakePool(rows_map)


def test_health_and_lookup_students(monkeypatch):
    # Import app after monkeypatching environment if needed
    import backend.api as api

    # Prepare fake rows for the lookup
    fake_rows = [
        {"value": 1, "label": "Alice Example"},
        {"value": 2, "label": "Bob Example"},
    ]

    fake_pool = _make_fake_pool({"lookups/students": fake_rows})

    # Patch the module pool so the app uses our fake instead of a real DB pool
    monkeypatch.setattr(api, "pool", fake_pool)

    # If API_KEY is required, provide it in headers
    headers = {}
    if getattr(api, "API_KEY", None):
        headers["x-api-key"] = api.API_KEY

    with TestClient(api.app) as client:
        r = client.get("/health", headers=headers)
        assert r.status_code == 200
        assert r.json() == {"status": "ok"}

        r = client.get("/lookups/students", headers=headers)
        assert r.status_code == 200
        body = r.json()
        assert "data" in body
        assert isinstance(body["data"], list)
        # Should equal our fake rows after conversion to dicts
        assert body["data"] == fake_rows
