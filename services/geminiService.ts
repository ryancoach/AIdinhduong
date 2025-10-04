import { GoogleGenAI, Type } from "@google/genai";
import { type FoodNutrition, type FoodDataItem } from '../types';
import { foodDatabase, calculateNutritionFromIngredients } from './foodDatabase';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Cung cấp danh sách các thực phẩm đã biết cho AI để hướng dẫn phản hồi của nó
const knownFoodNames = foodDatabase.map(item => item.name).join(', ');

const imageAnalysisSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      name: {
        type: Type.STRING,
        description: "Tên chung của món ăn trong ảnh (ví dụ: 'Cơm Gà Xé').",
      },
      description: {
        type: Type.STRING,
        description: "Mô tả ngắn gọn, thú vị hoặc lời khuyên dinh dưỡng về món ăn này.",
      },
      ingredients: {
        type: Type.ARRAY,
        description: "Danh sách các thành phần chính tạo nên món ăn.",
        items: {
          type: Type.OBJECT,
          properties: {
            name: {
              type: Type.STRING,
              description: `Tên của thành phần. Cố gắng khớp chính xác với một trong các tên sau: ${knownFoodNames}. Nếu không chắc, hãy trả về tên mà bạn nghĩ là đúng nhất.`,
            },
            grams: {
              type: Type.INTEGER,
              description: "Trọng lượng ước tính của thành phần này bằng gam.",
            },
          },
          required: ["name", "grams"],
        },
      },
    },
    required: ["name", "description", "ingredients"],
  },
};

const singleIngredientSchema = {
    type: Type.OBJECT,
    properties: {
        calories: { type: Type.NUMBER, description: "Tổng lượng calo trên 100g." },
        protein: { type: Type.NUMBER, description: "Tổng lượng protein (gam) trên 100g." },
        carbohydrates: { type: Type.NUMBER, description: "Tổng lượng carbohydrate (gam) trên 100g." },
        fat: { type: Type.NUMBER, description: "Tổng lượng chất béo (gam) trên 100g." },
    },
    required: ["calories", "protein", "carbohydrates", "fat"],
};


export const analyzeImageWithGemini = async (base64Image: string, mimeType: string): Promise<FoodNutrition[]> => {
  const imagePart = {
    inlineData: {
      data: base64Image,
      mimeType: mimeType,
    },
  };

  const textPart = {
    text: `Phân tích hình ảnh này. Đối với mỗi món ăn bạn xác định được, hãy chia nhỏ nó thành các thành phần chính. Ước tính trọng lượng của mỗi thành phần bằng gam. Vui lòng chỉ sử dụng các thành phần từ danh sách đã biết này: ${knownFoodNames}. Nếu một thành phần không có trong danh sách, hãy tìm một lựa chọn thay thế gần nhất. Trả về kết quả dưới dạng JSON theo schema đã cung cấp.`,
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts: [textPart, imagePart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: imageAnalysisSchema,
      },
    });

    const jsonText = response.text.trim();
    const parsedData = JSON.parse(jsonText);

    if (!Array.isArray(parsedData)) {
      throw new Error("API did not return a valid array of food items.");
    }
    
    // Xử lý hậu kỳ: Tính tổng dựa trên các thành phần từ cơ sở dữ liệu của chúng tôi
    const processedData: FoodNutrition[] = parsedData.map((item: any) => {
      if (!item.ingredients || !Array.isArray(item.ingredients)) {
        // Xử lý trường hợp AI không trả về thành phần
        return {
          ...item,
          calories: 0,
          macros: { protein: '0g', carbohydrates: '0g', fat: '0g' },
          ingredients: [],
        };
      }
      const { calories, macros } = calculateNutritionFromIngredients(item.ingredients);
      return {
        name: item.name,
        description: item.description,
        ingredients: item.ingredients,
        calories,
        macros,
      };
    });

    return processedData;

  } catch (error) {
    console.error("Error calling Gemini API for image analysis:", error);
    throw new Error("Không thể nhận phân tích từ API Gemini cho hình ảnh.");
  }
};

/**
 * Lấy thông tin dinh dưỡng cho một thành phần duy nhất từ AI.
 * @param ingredientName Tên của thành phần cần tra cứu.
 * @returns Một Promise phân giải thành dữ liệu dinh dưỡng trên 100g.
 */
export const getNutritionForIngredient = async (ingredientName: string): Promise<Omit<FoodDataItem, 'name'>> => {
    const prompt = `Cung cấp thông tin dinh dưỡng ước tính (calo, protein, carbohydrate, chất béo) cho 100 gam của "${ingredientName}". Trả về kết quả dưới dạng JSON theo schema đã cung cấp.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: singleIngredientSchema,
            },
        });

        const jsonText = response.text.trim();
        const parsedData = JSON.parse(jsonText);

        if (typeof parsedData.calories !== 'number' || typeof parsedData.protein !== 'number' || typeof parsedData.carbohydrates !== 'number' || typeof parsedData.fat !== 'number') {
            throw new Error('Invalid data structure from API');
        }

        return {
            calories: parsedData.calories,
            protein: parsedData.protein,
            carbohydrates: parsedData.carbohydrates,
            fat: parsedData.fat,
        };
    } catch (error) {
        console.error(`Error fetching nutrition for ${ingredientName}:`, error);
        throw new Error(`Không thể lấy thông tin dinh dưỡng cho "${ingredientName}".`);
    }
};