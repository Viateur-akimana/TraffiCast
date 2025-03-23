
import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

type TimeSelectorProps = {
    value: number;
    onChange: (hour: number) => void;
};

export const TimeSelector = ({ value, onChange }: TimeSelectorProps) => {
    const getTimeLabel = (hour: number) => {
        const period = hour >= 12 ? "PM" : "AM";
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        return `${displayHour}:00 ${period}`;
    };

    const getTodText = (hour: number) => {
        if (hour >= 5 && hour < 12) return "Morning";
        if (hour >= 12 && hour < 17) return "Afternoon";
        if (hour >= 17 && hour < 21) return "Evening";
        return "Night";
    };

    const getTimeClass = (hour: number) => {
        // Morning
        if (hour >= 5 && hour < 12) return "bg-blue-50 text-blue-600 border-blue-200";
        // Afternoon
        if (hour >= 12 && hour < 17) return "bg-amber-50 text-amber-600 border-amber-200";
        // Evening
        if (hour >= 17 && hour < 21) return "bg-orange-50 text-orange-600 border-orange-200";
        // Night
        return "bg-indigo-50 text-indigo-600 border-indigo-200";
    };

    return (
        <div>
            <label className="label-text mb-2">Time of Day</label>
            <div className="relative">
                <div className="flex items-center bg-white/90 rounded-lg border border-gray-200 px-3 py-2">
                    <Clock className="w-5 h-5 text-gray-500 mr-2" />
                    <input
                        type="range"
                        min="0"
                        max="23"
                        value={value}
                        onChange={(e) => onChange(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                </div>
                <div className="mt-2 flex justify-between items-center">
                    <div className={`text-sm font-medium py-1 px-3 rounded-full ${getTimeClass(value)}`}>
                        {getTodText(value)}
                    </div>
                    <div className="text-sm font-medium">{getTimeLabel(value)}</div>
                </div>
            </div>
        </div>
    );
};