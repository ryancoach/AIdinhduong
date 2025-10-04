import React from 'react';
import { type FoodNutrition, type Settings } from '../types';
import EditableNutritionCard from './EditableNutritionCard';

interface NutritionGridProps {
  data: FoodNutrition[];
  nutrientUnit: Settings['nutrientUnit'];
  onUpdateAnalysis: (updatedItem: FoodNutrition, index: number) => void;
}

const MacroInfo: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => (
  <div className="text-center">
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</p>
  </div>
);

const NutritionGrid: React.FC<NutritionGridProps> = ({ data, nutrientUnit, onUpdateAnalysis }) => {
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

  // Helper to format macro values based on selected unit
  const formatMacro = (value: number, unit: 'g' | 'mg'): string => {
    if (unit === 'mg') {
      return `${(value * 1000).toLocaleString()}mg`;
    }
    return `${value.toFixed(1)}g`;
  };

  const totalCalories = Math.round(data.reduce((sum, item) => sum + item.calories, 0));
  const totalProtein = data.reduce((sum, item) => sum + parseMacro(item.macros.protein), 0);
  const totalCarbs = data.reduce((sum, item) => sum + parseMacro(item.macros.carbohydrates), 0);
  const totalFat = data.reduce((sum, item) => sum + parseMacro(item.macros.fat), 0);
  
  // Calculate calorie percentages for the bar chart
  const proteinCalories = totalProtein * 4;
  const carbsCalories = totalCarbs * 4;
  const fatCalories = totalFat * 9;
  const totalMacroCalories = proteinCalories + carbsCalories + fatCalories;

  const proteinPercentage = totalMacroCalories > 0 ? (proteinCalories / totalMacroCalories) * 100 : 0;
  const carbsPercentage = totalMacroCalories > 0 ? (carbsCalories / totalMacroCalories) * 100 : 0;
  const fatPercentage = totalMacroCalories > 0 ? (fatCalories / totalMacroCalories) * 100 : 0;


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
          <MacroInfo label="Protein" value={formatMacro(totalProtein, nutrientUnit)} color="text-red-500" />
          <MacroInfo label="Carbs" value={formatMacro(totalCarbs, nutrientUnit)} color="text-blue-500" />
          <MacroInfo label="Fat" value={formatMacro(totalFat, nutrientUnit)} color="text-yellow-500" />
        </div>

        {/* Macronutrient Breakdown Chart */}
        <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
          <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200 text-center mb-4">Phân Bổ Năng Lượng Calo</h4>
          <div className="flex w-full h-5 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700" role="progressbar" aria-label="Phân bổ dinh dưỡng đa lượng">
            <div 
              className="bg-red-500 transition-all duration-500" 
              style={{ width: `${proteinPercentage}%` }}
              title={`Protein: ${proteinPercentage.toFixed(1)}%`}
              aria-label={`Protein chiếm ${proteinPercentage.toFixed(1)}%`}
            ></div>
            <div 
              className="bg-blue-500 transition-all duration-500" 
              style={{ width: `${carbsPercentage}%` }}
              title={`Carbs: ${carbsPercentage.toFixed(1)}%`}
              aria-label={`Carbs chiếm ${carbsPercentage.toFixed(1)}%`}
            ></div>
            <div 
              className="bg-yellow-500 transition-all duration-500" 
              style={{ width: `${fatPercentage}%` }}
              title={`Fat: ${fatPercentage.toFixed(1)}%`}
              aria-label={`Fat chiếm ${fatPercentage.toFixed(1)}%`}
            ></div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-sm text-center">
            <div>
              <div className="flex items-center justify-center">
                <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                <span className="font-bold text-gray-700 dark:text-gray-300">Protein</span>
              </div>
              <p className="text-gray-500 dark:text-gray-400">{proteinPercentage.toFixed(1)}%</p>
            </div>
            <div>
              <div className="flex items-center justify-center">
                <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                <span className="font-bold text-gray-700 dark:text-gray-300">Carbs</span>
              </div>
              <p className="text-gray-500 dark:text-gray-400">{carbsPercentage.toFixed(1)}%</p>
            </div>
            <div>
              <div className="flex items-center justify-center">
                <span className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
                <span className="font-bold text-gray-700 dark:text-gray-300">Fat</span>
              </div>
              <p className="text-gray-500 dark:text-gray-400">{fatPercentage.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.map((item, index) => (
          <EditableNutritionCard 
            key={`${item.name}-${index}`} 
            item={item} 
            nutrientUnit={nutrientUnit} 
            onSave={(updatedItem) => onUpdateAnalysis(updatedItem, index)}
          />
        ))}
      </div>
    </div>
  );
};

export default NutritionGrid;