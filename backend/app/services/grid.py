def grid_points(min_lat, max_lat, min_lon, max_lon, n=3):
    """Return n×n evenly spaced points inside a bounding box."""
    if min_lat > max_lat or min_lon > max_lon:
        raise ValueError("Invalid bounding box: min > max")

    lats = (
        [min_lat + (max_lat - min_lat) * i / (n - 1) for i in range(n)]
        if n > 1 else [(min_lat + max_lat) / 2]
    )
    lons = (
        [min_lon + (max_lon - min_lon) * i / (n - 1) for i in range(n)]
        if n > 1 else [(min_lon + max_lon) / 2]
    )

    return [(round(lat, 4), round(lon, 4)) for lat in lats for lon in lons]