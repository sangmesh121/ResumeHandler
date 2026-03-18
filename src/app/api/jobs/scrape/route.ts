import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: "URL is required" }, { status: 400 });

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // Attempt to fetch the URL HTML to give to Gemini
    let pageText = "";
    try {
      // Basic fetch. If it's blocked by cors/bot protection, Gemini's prompt will attempt a fallback
      const pageRes = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      const html = await pageRes.text();
      // Slice first 40k chars to avoid token maxs if the page is heavy
      pageText = html.substring(0, 40000); 
    } catch(e) {
      console.warn("Failed to fetch HTML natively, relying on AI fallback.");
    }

    const prompt = `
      You are an expert Data Extraction AI. Extract the job posting details from the following raw web page HTML content.
      If the content is empty or blocked, do your best to infer the role from the URL string itself.
      
      Source URL: ${url}
      
      Return ONLY a JSON object with this exact structure:
      {
        "role": "The exact job title",
        "description": "The full responsibilities and requirements text extracted from the page. Format nicely with newlines."
      }
      
      Web Page Content Context:
      ${pageText}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const json = JSON.parse(response.text || '{}');

    return NextResponse.json({ success: true, data: json });
    
  } catch (error: any) {
    console.error("Job Scraper API Error:", error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}

