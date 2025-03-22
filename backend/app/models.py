import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from pydantic import BaseModel

# Mock data generation
def generate_mock_data():
    np.random.seed(42)
    data = {
        "temperature": np.random.randint(10, 35, 100),
        "rainfall": np.random.random(100) * 10,
        "hour": np.random.randint(0, 24, 100),
        "is_weekend": np.random.choice([0, 1], 100),
        "traffic_level": np.random.randint(1, 10, 100),
    }
    return pd.DataFrame(data)

# Train model
def train_model():
    df = generate_mock_data()
    X = df.drop("traffic_level", axis=1)
    y = df["traffic_level"]
    model = RandomForestRegressor(n_estimators=50)
    model.fit(X, y)
    return model

# API input schema
class TrafficPredictionInput(BaseModel):
    temperature: float
    rainfall: float
    hour: int
    is_weekend: bool

model = train_model()