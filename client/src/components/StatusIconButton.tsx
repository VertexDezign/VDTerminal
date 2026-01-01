import type { ReactNode } from "react";

export default function StatusIconButton({
  icon,
  active = false,
  color = "white",
  round = false,
  onClick,
}: {
  icon: ReactNode;
  active?: boolean;
  color?: "white" | "green";
  round?: boolean;
  onClick?: () => void;
}) {
  const baseClasses = `flex items-center justify-center border shadow-sm transition-all ${round ? "rounded-full w-12 h-12" : "rounded w-full h-12"}`;
  const activeClasses = active
    ? color === "green"
      ? "bg-gradient-to-b from-[var(--color-terminal-accent)] to-[var(--color-terminal-green)] text-white border-[var(--color-terminal-green)]"
      : "bg-white text-[var(--color-terminal-green)] border-gray-300"
    : "bg-gradient-to-b from-gray-100 to-gray-200 text-gray-500 border-gray-300";

  return (
    <div className={`${baseClasses} ${activeClasses}`} onClick={onClick}>
      {icon}
    </div>
  );
}
