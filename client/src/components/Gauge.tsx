import React from "react";

interface GaugeProps {
  value: number;
  min: number;
  max: number;
  unit: string;
  label: string;
  size?: number;
}

const Gauge: React.FC<GaugeProps> = ({
  value,
  min,
  max,
  unit,
  label,
  size = 160,
}) => {
  const center = size / 2;
  const radius = size * 0.42;

  const normalizedValue = Math.min(Math.max(value, min), max);
  const percentage = (normalizedValue - min) / (max - min);

  // Calculate angle for the indicator (from -135deg to 135deg)
  const startAngle = -135;
  const endAngle = 135;
  const currentAngle = startAngle + percentage * (endAngle - startAngle);

  // Generate tick marks
  const ticks = [];
  for (let i = 0; i <= 10; i++) {
    const angle = startAngle + (i / 10) * (endAngle - startAngle);
    const rad = (angle - 90) * (Math.PI / 180);
    const x1 = center + Math.cos(rad) * (radius * 0.9);
    const y1 = center + Math.sin(rad) * (radius * 0.9);
    const x2 = center + Math.cos(rad) * radius;
    const y2 = center + Math.sin(rad) * radius;
    ticks.push(
      <line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="#666"
        strokeWidth="2"
      />,
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background Gradients/Circles */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-gray-100 to-gray-300 shadow-inner flex items-center justify-center border border-gray-400">
          <div className="w-[85%] h-[85%] rounded-full bg-white shadow-sm flex items-center justify-center border border-gray-200">
            <div className="w-[60%] h-[60%] rounded-full bg-gray-100 border border-gray-300 shadow-inner"></div>
          </div>
        </div>

        <svg className="absolute inset-0 w-full h-full">
          {/* Ticks */}
          {ticks}

          {/* Numbers (optional, but keep it simple for now) */}
          <text
            x={center}
            y={center + size * 0.15}
            textAnchor="middle"
            className="text-[10px] font-bold fill-gray-500 uppercase tracking-tighter"
          >
            {unit}
          </text>

          {/* Indicator/Needle */}
          <g transform={`rotate(${currentAngle}, ${center}, ${center})`}>
            <path
              d={`M ${center} ${center - radius + 5} L ${center - 4} ${center - radius + 15} L ${center + 4} ${center - radius + 15} Z`}
              fill="var(--color-fendt-green)"
            />
          </g>
        </svg>

        {/* Center Value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
          <span className="text-2xl font-bold text-gray-800 tabular-nums">
            {value}
          </span>
        </div>
      </div>
      <span className="mt-1 text-[9px] font-bold uppercase text-gray-500 tracking-tight">
        {label}
      </span>
    </div>
  );
};

export default Gauge;
