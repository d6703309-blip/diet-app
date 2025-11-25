
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult, DietMode } from "./types";

// This tells TypeScript to ignore the process variable check
declare const process: any;

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    ingredients: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Name of the ingredient in Simplified Chinese" },
          weightG: { type: Type.NUMBER },
          calories: { type: Type.NUMBER, description: "Calories for this specific ingredient" },
          protein: { type: Type.NUMBER, description: "Protein(g) for this specific ingredient" },
          carbs: { type: Type.NUMBER, description: "Carbs(g) for this specific ingredient" },
          fat: { type: Type.NUMBER, description: "Fat(g) for this specific ingredient" },
        },
        required: ["name", "weightG", "calories", "protein", "carbs", "fat"],
      },
    },
    totalCalories: { type: Type.NUMBER },
    macros: {
      type: Type.OBJECT,
      properties: {
        protein: { type: Type.NUMBER, description: "Total Protein in grams" },
        carbs: { type: Type.NUMBER, description: "Total Carbohydrates in grams" },
        fat: { type: Type.NUMBER, description: "Total Fat in grams" },
        fiber: { type: Type.NUMBER, description: "Dietary fiber in grams" },
        vitaminA_pct: { type: Type.NUMBER, description: "% of daily value" },
        vitaminC_pct: { type: Type.NUMBER, description: "% of daily value" },
        calcium_pct: { type: Type.NUMBER, description: "% of daily value" },
        iron_pct: { type: Type.NUMBER, description: "% of daily value" },
      },
      required: ["protein", "carbs", "fat", "fiber", "vitaminA_pct", "vitaminC_pct", "calcium_pct", "iron_pct"],
    },
    exercises: {
      type: Type.OBJECT,
      properties: {
        runningMin: { type: Type.NUMBER },
        swimmingMin: { type: Type.NUMBER },
        ropeSkippingMin: { type: Type.NUMBER },
      },
      required: ["runningMin", "swimmingMin", "ropeSkippingMin"],
    },
    advice: { type: Type.STRING, description: "Health advice in Simplified Chinese" },
  },
  required: ["ingredients", "totalCalories", "macros", "exercises", "advice"],
};

export const analyzeFoodImage = async (
  base64Image: string,
  mode: DietMode
): Promise<AnalysisResult> => {
  // Check API Key explicitly
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey.length < 10) {
     throw new Error("API Key 未配置或无效。请在 Vercel 环境变量中设置 API_KEY。");
  }

  const genAI = new GoogleGenAI({ apiKey });

  try {
    const prompt = `
    Analyze the food image provided. 
    1. Identify all distinct ingredients (e.g., Rice, Chicken Breast, Broccoli, Sauce).
    2. Estimate the weight (grams) and calculate macros (calories, protein, carbs, fat) for EACH ingredient individually.
    3. Calculate total nutrition stats.
    4. Provide health advice based on the diet mode: "${mode}".
    5. CRITICAL: All output text (ingredient names, advice) MUST be in Simplified Chinese (简体中文).
    6. Return strictly JSON matching the schema.
    `;

    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: base64Image } },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.4, 
      },
    });

    const text = response.text;
    if (!text) throw new Error("AI 未返回数据");
    
    return JSON.parse(text) as AnalysisResult;
  } catch (error: any) {
    console.error("Gemini Analysis Error:", error);
    
    // Convert confusing error messages to friendly Chinese
    let msg = error.message || "未知错误";
    if (msg.includes("403") || msg.includes("API key not valid")) {
      msg = "API Key 无效或过期 (403)，请检查 Vercel 设置。";
    } else if (msg.includes("Failed to fetch") || msg.includes("NetworkError")) {
      msg = "网络连接失败。请确保您已开启 VPN 全局模式（可访问 Google）。";
    } else if (msg.includes("503") || msg.includes("Overloaded")) {
      msg = "AI 服务繁忙，请稍后重试。";
    }

    throw new Error(msg);
  }
};
