import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
DB_NAME = os.getenv("DB_NAME", "climate_hazard")
_raw_origins = os.getenv("CORS_ORIGINS", "http://localhost:5173")

# Support comma-separated list for production
CORS_ORIGINS = [o.strip() for o in _raw_origins.split(",") if o.strip()]

if not MONGODB_URI:
    raise RuntimeError("MONGODB_URI is missing from .env")