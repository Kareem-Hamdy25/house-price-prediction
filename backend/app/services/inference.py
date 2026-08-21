import joblib

_model = None


def load_model(path: str = "models/house_price.pkl"):
    global _model
    _model = joblib.load(path)


def predict_price(df) -> float:
    return float(_model.predict(df)[0])