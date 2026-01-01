import {
  ArrowLeft,
  ArrowRight,
  Lightbulb,
  Siren,
  Triangle,
} from "lucide-react";
import FendtPanel from "../components/FendtPanel";
import StatusIconButton from "../components/StatusIconButton";
import { getValAsBoolean } from "../utils/valueUtils.ts";
import type { Vehicle } from "../data/Vehicle.ts";

interface LightingProps {
  vehicle: Vehicle;
}

export default function Lighting({ vehicle }: LightingProps) {
  return (
    <FendtPanel title="Lighting" icon={<Lightbulb size={16} />}>
      <div className="h-full w-full flex items-center justify-center p-4">
        <div className="relative w-full aspect-[200/120] max-h-full">
          {/* Background Schematic */}
          <img
            src="mb_trac.png"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none opacity-50"
            alt="Tractor Schematic"
          />

          {/* Beacon Light - Top center of cabin */}
          <div className="absolute left-[58%] top-[-15%] -translate-x-1/2">
            <StatusIconButton
              icon={<Siren size={20} />}
              round={true}
              active={getValAsBoolean(vehicle.lights?.beaconLight)}
            />
          </div>

          {/* Worklight Front - Front of cabin */}
          <div className="absolute left-[42%] top-[0%] -translate-x-1/2">
            <StatusIconButton
              icon={<Lightbulb size={20} />}
              round={true}
              active={getValAsBoolean(vehicle.lights?.workLight?.front)}
            />
          </div>

          {/* Worklight Back - Back of cabin */}
          <div className="absolute left-[74%] top-[0%] -translate-x-1/2">
            <StatusIconButton
              icon={<Lightbulb size={20} />}
              round={true}
              active={getValAsBoolean(vehicle.lights?.workLight?.back)}
            />
          </div>

          {/* High Beam - Upper front */}
          <div className="absolute left-[15%] top-[25%] -translate-x-1/2">
            <StatusIconButton
              icon={<Lightbulb size={20} />}
              round={true}
              active={getValAsBoolean(vehicle.lights?.light.highBeam)}
            />
          </div>

          {/* Low Beam - Lower front */}
          <div className="absolute left-[15%] top-[50%] -translate-x-1/2">
            <StatusIconButton
              icon={<Lightbulb size={20} />}
              round={true}
              active={getValAsBoolean(vehicle.lights?.light.lowBeam)}
            />
          </div>

          {/* Indicators / Turn Signals (optional bottom row if needed) */}
          <div className="absolute left-[35%] top-[90%] -translate-x-1/2">
            <StatusIconButton
              icon={<ArrowLeft size={20} />}
              round={true}
              active={getValAsBoolean(vehicle.lights?.turnLight?.left)}
            />
          </div>
          <div className="absolute left-[50%] top-[90%] -translate-x-1/2">
            <StatusIconButton
              icon={<Triangle size={20} />}
              round={true}
              active={getValAsBoolean(vehicle.lights?.turnLight?.hazard)}
            />
          </div>
          <div className="absolute left-[65%] top-[90%] -translate-x-1/2">
            <StatusIconButton
              icon={<ArrowRight size={20} />}
              round={true}
              active={getValAsBoolean(vehicle.lights?.turnLight?.right)}
            />
          </div>
        </div>
      </div>
    </FendtPanel>
  );
}
