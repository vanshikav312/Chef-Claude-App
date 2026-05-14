"use client";

import { SavedRecipe, GeneratedRecipe } from "@/lib/types";
import { Trash2, Calendar, ChefHat, Flame, Clock } from "lucide-react";
import { useState } from "react";

interface SavedRecipeCardProps {
  recipe: SavedRecipe;
  onDelete: (id: string) => Promise<void>;
  onView?: (recipe: SavedRecipe) => void;
}

export default function SavedRecipeCard({ recipe, onDelete, onView }: SavedRecipeCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  let parsedContent: GeneratedRecipe | null = null;
  try {
    parsedContent = JSON.parse(recipe.content);
  } catch (e) {
    console.error("Failed to parse saved recipe content", e);
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await onDelete(recipe.id);
    } catch (err) {
      console.error(err);
      setIsDeleting(false);
    }
  };

  const formattedDate = new Date(recipe.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      onClick={() => onView && onView(recipe)}
      className={`bg-white rounded-3xl p-5 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden group ${
        onView ? "cursor-pointer hover:-translate-y-1 active:scale-[0.99]" : ""
      }`}
    >
      {/* Top accent visual loop */}
      <div className="absolute top-0 left-0 w-1.5 bottom-0 bg-gradient-to-b from-bite-red via-bite-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          {parsedContent?.cuisine ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-bite-red/5 text-bite-red rounded-full text-[10px] font-black tracking-wider uppercase border border-bite-red/10">
              <ChefHat className="w-3 h-3 text-bite-accent" />
              {parsedContent.cuisine}
            </span>
          ) : (
            <span className="text-[10px] text-gray-400 italic">Custom</span>
          )}

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            title="Remove from favorites"
            className="p-1.5 text-gray-300 hover:text-white hover:bg-bite-red rounded-full transition-all disabled:opacity-50"
          >
            {isDeleting ? (
              <div className="w-3.5 h-3.5 border-2 border-bite-red/30 border-t-bite-red rounded-full animate-spin" />
            ) : (
              <Trash2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        <h3 className="font-black text-bite-text group-hover:text-bite-red transition-colors line-clamp-2 text-base tracking-tight mb-2">
          {recipe.name}
        </h3>

        {/* Ingredients view */}
        <p className="text-xs text-bite-muted line-clamp-2 mb-4 leading-relaxed font-medium">
          <span className="font-bold text-gray-400">Items:</span> {recipe.ingredients.join(", ")}
        </p>
      </div>

      <div className="pt-3 border-t border-gray-50 flex items-center justify-between text-[11px] text-gray-400 font-bold">
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3 text-gray-300" />
          {formattedDate}
        </span>
        
        {parsedContent?.nutrition?.calories && (
          <span className="flex items-center gap-0.5 text-bite-accent">
            <Flame className="w-3 h-3" /> {parsedContent.nutrition.calories} kcal
          </span>
        )}

        {recipe.dietary_preference && recipe.dietary_preference !== "None" && (
          <span className="px-2 py-0.5 bg-gray-50 text-gray-500 rounded-md text-[10px]">
            {recipe.dietary_preference}
          </span>
        )}
      </div>
    </div>
  );
}
