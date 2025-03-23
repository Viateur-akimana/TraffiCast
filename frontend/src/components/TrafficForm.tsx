import { useState } from "react";
import { useTrafficPrediction } from "../hooks/useTrafficPrediction";
import { TrafficPredictionResponse, CongestionLevel } from "../types/api";
import { TimeSelector } from "./TimeSelector";
import { TrafficGauge } from "./TrafficGauge";
import {
    Cloud,
    CloudRain,
    Thermometer,
    Calendar,
    Map,
    BarChart
} from "lucide-react";
import { toast } from "../hooks/use-toast";

export const TrafficForm = () => {
    const [formData, setFormData] = useState({
        temperature: 20,
        rainfall: 0,
        hour: 12,
        isWeekend: false,
        roadType: "highway" as const,
    });

    const [prediction, setPrediction] = useState<TrafficPredictionResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const { predictTraffic } = useTrafficPrediction();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const result = await predictTraffic(formData);
            setPrediction(result);
            toast({
                title: "Prediction Complete",
                description: `Traffic level: ${result.congestion_level.toUpperCase()}`,
                variant: "default",
            });
        } catch (error) {
            console.error("Prediction failed:", error);
            toast({
                title: "Prediction Failed",
                description: "There was an error processing your request",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        setFormData({
            ...formData,
            [name]: type === "checkbox"
                ? (e.target as HTMLInputElement).checked
                : type === "number"
                    ? Number(value)
                    : value,
        });
    };

    const handleTimeChange = (hour: number) => {
        setFormData({
            ...formData,
            hour,
        });
    };

    const getCongestionColor = (level: CongestionLevel | undefined) => {
        if (!level) return "bg-gray-100 text-gray-500";
        switch (level) {
            case "low": return "bg-green-100 text-green-700 border-green-200";
            case "medium": return "bg-yellow-100 text-yellow-700 border-yellow-200";
            case "high": return "bg-orange-100 text-orange-700 border-orange-200";
            case "severe": return "bg-red-100 text-red-700 border-red-200";
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6 text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Traffic Congestion Predictor</h1>
                <p className="text-gray-600">Enter weather and road conditions to predict traffic levels</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 glass-card p-6 rounded-2xl animate-fade-in">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="label-text flex items-center mb-2">
                                <Thermometer className="w-4 h-4 mr-1" />
                                Temperature (°C)
                            </label>
                            <div className="flex items-center space-x-4">
                                <input
                                    type="range"
                                    name="temperature"
                                    min="-10"
                                    max="40"
                                    value={formData.temperature}
                                    onChange={handleChange}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                                <span className="text-lg font-medium w-12 text-center">{formData.temperature}°</span>
                            </div>
                        </div>

                        <div>
                            <label className="label-text flex items-center mb-2">
                                <CloudRain className="w-4 h-4 mr-1" />
                                Rainfall (mm)
                            </label>
                            <div className="flex items-center space-x-4">
                                <input
                                    type="range"
                                    name="rainfall"
                                    min="0"
                                    max="50"
                                    value={formData.rainfall}
                                    onChange={handleChange}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                                <span className="text-lg font-medium w-12 text-center">{formData.rainfall}</span>
                            </div>
                        </div>

                        <TimeSelector value={formData.hour} onChange={handleTimeChange} />

                        <div>
                            <label className="label-text flex items-center mb-2">
                                <Map className="w-4 h-4 mr-1" />
                                Road Type
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {["highway", "urban", "rural"].map((type) => (
                                    <label
                                        key={type}
                                        className={`flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-all
                                        ${formData.roadType === type
                                                ? 'bg-primary/10 border-primary/30 text-primary font-medium'
                                                : 'bg-white/80 border-gray-200 text-gray-700'}`}
                                    >
                                        <input
                                            type="radio"
                                            name="roadType"
                                            value={type}
                                            checked={formData.roadType === type}
                                            onChange={handleChange}
                                            className="sr-only"
                                        />
                                        <span className="capitalize">{type}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center bg-white/80 p-3 rounded-lg border border-gray-200">
                            <input
                                type="checkbox"
                                id="isWeekend"
                                name="isWeekend"
                                checked={formData.isWeekend}
                                onChange={handleChange}
                                className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                            />
                            <label
                                htmlFor="isWeekend"
                                className="flex items-center ml-2 text-gray-700 cursor-pointer"
                            >
                                <Calendar className="w-4 h-4 mr-1" />
                                Is Weekend?
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg text-white font-medium 
                            bg-primary hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
                            ${isLoading ? "animate-pulse-slow" : ""}`}
                        >
                            <BarChart className="w-5 h-5 mr-2" />
                            {isLoading ? "Analyzing traffic data..." : "Predict Traffic Congestion"}
                        </button>
                    </form>
                </div>

                <div className="lg:col-span-2">
                    {prediction ? (
                        <div className="glass-card p-6 rounded-2xl animate-fade-in h-full">
                            <h3 className="font-bold text-lg mb-4 text-gray-800">Traffic Prediction</h3>

                            <TrafficGauge
                                value={prediction.predicted_traffic}
                                congestionLevel={prediction.congestion_level}
                            />

                            <div className="mt-6">
                                <h4 className="text-sm text-gray-500 mb-2">Conditions Summary</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Temperature:</span>
                                        <span className="font-medium">{formData.temperature}°C</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Rainfall:</span>
                                        <span className="font-medium">{formData.rainfall} mm</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Time:</span>
                                        <span className="font-medium">
                                            {formData.hour}:00 {formData.hour >= 12 ? 'PM' : 'AM'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Day type:</span>
                                        <span className="font-medium">{formData.isWeekend ? 'Weekend' : 'Weekday'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Road:</span>
                                        <span className="font-medium capitalize">{formData.roadType}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="glass-card p-6 rounded-2xl h-full flex flex-col items-center justify-center text-center">
                            <Cloud className="w-16 h-16 text-gray-300 mb-4" />
                            <h3 className="text-xl font-medium text-gray-700 mb-2">No Prediction Yet</h3>
                            <p className="text-gray-500">Fill out the form and click 'Predict' to see traffic conditions</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
