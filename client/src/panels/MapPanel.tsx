import { Map, Navigation } from "lucide-react";
import Panel from "../components/Panel.tsx";
import type { Environment } from "../data/Environment.ts";
import type { Vehicle } from "../data/Vehicle.ts";

interface MapPanelProps {
  env: Environment;
  vehicle?: Vehicle;
}

export function MapPanel({ env, vehicle }: MapPanelProps) {
  const pda = env.pda;
  const imageUrl = `api/map-image`;

  return (
    <Panel title="PDA" icon={<Map size={16} />}>
      <div className="w-full h-full flex items-center justify-center overflow-hidden relative">
        {pda?.filename ? (
          <div className="relative max-h-full max-w-full aspect-square">
            <img
              src={imageUrl}
              alt="Map"
              className="w-full h-full object-contain block rounded-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            {pda.player && (
              <div
                className="absolute"
                style={{
                  top: `${pda.player.posZ * 100}%`,
                  left: `${pda.player.posX * 100}%`,
                  transform: `translate(-50%, -50%) rotate(${(vehicle?.gps?.heading || 0) - 45}deg)`,
                }}
              >
                <Navigation
                  size={20}
                  className="text-red-500 fill-red-500 drop-shadow-[0_0_2px_rgba(0,0,0,0.8)]"
                />
              </div>
            )}
          </div>
        ) : (
          <div className="text-gray-500 text-sm">No map data available</div>
        )}
      </div>
    </Panel>
  );
}
