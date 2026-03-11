-- Enable pgvector extension for AI matchings
create extension if not exists vector;

-- Users Table
create table if not exists users (
  id uuid references auth.users not null primary key,
  email text unique not null,
  plan text default 'free' check (plan in ('free', 'pro', 'enterprise')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Resumes Table
create table if not exists resumes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references users(id) on delete cascade not null,
  target_role text,
  parsed_resume_data jsonb,
  file_url text, -- Supabase Storage URL
  embedding vector(768), -- Gemini embedding for the resume context
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Jobs / Hiring Signals Table
create table if not exists jobs (
  id uuid default gen_random_uuid() primary key,
  company text not null,
  role text not null,
  department text,
  requirements jsonb,
  embedding vector(768), -- Gemini embedding for the job description
  apply_link text,
  hiring_status text default 'open',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Job Alerts Table
create table if not exists job_alerts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references users(id) on delete cascade not null,
  company text,
  department text,
  role text,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table users enable row level security;
alter table resumes enable row level security;
alter table job_alerts enable row level security;

-- Policies
create policy "Users can view their own profile." on users for select using (auth.uid() = id);
create policy "Users can update their own profile." on users for update using (auth.uid() = id);

create policy "Users can view their own resumes." on resumes for select using (auth.uid() = user_id);
create policy "Users can insert their own resumes." on resumes for insert with check (auth.uid() = user_id);
create policy "Users can delete their own resumes." on resumes for delete using (auth.uid() = user_id);

create policy "Users can view their own alerts." on job_alerts for select using (auth.uid() = user_id);
create policy "Users can manage their own alerts." on job_alerts for insert with check (auth.uid() = user_id);
create policy "Users can update their own alerts." on job_alerts for update using (auth.uid() = user_id);
