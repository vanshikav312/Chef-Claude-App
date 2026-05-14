"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { SavedRecipe, GeneratedRecipe } from "@/lib/types";
import SavedRecipeCard from "@/components/SavedRecipeCard";
import RecipeDisplay from "@/components/RecipeDisplay";
import NutritionCards from "@/components/NutritionCards";
import { BookOpen, X, Sparkles } from "lucide-react";
import Link from "next/link";

export default function SavedRecipesPage() {
  const [recipes, setRecipes] = useState<SavedRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState<{
    meta: SavedRecipe;
    parsed: GeneratedRecipe;
  } | null>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchSavedRecipes();
  }, []);

  const fetchSavedRecipes = async () => {
    setLoading(true);
    setError("");
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error: dbError } = await supabase
        .from("recipes")
        .select("*")
        .order("created_at", { ascending: false });

      if (dbError) throw dbError;

      setRecipes(data || []);
    } catch (err: any) {
      setError("Failed to load saved recipes.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error: deleteError } = await supabase.from("recipes").delete().eq("id", id);

      if (deleteError) throw deleteError;

      setRecipes((prev) => prev.filter((r) => r.id !== id));
      if (selectedRecipe?.meta.id === id) {
        setSelectedRecipe(null);
      }
    } catch (err) {
      console.error("Failed to delete recipe", err);
      throw err;
    }
  };

  const handleView = (recipe: SavedRecipe) => {
    try {
      const parsed = JSON.parse(recipe.content);
      setSelectedRecipe({ meta: recipe, parsed });
    } catch (e) {
      console.error("Parse error viewing recipe content", e);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2 text-amber-600 mb-1">
            <BookOpen className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Your Cookbook</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Saved Favorite Recipes
          </h1>
        </div>

        <Link
          href="/"
          className="self-start sm:self-auto px-4 py-2 bg-amber-50 text-amber-700 hover:bg-amber-100 font-semibold rounded-xl text-xs transition-all border border-amber-100"
        >
          + Generate New
        </Link>
      </div>

      {error && <p className="text-xs text-red-500 mb-6">{error}</p>}

      {/* Main Container */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-48 bg-gray-100 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : recipes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200 max-w-xl mx-auto p-8">
          <Sparkles className="w-10 h-10 text-amber-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-800 mb-1">No saved recipes yet</h3>
          <p className="text-xs text-gray-500 leading-relaxed mb-6">
            Whenever Chef Claude generates a recipe you adore, click "Save Recipe" to permanently store it here.
          </p>
          <Link
            href="/"
            className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-xl text-xs transition-all shadow-md shadow-amber-500/10"
          >
            Open Kitchen
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <SavedRecipeCard
              key={recipe.id}
              recipe={recipe}
              onDelete={handleDelete}
              onView={handleView}
            />
          ))}
        </div>
      )}

      {/* Detailed Recipe Modal View */}
      {selectedRecipe && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="relative max-w-3xl w-full bg-[#fafaf9] rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto border border-amber-100/50">
            {/* Sticky close action */}
            <div className="sticky top-0 right-0 z-50 flex justify-end p-4 pointer-events-none">
              <button
                onClick={() => setSelectedRecipe(null)}
                className="p-2 bg-white/80 backdrop-blur-md rounded-full text-gray-400 hover:text-gray-700 shadow-md border border-gray-100 pointer-events-auto transition-transform active:scale-95"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-2 sm:p-6 pt-0">
              <RecipeDisplay recipe={selectedRecipe.parsed} saved={true} />
              <div className="px-6 pb-6">
                <NutritionCards nutrition={selectedRecipe.parsed.nutrition} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
