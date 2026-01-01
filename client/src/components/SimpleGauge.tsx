import React from "react";

interface SimpleGaugeProps {
  value: number;
  min: number;
  max: number;
  unit: string;
  size?: number;
  numOfTicks?: number;
  isActive?: boolean;
}

const SimpleGauge: React.FC<SimpleGaugeProps> = ({
  value,
  min,
  max,
  unit,
  size = 130,
  numOfTicks = 0,
  isActive = false,
}) => {
  const center = size / 2;
  const strokeWidth = size * 0.08;
  const radius = (size - strokeWidth) / 2 - 10;

  const normalizedValue = Math.min(Math.max(value, min), max);
  const percentage = (normalizedValue - min) / (max - min);

  // Simple arc from 225deg to 495deg (3/4 circle, open at bottom)
  const startAngle = 225;
  const endAngle = 495;
  const currentAngle = startAngle + percentage * (endAngle - startAngle);

  const polarToCartesian = (
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number,
  ) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  const describeArc = (
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number,
  ) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return [
      "M",
      start.x,
      start.y,
      "A",
      radius,
      radius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
    ].join(" ");
  };

  const ticks = [];
  for (let i = 0; i <= numOfTicks; i++) {
    const angle = startAngle + (i / numOfTicks) * (endAngle - startAngle);
    const rad = (angle - 90) * (Math.PI / 180);
    const innerR = radius - strokeWidth / 2;
    const outerR = radius + strokeWidth / 2;
    const x1 = center + Math.cos(rad) * innerR;
    const y1 = center + Math.sin(rad) * innerR;
    const x2 = center + Math.cos(rad) * outerR;
    const y2 = center + Math.sin(rad) * outerR;
    ticks.push(
      <line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="white"
        strokeWidth="1"
        className="opacity-40"
      />,
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full" viewBox={`0 0 ${size} ${size}`}>
          {/* Background Arc */}
          <path
            d={describeArc(center, center, radius, startAngle, endAngle)}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Active Arc */}
          <path
            d={describeArc(center, center, radius, startAngle, currentAngle)}
            fill="none"
            stroke={isActive ? "var(--color-fendt-green)" : "#94a3b8"}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Ticks */}
          {ticks}
        </svg>

        {/* Center Value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={`text-3xl font-bold leading-none tabular-nums ${isActive ? "text-fendt-green" : "text-gray-800"}`}
          >
            {max < 100
              ? value.toLocaleString("de-CH", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              : Math.round(value)}
          </span>
          <span className="text-sm font-medium text-gray-500 mt-1">{unit}</span>
        </div>
      </div>
    </div>
  );
};

export default SimpleGauge;
