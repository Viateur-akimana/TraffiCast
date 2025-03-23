import os
import requests
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

class TrafficDataFetcher:
    @staticmethod
    def get_weather(city: str):
        url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={os.getenv('OPENWEATHER_API_KEY')}&units=metric"
        response = requests.get(url)
        return {
            "temp": response.json()["main"]["temp"],
            "humidity": response.json()["main"]["humidity"],
            "rain": response.json().get("rain", {}).get("1h", 0)
        }

    @staticmethod
    def get_traffic(lat: float, lon: float):
        url = f"https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?point={lat},{lon}&key={os.getenv('TOMTOM_API_KEY')}"
        response = requests.get(url)
        return {
            "current_speed": response.json()["flowSegmentData"]["currentSpeed"],
            "free_flow_speed": response.json()["flowSegmentData"]["freeFlowSpeed"]
        }

def prepare_dataset():
    # Mock data generation (replace with real historical data)
    data = {
        "temp": [20, 25, 15, 30, 10],
        "humidity": [60, 70, 50, 80, 40],
        "rain": [0, 5, 0, 10, 0],
        "hour": [8, 12, 18, 20, 7],
        "is_weekend": [0, 0, 1, 1, 0],
        "congestion_level": [3, 5, 8, 9, 2]  # 1-10 scale
    }
    return pd.DataFrame(data)

model = Pipeline([
    ('scaler', StandardScaler()),
    ('regressor', RandomForestRegressor(n_estimators=100))
]).fit(*prepare_dataset())

class PredictionInput(BaseModel):
    city: str
    lat: float
    lon: float
    hour: int
    is_weekend: bool