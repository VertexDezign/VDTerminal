import { useEffect, useState } from "react";
import io from "socket.io-client";
import { Satellite } from "lucide-react";
import type { GGIData } from "./data/GGIData.ts";
import EngineTransmission from "./panels/EngineTransmission.tsx";
import FrontHitch from "./panels/FrontHitch.tsx";
import RearHitch from "./panels/RearHitch.tsx";
import Lighting from "./panels/Lighting.tsx";
import Tools from "./panels/Tools.tsx";
import Operations from "./panels/Operations.tsx";
import Header from "./components/Header.tsx";
import Footer from "./components/Footer.tsx";

const socket = io();

function App() {
  const [data, setData] = useState<GGIData | null>(null);

  useEffect(() => {
    // Request wake lock
    let wakeLock: WakeLockSentinel | null = null;

    const requestWakeLock = async () => {
      try {
        if ("wakeLock" in navigator) {
          wakeLock = await navigator.wakeLock.request("screen");
        } else {
          alert(
            "WakeLock API not supported. Please update your browser or device.",
          );
        }
      } catch (err) {
        if (err instanceof Error) {
          console.error(`${err.name}, ${err.message}`);
        } else {
          console.error("Unkown error", err);
        }
      }
    };

    requestWakeLock();

    // Re-request when page becomes visible again (iPad can release it when tab is hidden)
    const handleVisibilityChange = () => {
      if (wakeLock !== null && document.visibilityState === "visible") {
        requestWakeLock();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    socket.on("ggi-data", (receivedData) => {
      setData(receivedData);
    });
    return () => {
      socket.off("ggi-data");
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      wakeLock?.release().then(() => {
        wakeLock = null;
      });
    };
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[--color-fendt-light]">
        <div className="text-2xl font-bold animate-pulse text-[--color-fendt-green]">
          FENDT LOADING...
        </div>
      </div>
    );
  }

  if (!data.GGI.vehicle)
    return (
      <>
        <div className="flex items-center justify-center min-h-screen bg-[--color-fendt-light]">
          <div className="text-2xl font-bold animate-pulse text-[--color-fendt-green]">
            FENDT LOADING...
          </div>
        </div>
        <div className="fixed bottom-0 right-0 z-10">
          <div className="bg-fendt-green text-white p-2 rounded-full shadow-md">
            <div className="flex items-center gap-2">
              <Satellite className="w-6 h-6" />
              <div>No vehicle connected</div>
            </div>
          </div>
        </div>
      </>
    );

  const vehicle = data.GGI.vehicle;
  const environment = data.GGI.environment;

  return (
    <div className="min-h-screen bg-fendt-light flex flex-col font-sans select-none overflow-hidden h-screen">
      <Header time={environment.time} />

      {/* Main Content Area */}
      <main className="flex-1 p-2 grid grid-cols-3 gap-2 overflow-hidden">
        <FrontHitch />
        <EngineTransmission vehicle={vehicle} />
        <RearHitch />
        <Lighting vehicle={vehicle} />
        <Tools />
        <Operations />
      </main>

      <Footer vehicle={vehicle} />
    </div>
  );
}

export default App;
