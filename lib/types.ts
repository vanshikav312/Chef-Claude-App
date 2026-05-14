export interface RecipeNutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface GeneratedRecipe {
  name: string;
  cuisine: string;
  prepTime: string;
  cookTime: string;
  servings: number;
  ingredients: string[];
  instructions: string[];
  chefsTip: string;
  nutrition: RecipeNutrition;
}

export interface SavedRecipe {
  id: string;
  user_id: string;
  name: string;
  ingredients: string[];
  dietary_preference: string | null;
  content: string; // JSON stringified GeneratedRecipe
  created_at: string;
}

export interface RecipeHistoryItem {
  id: string;
  user_id: string;
  name: string;
  ingredients: string[];
  dietary_preference: string | null;
  content: string; // JSON stringified GeneratedRecipe
  created_at: string;
}
