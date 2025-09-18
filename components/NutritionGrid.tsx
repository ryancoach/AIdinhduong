import React from 'react';
import { type FoodNutrition } from '../types';
import NutritionCard from './NutritionCard';

interface NutritionGridProps {
  data: FoodNutrition[];
}

const MacroInfo: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => (
  <div className="text-center">
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</p>
  </div>
);


const NutritionGrid: React.FC<NutritionGridProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-2">Không tìm thấy thông tin</h2>
        <p className="text-gray-500 dark:text-gray-400">AI không thể xác định bất kỳ loại thực phẩm nào trong ảnh của bạn. Vui lòng thử lại với một hình ảnh rõ ràng hơn.</p>
      </div>
    );
  }

  // Helper to parse macro strings like "10g" into numbers
  const parseMacro = (macro: string): number => {
    return parseFloat(macro) || 0;
  };

  const totalCalories = Math.round(data.reduce((sum, item) => sum + item.calories, 0));
  const totalProtein = data.reduce((sum, item) => sum + parseMacro(item.macros.protein), 0);
  const totalCarbs = data.reduce((sum, item) => sum + parseMacro(item.macros.carbohydrates), 0);
  const totalFat = data.reduce((sum, item) => sum + parseMacro(item.macros.fat), 0);

  return (
    <div>
      <h2 className="text-3xl font-extrabold text-center mb-8 text-gray-800 dark:text-white">Kết Quả Phân Tích</h2>
      
      {/* Total Nutrition Summary Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 mb-10 border-t-4 border-teal-400">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">Tổng Quan Bữa Ăn</h3>
        <div className="flex justify-center items-center mb-6">
          <div className="text-center">
            <p className="text-5xl font-extrabold text-teal-500">{totalCalories}</p>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">TỔNG CALORIES</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 border-t border-gray-200 dark:border-gray-700 pt-4">
          <MacroInfo label="Protein" value={`${totalProtein.toFixed(1)}g`} color="text-red-500" />
          <MacroInfo label="Carbs" value={`${totalCarbs.toFixed(1)}g`} color="text-blue-500" />
          <MacroInfo label="Fat" value={`${totalFat.toFixed(1)}g`} color="text-yellow-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.map((item, index) => (
          <NutritionCard key={index} item={item} />
        ))}
      </div>
    </div>
  );
};

export default NutritionGrid;