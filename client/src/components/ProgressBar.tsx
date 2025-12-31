import React from 'react';

interface ProgressBarProps {
  value: number;
  capacity: number;
  unit: string;
  label: string;
  color?: string;
  vertical?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, capacity, unit, label, color = "var(--color-fendt-green)", vertical = false }) => {
  const percentage = Math.min(Math.max((value / capacity) * 100, 0), 100);

  if (vertical) {
    return (
      <div className="flex flex-col items-center h-full">
        <div className="w-4 h-32 bg-gray-200 border border-gray-300 rounded-sm relative overflow-hidden flex flex-col justify-end">
          <div 
            className="w-full transition-all duration-1000"
            style={{ height: `${percentage}%`, backgroundColor: color }}
          ></div>
        </div>
        <span className="mt-1 text-[8px] font-bold text-gray-500 uppercase">{label}</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-1 px-1">
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">{label}</span>
        <span className="text-[10px] font-bold text-gray-800 tabular-nums">{value} {unit}</span>
      </div>
      <div className="w-full bg-gray-200 h-2 border border-gray-300 rounded-sm overflow-hidden">
        <div 
          className="h-full transition-all duration-1000"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
