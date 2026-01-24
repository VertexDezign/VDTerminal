import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Crosshair, Map, ZoomIn, ZoomOut } from "lucide-react";
import {
  ImageOverlay,
  MapContainer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Panel from "../components/Panel.tsx";
import type { Environment } from "../data/Environment.ts";
import type { Vehicle } from "../data/Vehicle.ts";
import { StorageProvider } from "@lightspots/storageprovider";

const storage = StorageProvider.localStorage("map");

interface MapPanelProps {
  env: Environment;
  vehicle?: Vehicle;
}

export function MapPanel({ env, vehicle }: MapPanelProps) {
  const pda = env.pda;
  const imageUrl = `api/map-image`;

  const [autoCenter, setAutoCenter] = useState(
    storage.getAsBoolean("autoCenter") ?? false,
  );
  const [zoom, setZoom] = useState(storage.getAsNumber("zoom") ?? 0);

  useEffect(() => {
    storage.set("zoom", zoom);
  }, [zoom]);

  useEffect(() => {
    storage.set("autoCenter", autoCenter);
  }, [autoCenter]);

  const mapRef = useRef<L.Map | null>(null);
  const mapSize = useMemo(() => {
    if (!pda?.width || !pda?.height) return null;
    return { width: pda.width, height: pda.height };
  }, [pda?.height, pda?.width]);
  const mapBounds = useMemo<L.LatLngBoundsExpression | null>(() => {
    if (!mapSize) return null;
    return [
      [0, 0],
      [mapSize.height, mapSize.width],
    ];
  }, [mapSize]);

  const player = pda?.player;
  const centerOnPlayer = useCallback(() => {
    if (!player || !mapRef.current || !mapSize) return;
    mapRef.current.setView(
      [
        mapSize.height - player.posZ * mapSize.height,
        player.posX * mapSize.width,
      ],
      mapRef.current.getZoom(),
      { animate: true, duration: 0.5, easeLinearity: 1 },
    );
  }, [mapSize, player]);

  useEffect(() => {
    if (autoCenter) {
      centerOnPlayer();
    }
  }, [autoCenter, centerOnPlayer]);

  useEffect(() => {
    if (!mapRef.current || !mapBounds) return;
    mapRef.current.fitBounds(mapBounds, { animate: false });
  }, [mapBounds]);

  const zoomIn = () => {
    mapRef.current?.zoomIn();
    // setAutoCenter(true);
  };

  const zoomOut = () => {
    const map = mapRef.current;
    if (!map) return;
    map.zoomOut();
    if (map.getZoom() - 1 <= map.getMinZoom()) {
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
      <div className="w-full h-full overflow-hidden relative">
        {pda?.filename ? (
          <MapContainer
            className="w-full h-full rounded-lg"
            crs={L.CRS.Simple}
            center={[0, 0]}
            zoom={zoom}
            minZoom={-2}
            maxZoom={4}
            maxBounds={mapBounds ?? undefined}
            maxBoundsViscosity={1.0}
            zoomControl={false}
            ref={mapRef}
          >
            <MapEventBridge
              autoCenter={autoCenter}
              player={player}
              mapSize={mapSize ?? undefined}
              onUserMove={() => setAutoCenter(false)}
              onZoomChange={(nextZoom, prevZoom) => {
                setZoom(nextZoom);
                if (nextZoom > prevZoom && !autoCenter) {
                  // setAutoCenter(true);
                }
              }}
            />
            {mapBounds && <ImageOverlay url={imageUrl} bounds={mapBounds} />}
            {player && mapSize && (
              <Marker
                position={[
                  mapSize.height - player.posZ * mapSize.height,
                  player.posX * mapSize.width,
                ]}
                icon={createPlayerIcon(vehicle?.gps?.heading || 0)}
              />
            )}
          </MapContainer>
        ) : (
          <div className="text-gray-500 text-sm">No map data available</div>
        )}
      </div>
    </Panel>
  );
}

function MapEventBridge({
  autoCenter,
  player,
  mapSize,
  onUserMove,
  onZoomChange,
}: {
  autoCenter: boolean;
  player?: { posX: number; posZ: number };
  mapSize?: { width: number; height: number };
  onUserMove: () => void;
  onZoomChange: (nextZoom: number, prevZoom: number) => void;
}) {
  const map = useMap();
  const prevZoomRef = useRef(map.getZoom());
  const isAutoCenteringRef = useRef(false);
  const playerPosX = player?.posX ?? null;
  const playerPosZ = player?.posZ ?? null;

  useMapEvents({
    dragstart: () => {
      isAutoCenteringRef.current = false;
      onUserMove();
    },
    zoomend: () => {
      const nextZoom = map.getZoom();
      const prevZoom = prevZoomRef.current;
      prevZoomRef.current = nextZoom;
      onZoomChange(nextZoom, prevZoom);
    },
  });

  useEffect(() => {
    if (!autoCenter || !mapSize || playerPosX === null || playerPosZ === null) {
      return;
    }

    isAutoCenteringRef.current = true;
    map.setView(
      [
        mapSize.height - playerPosZ * mapSize.height,
        playerPosX * mapSize.width,
      ],
      map.getZoom(),
      { animate: true, duration: 0.5, easeLinearity: 1 },
    );
  }, [autoCenter, map, mapSize, playerPosX, playerPosZ]);

  return null;
}

function createPlayerIcon(rotation: number) {
  const arrowSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="#ef4444" stroke="#ef4444" stroke-width="1.5" xmlns="http://www.w3.org/2000/svg" style="transform: rotate(${rotation}deg); transform-origin: 50% 50%;">
    <path d="M12 3L20 21L12 17L4 21L12 3Z"></path>
  </svg>`;

  return L.divIcon({
    className: "map-player-marker",
    html: arrowSvg,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
}
