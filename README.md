# House Price Prediction — End-to-End ML Web App

An end-to-end machine learning web application that predicts house prices in India,
built from raw data to a deployed web app: a Jupyter notebook for data cleaning and
model training, a FastAPI backend serving the trained model, and a React frontend
where users enter property details and get an instant prediction.

## Overview

The project follows the full ML product lifecycle:
Raw Kaggle Dataset (house_prices.csv)
│
▼
Jupyter Notebook (cleaning, feature engineering, training, evaluation)
│
▼
Exported Model (house_price.pkl) + locations.json
│
▼
FastAPI Backend (/health, /predict)
│
▼
React Frontend (form → API call → result page)
│
▼
Predicted Price shown to the user (e.g. ₹ 4.53 Cr)


## Tech Stack

| Layer | Technology |
|---|---|
| Data & Modeling | Python, Pandas, NumPy, scikit-learn, Jupyter |
| Backend | FastAPI, Pydantic, Uvicorn, Joblib |
| Frontend | React, TypeScript, Vite, React Router |
| Tooling | Git, GitHub |

## Project Structure
house-price-project/
├── notebooks/
│ ├── house_price_model.ipynb # data cleaning, training, evaluation, export
│ ├── house_price.pkl # exported trained pipeline
│ └── locations.json # allowed locations for the frontend dropdown
├── backend/
│ ├── app/
│ │ ├── main.py # FastAPI app, CORS, lifespan model loading
│ │ ├── api/routes/prediction.py # GET /health, POST /predict
│ │ ├── schemas/prediction.py # PredictionRequest / PredictionResponse
│ │ ├── services/
│ │ │ ├── preprocessing.py # builds one-row DataFrame from a request
│ │ │ └── inference.py # loads .pkl, runs prediction
│ │ └── data/locations.json
│ ├── models/house_price.pkl
│ ├── tests/test_prediction.py
│ ├── requirements.txt
│ └── .env.example
└── frontend/
├── src/
│ ├── api/predictionClient.ts # fetch wrapper
│ ├── components/PredictionForm.tsx
│ ├── pages/HomePage.tsx | ResultPage.tsx | NotFoundPage.tsx
│ ├── types/prediction.ts
│ └── App.tsx
└── .env.example


## Dataset

**House Price** dataset by Juhi Bhojani on Kaggle (~187,000 real property listings from India):
https://www.kaggle.com/datasets/juhibhojani/house-price

The raw CSV is **not committed** to this repository (it's large). To get it:

```bash
pip install kaggle
# Get your API token: Kaggle → Settings → API → "Create New Token"
# Place kaggle.json in C:\Users\<you>\.kaggle\ (Windows) or ~/.kaggle/ (macOS/Linux)
kaggle datasets download -d juhibhojani/house-price -p notebooks/data --unzip
```

## Backend Setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate        # Windows
# source .venv/bin/activate   # macOS / Linux

pip install -r requirements.txt

uvicorn app.main:app --reload
# Swagger UI: http://localhost:8000/docs
```

### Environment Variables (backend)

| Variable | Description | Example |
|---|---|---|
| *(none required currently)* | — | — |

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
# App runs at http://localhost:5173
```

### Environment Variables (frontend)

| Variable | Description | Example |
|---|---|---|
| `VITE_API_BASE_URL` | Base URL of the FastAPI backend | `http://localhost:8000` |

## API Reference

### `GET /health`
Returns backend status.

**Response**
```json
{ "status": "ok" }
```

### `POST /predict`
Predicts a house price from property details.

**Request body**
```json
{
  "location": "mumbai",
  "carpet_area_sqft": 1200,
  "floor_num": 3,
  "bathroom": 2,
  "balcony": 1,
  "car_parking": 1,
  "furnishing": "Semi-Furnished",
  "transaction": "Resale",
  "ownership": "Freehold",
  "facing": "East"
}
```

**Response**
```json
{ "predicted_price": 45300000.0 }
```

**curl example**
```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "location": "mumbai",
    "carpet_area_sqft": 1200,
    "floor_num": 3,
    "bathroom": 2,
    "balcony": 1,
    "car_parking": 1,
    "furnishing": "Semi-Furnished",
    "transaction": "Resale",
    "ownership": "Freehold",
    "facing": "East"
  }'
```

## Model Performance

Two models were trained and compared on a held-out test set:

| Model | MAE | RMSE | R² |
|---|---|---|---|
| Linear Regression | 3,728,036 | 5,579,871 | 0.758 |
| **Random Forest Regressor (chosen)** | **913,117** | **2,676,850** | **0.944** |

**Random Forest Regressor** was selected as the final model — it captures the
non-linear interactions between features (location, area, furnishing, etc.) far
better than a linear baseline, cutting error roughly in half and explaining ~94%
of price variance versus ~76% for Linear Regression.

5-fold cross-validation on the Random Forest model gave a mean R² of **0.569**,
with scores ranging from -0.03 to 0.94 across folds — indicating some sensitivity
to how the data is split, likely due to regional price variation not evenly
represented in every fold.

## Screenshots

*(add screenshots of the running app here — HomePage form, and the ResultPage
showing a predicted price)*

## Running the Full Flow

1. Start the backend: `uvicorn app.main:app --reload` (port 8000)
2. Start the frontend: `npm run dev` (port 5173)
3. Open `http://localhost:5173`, fill in the property details, and submit
4. The predicted price is displayed on the result page