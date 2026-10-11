# Climate Hazard Trend Analyzer

A full-stack web application that detects and visualizes heatwave trends in any region on Earth using historical weather data.

**Live Demo:** [ADD URL AFTER DEPLOY]
**Repository:** [ADD GITHUB URL]

---

## Architecture

React Frontend (Vercel) → FastAPI Backend (Render) → MongoDB Atlas
                                              ↓
                                    Open-Meteo Weather API

---

## Features

### Core
- Region selection via city search + manual lat/lon
- Heatwave hazard (95th-percentile rule, 3+ consecutive days)
- Configurable time range (1940–2024)
- Time-series + bar chart visualizations
- Auto-generated summary insights

### Bonus
- City search via Open-Meteo Geocoding
- CSV export of events
- PDF export via browser print
- Linear regression trend detection
- Mann–Kendall non-parametric trend test
- Dark/light theme with system preference detection

---

## Heatwave Definition

3 or more consecutive days with Tmax above the 95th percentile of the selected period.
Missing days break streaks.

Trend analysis: percent change (first 5 years vs last 5 years), linear regression, Mann–Kendall test.

---

## Tech Stack

- Frontend: React 18, Vite, Tailwind CSS v4, Recharts, Framer Motion, Lucide
- Backend: FastAPI, Uvicorn, PyMongo, NumPy, SciPy, SlowAPI
- Database: MongoDB Atlas (M0)
- Data: Open-Meteo Archive + Geocoding APIs
- Deployment: Vercel + Render

---

## Local Setup

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt