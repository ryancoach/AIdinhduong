import { type DailyIntake } from '../types';

const getStorageKey = (email: string) => `dailyIntake_${email}`;

const getTodayDateString = (): string => {
  return new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
};

export const getDailyIntake = (email: string): DailyIntake => {
  const storageKey = getStorageKey(email);
  const today = getTodayDateString();
  const defaultIntake: DailyIntake = {
    date: today,
    consumedCalories: 0,
  };

  try {
    const storedData = localStorage.getItem(storageKey);
    if (storedData) {
      const parsedData: DailyIntake = JSON.parse(storedData);
      // If the stored data is not from today, reset it
      if (parsedData.date === today) {
        return parsedData;
      }
    }
  } catch (error) {
    console.error("Failed to parse daily intake from localStorage", error);
    localStorage.removeItem(storageKey);
  }

  // Return default (and save it for good measure)
  saveDailyIntake(email, defaultIntake);
  return defaultIntake;
};

export const saveDailyIntake = (email: string, intake: DailyIntake): void => {
  try {
    const storageKey = getStorageKey(email);
    const dataJson = JSON.stringify(intake);
    localStorage.setItem(storageKey, dataJson);
  } catch (error) {
    console.error("Failed to save daily intake to localStorage", error);
  }
};