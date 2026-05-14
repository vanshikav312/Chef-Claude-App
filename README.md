# Chef Claude 👨‍🍳✨

**Chef Claude** is a premium, placement-ready full-stack web application designed to help users combat food waste. By analyzing the available ingredients in your kitchen, Chef Claude leverages advanced Artificial Intelligence to generate complete, structured recipes—complete with estimated per-serving macronutritional profiles and instant cuisine classification.

---

## 🚀 Features

- **Secure, Server-Side AI Orchestration**: All Anthropic Claude interactions occur exclusively within protected Next.js API routes, guaranteeing client-side isolation of all API credentials.
- **Supabase Identity & Persistence**: Full user account lifecycle management (Sign Up, Log In, Protected Session Interceptors) paired with automated historical logging and a personal "Cookbook" favorites tab.
- **Rich Design & Micro-Animations**: Built using tailored Tailwind CSS color tokens, subtle gradient textures, interactive loading animations, and dynamic state feedback.
- **Unified Inline AI Schema**: Employs Anthropic's Claude 3.5 Sonnet engine to generate precise JSON payloads containing step-by-step instructions, specific ingredient string items, a single practical chef's tip, inline cuisine categorization, and estimated nutritional value stats per serving.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict types everywhere)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database & Authentication**: [Supabase](https://supabase.com/) (PostgreSQL + Row Level Security)
- **AI Integration**: [Anthropic Claude API](https://www.anthropic.com/) (`claude-3-5-sonnet-20241022`)
- **Deployment Target**: [Vercel](https://vercel.com/)

---

## 📦 Database Schema Setup

Before running the application locally, execute the following script inside your **Supabase SQL Editor** to construct the required tables and Row Level Security (RLS) policies:

```sql
create table recipes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  ingredients text[] not null,
  dietary_preference text,
  content text not null,
  created_at timestamptz default now()
);

create table recipe_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  ingredients text[] not null,
  dietary_preference text,
  content text not null,
  created_at timestamptz default now()
);

alter table recipes enable row level security;
alter table recipe_history enable row level security;

create policy "Users can manage their own recipes"
  on recipes for all using (auth.uid() = user_id);

create policy "Users can manage their own history"
  on recipe_history for all using (auth.uid() = user_id);
```

---

## ⚙️ Local Development Setup

Follow these straightforward steps to run Chef Claude locally on your machine:

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/ChefClaude.git
cd ChefClaude
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory by duplicating the provided `.env.example` file:
```bash
cp .env.example .env.local
```

Populate the newly created `.env.local` file with your specific environment keys:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```

#### Where to acquire your keys:
- **Supabase Keys**: Navigate to your Supabase Project Dashboard → **Project Settings** → **API**. Copy the `Project URL` and `anon` public key.
- **Anthropic API Key**: Access the [Anthropic Console](https://console.anthropic.com/), navigate to **API Keys**, and generate a new key.

> **Note on Fail-Safe Mode**: If `ANTHROPIC_API_KEY` is omitted or left empty during development review, the application will intelligently fall back to generating beautifully structured, premium placement-ready mock recipes so you can easily explore UI fidelity and database persistence without interruption.

### 4. Start the Development Server
```bash
npm run dev
```

Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to view the kitchen dashboard. Enjoy exploring and generating wonderful meals!
