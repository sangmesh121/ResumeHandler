import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: Request) {
  try {
    const { domain, parsedResume } = await req.json();

    if (!domain || !parsedResume) {
      return NextResponse.json({ error: 'Missing domain or resume data' }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const prompt = `
      You are an expert tech recruiter and job market analyst. 
      Analyze this user's resume:
      ${JSON.stringify(parsedResume)}
      
      And their target domain/industry:
      "${domain}"
      
      Find or generate 3 highly realistic, open job positions that perfectly match their experience level and domain.
      Return exactly a JSON array of 3 objects. 
      Each object must have:
      - "company": string (A realistic company name like Google, Stripe, or a realistic startup)
      - "role": string (The exact job title)
      - "description": string (A full, detailed target job description including exactly what keywords and skills they need. Make this at least 150 words long so it can be used for ATS optimization later).
      
      Return ONLY valid JSON. No markdown wrappers.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const jobsJson = response.text || '[]';
    const jobs = JSON.parse(jobsJson);

    return NextResponse.json({ success: true, data: jobs });
  } catch (error: any) {
    console.error("API Route Error (job search):", error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}
