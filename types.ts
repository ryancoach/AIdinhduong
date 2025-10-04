export interface Macronutrients {
  protein: string;
  carbohydrates: string;
  fat: string;
}

export interface Ingredient {
  name: string;
  grams: number;
}

// FIX: Added FoodDataItem interface to be used across services.
export interface FoodDataItem {
  name: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
}

export interface FoodNutrition {
  name: string;
  calories: number;
  macros: Macronutrients;
  description: string;
  ingredients: Ingredient[];
}

export interface AnalysisHistoryItem {
  id: number; // Using timestamp for a unique ID
  imagePreview: string; // The base64 data URI for the image
  analysisResult: FoodNutrition[];
}

export interface Settings {
  nutrientUnit: 'g' | 'mg';
  historyLimit: number;
  dailyCalorieGoal: number;
}

export interface DailyIntake {
  date: string; // YYYY-MM-DD format to check for daily reset
  consumedCalories: number;
}

export interface StreakData {
  count: number;
  lastLogDate: string; // YYYY-MM-DD
}

export interface AchievementData {
  consumed: number;
  goal: number;
  mealCount: number; // Đã thêm: theo dõi số bữa ăn
}

export interface AchievementHistory {
  [date: string]: AchievementData;
}
