"use client";

import { useState, FormEvent } from "react";
import { Plus, X, Sparkles, Layers, ArrowRight, Check } from "lucide-react";

interface IngredientInputProps {
  ingredients: string[];
  onAddIngredient: (ingredient: string) => void;
  onRemoveIngredient: (index: number) => void;
  dietaryPreference: string;
  onDietaryPreferenceChange: (pref: string) => void;
  onGenerateRecipe: () => void;
  isGenerating: boolean;
  servings: number;
  onServingsChange: (servings: number) => void;
}

const DIETARY_OPTIONS = ["None", "Vegetarian", "Vegan", "Gluten-Free"];

const PROMPT_EXAMPLES = [
  {
    label: "Generate a healthy dinner",
    items: ["Salmon breast", "Broccoli", "Brown rice", "Lemon"],
    diet: "None",
  },
  {
    label: "Make a recipe using chicken and rice",
    items: ["Chicken thigh", "Basmati rice", "Garlic", "Onion", "Tomatoes"],
    diet: "None",
  },
  {
    label: "High protein vegetarian meal",
    items: ["Extra firm tofu", "Quinoa", "Spinach", "Black beans", "Avocado"],
    diet: "Vegetarian",
  },
];

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

    // Split by commas if users paste multiple items
    const parts = trimmed.split(",").map((p) => p.trim()).filter(Boolean);

    let addedCount = 0;
    parts.forEach((part) => {
      if (!ingredients.map((i) => i.toLowerCase()).includes(part.toLowerCase())) {
        onAddIngredient(part);
        addedCount++;
      }
    });

    if (addedCount === 0 && parts.length > 0) {
      setError("Ingredient(s) already listed!");
    } else {
      setInputValue("");
      setError("");
    }
  };

  const handleApplyPreset = (example: typeof PROMPT_EXAMPLES[0]) => {
    if (isGenerating) return;
    setError("");
    // Apply dietary preference
    onDietaryPreferenceChange(example.diet);
    // Add all unique items
    example.items.forEach((item) => {
      if (!ingredients.map((i) => i.toLowerCase()).includes(item.toLowerCase())) {
        onAddIngredient(item);
      }
    });
  };

  const isValidToGenerate = ingredients.length >= 2;

  return (
    <div className="space-y-6">
      {/* Clickable Preset Examples Tier */}
      <div>
        <span className="text-[10px] font-bold text-bite-muted uppercase tracking-widest block mb-2 px-1">
          💡 Try an AI Prompt Example:
        </span>
        <div className="flex flex-wrap gap-2">
          {PROMPT_EXAMPLES.map((example, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(example)}
              disabled={isGenerating}
              className="px-3.5 py-1.5 bg-white hover:bg-bite-bg text-bite-text hover:text-bite-red border border-gray-200/80 rounded-full text-xs font-semibold transition-all shadow-sm flex items-center gap-1.5 group text-left active:scale-95"
            >
              <Sparkles className="w-3 h-3 text-bite-accent group-hover:rotate-12 transition-transform shrink-0" />
              <span className="truncate">{example.label}</span>
              <ArrowRight className="w-3 h-3 text-gray-300 group-hover:text-bite-red group-hover:translate-x-0.5 transition-all hidden sm:inline" />
            </button>
          ))}
        </div>
      </div>

      {/* Futuristic Glassmorphism Controller Box */}
      <div className="bg-white/80 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-xl shadow-gray-200/50 border border-white relative overflow-hidden transition-all">
        {/* Absolute top glowing layer */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-bite-red via-bite-accent to-bite-red opacity-80" />

        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-bite-red/5 rounded-2xl text-bite-red">
            <Layers className="w-5 h-5 text-bite-red" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-bite-text tracking-tight">
              AI Smart Input Deck
            </h2>
            <p className="text-xs text-bite-muted">
              Type custom items or click the suggestions above.
            </p>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="relative mb-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              if (error) setError("");
            }}
            placeholder="e.g. Chicken breast, white rice, garlic..."
            disabled={isGenerating}
            className="w-full pl-5 pr-28 py-4 bg-[#FFF8F3]/60 border border-gray-200/80 rounded-full text-bite-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-bite-accent/20 focus:border-bite-accent transition-all text-sm font-medium"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isGenerating}
            className="absolute right-1.5 top-1.5 bottom-1.5 px-5 bg-bite-text hover:bg-bite-red disabled:bg-gray-100 disabled:text-gray-300 text-white font-bold rounded-full text-xs transition-all flex items-center gap-1 shadow-sm active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            Add
          </button>
        </form>

        {error && <p className="text-xs text-bite-red mb-4 px-2 animate-fade-in">{error}</p>}

        {/* Dynamic Ingredients Tags Array */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-[10px] font-bold text-bite-muted uppercase tracking-wider">
              Active Parameters ({ingredients.length})
            </span>
            {ingredients.length > 0 && (
              <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-0.5">
                <Check className="w-3 h-3" /> Ready
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2 min-h-[48px] p-3 bg-bite-bg/40 rounded-2xl border border-gray-100">
            {ingredients.length === 0 ? (
              <span className="text-xs text-gray-400 italic self-center px-2">
                No items available. Add ingredients to empower the AI generator.
              </span>
            ) : (
              ingredients.map((item, index) => (
                <span
                  key={`${item}-${index}`}
                  className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 bg-white border border-gray-200/60 rounded-full text-xs font-bold text-bite-text shadow-sm animate-scale-in group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-bite-accent" />
                  {item}
                  <button
                    type="button"
                    onClick={() => onRemoveIngredient(index)}
                    disabled={isGenerating}
                    className="p-0.5 hover:bg-bite-red/10 rounded-full text-gray-400 hover:text-bite-red transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))
            )}
          </div>
        </div>

        {/* Dietary Modifiers */}
        <div className="mb-8">
          <span className="text-[10px] font-bold text-bite-muted uppercase tracking-wider block mb-2 px-1">
            Dietary Specification
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
                  className={`py-2.5 px-3 rounded-full text-xs font-bold border transition-all ${
                    isSelected
                      ? "bg-bite-accent/10 border-bite-accent text-bite-text shadow-sm"
                      : "bg-white border-gray-100 text-bite-muted hover:border-gray-200 hover:text-bite-text"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Pillar CTA Trigger */}
        <button
          type="button"
          onClick={onGenerateRecipe}
          disabled={!isValidToGenerate || isGenerating}
          className={`w-full py-4 px-6 rounded-full font-black text-white tracking-wide shadow-lg transition-all flex items-center justify-center gap-2 text-sm ${
            isValidToGenerate && !isGenerating
              ? "bg-bite-red hover:bg-[#8A0000] shadow-bite-red/20 hover:shadow-xl hover:shadow-bite-red/30 hover:scale-[1.01] active:scale-[0.99]"
              : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
          }`}
        >
          {isGenerating ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Synthesizing Meal Architecture...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-bite-accent animate-pulse" />
              <span>Generate Recipe</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        {!isValidToGenerate && (
          <p className="text-center text-[11px] text-bite-muted mt-3 font-medium">
            Requires at least 2 key ingredients to initiate smart modeling.
          </p>
        )}
      </div>
    </div>
  );
}
