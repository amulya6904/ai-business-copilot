function parseNumber(value) {
  if (!value) {
    return null;
  }

  const normalized = value.replace(/,/g, "");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

export function formatCompactCurrency(value) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "--";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value >= 1000 ? 0 : 2,
  }).format(value);
}

export function formatPercent(value) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "--";
  }
  return `${value.toFixed(2)}%`;
}

export function extractKpis(insight) {
  const summary = insight?.summary || "";
  const title = insight?.title || "";

  const summaryMatch = summary.match(
    /Period A.*?(?:value|revenue)=([+-]?\d[\d,]*(?:\.\d+)?).*?Period B.*?(?:value|revenue)=([+-]?\d[\d,]*(?:\.\d+)?)/i,
  );
  const titleMatch = title.match(
    /by\s+([+-]?\d[\d,]*(?:\.\d+)?)\s*\(([-+]?\d[\d,]*(?:\.\d+)?)%\)/i,
  );

  const periodA = summaryMatch ? parseNumber(summaryMatch[1]) : null;
  const periodB = summaryMatch ? parseNumber(summaryMatch[2]) : null;
  const delta = titleMatch
    ? parseNumber(titleMatch[1])
    : periodA !== null && periodB !== null
      ? periodA - periodB
      : null;
  const pct = titleMatch
    ? parseNumber(titleMatch[2])
    : periodA !== null && periodB
      ? ((periodA - periodB) / periodB) * 100
      : null;

  return [
    { label: "Period A", value: formatCompactCurrency(periodA) },
    { label: "Period B", value: formatCompactCurrency(periodB) },
    { label: "Delta", value: formatCompactCurrency(delta) },
    { label: "Change", value: formatPercent(pct) },
  ];
}

export function extractDriverSeries(insight) {
  const drivers = insight?.key_drivers || [];

  return drivers
    .map((driver) => {
      const match = driver.match(/^(.+?):\s*([+-]?\d[\d,]*(?:\.\d+)?)/);
      if (!match) {
        return null;
      }

      const value = parseNumber(match[2]);
      if (value === null) {
        return null;
      }

      return {
        label: match[1],
        value,
        absolute: Math.abs(value),
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.absolute - a.absolute)
    .slice(0, 6);
}
