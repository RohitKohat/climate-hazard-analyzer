from fastapi import APIRouter, HTTPException, Request, Query
from bson import ObjectId
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.models import AnalyzeRequest
from app.db import analysis_col
from app.services.weather import fetch_daily_tmax, fetch_grid_tmax
from app.services.heatwave import compute_threshold, annual_metrics
from app.services.trends import linear_trend, percent_change, mann_kendall
from app.services.geocode import geocode_city

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)


@router.get("/geocode")
@limiter.limit("30/minute")
async def geocode(request: Request, q: str = Query(..., min_length=1, max_length=100)):
    try:
        result = await geocode_city(q)
    except Exception as e:
        raise HTTPException(502, f"Geocoding failed: {e}")
    if not result:
        raise HTTPException(404, f"No city found for '{q}'")
    return result


@router.post("/analyze")
@limiter.limit("10/minute")
async def analyze(req: AnalyzeRequest, request: Request):
    if req.end_year < req.start_year:
        raise HTTPException(400, "end_year must be >= start_year")

    is_box = req.mode == "box"

    # For box mode, use the box center as a cache key anchor
    if is_box:
        if None in (req.min_lat, req.max_lat, req.min_lon, req.max_lon):
            raise HTTPException(400, "Box mode requires min_lat, max_lat, min_lon, max_lon")
        if req.min_lat >= req.max_lat or req.min_lon >= req.max_lon:
            raise HTTPException(400, "Invalid box: min must be < max")
        cache_lat = (req.min_lat + req.max_lat) / 2
        cache_lon = (req.min_lon + req.max_lon) / 2
    else:
        cache_lat, cache_lon = req.lat, req.lon

    cache_key = {
        "mode": req.mode,
        "min_lat": req.min_lat, "max_lat": req.max_lat,
        "min_lon": req.min_lon, "max_lon": req.max_lon,
        "start_year": req.start_year, "end_year": req.end_year,
        "percentile": req.percentile, "min_duration": req.min_duration,
    } if is_box else {
        "lat": req.lat, "lon": req.lon,
        "start_year": req.start_year, "end_year": req.end_year,
        "percentile": req.percentile, "min_duration": req.min_duration,
    }

    cached = analysis_col.find_one(cache_key)
    if cached:
        cached["cache_id"] = str(cached.pop("_id"))
        return cached

    start_date = f"{req.start_year}-01-01"
    end_date = f"{req.end_year}-12-31"

    try:
        if is_box:
            daily = await fetch_grid_tmax(
                req.min_lat, req.max_lat, req.min_lon, req.max_lon,
                start_date, end_date, n=3,
            )
        else:
            daily = await fetch_daily_tmax(req.lat, req.lon, start_date, end_date)
    except Exception as e:
        raise HTTPException(502, f"Failed to fetch weather data: {e}")

    dates, tmax = daily["time"], daily["temperature_2m_max"]

    try:
        threshold = compute_threshold(tmax, req.percentile)
    except ValueError as e:
        raise HTTPException(422, str(e))

    annual, events = annual_metrics(dates, tmax, threshold, req.min_duration)
    trend = linear_trend(annual)
    pct = percent_change(annual)
    mk = mann_kendall(annual)

    place = req.location_label or (
        f"box ({req.min_lat}, {req.min_lon}) to ({req.max_lat}, {req.max_lon})"
        if is_box else f"({req.lat:.2f}, {req.lon:.2f})"
    )

    if pct and pct.get("percent_change") is not None:
        direction = "increased" if pct["percent_change"] > 0 else "decreased"
        summary = (f"Heatwave days have {direction} by {abs(pct['percent_change'])}% "
                   f"in {place} between the first and last 5 years of the selected period.")
    else:
        summary = f"Insufficient data to compute percent change for {place}."

    doc = {
        **cache_key,
        "lat": cache_lat, "lon": cache_lon,
        "location_label": req.location_label,
        "mode": req.mode,
        "grid_points": daily.get("grid_points"),
        "grid_size": daily.get("grid_size"),
        "threshold_c": round(threshold, 2),
        "annual": annual, "events": events,
        "trend": {**trend, "percent_change": pct, "mann_kendall": mk},
        "summary": summary,
    }

    result = analysis_col.insert_one(doc)
    doc["cache_id"] = str(result.inserted_id)
    doc.pop("_id", None)
    return doc


@router.get("/results/{cache_id}")
async def get_results(cache_id: str):
    try:
        doc = analysis_col.find_one({"_id": ObjectId(cache_id)})
    except Exception:
        raise HTTPException(400, "Invalid id")
    if not doc:
        raise HTTPException(404, "Not found")
    doc["cache_id"] = str(doc.pop("_id"))
    return doc