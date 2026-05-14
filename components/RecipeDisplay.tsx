"use client";

import { GeneratedRecipe } from "@/lib/types";
import { Clock, ChefHat, Bookmark, Check, Sparkles, Share2, Layers, Flame, Award } from "lucide-react";
import { useState } from "react";

interface RecipeDisplayProps {
  recipe: GeneratedRecipe;
  onSaveRecipe?: () => Promise<void>;
  isSaving?: boolean;
  saved?: boolean;
}

// Curated stunning culinary mapping to guarantee high contrast dark overlays
const CUISINE_IMAGES: Record<string, string> = {
  Italian: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1200&q=80",
  Asian: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1200&q=80",
  Indian: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1200&q=80",
  Mexican: "https://images.unsplash.com/photo-1565299585323-38d610875b7a?auto=format&fit=crop&w=1200&q=80",
  American: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80",
  French: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=1200&q=80",
  Mediterranean: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80",
  Healthy: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80",
  Default: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
};

export default function RecipeDisplay({
  recipe,
  onSaveRecipe,
  isSaving = false,
  saved = false,
}: RecipeDisplayProps) {
  const [internalSaved, setInternalSaved] = useState(saved);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({});

  // Dynamic Image assignment
  const matchedKey = Object.keys(CUISINE_IMAGES).find(
    (key) => recipe.cuisine?.toLowerCase().includes(key.toLowerCase()) || recipe.name.toLowerCase().includes(key.toLowerCase())
  );
  const heroImage = matchedKey ? CUISINE_IMAGES[matchedKey] : CUISINE_IMAGES.Default;

  // Compute Difficulty heuristic
  const stepCount = recipe.instructions.length;
  const difficulty = stepCount > 7 ? "Hard" : stepCount > 4 ? "Medium" : "Easy";
  const difficultyColor =
    difficulty === "Easy"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : difficulty === "Medium"
      ? "bg-bite-accent/10 text-bite-text border-bite-accent"
      : "bg-bite-red/10 text-bite-red border-bite-red/20";

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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.name,
          text: `Check out this AI Generated recipe for ${recipe.name}!`,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const toggleCheck = (idx: number) => {
    setCheckedIngredients((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden transition-all animate-slide-up">
      {/* Large Featured Hero Food Image with Luxury Dark Overlay */}
      <div className="relative h-64 sm:h-80 w-full bg-bite-bg overflow-hidden">
        <img
          src={heroImage}
          alt={recipe.name}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
        />
        {/* Soft luxury dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Floating overlays: Cuisine badge & share bar */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          {recipe.cuisine && (
            <span className="backdrop-blur-md bg-white/90 text-bite-red px-3.5 py-1.5 rounded-full text-xs font-black tracking-wide shadow-md border border-white/20 flex items-center gap-1.5">
              <ChefHat className="w-3.5 h-3.5 text-bite-accent" />
              {recipe.cuisine}
            </span>
          )}

          <button
            onClick={handleShare}
            title="Share recipe link"
            className="p-2.5 backdrop-blur-md bg-black/40 hover:bg-black/60 text-white rounded-full transition-all border border-white/10 active:scale-95"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Title over dark backdrop */}
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight drop-shadow-md">
            {recipe.name}
          </h1>
        </div>
      </div>

      {/* Main body info content */}
      <div className="p-6 sm:p-8 space-y-8">
        {/* Top Parameters Row Deck */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-1">
          {/* Stats grouping */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Difficulty Pill */}
            <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 shadow-sm ${difficultyColor}`}>
              <Award className="w-3 h-3 shrink-0" />
              {difficulty}
            </span>

            {/* Time Pill */}
            <span className="px-3 py-1 bg-bite-bg text-bite-text rounded-full text-xs font-bold border border-gray-200/60 flex items-center gap-1 shadow-sm">
              <Clock className="w-3 h-3 text-bite-red shrink-0" />
              {recipe.prepTime ? `${recipe.prepTime} Prep` : "15m"}
            </span>

            {/* Calories Highlight badge */}
            {recipe.nutrition?.calories && (
              <span className="px-3 py-1 bg-bite-red text-white rounded-full text-xs font-black tracking-tight shadow-sm flex items-center gap-1">
                <Flame className="w-3 h-3 text-bite-accent shrink-0" />
                {recipe.nutrition.calories} kcal
              </span>
            )}
          </div>

          {/* Core Action Trigger: Save Button */}
          {onSaveRecipe && (
            <button
              onClick={handleSave}
              disabled={internalSaved || loading || isSaving}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold tracking-wide transition-all shadow-md active:scale-95 ${
                internalSaved
                  ? "bg-emerald-500 text-white border border-emerald-600 shadow-emerald-500/20"
                  : "bg-bite-accent hover:bg-[#E0941B] text-bite-text border border-transparent shadow-bite-accent/20"
              }`}
            >
              {internalSaved ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Saved to Favorites</span>
                </>
              ) : loading || isSaving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-3.5 h-3.5 fill-current" />
                  <span>Save Recipe</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Main Grid: Checklist & Step instructions */}
        <div className="grid md:grid-cols-12 gap-8 items-start pt-4 border-t border-gray-100">
          {/* Left Column: Interactive Ingredient Checklist */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-bite-muted uppercase tracking-wider block">
                Ingredient Checklist
              </h3>
              <span className="text-[10px] text-gray-400 italic">Click to check off</span>
            </div>

            <div className="space-y-2">
              {recipe.ingredients.map((item, idx) => {
                const isChecked = checkedIngredients[idx];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleCheck(idx)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                      isChecked
                        ? "bg-gray-50/80 border-gray-200/60 opacity-60 line-through text-gray-400"
                        : "bg-white border-gray-100 hover:border-bite-accent/40 text-bite-text shadow-sm"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        isChecked ? "bg-bite-red border-bite-red text-white" : "border-gray-300 bg-white"
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className="text-xs font-semibold leading-relaxed pt-0.5">{item}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Step-by-Step Instructions */}
          <div className="md:col-span-7 space-y-4">
            <h3 className="text-xs font-bold text-bite-muted uppercase tracking-wider block">
              Step-by-Step Method
            </h3>

            <div className="space-y-3.5">
              {recipe.instructions.map((step, idx) => {
                const stepText = step.replace(/^Step \d+:\s*/i, "");
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[#FFF8F3]/40 border border-gray-100 flex items-start gap-3.5"
                  >
                    <span className="flex items-center justify-center shrink-0 w-6 h-6 rounded-full bg-bite-red text-white font-black text-xs shadow-sm">
                      {idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm text-bite-text font-medium leading-relaxed pt-0.5">
                      {stepText}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Featured Chef's Secret Tip Footer */}
        {recipe.chefsTip && (
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-bite-red/5 to-bite-accent/10 border border-bite-red/10 flex items-start gap-3.5">
            <div className="p-2 bg-bite-red rounded-xl text-white shrink-0 shadow-sm">
              <Sparkles className="w-4 h-4 text-bite-accent animate-spin" />
            </div>
            <div>
              <h4 className="text-[10px] font-bold text-bite-red uppercase tracking-widest mb-1">
                AI Chef Tip
              </h4>
              <p className="text-xs sm:text-sm text-bite-text italic font-bold leading-relaxed">
                "{recipe.chefsTip}"
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
