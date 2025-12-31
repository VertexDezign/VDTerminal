import { Menu, Minus, Plus, Search } from "lucide-react";

interface HeaderProps {
  time: string;
}

export default function Header({ time }: HeaderProps) {
  return (
    <header className="bg-fendt-green text-white p-2 px-4 flex justify-between items-center shadow-md z-10">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-6">
          <Menu className="w-6 h-6 cursor-pointer" />
          <div className="text-2xl font-bold tabular-nums">{time}</div>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="flex items-center gap-1">
          <span className="text-xs text-green-100">X:</span>
          <span className="text-sm font-bold">1047</span>
          <span className="text-xs text-green-100 ml-2">Y:</span>
          <span className="text-sm font-bold">1915</span>
        </div>
        <div className="text-3xl font-black italic tracking-tighter">
          FENDT™
        </div>
        <div className="flex items-center gap-4 text-xs font-bold">
          <span>
            TEMP: DAY <span className="text-base ml-1">68</span>
          </span>
          <span>
            NIGHT <span className="text-base ml-1">46</span>
          </span>
          <span className="uppercase ml-2">Sep</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Search className="w-5 h-5" />
        <Minus className="w-5 h-5 border border-white/30 rounded" />
        <Plus className="w-5 h-5 border border-white/30 rounded" />
      </div>
    </header>
  );
}
