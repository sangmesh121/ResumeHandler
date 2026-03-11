# AI ResumeHandler Platform

A $10M SaaS-grade AI Resume Intelligence platform built with Next.js 14, Supabase, and Google Gemini 2.5 Flash.

## Features
- **Resume Vault:** Upload base PDF resumes.
- **Magic Auto-Optimize:** Real-time AI resume rewrites against target job descriptions using Gemini.
- **ATS Match Scoring:** Instant probability scoring for resume-job compatibility.
- **Live Hiring Signals:** Real-time WebSocket company tracking utilizing Supabase pipelines.
- **Keyword Extraction:** AI-driven scraping of ATS keywords from job postings.

## Tech Stack
- Frontend: Next.js 14 (App Router), Tailwind CSS, Framer Motion
- Backend: Next.js API Routes, Supabase (PostgreSQL + pgvector)
- AI Engine: Google Gemini (`@google/genai`)

## Setup
1. Clone the repository.
2. Run `npm install`.
3. Copy `.env.local.example` to `.env.local` and add your `GEMINI_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Run `npm run dev`.
