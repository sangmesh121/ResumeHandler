import { NextResponse } from 'next/server';
import { parseResumeWithGemini } from '@/lib/ai';
// @ts-ignore
import pdfParse from 'pdf-parse';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 1. Extract raw text from PDF
    // Handle Next.js Webpack ESM/CJS interop issues dynamically
    const parsePDF = typeof pdfParse === 'function' ? pdfParse : (pdfParse as any).default || pdfParse;
    
    if (typeof parsePDF !== 'function') {
       throw new Error(`pdfParse failed to load callable function. Found type: ${typeof parsePDF}`);
    }

    const pdfData = await parsePDF(buffer);
    const rawText = pdfData.text;

    if (!rawText || rawText.trim().length === 0) {
      return NextResponse.json({ error: 'Could not extract text from PDF' }, { status: 400 });
    }

    // 2. Pass raw text to Gemini for structured JSON extraction
    const structuredResume = await parseResumeWithGemini(rawText);

    return NextResponse.json({ success: true, data: structuredResume });
    
  } catch (error: any) {
    console.error("API Route Error (parse):", error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}
