"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { SavedRecipe, GeneratedRecipe } from "@/lib/types";
import SavedRecipeCard from "@/components/SavedRecipeCard";
import RecipeDisplay from "@/components/RecipeDisplay";
import NutritionCards from "@/components/NutritionCards";
import { Bookmark, X, Sparkles, Layers } from "lucide-react";
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in pb-24">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-200/60">
        <div>
          <div className="flex items-center gap-2 text-bite-red mb-1">
            <Bookmark className="w-4 h-4 fill-current text-bite-accent" />
            <span className="text-[10px] font-black uppercase tracking-widest block">
              Dashboard Collection
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-bite-text tracking-tight">
            Saved AI Recipes
          </h1>
        </div>

        <Link
          href="/"
          className="self-start sm:self-auto px-5 py-2.5 bg-bite-text text-white hover:bg-bite-red font-bold rounded-full text-xs transition-all shadow-sm active:scale-95 flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-bite-accent" />
          <span>New Generation</span>
        </Link>
      </div>

      {error && <p className="text-xs text-bite-red mb-6 font-bold">{error}</p>}

      {/* Main Container */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-44 bg-white border border-gray-100 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : recipes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200 max-w-xl mx-auto p-8 shadow-sm">
          <Layers className="w-10 h-10 text-bite-accent mx-auto mb-3" />
          <h3 className="text-sm font-black text-bite-text mb-1 tracking-tight">No saved formulas</h3>
          <p className="text-xs text-bite-muted leading-relaxed mb-6 font-medium">
            Generated recipes that you choose to store will permanently accumulate here for easy re-cooking reference.
          </p>
          <Link
            href="/"
            className="px-5 py-2.5 bg-bite-red hover:bg-[#8A0000] text-white font-bold rounded-full text-xs transition-all shadow-md shadow-bite-red/10"
          >
            Launch Input Studio
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

      {/* Detailed Fullscreen Preview Screen overlay */}
      {selectedRecipe && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in">
          <div className="relative max-w-3xl w-full bg-bite-bg rounded-3xl shadow-2xl max-h-[92vh] overflow-y-auto border border-white">
            {/* Close control overlay */}
            <div className="sticky top-0 right-0 z-50 flex justify-end p-4 pointer-events-none">
              <button
                onClick={() => setSelectedRecipe(null)}
                className="p-2.5 bg-black/80 hover:bg-black text-white rounded-full shadow-lg border border-white/10 pointer-events-auto transition-transform active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-2 sm:p-6 pt-0 space-y-6">
              <RecipeDisplay recipe={selectedRecipe.parsed} saved={true} />
              <div className="px-2 sm:px-6 pb-6">
                <NutritionCards nutrition={selectedRecipe.parsed.nutrition} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
