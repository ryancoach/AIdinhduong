import React, { useState, useEffect } from 'react';
import { type FoodNutrition, type Ingredient, type Settings } from '../types';
import { findFoodInDB, calculateNutritionFromIngredients, addFoodToCache } from '../services/foodDatabase';
import { getNutritionForIngredient } from '../services/geminiService';

interface EditableNutritionCardProps {
  item: FoodNutrition;
  nutrientUnit: Settings['nutrientUnit'];
  onSave: (updatedItem: FoodNutrition) => void;
}

const MacroInfo: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => (
  <div className="text-center">
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</p>
  </div>
);

const MiniSpinner: React.FC = () => (
    <svg className="animate-spin h-5 w-5 text-teal-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const EditableNutritionCard: React.FC<EditableNutritionCardProps> = ({ item, nutrientUnit, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState<FoodNutrition>(JSON.parse(JSON.stringify(item)));
  const [ingredientLoading, setIngredientLoading] = useState<Record<number, boolean>>({});
  const [editMode, setEditMode] = useState<'ingredients' | 'totals'>('ingredients');

  const parseMacroToNumber = (macro: string): number => parseFloat(macro) || 0;

  useEffect(() => {
    setEditedItem(JSON.parse(JSON.stringify(item)));
    setIsEditing(false);
    setEditMode('ingredients');
  }, [item]);

  useEffect(() => {
    if (isEditing && editMode === 'ingredients') {
      const { calories, macros } = calculateNutritionFromIngredients(editedItem.ingredients);
      setEditedItem(prev => ({
        ...prev,
        calories,
        macros
      }));
    }
  }, [editedItem.ingredients, isEditing, editMode]);


  const handleIngredientChange = (index: number, field: keyof Ingredient, value: string | number) => {
    const newIngredients = [...editedItem.ingredients];
    if (field === 'name') {
      newIngredients[index].name = value as string;
    } else {
      newIngredients[index].grams = Number(value) || 0;
    }
    setEditedItem({ ...editedItem, ingredients: newIngredients });
  };

  const handleTotalMacroChange = (field: 'calories' | keyof FoodNutrition['macros'], value: string) => {
    const numValue = Number(value) || 0;
    if (field === 'calories') {
      setEditedItem(prev => ({ ...prev, calories: numValue }));
    } else {
      setEditedItem(prev => ({
        ...prev,
        macros: {
          ...prev.macros,
          [field]: `${numValue}g`,
        }
      }));
    }
  };

  const handleIngredientBlur = async (index: number, name: string) => {
    if (!name || findFoodInDB(name)) {
        return;
    }

    setIngredientLoading(prev => ({ ...prev, [index]: true }));
    try {
        const nutritionData = await getNutritionForIngredient(name);
        const newFoodItem = { name, ...nutritionData };
        addFoodToCache(newFoodItem);
        setEditedItem(prev => ({ ...prev }));
    } catch (error) {
        console.error("Không thể lấy dữ liệu cho thành phần mới:", error);
    } finally {
        setIngredientLoading(prev => ({ ...prev, [index]: false }));
    }
  };


  const handleAddIngredient = () => {
    setEditedItem({
      ...editedItem,
      ingredients: [...editedItem.ingredients, { name: '', grams: 0 }],
    });
  };

  const handleRemoveIngredient = (index: number) => {
    const newIngredients = editedItem.ingredients.filter((_, i) => i !== index);
    setEditedItem({ ...editedItem, ingredients: newIngredients });
  };
  
  const handleSave = () => {
    let finalItem = { ...editedItem };
    if (editMode === 'ingredients') {
      finalItem.ingredients = editedItem.ingredients.filter(ing => ing.name && findFoodInDB(ing.name) && ing.grams > 0);
      // Recalculate one last time to be sure
      const { calories, macros } = calculateNutritionFromIngredients(finalItem.ingredients);
      finalItem.calories = calories;
      finalItem.macros = macros;
    } else {
      // Khi lưu ở chế độ tổng thể, xóa thành phần để tránh không nhất quán
      finalItem.ingredients = [];
    }
    onSave(finalItem);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
      setEditedItem(JSON.parse(JSON.stringify(item)));
      setIsEditing(false);
  };
  
  const formatMacro = (value: string, unit: 'g' | 'mg'): string => {
    const numValue = parseFloat(value) || 0;
    if (unit === 'mg') {
      return `${(numValue * 1000).toLocaleString()}mg`;
    }
    return Number.isInteger(numValue) ? `${numValue}g` : `${numValue.toFixed(1)}g`;
  };

  const currentItem = isEditing ? editedItem : item;

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden flex flex-col h-full transition-all duration-300 ${isEditing ? 'ring-2 ring-teal-500' : ''}`}>
      <div className="p-6 flex-grow">
        {isEditing ? (
             <input
              type="text"
              value={editedItem.name}
              onChange={(e) => setEditedItem({...editedItem, name: e.target.value})}
              className="w-full text-2xl font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 rounded-md p-2 mb-2"
            />
        ) : (
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{currentItem.name}</h3>
        )}
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">{currentItem.description}</p>
        
        {isEditing && (
            <div className="space-y-4">
                {/* Edit Mode Toggle */}
                <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                    <button onClick={() => setEditMode('ingredients')} className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-colors ${editMode === 'ingredients' ? 'bg-white dark:bg-gray-600 text-teal-600 dark:text-teal-400 shadow' : 'text-gray-600 dark:text-gray-300'}`}>Theo Thành Phần</button>
                    <button onClick={() => setEditMode('totals')} className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-colors ${editMode === 'totals' ? 'bg-white dark:bg-gray-600 text-teal-600 dark:text-teal-400 shadow' : 'text-gray-600 dark:text-gray-300'}`}>Theo Tổng Thể</button>
                </div>

                {editMode === 'ingredients' ? (
                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold uppercase text-gray-500">Thành Phần</h4>
                        {editedItem.ingredients.map((ing, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <div className="relative flex-grow">
                                    <input type="text" value={ing.name} onChange={(e) => handleIngredientChange(index, 'name', e.target.value)} onBlur={(e) => handleIngredientBlur(index, e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700" placeholder="Tên thành phần" />
                                    {ingredientLoading[index] && (<div className="absolute right-2 top-1/2 -translate-y-1/2"><MiniSpinner /></div>)}
                                </div>
                                <input type="number" value={ing.grams === 0 ? '' : ing.grams} onChange={(e) => handleIngredientChange(index, 'grams', e.target.value)} className="w-24 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700" placeholder="grams" />
                                <button onClick={() => handleRemoveIngredient(index)} className="text-red-500 hover:text-red-700 p-1"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg></button>
                            </div>
                        ))}
                        <button onClick={handleAddIngredient} className="text-sm text-teal-500 font-semibold hover:text-teal-600">+ Thêm thành phần</button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold uppercase text-gray-500">Chỉnh Sửa Tổng Thể</h4>
                        <div>
                           <label className="block text-xs font-medium text-gray-500">Tổng Calo</label>
                           <input type="number" value={editedItem.calories || ''} onChange={(e) => handleTotalMacroChange('calories', e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700" />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <div>
                                <label className="block text-xs font-medium text-gray-500">Protein (g)</label>
                                <input type="number" value={parseMacroToNumber(editedItem.macros.protein) || ''} onChange={(e) => handleTotalMacroChange('protein', e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500">Carbs (g)</label>
                                <input type="number" value={parseMacroToNumber(editedItem.macros.carbohydrates) || ''} onChange={(e) => handleTotalMacroChange('carbohydrates', e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500">Fat (g)</label>
                                <input type="number" value={parseMacroToNumber(editedItem.macros.fat) || ''} onChange={(e) => handleTotalMacroChange('fat', e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700" />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )}

      </div>
      <div className="bg-gray-50 dark:bg-gray-700/50 p-6 mt-auto">
        <div className="flex justify-center items-center mb-6">
          <div className="text-center">
            <p className="text-5xl font-extrabold text-teal-500">{currentItem.calories}</p>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">CALORIES</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 border-t border-gray-200 dark:border-gray-700 pt-4">
          <MacroInfo label="Protein" value={formatMacro(currentItem.macros.protein, nutrientUnit)} color="text-red-500" />
          <MacroInfo label="Carbs" value={formatMacro(currentItem.macros.carbohydrates, nutrientUnit)} color="text-blue-500" />
          <MacroInfo label="Fat" value={formatMacro(currentItem.macros.fat, nutrientUnit)} color="text-yellow-500" />
        </div>
        <div className="mt-6 flex gap-2 justify-end">
            {isEditing ? (
                <>
                    <button onClick={handleCancel} className="px-4 py-2 text-sm font-semibold rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300">Hủy</button>
                    <button onClick={handleSave} className="px-4 py-2 text-sm font-semibold rounded-md text-white bg-teal-500 hover:bg-teal-600">Lưu</button>
                </>
            ) : (
                <button onClick={() => setIsEditing(true)} className="px-4 py-2 text-sm font-semibold rounded-md text-white bg-blue-500 hover:bg-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                    </svg>
                    Chỉnh Sửa
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default EditableNutritionCard;
