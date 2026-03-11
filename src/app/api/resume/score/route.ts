import { NextResponse } from 'next/server';
import { calculateATSScore } from '@/lib/ats';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { resumeText, jobDescription } = body;

    if (!resumeText || !jobDescription) {
      return NextResponse.json(
        { error: 'Missing resumeText or jobDescription' }, 
        { status: 400 }
      );
    }

    const matchData = await calculateATSScore(resumeText, jobDescription);

    return NextResponse.json({ success: true, data: matchData });
    
  } catch (error: any) {
    console.error("API Route Error (score):", error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}
