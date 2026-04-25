import { ArrowLeft, ArrowRight, Lightbulb, Siren, Triangle } from "lucide-react";
import Panel from "../components/Panel.tsx";
import StatusIconButton from "../components/StatusIconButton";
import { getValAsBoolean } from "../utils/valueUtils.ts";
import type { Vehicle } from "../data/Vehicle.ts";

interface LightingProps {
  vehicle: Vehicle;
}

export default function Lighting({ vehicle }: LightingProps) {
  return (
    <Panel title="Lighting" icon={<Lightbulb size={16} />}>
      <div className="w-full h-full flex items-center justify-center overflow-hidden relative">
        <div className="relative max-h-full max-w-full aspect-square">
          {/* Background Schematic */}
          <img
            src="mb_trac.png"
            className="w-full h-full object-contain block opacity-50"
            alt="Tractor Schematic"
          />

          {/* Beacon Light - Top center of cabin */}
          <div className="absolute left-[58%] top-[15%] -translate-1/2">
            <StatusIconButton
              icon={<Siren size={20} />}
              round={true}
              active={getValAsBoolean(vehicle.lights?.beaconLight)}
            />
          </div>

          {/* Worklight Front - Front of cabin */}
          <div className="absolute left-[42%] top-[25%] -translate-1/2">
            <StatusIconButton
              icon={<Lightbulb size={20} />}
              round={true}
              active={getValAsBoolean(vehicle.lights?.workLight?.front)}
            />
          </div>

          {/* Worklight Back - Back of cabin */}
          <div className="absolute left-[74%] top-[25%] -translate-1/2">
            <StatusIconButton
              icon={<Lightbulb size={20} />}
              round={true}
              active={getValAsBoolean(vehicle.lights?.workLight?.back)}
            />
          </div>

          {/* High Beam - Upper front */}
          <div className="absolute left-[10%] top-[42%] -translate-1/2">
            <StatusIconButton
              icon={<Lightbulb size={20} />}
              round={true}
              active={getValAsBoolean(vehicle.lights?.light.highBeam)}
            />
          </div>

          {/* Low Beam - Lower front */}
          <div className="absolute left-[10%] top-[55%] -translate-1/2">
            <StatusIconButton
              icon={<Lightbulb size={20} />}
              round={true}
              active={getValAsBoolean(vehicle.lights?.light.lowBeam)}
            />
          </div>

          {/* Indicators / Turn Signals (optional bottom row if needed) */}
          <div className="absolute left-[35%] top-[83%] -translate-1/2">
            <StatusIconButton
              icon={<ArrowLeft size={20} />}
              round={true}
              active={getValAsBoolean(vehicle.lights?.indicator?.left)}
            />
          </div>
          <div className="absolute left-[50%] top-[83%] -translate-1/2">
            <StatusIconButton
              icon={<Triangle size={20} />}
              round={true}
              active={getValAsBoolean(vehicle.lights?.indicator?.hazard)}
            />
          </div>
          <div className="absolute left-[65%] top-[83%] -translate-1/2">
            <StatusIconButton
              icon={<ArrowRight size={20} />}
              round={true}
              active={getValAsBoolean(vehicle.lights?.indicator?.right)}
            />
          </div>
        </div>
      </div>
    </Panel>
  );
}
