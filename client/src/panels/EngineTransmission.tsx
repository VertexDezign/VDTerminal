import { ArrowDown, ArrowUp, FoldVertical, Power, Tractor } from "lucide-react";
import Panel from "../components/Panel.tsx";
import SimpleGauge from "../components/SimpleGauge";
import { getVal, getValAsBoolean, getValAsNumber } from "../utils/valueUtils";
import StatusIconButton from "../components/StatusIconButton.tsx";
import FillUnitsDisplay from "../components/FillUnitsDisplay.tsx";

interface EngineTransmissionProps {
  vehicle: any;
}

export default function EngineTransmission({
  vehicle,
}: EngineTransmissionProps) {
  const motor = vehicle.motor;
  const cruiseControl = vehicle.cruiseControl;

  const foldable = getVal(vehicle?.foldable);
  const isTurnedOn = getValAsBoolean(vehicle?.isTurnedOn);
  const lowered = getValAsBoolean(vehicle?.lowered);

  const fillUnitsData = vehicle?.fillUnits?.fillUnit || [];

  return (
    <Panel title="Engine and Transmission" icon={<Tractor size={16} />}>
      <div className="flex flex-col items-center h-full">
        <div className="flex items-center justify-between w-full px-2">
          {/* Left: Minus & RPM */}
          <div className="flex flex-col items-center gap-2 w-16">
            <div className="relative">
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                className="opacity-80"
              >
                <path
                  d="M 8 32 A 15 15 0 1 1 32 32"
                  fill="none"
                  stroke="#cbd5e1"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <text
                  x="20"
                  y="26"
                  textAnchor="middle"
                  className="text-[14px] font-black fill-slate-600"
                >
                  -
                </text>
              </svg>
            </div>
            <div className="mt-4 flex flex-col items-center">
              <span className="text-lg font-bold text-gray-700 tabular-nums">
                {getVal(motor.rpm)}
              </span>
              <span className="text-[9px] font-bold text-gray-400 uppercase">
                RPM
              </span>
            </div>
            <div className="mt-4 flex flex-col items-center">
              <div className="text-sm font-bold text-gray-600 tabular-nums">
                {getVal(vehicle?.motor?.fillUnits?.fuel?.usage)}
                {getVal(vehicle?.motor?.fillUnits?.fuel?.unit)}
              </div>
              <div className="text-[9px] font-bold text-gray-400 uppercase">
                FUEL/HR
              </div>
            </div>
          </div>

          {/* Center: Gauge */}
          <div className="flex flex-col items-center">
            <SimpleGauge
              value={getValAsNumber(vehicle.speed)}
              min={0}
              max={Math.max(
                getValAsNumber(vehicle.motor.maxSpeed.forward),
                getValAsNumber(vehicle.motor.maxSpeed.backward),
              )}
              unit={vehicle.speed.unit}
              size={140}
              isActive={getValAsBoolean(cruiseControl?.active)}
            />
            {cruiseControl && (
              <div className="mt-[-20px] flex flex-col items-center">
                <span
                  className={`text-lg font-bold tabular-nums ${getValAsBoolean(cruiseControl.active) ? "text-terminal-green" : "text-gray-600"}`}
                >
                  {getVal(cruiseControl.targetSpeed)}
                </span>
                <span className="text-[8px] font-bold text-gray-400 uppercase leading-none">
                  CRUISE
                </span>
              </div>
            )}
          </div>

          {/* Right: Plus & Water Temp */}
          <div className="flex flex-col items-center gap-2 w-16">
            <div className="relative">
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                className="opacity-80"
              >
                <path
                  d="M 8 32 A 15 15 0 1 1 32 32"
                  fill="none"
                  stroke="#cbd5e1"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <text
                  x="20"
                  y="26"
                  textAnchor="middle"
                  className="text-[14px] font-black fill-slate-600"
                >
                  +
                </text>
              </svg>
            </div>
            <div className="mt-4 flex flex-col items-center">
              <span className="text-lg font-bold text-gray-700 tabular-nums">
                {getVal(motor.temperatur)} {getVal(motor.temperatur.unit)}
              </span>
              <span className="text-[9px] font-bold text-gray-400 uppercase">
                WATER
              </span>
            </div>
            <div className="mt-4 flex flex-col items-center">
              <span className="text-sm font-bold text-gray-600 tabular-nums">
                {getVal(vehicle?.motor?.fillUnits?.def?.usage)}
              </span>
              <span className="text-[9px] font-bold text-gray-400 uppercase">
                DEF/HR
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full mt-4 text-center border-t border-gray-100 pt-2">
          <div className="flex flex-row gap-2">
            <StatusIconButton
              icon={<FoldVertical size={20} />}
              active={foldable === "FOLDED" || foldable === "EXTENDED"}
              color={foldable === "EXTENDED" ? "green" : "white"}
            />
            <StatusIconButton
              icon={<Power size={20} />}
              active={isTurnedOn}
              color="green"
            />
            <StatusIconButton
              icon={lowered ? <ArrowDown size={20} /> : <ArrowUp size={20} />}
              active={lowered}
              color="green"
            />
          </div>
          <FillUnitsDisplay fillUnits={fillUnitsData} />
        </div>

        <div className="mt-auto mb-2 flex items-center gap-1 bg-gray-200 p-1 rounded">
          <Tractor size={14} className="text-terminal-green" />
          <div className="w-4 h-2 bg-terminal-green rounded-sm"></div>
        </div>
      </div>
    </Panel>
  );
}
