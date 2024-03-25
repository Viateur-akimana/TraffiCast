from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .models import PredictionInput, model, TrafficDataFetcher

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/predict")
async def predict(data: PredictionInput):
    weather = TrafficDataFetcher.get_weather(data.city)
    traffic = TrafficDataFetcher.get_traffic(data.lat, data.lon)
    
    congestion = model.predict([[
        weather["temp"],
        weather["humidity"],
        weather["rain"],
        data.hour,
        1 if data.is_weekend else 0
    ]])[0]
    
    return {
        "congestion": float(congestion),
        "current_speed": traffic["current_speed"],
        "free_flow_speed": traffic["free_flow_speed"]
    }