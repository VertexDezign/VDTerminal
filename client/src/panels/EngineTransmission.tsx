import { Minus, Plus, Tractor } from "lucide-react";
import FendtPanel from "../components/FendtPanel";
import Gauge from "../components/Gauge";
import { getVal, getValAsNumber } from "../utils/valueUtils";

interface EngineTransmissionProps {
  vehicle: any;
}

export default function EngineTransmission({
  vehicle,
}: EngineTransmissionProps) {
  const motor = vehicle.motor;

  return (
    <FendtPanel title="Engine and Transmission" icon={<Tractor size={16} />}>
      <div className="flex flex-col items-center h-full relative">
        <div className="text-[8px] font-bold text-gray-400 uppercase mb-1">
          Press speedometer for cruise control
        </div>
        <div className="flex justify-between w-full px-4 absolute top-8">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full border-2 border-gray-400 flex items-center justify-center">
              <Minus size={14} />
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full border-2 border-gray-400 flex items-center justify-center">
              <Plus size={14} />
            </div>
          </div>
        </div>
        <Gauge
          label=""
          value={getValAsNumber(vehicle.speed)}
          min={0}
          max={60}
          unit={vehicle.speed.unit}
          size={130}
        />

        <div className="grid grid-cols-2 w-full mt-2 gap-x-8 text-center">
          <div>
            <div className="text-[8px] font-bold text-gray-400 uppercase">
              FUEL/HR
            </div>
            <div className="text-xl font-bold text-gray-700">7.7</div>
          </div>
          <div>
            <div className="text-[8px] font-bold text-gray-400 uppercase">
              DEF/HR
            </div>
            <div className="text-xl font-bold text-gray-700">0.6</div>
          </div>
          <div className="mt-2">
            <div className="text-[8px] font-bold text-gray-400 uppercase">
              RPM
            </div>
            <div className="text-2xl font-bold text-gray-700">
              {getVal(motor.rpm)}
            </div>
          </div>
          <div className="mt-2">
            <div className="text-[8px] font-bold text-gray-400 uppercase">
              WATER
            </div>
            <div className="text-2xl font-bold text-gray-700">
              {getVal(motor.temperatur)}
            </div>
          </div>
        </div>

        <div className="mt-2 flex items-center gap-1 bg-gray-200 p-1 rounded">
          <Tractor size={14} className="text-fendt-green" />
          <div className="w-4 h-2 bg-fendt-green rounded-sm"></div>
        </div>
      </div>
    </FendtPanel>
  );
}
