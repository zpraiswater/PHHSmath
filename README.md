# College Algebra Final Review Dashboard

Next.js + Supabase dashboard for a 2-week College Algebra final exam review.

## Features
- Student login with Supabase Auth.
- Topic-based practice with immediate feedback.
- Mastery states: Not Started, Developing, Almost There, Mastered.
- Teacher dashboard for class snapshots.
- Teacher content page for topic/question management fields.
- Placeholder `/api/generate-question` route for future AI-generated questions.

## Tech Stack
- Next.js App Router + TypeScript
- Tailwind CSS
- Supabase (Auth + Postgres + RLS)

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```
3. Fill in `.env.local` with your Supabase URL and anon key.
4. In Supabase SQL editor, run:
   - `supabase/schema.sql`
5. Run dev server:
   ```bash
   npm run dev
   ```
6. Deploy to Vercel:
   - Import this repo into Vercel.
   - Add the same env vars (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).

## Mastery Rules
- Not Started = 0 attempts
- Developing = below 60%
- Almost There = 60–79%
- Mastered = 80% or higher with at least 5 attempts on topic

## Notes for Future AI Question Generation
- Route: `app/api/generate-question/route.ts`
- Current behavior: returns placeholder JSON.
- Future plan: send topic + example teacher questions to OpenAI to generate mimicked multiple-choice questions and explanations.


## Vercel 404 Troubleshooting
- Ensure the Vercel project **Root Directory** is set to this repository root (`/`).
- Ensure framework preset is **Next.js** (this repo includes `vercel.json`).
- Add both public env vars in Vercel project settings before redeploying.
- If a deployment previously failed during install/build, trigger a fresh redeploy after fixing dependencies.
