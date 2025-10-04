import { type AchievementHistory, type AchievementData } from '../types';

const getStorageKey = (email: string) => `achievementHistory_${email}`;

const getTodayDateString = (): string => {
  return new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
};

export const getAchievementHistory = (email: string): AchievementHistory => {
  const storageKey = getStorageKey(email);
  try {
    const storedData = localStorage.getItem(storageKey);
    if (storedData) {
      return JSON.parse(storedData);
    }
  } catch (error) {
    console.error("Failed to parse achievement history from localStorage", error);
    localStorage.removeItem(storageKey);
  }
  return {};
};

const saveAchievementHistory = (email: string, history: AchievementHistory): void => {
  try {
    const storageKey = getStorageKey(email);
    const dataJson = JSON.stringify(history);
    localStorage.setItem(storageKey, dataJson);
  } catch (error) {
    console.error("Failed to save achievement history to localStorage", error);
  }
};

export const updateAchievement = (email: string, totalConsumed: number, goal: number): AchievementHistory => {
    const history = getAchievementHistory(email);
    const today = getTodayDateString();
    
    // Lấy dữ liệu hiện có hoặc tạo mới
    const existingTodayData: AchievementData = history[today] || { consumed: 0, goal: 0, mealCount: 0 };

    // Cập nhật dữ liệu
    existingTodayData.consumed = totalConsumed;
    existingTodayData.goal = goal;
    existingTodayData.mealCount += 1; // Tăng số bữa ăn lên 1

    history[today] = existingTodayData;

    saveAchievementHistory(email, history);
    return history;
}