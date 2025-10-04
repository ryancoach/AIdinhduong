import { type Settings } from '../types';

const SETTINGS_STORAGE_KEY = 'nutritionAppSettings';

export const defaultSettings: Settings = {
  nutrientUnit: 'g',
  historyLimit: 50,
  dailyCalorieGoal: 2000,
};

export const getSettings = (): Settings => {
  try {
    const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (storedSettings) {
      // Merge with defaults to ensure all keys are present if new settings are added
      return { ...defaultSettings, ...JSON.parse(storedSettings) };
    }
  } catch (error) {
    console.error("Failed to parse settings from localStorage", error);
    localStorage.removeItem(SETTINGS_STORAGE_KEY);
  }
  return defaultSettings;
};

export const saveSettings = (settings: Settings): void => {
  try {
    const settingsJson = JSON.stringify(settings);
    localStorage.setItem(SETTINGS_STORAGE_KEY, settingsJson);
  } catch (error) {
    console.error("Failed to save settings to localStorage", error);
  }
};
