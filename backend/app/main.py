from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from app.config import CORS_ORIGINS
from app.routers import analyze

limiter = Limiter(key_func=get_remote_address)
app = FastAPI(title="Climate Hazard Trend Analyzer")

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,        # loaded from env — never "*" in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze.router, prefix="/api")

@app.get("/")
def root():
    return {"status": "ok", "service": "climate-hazard-analyzer"}