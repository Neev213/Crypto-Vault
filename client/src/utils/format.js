export const formatCurrency = (value, compact = false) => {
  if (value == null || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: compact && Math.abs(value) >= 1000 ? "compact" : "standard",
    maximumFractionDigits: value < 1 ? 6 : 2,
  }).format(value);
};

export const formatPercent = (value) => {
  if (value == null || Number.isNaN(value)) return "—";
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
};

export const formatNumber = (value) => {
  if (value == null) return "—";
  return new Intl.NumberFormat("en-US").format(value);
};

export const cn = (...classes) => classes.filter(Boolean).join(" ");
