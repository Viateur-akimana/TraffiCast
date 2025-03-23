import { TrafficFormData, TrafficPredictionResponse, CongestionLevel } from "../types/api";

export const useTrafficPrediction = () => {
    // This function simulates a traffic prediction API
    const predictTraffic = async (data: TrafficFormData): Promise<TrafficPredictionResponse> => {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1200));

        // Calculate base traffic based on hour
        let traffic = 0;

        // Rush hours: higher traffic
        if ((data.hour >= 7 && data.hour <= 9) || (data.hour >= 16 && data.hour <= 19)) {
            traffic += 75;
        }
        // Mid-day
        else if (data.hour >= 10 && data.hour <= 15) {
            traffic += 40;
        }
        // Night
        else {
            traffic += 15;
        }

        // Weekend reduction
        if (data.isWeekend) {
            traffic *= 0.7;
        }

        // Road type adjustment
        if (data.roadType === "highway") {
            traffic *= 1.2;
        } else if (data.roadType === "urban") {
            traffic *= 1.5;
        } else {
            traffic *= 0.8; // rural roads
        }

        // Weather effects
        // Rain increases traffic
        if (data.rainfall > 0) {
            traffic += data.rainfall * 2;
        }

        // Extreme temperatures impact traffic
        if (data.temperature < 0 || data.temperature > 30) {
            traffic += 15;
        }

        // Normalize to 0-100 scale
        traffic = Math.min(100, Math.max(0, traffic));

        // Determine congestion level
        let congestion_level: CongestionLevel;
        if (traffic < 30) {
            congestion_level = "low";
        } else if (traffic < 60) {
            congestion_level = "medium";
        } else if (traffic < 85) {
            congestion_level = "high";
        } else {
            congestion_level = "severe";
        }

        return {
            predicted_traffic: traffic,
            congestion_level
        };
    };

    return { predictTraffic };
};