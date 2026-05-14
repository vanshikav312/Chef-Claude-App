"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { RecipeHistoryItem, GeneratedRecipe } from "@/lib/types";
import RecipeDisplay from "@/components/RecipeDisplay";
import NutritionCards from "@/components/NutritionCards";
import { History, Calendar, X, Sparkles, ChefHat, Flame, Clock, Layers } from "lucide-react";
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in pb-24">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-200/60">
        <div>
          <div className="flex items-center gap-2 text-bite-red mb-1">
            <History className="w-4 h-4 text-bite-accent" />
            <span className="text-[10px] font-black uppercase tracking-widest block">
              AI Processing Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-bite-text tracking-tight">
            Consultation History
          </h1>
        </div>

        <Link
          href="/"
          className="self-start sm:self-auto px-5 py-2.5 bg-bite-text text-white hover:bg-bite-red font-bold rounded-full text-xs transition-all shadow-sm active:scale-95 flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-bite-accent" />
          <span>New Consultation</span>
        </Link>
      </div>

      {error && <p className="text-xs text-bite-red mb-6 font-bold">{error}</p>}

      {/* Main Container */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-20 bg-white border border-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : historyItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200 max-w-xl mx-auto p-8 shadow-sm">
          <Layers className="w-10 h-10 text-bite-accent mx-auto mb-3" />
          <h3 className="text-sm font-black text-bite-text mb-1 tracking-tight">No historical iterations</h3>
          <p className="text-xs text-bite-muted leading-relaxed mb-6 font-medium">
            AI synthesized recipes process through isolated model states and automatically maintain a chronological footprint here.
          </p>
          <Link
            href="/"
            className="px-5 py-2.5 bg-bite-red hover:bg-[#8A0000] text-white font-bold rounded-full text-xs transition-all shadow-md shadow-bite-red/10"
          >
            Launch Input Studio
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
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
                className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 hover:border-bite-accent/60 hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group relative overflow-hidden active:scale-[0.99]"
              >
                {/* Left accent marker loop */}
                <div className="absolute top-0 left-0 w-1 bottom-0 bg-bite-red opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="space-y-1.5 pl-1">
                  <div className="flex items-center gap-2.5">
                    {parsed?.cuisine && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-bite-red/5 text-bite-red rounded-full text-[9px] font-black tracking-wider uppercase border border-bite-red/10">
                        <ChefHat className="w-2.5 h-2.5 text-bite-accent shrink-0" />
                        {parsed.cuisine}
                      </span>
                    )}
                    <h3 className="font-black text-bite-text group-hover:text-bite-red transition-colors text-sm sm:text-base tracking-tight">
                      {item.name}
                    </h3>
                  </div>
                  <p className="text-xs text-bite-muted line-clamp-1 font-medium">
                    <span className="font-bold text-gray-400">Parameters:</span> {item.ingredients.join(", ")}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2.5 sm:pt-0 border-gray-50 shrink-0">
                  <div className="flex items-center gap-3">
                    {parsed?.nutrition?.calories && (
                      <span className="flex items-center gap-0.5 text-[10px] font-black text-bite-accent">
                        <Flame className="w-3 h-3" /> {parsed.nutrition.calories} kcal
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-[10px] text-gray-400 font-bold">
                      <Calendar className="w-3 h-3 text-gray-300" />
                      {formattedDate}
                    </span>
                  </div>
                  <span className="text-xs font-black text-bite-text group-hover:text-bite-red transition-colors opacity-0 group-hover:opacity-100 hidden sm:inline">
                    Review →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detailed Screen modal View */}
      {selectedRecipe && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in">
          <div className="relative max-w-3xl w-full bg-bite-bg rounded-3xl shadow-2xl max-h-[92vh] overflow-y-auto border border-white">
            {/* Close trigger overlay */}
            <div className="sticky top-0 right-0 z-50 flex justify-end p-4 pointer-events-none">
              <button
                onClick={() => setSelectedRecipe(null)}
                className="p-2.5 bg-black/80 hover:bg-black text-white rounded-full shadow-lg border border-white/10 pointer-events-auto transition-transform active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-2 sm:p-6 pt-0 space-y-6">
              <RecipeDisplay recipe={selectedRecipe.parsed} />
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
