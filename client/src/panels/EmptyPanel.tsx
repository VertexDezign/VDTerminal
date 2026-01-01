import { Zap } from "lucide-react";
import FendtPanel from "../components/FendtPanel";

export function EmptyPanel() {
  return (
    <FendtPanel title="ToDo" icon={<Zap size={16} />}>
      TODO
    </FendtPanel>
  );
}
