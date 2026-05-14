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
      colorClass: "text-orange-500",
      bgClass: "bg-orange-50",
      borderClass: "border-orange-100",
    },
    {
      label: "Protein",
      value: nutrition.protein ?? "-",
      unit: "g",
      icon: Beef,
      colorClass: "text-red-500",
      bgClass: "bg-red-50",
      borderClass: "border-red-100",
    },
    {
      label: "Carbs",
      value: nutrition.carbs ?? "-",
      unit: "g",
      icon: Wheat,
      colorClass: "text-amber-500",
      bgClass: "bg-amber-50",
      borderClass: "border-amber-100",
    },
    {
      label: "Fat",
      value: nutrition.fat ?? "-",
      unit: "g",
      icon: Droplets,
      colorClass: "text-yellow-600",
      bgClass: "bg-yellow-50",
      borderClass: "border-yellow-100",
    },
  ];

  return (
    <div className="mt-6 animate-slide-up">
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">
        Estimated Nutrition (Per Serving)
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className={`p-4 rounded-2xl border bg-white shadow-sm flex items-center gap-3.5 hover:shadow-md transition-shadow relative overflow-hidden group`}
            >
              <div className={`p-2.5 rounded-xl ${stat.bgClass} ${stat.colorClass} shrink-0`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-medium text-gray-500 block mb-0.5">
                  {stat.label}
                </span>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-lg font-bold text-gray-800 tracking-tight">
                    {stat.value}
                  </span>
                  <span className="text-xs font-semibold text-gray-400">{stat.unit}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
