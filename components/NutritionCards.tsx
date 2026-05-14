"use client";

import { RecipeNutrition } from "@/lib/types";
import { Flame, Beef, Wheat, Droplets } from "lucide-react";

interface NutritionCardsProps {
  nutrition?: RecipeNutrition | null;
}

export default function NutritionCards({ nutrition }: NutritionCardsProps) {
  if (!nutrition) return null;

  const stats = [
    {
      label: "Calories",
      value: nutrition.calories ?? "-",
      unit: "kcal",
      icon: Flame,
      colorClass: "text-bite-red",
      bgClass: "bg-bite-red/5",
      borderClass: "border-bite-red/10",
    },
    {
      label: "Protein",
      value: nutrition.protein ?? "-",
      unit: "g",
      icon: Beef,
      colorClass: "text-[#D97706]",
      bgClass: "bg-amber-50",
      borderClass: "border-amber-100",
    },
    {
      label: "Carbs",
      value: nutrition.carbs ?? "-",
      unit: "g",
      icon: Wheat,
      colorClass: "text-bite-accent",
      bgClass: "bg-bite-accent/10",
      borderClass: "border-bite-accent/20",
    },
    {
      label: "Fat",
      value: nutrition.fat ?? "-",
      unit: "g",
      icon: Droplets,
      colorClass: "text-gray-500",
      bgClass: "bg-gray-50",
      borderClass: "border-gray-100",
    },
  ];

  return (
    <div className="mt-6 animate-slide-up">
      <h3 className="text-[10px] font-bold text-bite-muted uppercase tracking-wider mb-3 px-1">
        Estimated Macronutrients (Per Serving)
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className={`p-3.5 rounded-2xl border ${stat.borderClass} bg-white shadow-sm flex items-center gap-3 hover:shadow-md transition-shadow relative overflow-hidden group`}
            >
              <div className={`p-2.5 rounded-xl ${stat.bgClass} ${stat.colorClass} shrink-0`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-bite-muted block mb-0.5">
                  {stat.label}
                </span>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-base font-black text-bite-text tracking-tight">
                    {stat.value}
                  </span>
                  <span className="text-[10px] font-bold text-gray-400">{stat.unit}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
