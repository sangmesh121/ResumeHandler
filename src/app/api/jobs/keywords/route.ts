import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { jobDescription } = body;

    if (!jobDescription) {
      return NextResponse.json(
        { error: 'Missing jobDescription' }, 
        { status: 400 }
      );
    }

    const prompt = `
      Extract the core technical skills, soft skills, and required tools from the following job description.
      Output ONLY a JSON array of strings, ordered by importance. No markdown.
      Example: ["Python", "Machine Learning", "PyTorch", "Leadership"]
      
      Job Description:
      ${jobDescription}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    const textOutput = response.text || "[]";
    const jsonString = textOutput.replace(/```json/g, '').replace(/```/g, '').trim();
    const keywords = JSON.parse(jsonString);

    return NextResponse.json({ success: true, data: keywords });
    
  } catch (error: any) {
    console.error("Keyword Extraction Error:", error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}
