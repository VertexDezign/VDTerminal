import { Lightbulb, Tractor } from "lucide-react";
import FendtPanel from "../components/FendtPanel";
import StatusIconButton from "../components/StatusIconButton";

interface LightingProps {
  vehicle: any;
}

export default function Lighting({ vehicle }: LightingProps) {
  return (
    <FendtPanel title="Lighting" icon={<Lightbulb size={16} />}>
      <div className="relative h-full">
        <div className="text-sm font-bold text-gray-400">98.6%</div>
        <div className="flex justify-around mt-4">
          <StatusIconButton
            icon={<Lightbulb size={24} />}
            round={true}
            active={vehicle.lights?.light.lowBeam === "true"}
          />
          <StatusIconButton
            icon={<Lightbulb size={24} />}
            round={true}
            active={vehicle.lights?.light.highBeam === "true"}
          />
          <StatusIconButton
            icon={<Lightbulb size={24} />}
            round={true}
            active={vehicle.lights?.beaconLight === "true"}
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 flex justify-center">
          <Tractor size={120} className="text-gray-300 opacity-50" />
        </div>
      </div>
    </FendtPanel>
  );
}
