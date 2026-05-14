"use client";

import { SavedRecipe, GeneratedRecipe } from "@/lib/types";
import { Trash2, Calendar, ChefHat, Eye } from "lucide-react";
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
      className={`bg-white rounded-3xl p-5 border border-amber-100/80 shadow-md shadow-amber-100/30 hover:shadow-xl hover:shadow-amber-100/50 transition-all flex flex-col justify-between relative overflow-hidden group ${
        onView ? "cursor-pointer hover:-translate-y-1" : ""
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          {parsedContent?.cuisine ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 rounded-full text-[10px] font-semibold text-amber-800 border border-amber-100">
              <ChefHat className="w-3 h-3 text-amber-600" />
              {parsedContent.cuisine}
            </span>
          ) : (
            <span className="text-[10px] text-gray-400 italic">Custom</span>
          )}

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            title="Delete saved recipe"
            className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all disabled:opacity-50"
          >
            {isDeleting ? (
              <div className="w-4 h-4 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        </div>

        <h3 className="font-bold text-gray-800 group-hover:text-amber-700 transition-colors line-clamp-2 text-base mb-2">
          {recipe.name}
        </h3>

        {/* Ingredients preview */}
        <p className="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed">
          <span className="font-semibold text-gray-400">Ingredients:</span>{" "}
          {recipe.ingredients.join(", ")}
        </p>
      </div>

      <div className="pt-3 border-t border-gray-50 flex items-center justify-between text-[11px] text-gray-400 font-medium">
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {formattedDate}
        </span>
        {recipe.dietary_preference && recipe.dietary_preference !== "None" && (
          <span className="px-2 py-0.5 bg-gray-50 text-gray-500 rounded-md">
            {recipe.dietary_preference}
          </span>
        )}
      </div>
    </div>
  );
}
