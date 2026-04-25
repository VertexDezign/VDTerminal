import { useEffect, useRef, useState } from "react";

interface ProgressBarProps {
  percentage: number;
  leftLabel?: string;
  rightLabel?: string;
  className?: string;
}

export default function ProgressBar({
  percentage,
  leftLabel,
  rightLabel,
  className = "",
}: ProgressBarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const content = (
    <div
      className="absolute inset-0 flex justify-between items-center px-1"
      style={{ width: "100%", whiteSpace: "nowrap" }}
    >
      <span className="truncate flex-1 mr-1">{leftLabel}</span>
      <span className="shrink-0">{rightLabel}</span>
    </div>
  );

  return (
    <div
      ref={containerRef}
      className={`relative h-4 bg-gray-200 rounded overflow-hidden border border-gray-300 text-[9px] font-bold ${className}`}
    >
      {/* Background Text (Dark) */}
      <div className="text-gray-700 select-none w-full h-full relative">{content}</div>

      {/* Progress Bar */}
      <div
        className="absolute top-0 left-0 h-full bg-blue-600 transition-all duration-500 overflow-hidden pointer-events-none"
        style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
      >
        {/* Foreground Text (White) - same content but clipped by parent width */}
        <div
          className="text-white absolute top-0 left-0 h-full select-none"
          style={{
            width: `${containerWidth}px`,
          }}
        >
          {content}
        </div>
      </div>
    </div>
  );
}
