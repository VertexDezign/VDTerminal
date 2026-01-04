import ProgressBar from "./ProgressBar.tsx";
import { getVal } from "../utils/valueUtils.ts";

interface FillUnit {
  fillLevelPercentage?: string;
  title?: string;
  type?: string;
  unit?: string;
  [key: string]: any;
}

interface FillUnitsDisplayProps {
  fillUnits: FillUnit | FillUnit[];
  className?: string;
}

export default function FillUnitsDisplay({
  fillUnits: fillUnitsData,
  className = "flex flex-col gap-2",
}: FillUnitsDisplayProps) {
  const fillUnits = Array.isArray(fillUnitsData)
    ? fillUnitsData
    : [fillUnitsData];

  return (
    <div className={className}>
      {fillUnits.map((fu: any, idx: number) => {
        const percentage = parseInt(fu.fillLevelPercentage || "0");
        const title = fu.title || fu.type;
        const level = getVal(fu);
        const unit = fu.unit || "";

        if (!fu.type && !fu.title && (level === 0 || level === "0"))
          return null;

        return (
          <ProgressBar
            key={idx}
            percentage={percentage}
            leftLabel={title || "Fill"}
            rightLabel={`${level}${unit}`}
          />
        );
      })}
    </div>
  );
}
