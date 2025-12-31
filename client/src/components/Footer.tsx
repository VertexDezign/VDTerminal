import { Fuel, Satellite, Tractor } from "lucide-react";
import { getVal } from "../utils/valueUtils";
import type { Vehicle } from "../data/Vehicle.ts";

interface FooterProps {
  vehicle: Vehicle;
}

const getDirectionFromHeading = (heading: number) => {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const index = Math.floor(heading / 22.5 + 0.5) % 8;
  return directions[index];
};

export default function Footer({ vehicle }: FooterProps) {
  // calculate direction (east west north south) from heading
  const direction = getDirectionFromHeading(vehicle.gps.heading);

  return (
    <footer className="bg-black text-white p-2 px-6 flex justify-between items-center h-14">
      <div className="flex items-center gap-10">
        <Satellite className="w-6 h-6 text-gray-400" />
        <div className="w-8 h-8 rounded-full border-2 border-gray-400 flex items-center justify-center">
          <Tractor className="w-5 h-5" />
        </div>
        <div className="flex flex-col items-center">
          <div className="text-xs font-bold text-gray-500">A ... B</div>
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-1.5 h-0.5 bg-gray-600"></div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-12">
        <div className="flex flex-col items-center">
          <div className="text-xs font-bold text-gray-400">90°</div>
          <div className="w-6 h-6 rounded-full border border-green-500 flex items-center justify-center">
            <div className="w-0.5 h-4 bg-green-500 transform rotate-45"></div>
          </div>
        </div>
        <div className="w-8 h-8 flex flex-col justify-between py-1">
          <div className="h-0.5 w-full bg-gray-600"></div>
          <div className="h-0.5 w-full bg-gray-300"></div>
          <div className="h-0.5 w-full bg-gray-600"></div>
        </div>
        <div className="text-3xl font-bold">{direction}</div>
        <div className="text-4xl font-black tabular-nums">
          {getVal(vehicle.gps.heading)}
        </div>
        <div className="flex items-center gap-2">
          <Fuel className="text-gray-400" size={20} />
          <div className="h-6 w-1 bg-white"></div>
        </div>
      </div>

      <div className="flex flex-col items-end text-[10px] font-bold uppercase text-gray-400 leading-tight">
        <div>{getVal(vehicle.name)}</div>
        <div>{getVal(vehicle.type)}</div>
      </div>
    </footer>
  );
}
