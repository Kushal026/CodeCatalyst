import { HistoryEntry } from "@/types/analysis";

const STORAGE_KEY = "codecatalyst_history";
const MAX_HISTORY = 20;

export function getHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addToHistory(entry: HistoryEntry): HistoryEntry[] {
  const history = getHistory();
  history.unshift(entry);
  const trimmed = history.slice(0, MAX_HISTORY);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  return trimmed;
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}
