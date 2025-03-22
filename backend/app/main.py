from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .models import TrafficPredictionInput, model

app = FastAPI()

# Allow CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/predict")
async def predict(data: TrafficPredictionInput):
    input_data = [[
        data.temperature,
        data.rainfall,
        data.hour,
        1 if data.is_weekend else 0,
    ]]
    prediction = model.predict(input_data)[0]
    return {"predicted_traffic": float(prediction)}