import { useCallback, useEffect, useRef, useState } from "react";
import { Crosshair, Map, Navigation, ZoomIn, ZoomOut } from "lucide-react";
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

  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const [autoCenter, setAutoCenter] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const centerOnPlayer = useCallback(() => {
    if (!pda?.player || !containerRef.current) return;

    // Player position is 0-1. Map is aspect-square, centered in container.
    // We want the player to be at (clientWidth/2, clientHeight/2)
    // The map itself might be smaller than container if object-contain is used,
    // but here we are scaling a div that contains the map.

    // Target offset to center player:
    // newX = 0.5 - playerPosX
    // newY = 0.5 - playerPosZ
    // (all in relative units of the map size)

    setOffset({
      x: (0.5 - pda.player.posX) * 100,
      y: (0.5 - pda.player.posZ) * 100,
    });
  }, [pda?.player]);

  useEffect(() => {
    if (autoCenter) {
      centerOnPlayer();
    }
  }, [autoCenter, centerOnPlayer]);

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    setAutoCenter(false);
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    setLastPos({ x: clientX, y: clientY });
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    const dx = clientX - lastPos.x;
    const dy = clientY - lastPos.y;

    if (containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;
      const mapSize = Math.min(clientWidth, clientHeight);

      setOffset((prev) => ({
        x: prev.x + (dx / mapSize / scale) * 100,
        y: prev.y + (dy / mapSize / scale) * 100,
      }));
    }

    setLastPos({ x: clientX, y: clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.min(Math.max(scale * delta, 1), 10);

    if (newScale > scale && !autoCenter) {
      // Optional: auto-center on zoom in if requested by issue description
      // "Center on vehicle (should happen automatically on zoom in)"
      setAutoCenter(true);
    }

    if (newScale === 1) {
      setOffset({ x: 0, y: 0 });
      setAutoCenter(false);
    }

    setScale(newScale);
  };

  const zoomIn = () => {
    setScale((prev) => Math.min(prev * 1.2, 10));
    setAutoCenter(true);
  };

  const zoomOut = () => {
    const newScale = Math.max(scale / 1.2, 1);
    setScale(newScale);
    if (newScale === 1) {
      setOffset({ x: 0, y: 0 });
      setAutoCenter(false);
    }
  };

  return (
    <Panel
      title="PDA"
      icon={<Map size={16} />}
      headerActions={
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoCenter(!autoCenter)}
            className={`p-1 rounded transition-colors ${autoCenter ? "text-blue-400 bg-blue-400/10" : "text-gray-400 hover:text-white"}`}
            title="Center on Vehicle"
          >
            <Crosshair size={16} />
          </button>
          <button
            onClick={zoomOut}
            className="p-1 text-gray-400 hover:text-white transition-colors"
            title="Zoom Out"
          >
            <ZoomOut size={16} />
          </button>
          <button
            onClick={zoomIn}
            className="p-1 text-gray-400 hover:text-white transition-colors"
            title="Zoom In"
          >
            <ZoomIn size={16} />
          </button>
        </div>
      }
    >
      <div
        ref={containerRef}
        className="w-full h-full flex items-center justify-center overflow-hidden relative touch-none select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
        onWheel={handleWheel}
      >
        {pda?.filename ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <div
              className="relative max-h-full max-w-full aspect-square"
              style={{
                transform: `scale(${scale}) translate(${offset.x}%, ${offset.y}%)`,
              }}
            >
              <img
                src={imageUrl}
                alt="Map"
                className="w-full h-full object-contain block rounded-lg pointer-events-none"
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
                    size={20 / scale}
                    className="text-red-500 fill-red-500 drop-shadow-[0_0_2px_rgba(0,0,0,0.8)]"
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-gray-500 text-sm">No map data available</div>
        )}
      </div>
    </Panel>
  );
}
