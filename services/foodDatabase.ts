// FIX: Import FoodDataItem from the centralized types file.
import { type FoodDataItem } from '../types';

// Dữ liệu dinh dưỡng cho mỗi 100g

// Cơ sở dữ liệu tạm thời để lưu các mục AI tra cứu trong phiên hiện tại
const temporaryFoodCache: FoodDataItem[] = [];

export const foodDatabase: FoodDataItem[] = [
  { name: 'Ức gà', calories: 165, protein: 31, carbohydrates: 0, fat: 3.6 },
  { name: 'Đùi gà', calories: 209, protein: 26, carbohydrates: 0, fat: 10.9 },
  { name: 'Thịt bò thăn', calories: 250, protein: 26, carbohydrates: 0, fat: 15 },
  { name: 'Thịt lợn nạc', calories: 242, protein: 26, carbohydrates: 0, fat: 14 },
  { name: 'Cá hồi', calories: 208, protein: 20, carbohydrates: 0, fat: 13 },
  { name: 'Tôm', calories: 99, protein: 24, carbohydrates: 0.2, fat: 0.3 },
  { name: 'Trứng', calories: 155, protein: 13, carbohydrates: 1.1, fat: 11 },
  { name: 'Đậu phụ', calories: 76, protein: 8, carbohydrates: 1.9, fat: 4.8 },
  { name: 'Cơm trắng', calories: 130, protein: 2.7, carbohydrates: 28, fat: 0.3 },
  { name: 'Gạo lứt', calories: 111, protein: 2.6, carbohydrates: 23, fat: 0.9 },
  { name: 'Khoai lang', calories: 86, protein: 1.6, carbohydrates: 20, fat: 0.1 },
  { name: 'Bông cải xanh', calories: 55, protein: 3.7, carbohydrates: 11.2, fat: 0.6 },
  { name: 'Rau bina (cải bó xôi)', calories: 23, protein: 2.9, carbohydrates: 3.6, fat: 0.4 },
  { name: 'Cà chua', calories: 18, protein: 0.9, carbohydrates: 3.9, fat: 0.2 },
  { name: 'Dưa chuột', calories: 15, protein: 0.7, carbohydrates: 3.6, fat: 0.1 },
  { name: 'Cà rốt', calories: 41, protein: 0.9, carbohydrates: 10, fat: 0.2 },
  { name: 'Dầu ô liu', calories: 884, protein: 0, carbohydrates: 0, fat: 100 },
  { name: 'Bơ (quả)', calories: 160, protein: 2, carbohydrates: 8.5, fat: 15 },
  { name: 'Sữa tươi', calories: 42, protein: 3.4, carbohydrates: 5, fat: 1 },
];

/**
 * Thêm một mục thực phẩm vào bộ nhớ đệm tạm thời.
 * @param foodItem Mục thực phẩm mới cần thêm.
 */
export const addFoodToCache = (foodItem: FoodDataItem): void => {
    // Kiểm tra xem mục đã tồn tại chưa để tránh trùng lặp
    const exists = temporaryFoodCache.some(item => item.name.toLowerCase() === foodItem.name.toLowerCase());
    if (!exists) {
        temporaryFoodCache.push(foodItem);
    }
};


/**
 * Tìm một mục thực phẩm trong bộ nhớ đệm và cơ sở dữ liệu theo tên (không phân biệt chữ hoa chữ thường).
 * @param name Tên của thực phẩm cần tìm.
 * @returns FoodDataItem nếu tìm thấy, ngược lại là undefined.
 */
export const findFoodInDB = (name: string): FoodDataItem | undefined => {
  if (!name) return undefined;
  const searchTerm = name.toLowerCase().trim();
  // Tìm trong bộ nhớ đệm trước
  const cachedItem = temporaryFoodCache.find(item => item.name.toLowerCase() === searchTerm);
  if (cachedItem) return cachedItem;
  // Nếu không có, tìm trong cơ sở dữ liệu chính
  return foodDatabase.find(item => item.name.toLowerCase() === searchTerm);
};

/**
 * Tính toán dinh dưỡng cho một danh sách các thành phần.
 * @param ingredients Danh sách các thành phần cùng với trọng lượng của chúng.
 * @returns Một đối tượng chứa tổng lượng calo và các chất dinh dưỡng đa lượng.
 */
export const calculateNutritionFromIngredients = (ingredients: { name: string; grams: number }[]) => {
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;

  ingredients.forEach(ingredient => {
    const foodData = findFoodInDB(ingredient.name);
    if (foodData) {
      const multiplier = ingredient.grams / 100;
      totalCalories += foodData.calories * multiplier;
      totalProtein += foodData.protein * multiplier;
      totalCarbs += foodData.carbohydrates * multiplier;
      totalFat += foodData.fat * multiplier;
    }
  });

  return {
    calories: Math.round(totalCalories),
    macros: {
      protein: `${totalProtein.toFixed(1)}g`,
      carbohydrates: `${totalCarbs.toFixed(1)}g`,
      fat: `${totalFat.toFixed(1)}g`,
    },
  };
};
