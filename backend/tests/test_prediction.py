from fastapi.testclient import TestClient

from app.main import app


def test_predict_happy_path():
    """Valid request should return 200 and a predicted_price float."""
    payload = {
        "location": "Test Location",
        "carpet_area_sqft": 1200,
        "floor_num": 3,
        "bathroom": 2,
        "balcony": 1,
        "car_parking": 1,
        "furnishing": "Furnished",
        "transaction": "Resale",
        "ownership": "Freehold",
        "facing": "East",
    }

    with TestClient(app) as client:
        response = client.post("/predict", json=payload)

    assert response.status_code == 200
    data = response.json()
    assert "predicted_price" in data
    assert isinstance(data["predicted_price"], (int, float))


def test_predict_invalid_input():
    """Missing required fields should return 422 Validation Error."""
    payload = {
        "location": "Test Location",
        # carpet_area_sqft وباقي الحقول المطلوبة ناقصة عمدًا
    }

    with TestClient(app) as client:
        response = client.post("/predict", json=payload)

    assert response.status_code == 422