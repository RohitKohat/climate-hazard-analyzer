from pymongo import MongoClient
from app.config import MONGODB_URI, DB_NAME

client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=5000)
db = client[DB_NAME]

raw_weather_col = db["raw_weather"]
analysis_col = db["heatwave_analysis"]

raw_weather_col.create_index(
    [("lat", 1), ("lon", 1), ("start_date", 1), ("end_date", 1)]
)
analysis_col.create_index(
    [("lat", 1), ("lon", 1), ("start_year", 1), ("end_year", 1),
     ("percentile", 1), ("min_duration", 1)]
)