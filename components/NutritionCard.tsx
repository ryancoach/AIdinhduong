import React from 'react';
import { type FoodNutrition } from '../types';

interface NutritionCardProps {
  item: FoodNutrition;
}

const MacroInfo: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => (
  <div className="text-center">
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</p>
  </div>
);

const NutritionCard: React.FC<NutritionCardProps> = ({ item }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition-all hover:scale-105 hover:shadow-2xl flex flex-col h-full">
      <div className="p-6 flex-grow">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{item.name}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">{item.description}</p>
      </div>
      <div className="bg-gray-50 dark:bg-gray-700/50 p-6 mt-auto">
        <div className="flex justify-center items-center mb-6">
          <div className="text-center">
            <p className="text-5xl font-extrabold text-teal-500">{item.calories}</p>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">CALORIES</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 border-t border-gray-200 dark:border-gray-700 pt-4">
          <MacroInfo label="Protein" value={item.macros.protein} color="text-red-500" />
          <MacroInfo label="Carbs" value={item.macros.carbohydrates} color="text-blue-500" />
          <MacroInfo label="Fat" value={item.macros.fat} color="text-yellow-500" />
        </div>
      </div>
    </div>
  );
};

export default NutritionCard;
