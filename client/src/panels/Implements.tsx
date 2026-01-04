import {
  Anchor,
  ArrowDown,
  ArrowUp,
  FoldVertical,
  Link,
  Power,
  Wrench,
} from "lucide-react";
import Panel from "../components/Panel.tsx";
import StatusIconButton from "../components/StatusIconButton";
import type { Vehicle } from "../data/Vehicle";
import { getVal } from "../utils/valueUtils.ts";
import FillUnitsDisplay from "../components/FillUnitsDisplay.tsx";

export default function Implements({ vehicle }: { vehicle: Vehicle }) {
  const implementsData = vehicle.implement || [];
  const implementsArray = Array.isArray(implementsData)
    ? implementsData
    : [implementsData];

  const findImplement = (arr: any[], pos: string): any => {
    for (const imp of arr) {
      if (imp.position === pos) return imp;
      if (imp.implement) {
        const nested = Array.isArray(imp.implement)
          ? imp.implement
          : [imp.implement];
        const found = findImplement(nested, pos);
        if (found) return found;
      }
    }
    return null;
  };

  const frontImplement = findImplement(implementsArray, "FRONT");
  const backImplement = findImplement(implementsArray, "BACK");

  const combined = vehicle.combined || {};
  const combinedImplement = combined.implement || {};
  const frontState = combinedImplement.front || {};
  const backState = combinedImplement.back || {};
  const combinedWearable = combined.wearable || {};

  const renderImplementColumn = (
    imp: any,
    state: any,
    side: "left" | "right",
  ) => {
    const isAttached = !!imp;
    const name = imp?.name || "";
    const type = imp?.type || "Extra";

    const lowered = !!getVal(state.lowered);

    const fillUnitsData = imp?.fillUnits?.fillUnit || [];

    // Use combined wear if available, otherwise use implement specific wear
    const damage =
      (side === "left"
        ? frontImplement?.wearable?.damage
        : backImplement?.wearable?.damage) ??
      (combinedWearable.damage || 0);

    return (
      <div
        className={`flex flex-col flex-1 min-w-0 gap-2 ${side === "left" ? "border-r border-gray-300 pr-2" : "pl-2"}`}
      >
        {/* Header: Position and Attach Status */}
        <div className="flex items-center gap-1 min-h-5">
          {side === "left" ? (
            <>
              <span className="text-[10px] font-bold uppercase text-gray-500">
                Front
              </span>
              <Link
                size={16}
                className={isAttached ? "text-green-600" : "text-gray-400"}
              />
            </>
          ) : (
            <>
              <div className="flex-1" />
              <Link
                size={16}
                className={isAttached ? "text-green-600" : "text-gray-400"}
              />
              <span className="text-[10px] font-bold uppercase text-gray-500">
                Rear
              </span>
            </>
          )}
        </div>

        {/* Name and Type */}
        <div className="bg-white p-1 border rounded shadow-sm text-[10px] font-bold text-center h-8 flex flex-col justify-center leading-tight min-w-0">
          {isAttached ? (
            <>
              <div className="truncate w-full">{name}</div>
              <div className="text-[8px] text-gray-400 truncate w-full">
                {type}
              </div>
            </>
          ) : (
            <div className="text-gray-300">No Implement</div>
          )}
        </div>

        {/* Wear Damage */}
        <div
          className={`flex items-center gap-2 px-1 ${side === "right" ? "justify-end" : ""}`}
        >
          <Wrench size={14} className="text-gray-500" />
          <span className="text-sm font-bold text-gray-600">
            {100 - damage}%
          </span>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2">
          <StatusIconButton
            icon={<FoldVertical size={20} />}
            active={
              state.foldable === "FOLDED" || state.foldable === "EXTENDED"
            }
            color={state.foldable === "EXTENDED" ? "green" : "white"}
          />
          <StatusIconButton
            icon={<Power size={20} />}
            active={state.isTurnedOn === "true" || state.isTurnedOn === true}
            color="green"
          />
          <StatusIconButton
            icon={lowered ? <ArrowDown size={20} /> : <ArrowUp size={20} />}
            active={lowered}
            color="green"
          />
        </div>

        {/* Fill Units */}
        {isAttached && fillUnitsData.length > 0 && (
          <FillUnitsDisplay
            fillUnits={fillUnitsData}
            className="flex flex-col gap-1 mt-auto"
          />
        )}
      </div>
    );
  };

  return (
    <Panel title="Implements" icon={<Anchor size={16} />}>
      <div className="flex h-full">
        {renderImplementColumn(frontImplement, frontState, "left")}
        {renderImplementColumn(backImplement, backState, "right")}
      </div>
    </Panel>
  );
}
