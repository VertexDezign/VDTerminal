import { Anchor, Layers, Settings } from "lucide-react";
import FendtPanel from "../components/FendtPanel";

export default function Tools() {
  return (
    <FendtPanel title="Front Tool | Rear Tool" icon={<Settings size={16} />}>
      <div className="grid grid-cols-2 h-full gap-2 py-1">
        {/* Front Tool Status */}
        <div className="flex flex-col gap-1 border-r border-gray-300 pr-1">
          <div className="bg-orange-500 text-white p-2 rounded flex flex-col items-center">
            <Anchor size={20} />
            <span className="text-[8px] font-black uppercase mt-1">
              Attached
            </span>
          </div>
          <div className="bg-blue-500 text-white p-2 rounded flex flex-col items-center">
            <Layers size={20} />
            <span className="text-[8px] font-black uppercase mt-1">
              Unfolded
            </span>
          </div>
          <div className="h-2 bg-yellow-400 rounded-full mt-1"></div>
          <div className="bg-gray-100 p-2 rounded border flex flex-col items-center mt-auto">
            <span className="text-[8px] font-black uppercase">Raised</span>
          </div>
        </div>
        {/* Rear Tool Status */}
        <div className="flex flex-col gap-1">
          <div className="bg-red-600 text-white p-2 rounded flex flex-col items-center">
            <Anchor size={20} />
            <span className="text-[8px] font-black uppercase mt-1">
              Attached
            </span>
          </div>
          <div className="bg-green-600 text-white p-2 rounded flex flex-col items-center">
            <Layers size={20} />
            <span className="text-[8px] font-black uppercase mt-1">
              Unfolded
            </span>
          </div>
          <div className="h-2 bg-purple-600 rounded-full mt-1"></div>
          <div className="bg-gray-100 p-2 rounded border flex flex-col items-center mt-auto">
            <span className="text-[8px] font-black uppercase">Off</span>
          </div>
        </div>
      </div>
    </FendtPanel>
  );
}
