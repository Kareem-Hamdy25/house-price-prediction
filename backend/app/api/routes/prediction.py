from fastapi import APIRouter
from app.schemas.prediction import PredictionRequest, PredictionResponse
from app.services.preprocessing import build_dataframe
from app.services.inference import predict_price

router = APIRouter()


@router.get("/health")
def health():
    return {"status": "ok"}


@router.post("/predict", response_model=PredictionResponse)
def predict(request: PredictionRequest):
    df = build_dataframe(request)
    price = predict_price(df)
    return {"predicted_price": price}