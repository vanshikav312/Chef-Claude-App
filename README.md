# Chef Claude

> A full-stack AI-powered cooking assistant that generates personalized recipes from your available ingredients — reducing food waste one meal at a time.

## Features

- **AI Recipe Generation** — Input your ingredients and instantly receive a fully structured recipe powered by LLaMA 3.3 70B via Groq
- **Cuisine Classification** — Automatic ML-based cuisine detection using Hugging Face zero-shot classification
- **Dietary Preferences** — Supports None, Vegetarian, Vegan, and Gluten-Free filters, strictly enforced in the AI prompt
- **Serving Customization** — Dynamically adjust recipe ingredients and quantities based on the number of people/servings
- **Nutrition Estimation** — Per-serving breakdown of calories, protein, carbs, and fats — estimated by the AI model
- **Save Favourites** — Authenticated users can save generated recipes and access them from their personal dashboard
- **Generation History** — Every recipe generation is logged and accessible in reverse chronological order
- **Secure by Design** — All API keys are server-side only; never exposed to the client

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| AI / LLM | Groq API — `llama-3.3-70b-versatile` |
| ML Classification | Hugging Face Inference API — `facebook/bart-large-mnli` |
| Auth & Database | Supabase (PostgreSQL + Row Level Security) |
| Deployment | Vercel |

---

## Architecture & Engineering Decisions

- **Secure API proxy pattern** — All AI and third-party API calls are routed through Next.js API routes (`/api/generate-recipe`, `/api/classify-cuisine`). No API keys are ever sent to or accessible from the client.

- **Database-level security** — Row Level Security (RLS) is enforced directly in Supabase/PostgreSQL, ensuring users can only read and write their own data — independent of application logic.

- **Parallel API execution** — Cuisine classification via Hugging Face runs in parallel with recipe generation using `Promise.all`, keeping response times fast. If the ML service fails, the app falls back gracefully without breaking the user experience.

- **Structured JSON prompting** — The LLM is instructed to return strict JSON with a defined schema. Responses are parsed with error handling, enabling fully type-safe data flow from AI to UI.

- **Provider-agnostic API layer** — The AI provider is abstracted behind a single API route. Switching models or providers requires changing one file only.

---

## Project Structure

```
chefclaude/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx          ← protected layout, auth check
│   │   ├── page.tsx            ← ingredient input + recipe generation
│   │   ├── saved/page.tsx      ← saved favourite recipes
│   │   └── history/page.tsx    ← generation history
│   ├── api/
│   │   ├── generate-recipe/route.ts   ← Groq LLM call
│   │   └── classify-cuisine/route.ts  ← Hugging Face ML call
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── IngredientInput.tsx
│   ├── RecipeDisplay.tsx
│   ├── NutritionCards.tsx
│   ├── SavedRecipeCard.tsx
│   └── Navbar.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   └── types.ts
├── .env.example
└── README.md
```

---

## Database Schema

```sql
-- Saved favourite recipes
create table recipes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  ingredients text[] not null,
  dietary_preference text,
  content text not null,
  created_at timestamptz default now()
);

-- Full generation history
create table recipe_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  ingredients text[] not null,
  dietary_preference text,
  content text not null,
  created_at timestamptz default now()
);

-- Row Level Security
alter table recipes enable row level security;
alter table recipe_history enable row level security;

create policy "Users manage their own recipes"
  on recipes for all using (auth.uid() = user_id);

create policy "Users manage their own history"
  on recipe_history for all using (auth.uid() = user_id);
```

---

## Local Setup

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) project (free)
- A [Groq](https://console.groq.com) API key (free)
- A [Hugging Face](https://huggingface.co/settings/tokens) access token (free)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/chefclaude.git
cd chefclaude
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GROQ_API_KEY=your_groq_api_key
HUGGINGFACE_API_KEY=your_huggingface_token
```

4. **Run the Supabase SQL schema**

Go to your Supabase project → SQL Editor → paste and run the schema from the Database Schema section above.

5. **Start the development server**
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key |
| `GROQ_API_KEY` | Groq API key for LLM recipe generation |
| `HUGGINGFACE_API_KEY` | Hugging Face token for cuisine classification |

---

## License

MIT — free to use and modify.

---

<p align="center">Built by <a href="https://linkedin.com/in/vanshikav731">Vanshika Valecha</a></p>
