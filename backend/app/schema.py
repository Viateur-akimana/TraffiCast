from pydantic import BaseModel

class TrafficPredictionInput(BaseModel):
    temperature: float = 20.0
    rainfall: float = 0.0
    hour: int = 12
    is_weekend: bool = False
    road_type: str = "highway"  # highway | urban | rural

class TrafficPredictionResponse(BaseModel):
    predicted_traffic: float
    congestion_level: str  # low | medium | high