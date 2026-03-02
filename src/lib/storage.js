const HISTORY_KEY = "ai-business-insights-history";
const LIMIT = 10;

export function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveHistory(items) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(items.slice(0, LIMIT)));
}

export function pushHistory(entry) {
  const existing = loadHistory();
  const next = [entry, ...existing.filter((item) => item.id !== entry.id)].slice(
    0,
    LIMIT,
  );
  saveHistory(next);
  return next;
}

export function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
}
