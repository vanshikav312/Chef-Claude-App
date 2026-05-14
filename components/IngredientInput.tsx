"use client";

import { useState, FormEvent } from "react";
import { Plus, X, Sparkles, Utensils } from "lucide-react";

interface IngredientInputProps {
  ingredients: string[];
  onAddIngredient: (ingredient: string) => void;
  onRemoveIngredient: (index: number) => void;
  dietaryPreference: string;
  onDietaryPreferenceChange: (pref: string) => void;
  onGenerateRecipe: () => void;
  isGenerating: boolean;
}

const DIETARY_OPTIONS = ["None", "Vegetarian", "Vegan", "Gluten-Free"];

export default function IngredientInput({
  ingredients,
  onAddIngredient,
  onRemoveIngredient,
  dietaryPreference,
  onDietaryPreferenceChange,
  onGenerateRecipe,
  isGenerating,
}: IngredientInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    if (ingredients.map((i) => i.toLowerCase()).includes(trimmed.toLowerCase())) {
      setError("Ingredient already added!");
      return;
    }

    onAddIngredient(trimmed);
    setInputValue("");
    setError("");
  };

  const isValidToGenerate = ingredients.length >= 2;

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-xl shadow-amber-100/50 border border-amber-100/60 transition-all">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-amber-50 rounded-2xl text-amber-600">
          <Utensils className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">What's in your kitchen?</h2>
          <p className="text-sm text-gray-500">Add at least 2 ingredients to start generating.</p>
        </div>
      </div>

      {/* Ingredient Form */}
      <form onSubmit={handleSubmit} className="relative mb-4">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            if (error) setError("");
          }}
          placeholder="e.g. 200g chicken breast, 2 tomatoes..."
          disabled={isGenerating}
          className="w-full pl-5 pr-32 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm"
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || isGenerating}
          className="absolute right-2 top-2 bottom-2 px-5 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-medium rounded-xl text-sm transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </form>

      {error && <p className="text-xs text-red-500 mb-4 px-1 animate-fade-in">{error}</p>}

      {/* Tags List */}
      <div className="mb-6">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2.5">
          Ingredients List ({ingredients.length})
        </span>
        <div className="flex flex-wrap gap-2 min-h-[44px] p-2.5 bg-gray-50/50 rounded-2xl border border-gray-100">
          {ingredients.length === 0 ? (
            <span className="text-xs text-gray-400 italic self-center px-2">
              No ingredients added yet.
            </span>
          ) : (
            ingredients.map((item, index) => (
              <span
                key={`${item}-${index}`}
                className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 bg-white border border-amber-200/60 rounded-xl text-xs font-medium text-amber-900 shadow-sm animate-fade-in group"
              >
                {item}
                <button
                  type="button"
                  onClick={() => onRemoveIngredient(index)}
                  disabled={isGenerating}
                  className="p-0.5 hover:bg-amber-50 rounded-md text-amber-400 hover:text-amber-600 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))
          )}
        </div>
      </div>

      {/* Dietary Preference Selector */}
      <div className="mb-8">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2.5">
          Dietary Preference
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {DIETARY_OPTIONS.map((option) => {
            const isSelected = dietaryPreference === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => onDietaryPreferenceChange(option)}
                disabled={isGenerating}
                className={`py-2.5 px-3 rounded-xl text-xs font-medium border transition-all ${
                  isSelected
                    ? "bg-amber-50 border-amber-500 text-amber-700 shadow-sm font-semibold"
                    : "bg-white border-gray-200 text-gray-600 hover:border-amber-200 hover:bg-amber-50/20"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      {/* Generate Button */}
      <button
        type="button"
        onClick={onGenerateRecipe}
        disabled={!isValidToGenerate || isGenerating}
        className={`w-full py-4 px-6 rounded-2xl font-semibold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
          isValidToGenerate && !isGenerating
            ? "bg-gradient-to-r from-amber-500 to-orange-600 hover:shadow-xl hover:shadow-amber-500/20 hover:scale-[1.01] active:scale-[0.99]"
            : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
        }`}
      >
        {isGenerating ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Consulting Chef Claude...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span>Generate Recipe</span>
          </>
        )}
      </button>

      {!isValidToGenerate && (
        <p className="text-center text-xs text-amber-600/80 mt-3 font-medium">
          💡 Add {2 - ingredients.length} more ingredient{ingredients.length === 1 ? "" : "s"} to unlock AI generation.
        </p>
      )}
    </div>
  );
}
