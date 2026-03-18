import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: Request) {
  try {
    const { filters, parsedResume } = await req.json();

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const prompt = `
      You are an elite Tech Recruiter AI with access to live Google Search. 
      Your task is to search the live internet for currently active, open job postings that highly match the following filters and the candidate's core resume skills.
      
      User Requested Filters:
      - Role/Keywords: ${filters?.role || 'Any'}
      - Location: ${filters?.location || 'Anywhere / Remote'}
      - Experience Level: ${filters?.experience || 'Any'}
      - Work Mode: ${filters?.workMode || 'Any'}
      
      Candidate's Base Resume (for context):
      ${JSON.stringify(parsedResume?.skills || {})}
      ${JSON.stringify(parsedResume?.summary || "")}
      
      Search career pages, LinkedIn, Indeed, Glassdoor, and startup boards. 
      You MUST return exactly 10 highly realistic, currently open job positions that fit these criteria.
      
      CRITICAL URL REQUIREMENT: 
      The "applyUrl" MUST be the direct, exact link to the job's application form (e.g., boards.greenhouse.io/company/jobs/1234, jobs.lever.co/company/4567, or company.com/careers/specific-job-id). 
      DO NOT return generic homepages like "stripe.com" or "google.com".
      
      Return a JSON array of 10 objects. Each object MUST have exactly these fields:
      - "company": string (The name of the hiring company)
      - "role": string (The job title)
      - "location": string (The job location, e.g. "Bangalore, Remote")
      - "experience": string (e.g., "0-2 Yrs", "3+ Yrs")
      - "description": string (A 2-3 sentence summary of the role's requirements)
      - "applyUrl": string (A VALID, DIRECT url to the specific application form. Must start with https://)
      - "tags": array of strings (3-4 core skills required, like ["React", "Node.js"])
      
      Return ONLY valid JSON. No markdown wrappers, no explanations. Do not fail.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    const jobsJson = response.text || '[]';
    // Sometimes Gemini wraps it in markdown despite instructions if grounding is used, so clean it safely
    const cleanJson = jobsJson.replace(/```json/g, '').replace(/```/g, '').trim();
    const jobs = JSON.parse(cleanJson);

    return NextResponse.json({ success: true, data: jobs });
  } catch (error: any) {
    console.error("API Route Error (job search):", error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
