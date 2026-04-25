import { ChevronUp, Fuel, Map, Settings, Tractor, Video, Zap } from "lucide-react";
import Panel from "../components/Panel.tsx";
import StatusIconButton from "../components/StatusIconButton";

export default function Operations() {
  return (
    <Panel title="Operations" icon={<Zap size={16} />}>
      <div className="grid grid-cols-3 gap-2">
        <StatusIconButton icon={<Zap />} active={true} color="green" />
        <StatusIconButton icon={<Fuel />} />
        <StatusIconButton icon={<Tractor />} />
        <StatusIconButton icon={<ChevronUp />} />
        <StatusIconButton icon={<ChevronUp />} />
        <StatusIconButton icon={<Map />} active={true} color="green" />
        <StatusIconButton icon={<Settings />} />
        <StatusIconButton icon={<Tractor />} />
        <StatusIconButton icon={<Video />} />
      </div>
    </Panel>
  );
}
