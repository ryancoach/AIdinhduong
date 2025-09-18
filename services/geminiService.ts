import { GoogleGenAI, Type } from "@google/genai";
import { type FoodNutrition } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const nutritionSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      name: {
        type: Type.STRING,
        description: "Tên của loại thực phẩm được xác định.",
      },
      calories: {
        type: Type.INTEGER,
        description: "Lượng calo ước tính cho khẩu phần trong ảnh.",
      },
      macros: {
        type: Type.OBJECT,
        properties: {
          protein: {
            type: Type.STRING,
            description: "Lượng protein ước tính (ví dụ: '10g').",
          },
          carbohydrates: {
            type: Type.STRING,
            description: "Lượng carbohydrate ước tính (ví dụ: '25g').",
          },
          fat: {
            type: Type.STRING,
            description: "Lượng chất béo ước tính (ví dụ: '5g').",
          },
        },
        required: ["protein", "carbohydrates", "fat"],
      },
      description: {
        type: Type.STRING,
        description: "Mô tả ngắn gọn, thú vị hoặc lời khuyên dinh dưỡng về thực phẩm này.",
      },
    },
    required: ["name", "calories", "macros", "description"],
  },
};

export const analyzeImageWithGemini = async (base64Image: string, mimeType: string): Promise<FoodNutrition[]> => {
  const imagePart = {
    inlineData: {
      data: base64Image,
      mimeType: mimeType,
    },
  };

  const textPart = {
    text: "Phân tích hình ảnh này và xác định tất cả các loại thực phẩm có trong đó. Đối với mỗi loại thực phẩm, hãy cung cấp ước tính về lượng calo, các chất dinh dưỡng đa lượng (protein, carbohydrate, fat) và một mô tả ngắn gọn. Vui lòng trả về kết quả dưới dạng JSON theo schema đã cung cấp.",
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts: [textPart, imagePart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: nutritionSchema,
      },
    });

    const jsonText = response.text.trim();
    const parsedData = JSON.parse(jsonText);

    // Basic validation to ensure we have an array
    if (!Array.isArray(parsedData)) {
      throw new Error("API did not return a valid array of food items.");
    }
    
    return parsedData as FoodNutrition[];

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get analysis from Gemini API.");
  }
};