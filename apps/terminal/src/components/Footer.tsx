import { Cpu, Fuel, Satellite } from "lucide-react";
import { getVal } from "../utils/valueUtils";
import type { Vehicle } from "../data/Vehicle.ts";

interface FooterProps {
  vehicle?: Vehicle;
}

const getDirectionFromHeading = (heading: number) => {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const index = Math.floor(heading / 22.5 + 0.5) % 8;
  return directions[index];
};

export default function Footer({ vehicle }: FooterProps) {
  if (!vehicle) {
    return (
      <footer className="bg-black text-white p-2 px-6 flex items-center justify-between h-14">
        <div className="flex items-center gap-10">
          <Satellite className="text-gray-700 w-6 h-6" />
          <div className="w-8 h-8 rounded-full border-2 border-gray-500 flex items-center justify-center">
            <Cpu className="text-gray-500 w-5 h-5" />
          </div>
        </div>
        <div className="text-[10px] font-bold uppercase text-gray-400">VDTERMINAL SYSTEM READY</div>
      </footer>
    );
  }

  // calculate direction (east west north south) from heading
  const gpsEnabled = getVal(vehicle.gps.enabled);
  const gpsActive = getVal(vehicle.gps.active);
  const aiActive = getVal(vehicle.ai.active);
  const direction = getDirectionFromHeading(vehicle.gps.heading);
  const fuelLevel = vehicle.motor?.fillUnits?.fuel?.fillLevelPercentage ?? 100;
  const isLowFuel = fuelLevel <= 10;

  return (
    <footer className="bg-black text-white p-2 px-6 grid grid-cols-3 items-center h-14">
      <div className="flex items-center gap-10">
        <div className="relative">
          <Satellite
            className={`w-6 h-6 ${
              gpsEnabled ? (gpsActive ? "text-green-600" : "text-gray-500") : "text-gray-700"
            }`}
          />
          {!gpsEnabled && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-0.5 bg-red-600 rotate-45" />
            </div>
          )}
        </div>
        <div
          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${aiActive ? "border-green-600" : "border-gray-500"}`}
        >
          <Cpu className={`w-5 h-5 ${aiActive ? "text-green-600" : "text-gray-500"}`} />
        </div>
      </div>

      <div className="flex items-center justify-center gap-12">
        <div className="text-3xl font-bold w-12 text-center">{direction}</div>
        <div className="text-4xl font-black tabular-nums w-20 text-center">
          {getVal(vehicle.gps.heading)}
        </div>
        <div className="flex items-center gap-2">
          <Fuel className={isLowFuel ? "text-red-500" : "text-gray-400"} size={20} />
          <div className="h-6 w-1 bg-gray-700 relative overflow-hidden">
            <div
              className="absolute bottom-0 left-0 w-full bg-white transition-all duration-500"
              style={{ height: `${fuelLevel}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end text-[10px] font-bold uppercase text-gray-400 leading-tight">
        <div>{getVal(vehicle.name)}</div>
        <div className="truncate max-w-full">{getVal(vehicle.type)}</div>
      </div>
    </footer>
  );
}
