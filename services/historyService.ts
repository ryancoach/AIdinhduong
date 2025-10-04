import { type AnalysisHistoryItem } from '../types';

const HISTORY_STORAGE_KEY = 'nutritionAnalysisHistory';

export const getHistory = (): AnalysisHistoryItem[] => {
  try {
    const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (storedHistory) {
      return JSON.parse(storedHistory);
    }
  } catch (error) {
    console.error("Failed to parse history from localStorage", error);
    // If parsing fails, clear the corrupted data
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  }
  return [];
};

export const saveHistory = (history: AnalysisHistoryItem[], limit: number): void => {
  try {
    // Limit history based on user settings
    const limitedHistory = history.slice(0, limit);
    const historyJson = JSON.stringify(limitedHistory);
    localStorage.setItem(HISTORY_STORAGE_KEY, historyJson);
  } catch (error) {
    console.error("Failed to save history to localStorage", error);
  }
};
