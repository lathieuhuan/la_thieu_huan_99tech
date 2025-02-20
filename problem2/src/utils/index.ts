export function isNumber(value: any): value is number {
  return typeof value === "number" && !isNaN(value);
}

export function formatNumber(value: number) {
  return value.toLocaleString("en", { maximumFractionDigits: 3 });
}
