import { NextResponse } from 'next/server';
import { optimizeResumeForJob } from '@/lib/ai';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { parsedResume, jobDescription } = body;

    if (!parsedResume || !jobDescription) {
      return NextResponse.json(
        { error: 'Missing parsedResume or jobDescription' }, 
        { status: 400 }
      );
    }

    const optimizedResume = await optimizeResumeForJob(parsedResume, jobDescription);

    return NextResponse.json({ success: true, data: optimizedResume });
    
  } catch (error: any) {
    console.error("API Route Error (optimize):", error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}
