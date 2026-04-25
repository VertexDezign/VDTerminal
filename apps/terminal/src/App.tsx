import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";
import type { GGIData } from "./data/GGIData.ts";
import EngineTransmission from "./panels/EngineTransmission.tsx";
import Lighting from "./panels/Lighting.tsx";
import Header from "./components/Header.tsx";
import Footer from "./components/Footer.tsx";
import Implements from "./panels/Implements.tsx";
import { socket } from "./socket/socket.ts";
import { EmptyPanel } from "./panels/EmptyPanel.tsx";
import { MapPanel } from "./panels/MapPanel.tsx";

function App() {
  const [data, setData] = useState<GGIData | null>(null);

  useEffect(() => {
    socket.on("ggi-data", (receivedData: GGIData) => {
      if (receivedData.GGI) {
        setData(receivedData);
      }
    });
    return () => {
      socket.off("ggi-data");
    };
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[--color-terminal-light]">
        <div className="text-2xl font-bold animate-pulse text-[--color-terminal-green]">
          VDTERMINAL LOADING...
        </div>
      </div>
    );
  }

  const vehicle = data.GGI.vehicle;
  const environment = data.GGI.environment;
  const brandClass = vehicle?.brand?.name
    ? `brand-${vehicle.brand.name.toLowerCase().replace(/\s+/g, "")}`
    : "";

  if (!vehicle)
    return (
      <div
        className={`min-h-screen bg-terminal-light flex flex-col font-sans select-none overflow-hidden h-screen ${brandClass}`}
      >
        <Header env={environment} vehicle={vehicle} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-white p-4 rounded-xl shadow-lg flex items-center gap-4 animate-bounce bg-terminal-green">
            <WifiOff className="w-8 h-8" />
            <div className="text-xl font-bold">No vehicle connected</div>
          </div>
        </main>
        <Footer vehicle={vehicle} />
      </div>
    );

  return (
    <div
      className={`min-h-screen bg-terminal-light flex flex-col font-sans select-none overflow-hidden h-screen ${brandClass}`}
    >
      <Header env={environment} vehicle={vehicle} />

      {/* Main Content Area */}
      <main className="flex-1 p-2 grid grid-cols-3 grid-rows-2 gap-2 overflow-hidden">
        <MapPanel env={environment} vehicle={vehicle} />
        <EngineTransmission vehicle={vehicle} />
        <Implements vehicle={vehicle} />
        <Lighting vehicle={vehicle} />
        <EmptyPanel />
        <EmptyPanel />
      </main>

      <Footer vehicle={vehicle} />
    </div>
  );
}

export default App;
