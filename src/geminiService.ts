
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult, DietMode } from "./types";

const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });

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
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};
