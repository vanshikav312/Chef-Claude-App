"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { RecipeHistoryItem, GeneratedRecipe } from "@/lib/types";
import RecipeDisplay from "@/components/RecipeDisplay";
import NutritionCards from "@/components/NutritionCards";
import { History, Calendar, X, Sparkles, ChefHat } from "lucide-react";
import Link from "next/link";

export default function HistoryPage() {
  const [historyItems, setHistoryItems] = useState<RecipeHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState<{
    meta: RecipeHistoryItem;
    parsed: GeneratedRecipe;
  } | null>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    setError("");
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error: dbError } = await supabase
        .from("recipe_history")
        .select("*")
        .order("created_at", { ascending: false });

      if (dbError) throw dbError;

      setHistoryItems(data || []);
    } catch (err: any) {
      setError("Failed to load recipe generation history.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (item: RecipeHistoryItem) => {
    try {
      const parsed = JSON.parse(item.content);
      setSelectedRecipe({ meta: item, parsed });
    } catch (e) {
      console.error("Parse error viewing history content", e);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2 text-amber-600 mb-1">
            <History className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Activity Log</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Generation History
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
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : historyItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200 max-w-xl mx-auto p-8">
          <Sparkles className="w-10 h-10 text-amber-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-800 mb-1">No generations found</h3>
          <p className="text-xs text-gray-500 leading-relaxed mb-6">
            Every AI recipe you generate will be automatically tracked in this history tab for reference.
          </p>
          <Link
            href="/"
            className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-xl text-xs transition-all shadow-md shadow-amber-500/10"
          >
            Open Kitchen
          </Link>
        </div>
      ) : (
        <div className="space-y-3.5">
          {historyItems.map((item) => {
            let parsed: GeneratedRecipe | null = null;
            try {
              parsed = JSON.parse(item.content);
            } catch (e) {}

            const formattedDate = new Date(item.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={item.id}
                onClick={() => handleView(item)}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 hover:border-amber-200 hover:bg-amber-50/10 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    {parsed?.cuisine && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 rounded-md text-[10px] font-semibold text-amber-800 border border-amber-100">
                        <ChefHat className="w-2.5 h-2.5 text-amber-600" />
                        {parsed.cuisine}
                      </span>
                    )}
                    <h3 className="font-bold text-gray-800 group-hover:text-amber-700 transition-colors text-sm sm:text-base">
                      {item.name}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-1">
                    <span className="font-semibold text-gray-400">Ingredients used:</span>{" "}
                    {item.ingredients.join(", ")}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-50 shrink-0">
                  <span className="flex items-center gap-1 text-[11px] text-gray-400 font-medium">
                    <Calendar className="w-3 h-3" />
                    {formattedDate}
                  </span>
                  <span className="text-xs font-semibold text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    View Recipe →
                  </span>
                </div>
              </div>
            );
          })}
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
              <RecipeDisplay recipe={selectedRecipe.parsed} />
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
