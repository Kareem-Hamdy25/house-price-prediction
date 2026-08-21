import json
import pandas as pd
from app.schemas.prediction import PredictionRequest

ALLOWED_LOCATIONS: set[str] = set()


def load_locations(path: str = "app/data/locations.json"):
    global ALLOWED_LOCATIONS
    with open(path, encoding="utf-8") as f:
        ALLOWED_LOCATIONS = set(json.load(f))


def build_dataframe(request: PredictionRequest) -> pd.DataFrame:
    location = request.location if request.location in ALLOWED_LOCATIONS else "other"

    data = {
        "location_grouped": [location],
        "Carpet_Area_Sqft": [request.carpet_area_sqft],
        "floor_num": [request.floor_num],
        "Bathroom_num": [request.bathroom],
        "Balcony_num": [request.balcony],
        "Car Parking_num": [request.car_parking],
        "Furnishing": [request.furnishing],
        "Transaction": [request.transaction],
        "Ownership": [request.ownership],
        "facing": [request.facing],
    }
    return pd.DataFrame(data)