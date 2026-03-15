import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from psycopg_pool import AsyncConnectionPool

# Environment configuration
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL environment variable is required (Neon connection string)")

CORS_ORIGINS = [origin.strip() for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",") if origin.strip()]

# Database connection pool
pool = AsyncConnectionPool(
    conninfo=DATABASE_URL,
    max_size=5,
    num_workers=3,
    timeout=10,
)

app = FastAPI(title="Liverpool Database API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    # Open the pool and validate a connection on startup
    await pool.open(wait=True)


@app.on_event("shutdown")
async def shutdown_event():
    await pool.close()


@app.get("/health")
async def health_check():
    return {"status": "ok"}


@app.get("/students")
async def list_students():
    """Example read endpoint. Adjust the table/columns to match your Neon schema."""
    query = "SELECT id, name, email FROM students ORDER BY id LIMIT 50;"
    try:
        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute(query)
                rows = await cur.fetchall()
        return [{"id": r[0], "name": r[1], "email": r[2]} for r in rows]
    except Exception as exc:  # pragma: no cover - simple demo error handling
        raise HTTPException(status_code=500, detail=str(exc))
