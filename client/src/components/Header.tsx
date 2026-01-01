import {
  Calendar,
  Clock,
  Menu,
  Minus,
  Plus,
  Search,
  Thermometer,
  Tractor,
} from "lucide-react";
import { toggleWakeLock } from "../utils/wakeLock.ts";
import type { Environment } from "../data/Environment.ts";
import type { Vehicle } from "../data/Vehicle.ts";
import { getVal } from "../utils/valueUtils.ts";

interface HeaderProps {
  env: Environment;
  vehicle?: Vehicle;
}

export default function Header({ env, vehicle }: HeaderProps) {
  const brandName = vehicle?.brand?.name || "VDTerminal";

  return (
    <header className="bg-[var(--color-brand-active)] text-[var(--color-brand-text)] p-2 px-4 grid grid-cols-3 items-center shadow-md z-10">
      <div className="flex items-center gap-12">
        <Menu
          className="w-6 h-6 cursor-pointer"
          onClick={() => {
            toggleWakeLock();
          }}
        />
        <div className="flex items-center gap-4 tabular-nums">
          <div className="flex flex-col items-center">
            <Thermometer size={20} strokeWidth={1.5} />
            <span className="text-sm font-bold leading-tight">
              {env.weather.temperature.current}
              {env.weather.temperature.unit}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <Tractor size={20} strokeWidth={1.5} />
            <span className="text-sm font-bold leading-tight">
              {getVal(vehicle?.motor?.state)}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <Calendar size={20} strokeWidth={1.5} />
            <span className="text-sm font-bold leading-tight">{env.date}</span>
          </div>
          <div className="flex flex-col items-center">
            <Clock size={20} strokeWidth={1.5} />
            <span className="text-sm font-bold leading-tight">{env.time}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-8">
        <div className="text-3xl font-black italic tracking-tighter uppercase">
          {brandName}
        </div>
      </div>

      <div className="flex items-center justify-end gap-4">
        <Search className="w-5 h-5" />
        <Minus className="w-5 h-5 border border-[var(--color-brand-text)]/30 rounded" />
        <Plus className="w-5 h-5 border border-[var(--color-brand-text)]/30 rounded" />
      </div>
    </header>
  );
}
