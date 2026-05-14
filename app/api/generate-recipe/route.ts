import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function cleanJsonResponse(text: string): string {
  let cleaned = text.trim();
  cleaned = cleaned.replace(/^```json\s*/, "").replace(/^```\s*/, "").replace(/\s*```$/, "");
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start !== -1 && end !== -1) {
    cleaned = cleaned.substring(start, end + 1);
  }
  return cleaned.trim();
}

export async function POST(request: Request) {
  try {
    const { ingredients, dietaryPreference } = await request.json();

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length < 2) {
      return NextResponse.json({ error: "At least 2 ingredients are required." }, { status: 400 });
    }

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY missing." }, { status: 500 });
    }

    const prompt = `You are a professional chef assistant. Based on the ingredients provided, generate a detailed recipe.
Ingredients available: ${ingredients.join(", ")}
Dietary preference: ${dietaryPreference || "None"}

Respond ONLY with a valid JSON object — no markdown, no backticks, no explanation. 
Use exactly this structure:
{
  "name": "Recipe Name",
  "cuisine": "Italian",
  "prepTime": "10 mins",
  "cookTime": "20 mins",
  "servings": 2,
  "ingredients": [
    "200g chicken breast",
    "2 cloves garlic"
  ],
  "instructions": [
    "Step 1: Do this first",
    "Step 2: Then do this"
  ],
  "chefsTip": "One practical tip to improve this dish",
  "nutrition": {
    "calories": 420,
    "protein": 28,
    "carbs": 45,
    "fat": 12
  }
}
Rules:
- nutrition values are per serving, whole numbers only
- ingredients are exact quantities as strings
- instructions are clear numbered steps as strings
- chefsTip is one sentence only
- cuisine must be one of: Italian, Indian, Asian, Mexican, Mediterranean, American, Middle Eastern, French
- respect the dietary preference strictly`;

    try {
      // Updated the model name to gemini-2.0-flash as requested
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1024,
            }
          })
        }
      );

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Gemini API Fetch Error (${response.status}): ${errText}`);
      }

      const data = await response.json();
      
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error("No candidates returned from Gemini.");
      }

      const rawText = data.candidates[0].content.parts[0].text;
      const cleanedJson = cleanJsonResponse(rawText);
      const recipeData = JSON.parse(cleanedJson);

      supabase.from("recipe_history").insert({
        user_id: user.id,
        name: recipeData.name,
        ingredients: ingredients,
        dietary_preference: dietaryPreference || "None",
        content: JSON.stringify(recipeData),
      }).then(({ error }) => { if (error) console.error("History logging error:", error); });

      return NextResponse.json({ recipe: recipeData });
    } catch (aiError: any) {
      console.error("Gemini Fetch Error:", aiError.message);
      return NextResponse.json({ error: "AI Generation failed: " + aiError.message }, { status: 500 });
    }
  } catch (error: any) {
    console.error("Internal server error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
