export interface Macronutrients {
  protein: string;
  carbohydrates: string;
  fat: string;
}

export interface FoodNutrition {
  name: string;
  calories: number;
  macros: Macronutrients;
  description: string;
}

export interface AnalysisHistoryItem {
  id: number; // Using timestamp for a unique ID
  imagePreview: string; // The base64 data URI for the image
  analysisResult: FoodNutrition[];
}
