
export enum DietMode {
  NORMAL = '普通饮食',
  WEIGHT_LOSS = '减脂',
  MUSCLE_GAIN = '增肌',
  SUGAR_CONTROL = '控糖',
}

export interface Ingredient {
  name: string;
  weightG: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Macros {
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  vitaminA_pct: number;
  vitaminC_pct: number;
  calcium_pct: number;
  iron_pct: number;
}

export interface ExerciseEquivalents {
  runningMin: number;
  swimmingMin: number;
  ropeSkippingMin: number;
}

export interface AnalysisResult {
  ingredients: Ingredient[];
  totalCalories: number;
  macros: Macros;
  exercises: ExerciseEquivalents;
  advice: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  imageUri: string;
  result: AnalysisResult;
  mode: DietMode;
}
