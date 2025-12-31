import { Anchor, ChevronDown, ChevronUp, Layers } from "lucide-react";
import FendtPanel from "../components/FendtPanel";
import Gauge from "../components/Gauge";
import StatusIconButton from "../components/StatusIconButton";
import ProgressBar from "../components/ProgressBar";

export default function RearHitch() {
  return (
    <FendtPanel title="Rear Hitch" icon={<Anchor size={16} />}>
      <div className="flex justify-between h-full">
        <div className="flex items-end pb-2">
          <ProgressBar
            label=""
            value={65}
            capacity={100}
            unit="%"
            vertical={true}
          />
        </div>
        <div className="flex flex-col gap-2 w-20">
          <div className="bg-white p-1 border rounded shadow-sm text-[10px] font-bold text-center">
            EXTRA 7100T
          </div>
          <StatusIconButton icon={<ChevronUp />} active={true} color="green" />
          <StatusIconButton icon={<Layers />} />
          <StatusIconButton icon={<ChevronDown />} />
        </div>
        <div className="flex flex-col justify-between py-2">
          <div className="text-sm font-bold text-gray-400 text-right">
            94.4%
          </div>
          <Gauge label="" value={94} min={0} max={100} unit="%" size={110} />
        </div>
      </div>
    </FendtPanel>
  );
}
