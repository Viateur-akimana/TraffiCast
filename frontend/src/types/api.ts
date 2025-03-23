export type RoadType = "highway" | "urban" | "rural";

export type TrafficFormData = {
    temperature: number;
    rainfall: number;
    hour: number;
    isWeekend: boolean;
    roadType: RoadType;
};

export type CongestionLevel = "low" | "medium" | "high" | "severe";

export type TrafficPredictionResponse = {
    predicted_traffic: number;
    congestion_level: CongestionLevel;
};