<div align="center">
  <h1>🚀 ProHire AI: Resume Intelligence Platform</h1>
  <p><strong>A $10M SaaS-grade AI Career Intelligence engine built to auto-optimize resumes and track live hiring signals.</strong></p>

  <!-- Badges -->
  <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js 14" /></a>
  <a href="https://supabase.com/"><img src="https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase" alt="Supabase" /></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" /></a>
  <a href="https://gemini.google.com/"><img src="https://img.shields.io/badge/Gemini_2.5_Flash-AI-4285F4?style=for-the-badge&logo=google" alt="Google Gemini API" /></a>
</div>

<br />

## 🌟 The Vision
The **ResumeHandler Platform** acts as an all-in-one AI career co-pilot. It instantly processes base resumes, monitors target companies for job openings via real-time WebSockets, and uses **Google Gemini 2.5 Flash** to automatically rewrite, optimize, and score resumes against specific job descriptions. 

Designed with a premium dark-mode, glassmorphic UI, it delivers a state-of-the-art interaction experience.

---

## 🔥 Key Features

- **🧠 The Magic Auto-Optimizer:** Paste any job description to instantly ping Gemini AI. Watch as it rewrites your Professional Summary and Experience bullet points to perfectly align with the target role.
- **🎯 ATS Match Scoring:** Calculates probability scores for ATS (Applicant Tracking System) compatibility and suggests missing keywords to improve application success rates.
- **⚡ Live Hiring Signals:** Connects to Supabase Realtime subscriptions to track company job postings dynamically. Creates instantaneous UI Toasts when new signal events occur in the database.
- **📄 The Resume Vault:** A centralized Dropzone for users to upload and manage their base PDF templates.
- **🔍 AI Keyword Extraction Engine:** A powerful tool that parses raw job descriptions to isolate the exact technical and soft skills ATS algorithms scan for.

---

## 💻 The Tech Stack

### Frontend Architecture
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS & Custom CSS Variables (Glassmorphism, Gradients)
- **Animations:** Framer Motion & CSS keyframes
- **Icons:** `lucide-react`

### Backend & AI Architecture
- **API Engine:** Next.js API/Edge Routes
- **Database:** Supabase (PostgreSQL)
- **Vector Storage:** `pgvector` enabled for semantic embeddings
- **Authentication:** Supabase SSR (Server-Side Rendering Auth)
- **AI Integration:** `@google/genai` (Gemini Flash model)
- **PDF Extraction:** `pdf-parse`

---

## 🛠️ Local Development Setup

Follow these steps to run the application locally.

### 1. Clone the Repository
```bash
git clone https://github.com/sangmesh121/ResumeHandler.git
cd ResumeHandler/web
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Supabase Database
1. Create a new project at [database.new](https://database.new)
2. Open your project's **SQL Editor**.
3. Copy the contents of `/supabase/schema.sql` and run it to instantiate the users, resumes, and jobs tables, along with Row Level Security.

### 4. Setup Environment Variables
Create a `.env.local` file in the root `web/` directory and add your keys:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Get a key from Google AI Studio
GEMINI_API_KEY=your_google_gemini_api_key
```

### 5. Launch the App
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 📸 Platform Views

| Landing Page | Dashboard & Live Signals |
| :---: | :---: |
| Premium marketing UI with dynamic effects. | Overview of ATS scores and live hiring tracking. |
| AI Resume Optimizer | AI Keyword Engine |
| Magic real-time generation of target variants. | Instant extraction of crucial ATS requirements. |

---

*Built for scale. Designed to win.* 🚀
