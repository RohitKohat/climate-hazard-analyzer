import numpy as np

def compute_threshold(tmax_list, percentile=95.0):
    valid = [t for t in tmax_list if t is not None]
    if not valid:
        raise ValueError("No valid temperature data to compute threshold.")
    return float(np.percentile(valid, percentile))

def detect_heatwaves(dates, tmax, threshold, min_duration=3):
    events, streak = [], []
    for d, t in zip(dates, tmax):
        if t is not None and t > threshold:
            streak.append((d, t))
        else:
            if len(streak) >= min_duration:
                events.append(_summarize(streak))
            streak = []
    if len(streak) >= min_duration:
        events.append(_summarize(streak))
    return events

def _summarize(streak):
    temps = [t for _, t in streak]
    return {
        "start": streak[0][0], "end": streak[-1][0],
        "duration": len(streak),
        "mean_intensity": round(sum(temps) / len(temps), 2),
        "max_temp": round(max(temps), 2),
    }

def annual_metrics(dates, tmax, threshold, min_duration=3):
    events = detect_heatwaves(dates, tmax, threshold, min_duration)
    by_year = {}
    for e in events:
        y = int(e["start"][:4])
        by_year.setdefault(y, []).append(e)
    years = sorted({int(d[:4]) for d in dates})
    annual = []
    for y in years:
        evs = by_year.get(y, [])
        total_days = sum(e["duration"] for e in evs)
        annual.append({
            "year": y, "events": len(evs), "total_days": total_days,
            "mean_duration": round(total_days / len(evs), 2) if evs else 0,
            "max_duration": max((e["duration"] for e in evs), default=0),
            "mean_intensity": round(sum(e["mean_intensity"] for e in evs) / len(evs), 2) if evs else 0,
        })
    return annual, events