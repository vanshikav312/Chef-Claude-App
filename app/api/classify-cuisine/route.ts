import { HfInference } from "@huggingface/inference";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { ingredients } = await request.json();

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return NextResponse.json({ cuisine: "Unknown" });
    }

    const hfKey = process.env.HUGGINGFACE_API_KEY?.trim();
    if (!hfKey) {
      console.warn("HUGGINGFACE_API_KEY missing for classification. Falling back to Unknown.");
      return NextResponse.json({ cuisine: "Unknown" });
    }

    const hf = new HfInference(hfKey);

    try {
      // Using the exact pattern requested by the user
      const result = await hf.zeroShotClassification({
        model: "facebook/bart-large-mnli",
        inputs: ingredients.join(", "),
        parameters: {
          candidate_labels: [
            "Italian",
            "Indian",
            "Asian",
            "Mexican",
            "Mediterranean",
            "American",
            "Middle Eastern",
            "French"
          ]
        }
      });

      // Handle cases where labels might be empty
      if (result && result.labels && result.labels.length > 0) {
        return NextResponse.json({ cuisine: result.labels[0] });
      }

      return NextResponse.json({ cuisine: "Unknown" });
    } catch (hfError: any) {
      console.error("Cuisine Classification HF Error:", hfError.message);
      // Fallback instead of crash as requested
      return NextResponse.json({ cuisine: "Unknown" });
    }
  } catch (error: any) {
    console.error("Cuisine Classification Route Error:", error);
    // Fallback instead of crash as requested
    return NextResponse.json({ cuisine: "Unknown" });
  }
}
