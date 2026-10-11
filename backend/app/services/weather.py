import httpx
from datetime import datetime, timezone
from app.db import raw_weather_col

OPEN_METEO_URL = "https://archive-api.open-meteo.com/v1/archive"


async def fetch_daily_tmax(lat: float, lon: float, start_date: str, end_date: str):
    """Fetch daily max temperature from Open-Meteo, cached in MongoDB."""
    cached = raw_weather_col.find_one({
        "lat": lat, "lon": lon,
        "start_date": start_date, "end_date": end_date,
    })
    if cached:
        return cached["daily"]

    params = {
        "latitude": lat,
        "longitude": lon,
        "start_date": start_date,
        "end_date": end_date,
        "daily": "temperature_2m_max",
        "timezone": "auto",
    }

    async with httpx.AsyncClient(timeout=30.0) as client:
        r = await client.get(OPEN_METEO_URL, params=params)
        r.raise_for_status()
        data = r.json()

    daily = data.get("daily") or {}
    if "time" not in daily or "temperature_2m_max" not in daily:
        raise ValueError("Open-Meteo returned no daily data for this region.")

    # Clean outliers / nulls
    cleaned = [
        None if (t is None or t < -60 or t > 60) else t
        for t in daily["temperature_2m_max"]
    ]
    daily["temperature_2m_max"] = cleaned

    raw_weather_col.insert_one({
        "lat": lat, "lon": lon,
        "start_date": start_date, "end_date": end_date,
        "daily": daily,
        "fetched_at": datetime.now(timezone.utc).isoformat(),
    })
    return daily


async def fetch_grid_tmax(min_lat, max_lat, min_lon, max_lon, start_date, end_date, n=3):
    """Fetch Tmax for an n×n grid inside a bounding box, average per day."""
    from app.services.grid import grid_points

    points = grid_points(min_lat, max_lat, min_lon, max_lon, n=n)

    results = []
    for lat, lon in points:
        results.append(await fetch_daily_tmax(lat, lon, start_date, end_date))

    dates = results[0]["time"]
    n_days = len(dates)

    averaged = []
    for i in range(n_days):
        vals = [
            r["temperature_2m_max"][i]
            for r in results
            if r["temperature_2m_max"][i] is not None
        ]
        averaged.append(sum(vals) / len(vals) if vals else None)

    return {
        "time": dates,
        "temperature_2m_max": averaged,
        "grid_points": points,
        "grid_size": len(points),
    }