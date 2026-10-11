from pydantic import BaseModel, Field
from typing import Optional

class AnalyzeRequest(BaseModel):
    # Single point (used when mode == "point")
    lat: float = Field(..., ge=-90, le=90)
    lon: float = Field(..., ge=-180, le=180)

    # Bounding box (used when mode == "box")
    mode: str = Field("point")           # "point" or "box"
    min_lat: Optional[float] = Field(None, ge=-90, le=90)
    max_lat: Optional[float] = Field(None, ge=-90, le=90)
    min_lon: Optional[float] = Field(None, ge=-180, le=180)
    max_lon: Optional[float] = Field(None, ge=-180, le=180)

    start_year: int = Field(..., ge=1940, le=2024)
    end_year: int = Field(..., ge=1940, le=2024)
    hazard: str = "heatwave"
    percentile: float = Field(95, ge=50, le=99)
    min_duration: int = Field(3, ge=1, le=10)
    location_label: Optional[str] = None