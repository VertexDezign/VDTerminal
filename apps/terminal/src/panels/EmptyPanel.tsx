import { Zap } from "lucide-react";
import Panel from "../components/Panel.tsx";

export function EmptyPanel() {
  return (
    <Panel title="ToDo" icon={<Zap size={16} />}>
      TODO
    </Panel>
  );
}
