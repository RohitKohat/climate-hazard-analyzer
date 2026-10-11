import numpy as np
from scipy import stats

def linear_trend(annual, field="total_days"):
    years = np.array([a["year"] for a in annual])
    vals = np.array([a[field] for a in annual], dtype=float)
    if len(years) < 3 or np.all(vals == vals[0]):
        return {"slope": 0.0, "p_value": 1.0, "r_squared": 0.0, "direction": "flat"}
    slope, intercept, r, p, se = stats.linregress(years, vals)
    direction = "increasing" if slope > 0 else "decreasing" if slope < 0 else "flat"
    return {"slope": round(float(slope), 3), "p_value": round(float(p), 4),
            "r_squared": round(float(r ** 2), 3), "direction": direction}

def percent_change(annual, field="total_days", window=5):
    if len(annual) < window * 2:
        return None
    first = float(np.mean([a[field] for a in annual[:window]]))
    last = float(np.mean([a[field] for a in annual[-window:]]))
    if first == 0:
        return {"absolute_change": round(last - first, 2), "percent_change": None}
    pct = ((last - first) / first) * 100
    return {"absolute_change": round(last - first, 2), "percent_change": round(pct, 1)}

def mann_kendall(annual, field="total_days"):
    vals = [a[field] for a in annual]
    n = len(vals)
    if n < 3:
        return {"trend": "insufficient_data"}
    s = sum(np.sign(vals[j] - vals[i]) for i in range(n - 1) for j in range(i + 1, n))
    var_s = n * (n - 1) * (2 * n + 5) / 18
    z = (s - 1) / np.sqrt(var_s) if s > 0 else (s + 1) / np.sqrt(var_s) if s < 0 else 0.0
    p = 2 * (1 - stats.norm.cdf(abs(z)))
    trend = "increasing" if z > 0 else "decreasing" if z < 0 else "no trend"
    return {"z": round(float(z), 3), "p_value": round(float(p), 4), "trend": trend}