"use client";

import { useState } from "react";
import IngredientInput from "@/components/IngredientInput";
import RecipeDisplay from "@/components/RecipeDisplay";
import NutritionCards from "@/components/NutritionCards";
import { GeneratedRecipe } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { Sparkles, Layers, Flame, Clock, Bookmark, ArrowRight, Check, Award, Compass } from "lucide-react";

// Premium High-Contrast Trending Starters Deck
const TRENDING_RECIPES = [
  {
    name: "Tuscan Garlic Butter Shrimp",
    cuisine: "Italian",
    time: "20m",
    calories: "420",
    difficulty: "Easy",
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80",
    ingredients: ["Shrimp", "Garlic", "Butter", "Heavy Cream", "Spinach", "Sun-dried Tomatoes"],
    diet: "None",
  },
  {
    name: "Spicy Creamy Vegan Ramen",
    cuisine: "Asian",
    time: "25m",
    calories: "510",
    difficulty: "Medium",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
    ingredients: ["Ramen Noodles", "Coconut Milk", "Chili Paste", "Tofu", "Mushrooms", "Bok Choy"],
    diet: "Vegan",
  },
  {
    name: "Golden Paneer Tikka Masala",
    cuisine: "Indian",
    time: "30m",
    calories: "580",
    difficulty: "Medium",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80",
    ingredients: ["Paneer", "Yogurt", "Garam Masala", "Tomato Puree", "Onions", "Cashews"],
    diet: "Vegetarian",
  },
];

export default function DashboardPage() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [dietaryPreference, setDietaryPreference] = useState("None");
  const [servings, setServings] = useState(2);
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
        body: JSON.stringify({ ingredients, dietaryPreference, servings }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate recipe.");
      }

      setRecipe(data.recipe);
      // Smooth scroll down to output
      setTimeout(() => {
        window.scrollTo({ top: window.innerHeight * 0.7, behavior: "smooth" });
      }, 100);
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
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadTrending = async (item: typeof TRENDING_RECIPES[0]) => {
    if (isGenerating) return;
    
    // Update the UI to show the selected trending item's parameters
    setIngredients(item.ingredients);
    setDietaryPreference(item.diet);
    
    setIsGenerating(true);
    setError("");
    setRecipe(null);
    setSaved(false);

    try {
      const response = await fetch("/api/generate-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients: item.ingredients, dietaryPreference: item.diet }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate recipe.");
      }

      setRecipe(data.recipe);
      
      setTimeout(() => {
        window.scrollTo({ top: window.innerHeight * 0.7, behavior: "smooth" });
      }, 100);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please check your network and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Immersive Futuristic Hero Header Banner Deck */}
      <div className="relative bg-bite-red text-white py-16 sm:py-24 overflow-hidden mb-12 shadow-xl">
        {/* Absolute Background image overlay with luxury dark contrast */}
        <div className="absolute inset-0 z-0 opacity-25 mix-blend-overlay pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80"
            alt="Premium Backdrop"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Ambient background decoration */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-bite-accent rounded-full opacity-20 blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-bite-accent tracking-widest uppercase mb-4 border border-white/10">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Gen Smart Cooking Assistant</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-4">
              AI Recipes Built <br />
              <span className="text-bite-accent">Instantly</span> For You.
            </h1>

            <p className="text-sm sm:text-base text-white/80 leading-relaxed font-medium mb-8 max-w-xl">
              Stop stressing over food inventory. Input your kitchen parameters below to empower our engine with structured multi-layer generation models.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-xs text-bite-red text-center font-bold animate-fade-in shadow-sm">
            ⚠️ {error}
          </div>
        )}

        {/* Core Workspace Input Deck */}
        <div className="-mt-20 relative z-20">
          <IngredientInput
            ingredients={ingredients}
            onAddIngredient={handleAddIngredient}
            onRemoveIngredient={handleRemoveIngredient}
            dietaryPreference={dietaryPreference}
            onDietaryPreferenceChange={setDietaryPreference}
            onGenerateRecipe={handleGenerateRecipe}
            isGenerating={isGenerating}
            servings={servings}
            onServingsChange={setServings}
          />
        </div>

        {/* Output Presentation Screen Area */}
        {recipe && (
          <div className="pt-6 space-y-6 animate-slide-up">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200/60">
              <span className="text-xs font-black uppercase tracking-wider text-bite-red flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-bite-accent" /> Generated Recipe Architecture
              </span>
              <button
                onClick={() => setRecipe(null)}
                className="text-xs font-bold text-gray-400 hover:text-bite-text transition-colors"
              >
                Clear Preview ×
              </button>
            </div>

            <RecipeDisplay
              recipe={recipe}
              onSaveRecipe={handleSaveRecipe}
              isSaving={isSaving}
              saved={saved}
            />
            <NutritionCards nutrition={recipe.nutrition} />
          </div>
        )}

        {/* Trending Recipes Pre-Generated Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-bite-text uppercase tracking-wider">
                Trending AI Compositions
              </h3>
              <p className="text-xs text-bite-muted">Click to preview items and setup instantly</p>
            </div>
            <span className="text-[10px] font-bold text-bite-accent bg-bite-accent/10 px-2.5 py-1 rounded-full">
              Live Preview
            </span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TRENDING_RECIPES.map((item, idx) => (
              <div
                key={idx}
                onClick={() => handleLoadTrending(item)}
                className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col justify-between active:scale-[0.98]"
              >
                {/* Visual Backdrop layout */}
                <div className="relative h-44 w-full bg-bite-bg overflow-hidden shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-0.5 bg-bite-red text-white text-[9px] font-black tracking-widest rounded-full uppercase">
                      {item.cuisine}
                    </span>
                    <span className="p-1.5 bg-white/90 backdrop-blur-md rounded-full text-bite-text group-hover:text-bite-red shadow-sm transition-colors">
                      <Bookmark className="w-3 h-3" />
                    </span>
                  </div>

                  {/* Title overlay */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <h4 className="text-sm font-black text-white line-clamp-1 drop-shadow-sm">
                      {item.name}
                    </h4>
                  </div>
                </div>

                {/* Footer Parameters */}
                <div className="p-4 space-y-3">
                  <p className="text-[11px] text-gray-500 line-clamp-1 font-medium">
                    <span className="text-gray-400 font-bold">Includes:</span> {item.ingredients.join(", ")}
                  </p>

                  <div className="pt-2 border-t border-gray-50 flex items-center justify-between text-[10px] font-bold text-bite-muted">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-bite-accent" /> {item.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <Flame className="w-3 h-3 text-bite-red" /> {item.calories} kcal
                    </span>
                    <span className="text-bite-text group-hover:text-bite-red transition-colors flex items-center gap-0.5">
                      Explore <ArrowRight className="w-2.5 h-2.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
