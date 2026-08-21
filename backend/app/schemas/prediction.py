from pydantic import BaseModel, Field


class PredictionRequest(BaseModel):
    location: str
    carpet_area_sqft: float = Field(gt=0)
    floor_num: float
    bathroom: float
    balcony: float
    car_parking: float
    furnishing: str       # "Furnished" | "Semi-Furnished" | "Unfurnished"
    transaction: str      # "New Property" | "Resale"
    ownership: str
    facing: str


class PredictionResponse(BaseModel):
    predicted_price: float


