// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getVal = (obj: any): boolean | number | string => {
  if (obj === null || obj === undefined) return 0;
  if (typeof obj === "object") return getVal(obj["#text"]) || 0;
  if (obj === "true") return true;
  if (obj === "false") return false;
  return obj;
};

export const getValAsNumber = (obj: any): number => {
  return getVal(obj) as number;
};
