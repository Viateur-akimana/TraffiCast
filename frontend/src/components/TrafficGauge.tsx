import { CongestionLevel } from "../types/api";
import { useEffect, useState } from "react";

type TrafficGaugeProps = {
    value: number;
    congestionLevel: CongestionLevel;
    animate?: boolean;
};

export const TrafficGauge = ({ value, congestionLevel, animate = true }: TrafficGaugeProps) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        if (!animate) {
            setDisplayValue(value);
            return;
        }

        // Animate the gauge
        const timeout = setTimeout(() => {
            setDisplayValue(prev => {
                const diff = value - prev;
                const increment = Math.sign(diff) * Math.min(Math.abs(diff), 2);
                const newValue = prev + increment;

                if (Math.abs(newValue - value) < 2) return value;
                return newValue;
            });
        }, 10);

        return () => clearTimeout(timeout);
    }, [value, displayValue, animate]);

    const getColor = (level: CongestionLevel) => {
        switch (level) {
            case "low": return "bg-traffic-low";
            case "medium": return "bg-traffic-medium";
            case "high": return "bg-traffic-high";
            case "severe": return "bg-traffic-severe";
        }
    };

    const getTextColor = (level: CongestionLevel) => {
        switch (level) {
            case "low": return "text-traffic-low";
            case "medium": return "text-traffic-medium";
            case "high": return "text-traffic-high";
            case "severe": return "text-traffic-severe";
        }
    };

    return (
        <div className= "flex flex-col items-center space-y-3" >
        <div className="relative w-full h-8 bg-gray-200 rounded-full overflow-hidden" >
            <div 
          className={ `absolute top-0 left-0 h-full transition-all duration-300 ${getColor(congestionLevel)}` }
    style = {{ width: `${displayValue}%` }
}
        > </div>
    </div>
    < div className = "flex w-full justify-between text-xs text-gray-500" >
        <span>0 </span>
        < span > 25 </span>
        < span > 50 </span>
        < span > 75 </span>
        < span > 100 </span>
        </div>
        < div className = "text-center" >
            <span className="text-sm text-gray-500" > Traffic Level </span>
                < div className = "text-3xl font-bold flex items-center justify-center space-x-1" >
                    <span>{ displayValue.toFixed(0) } </span>
                    < span className = {`text-lg ${getTextColor(congestionLevel)}`}>
            / 100
                        </span>
                        </div>
                        < div className = {`font-medium text-lg capitalize mt-1 ${getTextColor(congestionLevel)}`}>
                            { congestionLevel } Congestion
                                </div>
                                </div>
                                </div>
  );
};