import httpx
from datetime import datetime, timezone
from app.db import db

geocode_cache_col = db["geocode_cache"]
geocode_cache_col.create_index("query")

OPEN_METEO_GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search"

async def geocode_city(query: str):
    """Search for a city by name using Open-Meteo geocoding, cached in MongoDB."""
    query_norm = query.strip().lower()
    if not query_norm:
        return None

    # Cache hit
    cached = geocode_cache_col.find_one({"query": query_norm})
    if cached:
        cached.pop("_id", None)
        cached.pop("query", None)
        cached.pop("cached_at", None)
        return cached

    params = {"name": query, "count": 1, "language": "en", "format": "json"}

    async with httpx.AsyncClient(timeout=15.0) as client:
        r = await client.get(OPEN_METEO_GEOCODE_URL, params=params)
        r.raise_for_status()
        data = r.json()

    results = data.get("results") or []
    if not results:
        return None

    top = results[0]
    result = {
        "lat": top["latitude"],
        "lon": top["longitude"],
        "name": top.get("name"),
        "country": top.get("country"),
        "admin1": top.get("admin1"),
        "label": f"{top.get('name')}, {top.get('country')}"
                 + (f" ({top.get('admin1')})" if top.get("admin1") else ""),
    }

    geocode_cache_col.insert_one({
        "query": query_norm,
        **result,
        "cached_at": datetime.now(timezone.utc).isoformat(),
    })
    return result