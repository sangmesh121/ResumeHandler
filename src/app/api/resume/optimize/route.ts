import { NextResponse } from 'next/server';
import { optimizeResumeForJob } from '@/lib/ai';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { parsedResume, jobDescription, githubUsername } = body;

    if (!parsedResume || !jobDescription) {
      return NextResponse.json(
        { error: 'Missing parsedResume or jobDescription' }, 
        { status: 400 }
      );
    }

    let githubRepos = [];
    if (githubUsername) {
       try {
          const res = await fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=10`);
          if (res.ok) {
             const repos = await res.json();
             githubRepos = repos.map((r: any) => ({
                 name: r.name,
                 description: r.description,
                 language: r.language,
                 topics: r.topics
             }));
          }
       } catch (e) {
         console.warn("Failed to fetch github repos", e);
       }
    }

    const optimizedResume = await optimizeResumeForJob(parsedResume, jobDescription, githubRepos);

    return NextResponse.json({ success: true, data: optimizedResume });
    
  } catch (error: any) {
    console.error("API Route Error (optimize):", error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}
