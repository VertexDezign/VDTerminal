// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getVal = (obj: any) => {
  if (obj === null || obj === undefined) return 0;
  if (typeof obj === "object") return obj["#text"] || 0;
  return obj;
};
