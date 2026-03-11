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
    - education (array of objects with: degree, institution, graduationYear)
    
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

export async function optimizeResumeForJob(parsedResume: any, jobDescription: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'dummy_key' });
    const prompt = `
      You are an elite Tech Career Coach. 
      I am providing a parsed resume (in JSON) and a target job description.
      
      Your task is to rewrite the resume's summary and experience bullet points to perfectly align with the target job descriptions' keywords and tone, while remaining strictly truthful to the original experience.
      
      1. Maximize the ATS match score by naturally injecting keywords from the job description.
      2. Quantify achievements where possible.
      3. Rewrite the professional summary.
      
      Respond ONLY with the completely optimized resume in the exact same JSON structure as provided.
      
      Target Job Description:
      ${jobDescription}
      
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
