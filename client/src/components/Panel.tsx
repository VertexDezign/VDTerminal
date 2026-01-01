import { type ReactNode } from "react";

export default function Panel({
  title,
  children,
  icon,
}: {
  title: string;
  children: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="bg-terminal-panel border border-gray-300 rounded shadow-sm flex flex-col overflow-hidden">
      <div className="p-1 px-3 border-b border-gray-200 flex justify-between items-center bg-white/50">
        <div className="flex items-center gap-2 text-gray-500">
          {icon}
          <span className="text-[11px] font-bold uppercase tracking-tight">
            {title}
          </span>
        </div>
        <div className="flex gap-1">
          <div className="w-4 h-4 rounded-full bg-gray-200 border border-gray-300"></div>
        </div>
      </div>
      <div className="flex-1 p-2 relative">{children}</div>
    </div>
  );
}
