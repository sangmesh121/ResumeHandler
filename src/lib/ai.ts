import { GoogleGenAI } from '@google/genai';

export async function parseResumeWithGemini(resumeText: string) {
  // Initialize inside function to avoid next build static evaluation without env vars
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'dummy_key' });
  const prompt = `
    You are an expert AI Resume Analyzer. Given the following resume text, parse it and extract the data into a structured JSON format.
    
    Extract the following fields:
    - name (string)
    - email (string)
    - phone (string)
    - location (string)
    - summary (string)
    - skills (array of strings)
    - experience (array of objects with: title, company, startDate, endDate, description (array of bullet points))
    - education (array of objects with: degree, institution, graduationYear, score)
    - certifications (array of strings)
    - projects (array of objects with: title, date (string), techStack (array of strings), description (array of bullet points))
    
    Respond ONLY with valid JSON. No markdown formatting, no explanations.
    
    Resume Text:
    ${resumeText}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    const textOutput = response.text || "{}";
    
    // Clean up potential markdown blocks if the model ignored instructions
    const jsonString = textOutput.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Gemini Parsing Error:", error);
    throw new Error('Failed to parse resume with AI.');
  }
}

export async function optimizeResumeForJob(parsedResume: any, jobDescription: string, githubRepos: any[] = []) {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'dummy_key' });
    const prompt = `
      You are an elite Tech Career Coach. 
      I am providing a parsed resume (in JSON), a target job description, and an optional list of the candidate's GitHub repositories.
      
      Your task is to comprehensively rewrite the resume's summary, experience bullet points, skills, and projects to perfectly align with the target job descriptions' keywords and tone, while remaining strictly truthful to the original experience.
      
      1. Maximize the ATS match score by naturally injecting keywords from the job description into the summary, experience bullets, and project descriptions.
      2. Quantify achievements where possible.
      3. Rewrite the professional summary to act as a targeted pitch for this exact role (keep it very concise, maximum 3 short sentences).
      4. SKILLS OVERHAUL (CRITICAL): You MUST dynamically alter the 'skills' array. ADD required skills and keywords mentioned in the job description. You MUST REMOVE existing skills that are completely irrelevant to the target job role to save space and increase focus. Organize them if possible into a flat array of strings.
      5. GITHUB PROJECTS (CRITICAL): Analyze the provided "Github Repositories". If any repository matches the tech stack or domain of the job description, add it to the 'projects' array and heavily optimize its description to match the job role.
      6. INVENT PROJECTS: If the provided Github repos do not perfectly match the job description, or if there are none, you MUST invent highly realistic, impressive projects.
      7. PROJECT REQUIREMENTS: Ensure there are EXACTLY Two (2) projects in the 'projects' array (whether from Github or invented). Each project MUST have a 'date' field (e.g. 'Jan 2025 - Jun 2025' or 'Jul 2025 - Ongoing'). Each project 'description' must be exactly 2 short bullet points.
      8. LENGTH: The entire resume MUST fit on a single printed page. Keep descriptions extremely concise.
      
      Respond ONLY with the completely optimized resume in the exact same JSON structure as provided.
      
      Target Job Description:
      ${jobDescription}
      
      Candidate's Github Repositories (To select from if relevant):
      ${JSON.stringify(githubRepos, null, 2)}
      
      Original Resume JSON:
      ${JSON.stringify(parsedResume, null, 2)}
    `;
  
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      
      const textOutput = response.text || "{}";
      const jsonString = textOutput.replace(/```json/g, '').replace(/```/g, '').trim();
      
      return JSON.parse(jsonString);
    } catch (error) {
      console.error("Gemini Optimization Error:", error);
      throw new Error('Failed to optimize resume with AI.');
    }
  }
