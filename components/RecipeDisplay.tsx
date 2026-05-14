"use client";

import { GeneratedRecipe } from "@/lib/types";
import { Clock, Users, ChefHat, Bookmark, Check, Sparkles } from "lucide-react";
import { useState } from "react";

interface RecipeDisplayProps {
  recipe: GeneratedRecipe;
  onSaveRecipe?: () => Promise<void>;
  isSaving?: boolean;
  saved?: boolean;
}

export default function RecipeDisplay({
  recipe,
  onSaveRecipe,
  isSaving = false,
  saved = false,
}: RecipeDisplayProps) {
  const [internalSaved, setInternalSaved] = useState(saved);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!onSaveRecipe || internalSaved || loading) return;
    setLoading(true);
    try {
      await onSaveRecipe();
      setInternalSaved(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl shadow-amber-100/40 border border-amber-100/80 animate-slide-up relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-gradient-to-br from-amber-50 to-orange-50 rounded-full opacity-50 pointer-events-none" />

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8 pb-6 border-b border-gray-100 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-3">
            {recipe.cuisine && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 border border-amber-200/60 rounded-full text-xs font-semibold text-amber-800 tracking-wide shadow-sm">
                <ChefHat className="w-3 h-3 text-amber-600" />
                {recipe.cuisine}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
            {recipe.name}
          </h1>
        </div>

        {onSaveRecipe && (
          <button
            onClick={handleSave}
            disabled={internalSaved || loading || isSaving}
            className={`self-start sm:self-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm ${
              internalSaved
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-white border border-amber-200 text-amber-700 hover:bg-amber-50/50 hover:border-amber-300 active:scale-95"
            }`}
          >
            {internalSaved ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Saved to Favorites</span>
              </>
            ) : loading || isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-amber-600/30 border-t-amber-600 rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4" />
                <span>Save Recipe</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-8 p-4 bg-gray-50/60 rounded-2xl border border-gray-100/80 text-center">
        <div className="flex flex-col items-center border-r border-gray-200/60 last:border-none">
          <span className="flex items-center gap-1 text-xs font-medium text-gray-500 mb-1">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Prep Time
          </span>
          <span className="text-sm sm:text-base font-bold text-gray-800">
            {recipe.prepTime || "N/A"}
          </span>
        </div>
        <div className="flex flex-col items-center border-r border-gray-200/60 last:border-none">
          <span className="flex items-center gap-1 text-xs font-medium text-gray-500 mb-1">
            <Clock className="w-3.5 h-3.5 text-orange-600" />
            Cook Time
          </span>
          <span className="text-sm sm:text-base font-bold text-gray-800">
            {recipe.cookTime || "N/A"}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="flex items-center gap-1 text-xs font-medium text-gray-500 mb-1">
            <Users className="w-3.5 h-3.5 text-amber-600" />
            Servings
          </span>
          <span className="text-sm sm:text-base font-bold text-gray-800">
            {recipe.servings || "N/A"}
          </span>
        </div>
      </div>

      {/* Main Grid: Ingredients & Instructions */}
      <div className="grid md:grid-cols-5 gap-8 mb-8">
        {/* Ingredients Column */}
        <div className="md:col-span-2">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">
            Ingredients
          </h3>
          <ul className="space-y-2.5">
            {recipe.ingredients.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm text-gray-700">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                <span className="font-medium leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Instructions Column */}
        <div className="md:col-span-3">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">
            Instructions
          </h3>
          <ol className="space-y-4">
            {recipe.instructions.map((step, idx) => {
              // Optionally remove leading "Step X: " if Claude returned it so we can style nicely, or render as is
              const stepText = step.replace(/^Step \d+:\s*/i, "");
              return (
                <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                  <span className="flex items-center justify-center shrink-0 w-6 h-6 rounded-lg bg-amber-50 text-amber-700 font-bold text-xs border border-amber-100">
                    {idx + 1}
                  </span>
                  <p className="leading-relaxed pt-0.5">{stepText}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      {/* Chef's Tip Section */}
      {recipe.chefsTip && (
        <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-50/80 to-orange-50/80 rounded-2xl border border-amber-200/60 flex items-start gap-3">
          <div className="p-2 bg-white rounded-xl shadow-sm text-amber-600 shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1">
              Chef's Tip
            </h4>
            <p className="text-xs sm:text-sm text-amber-950/90 italic font-medium leading-relaxed">
              "{recipe.chefsTip}"
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
