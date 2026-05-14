"use client";

import { useState } from "react";
import IngredientInput from "@/components/IngredientInput";
import RecipeDisplay from "@/components/RecipeDisplay";
import NutritionCards from "@/components/NutritionCards";
import { GeneratedRecipe } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { Sparkles, HelpCircle } from "lucide-react";

export default function DashboardPage() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [dietaryPreference, setDietaryPreference] = useState("None");
  const [isGenerating, setIsGenerating] = useState(false);
  const [recipe, setRecipe] = useState<GeneratedRecipe | null>(null);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const supabase = createClient();

  const handleAddIngredient = (item: string) => {
    setIngredients((prev) => [...prev, item]);
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGenerateRecipe = async () => {
    if (ingredients.length < 2) return;
    setIsGenerating(true);
    setError("");
    setRecipe(null);
    setSaved(false);

    try {
      const response = await fetch("/api/generate-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients, dietaryPreference }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate recipe.");
      }

      setRecipe(data.recipe);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please check your network and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveRecipe = async () => {
    if (!recipe || isSaving || saved) return;
    setIsSaving(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("User session not found.");

      const { error: dbError } = await supabase.from("recipes").insert({
        user_id: user.id,
        name: recipe.name,
        ingredients: ingredients,
        dietary_preference: dietaryPreference,
        content: JSON.stringify(recipe),
      });

      if (dbError) throw dbError;

      setSaved(true);
    } catch (err: any) {
      console.error("Failed to save recipe:", err);
      throw err; // propagates to component button state
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Title header */}
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200/60 rounded-full text-xs font-semibold text-amber-800 mb-3 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
          <span>AI Culinary Engine Powered by Claude</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight leading-tight">
          Turn Leftovers Into <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            Five-Star Meals
          </span>
        </h1>
        <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed">
          Input available kitchen items below. Let Chef Claude evaluate complementary flavors and generate step-by-step instructions.
        </p>
      </div>

      {error && (
        <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl text-xs text-red-600 animate-fade-in text-center font-medium">
          ⚠️ {error}
        </div>
      )}

      {/* Main Grid content layout */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Input Form */}
        <div className={`lg:col-span-5 ${recipe ? "lg:sticky lg:top-24" : "lg:col-span-8 lg:col-start-3"}`}>
          <IngredientInput
            ingredients={ingredients}
            onAddIngredient={handleAddIngredient}
            onRemoveIngredient={handleRemoveIngredient}
            dietaryPreference={dietaryPreference}
            onDietaryPreferenceChange={setDietaryPreference}
            onGenerateRecipe={handleGenerateRecipe}
            isGenerating={isGenerating}
          />
        </div>

        {/* Right Side: Recipe output presentation */}
        {recipe && (
          <div className="lg:col-span-7 space-y-6">
            <RecipeDisplay
              recipe={recipe}
              onSaveRecipe={handleSaveRecipe}
              isSaving={isSaving}
              saved={saved}
            />
            <NutritionCards nutrition={recipe.nutrition} />
          </div>
        )}
      </div>
    </div>
  );
}
