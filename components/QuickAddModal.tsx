import React, { useState } from 'react';
import { type FoodNutrition, type Macronutrients } from '../types';

interface QuickAddModalProps {
  onClose: () => void;
  onSave: (newItem: FoodNutrition) => void;
}

const QuickAddModal: React.FC<QuickAddModalProps> = ({ onClose, onSave }) => {
  const [name, setName] = useState('');
  const [calories, setCalories] = useState<number | ''>('');
  const [protein, setProtein] = useState<number | ''>('');
  const [carbs, setCarbs] = useState<number | ''>('');
  const [fat, setFat] = useState<number | ''>('');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!name || calories === '' || protein === '' || carbs === '' || fat === '') {
      setError('Vui lòng điền đầy đủ tất cả các trường.');
      return;
    }

    const newItem: FoodNutrition = {
      name,
      calories: Number(calories),
      macros: {
        protein: `${protein}g`,
        carbohydrates: `${carbs}g`,
        fat: `${fat}g`,
      },
      description: 'Món ăn được thêm thủ công.',
      ingredients: [], // Không có thành phần chi tiết khi thêm nhanh
    };

    onSave(newItem);
    onClose();
  };

  const handleNumberInputChange = (setter: React.Dispatch<React.SetStateAction<number | ''>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value === '' || /^[0-9]\d*$/.test(value)) {
          setter(value === '' ? '' : Number(value));
      }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            aria-label="Đóng"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Thêm Nhanh Món Ăn</h2>

          <div className="space-y-4">
            <div>
                <label htmlFor="foodName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tên món ăn</label>
                <input type="text" id="foodName" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700" />
            </div>
             <div>
                <label htmlFor="calories" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tổng Calo (kcal)</label>
                <input type="text" inputMode="numeric" id="calories" value={calories} onChange={handleNumberInputChange(setCalories)} className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700" />
            </div>
            <div className="grid grid-cols-3 gap-4">
                 <div>
                    <label htmlFor="protein" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Protein (g)</label>
                    <input type="text" inputMode="numeric" id="protein" value={protein} onChange={handleNumberInputChange(setProtein)} className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700" />
                </div>
                 <div>
                    <label htmlFor="carbs" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Carb (g)</label>
                    <input type="text" inputMode="numeric" id="carbs" value={carbs} onChange={handleNumberInputChange(setCarbs)} className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700" />
                </div>
                 <div>
                    <label htmlFor="fat" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Fat (g)</label>
                    <input type="text" inputMode="numeric" id="fat" value={fat} onChange={handleNumberInputChange(setFat)} className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700" />
                </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm font-semibold rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300">Hủy</button>
            <button onClick={handleSave} className="px-4 py-2 text-sm font-semibold rounded-md text-white bg-teal-500 hover:bg-teal-600">Lưu Món Ăn</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickAddModal;
