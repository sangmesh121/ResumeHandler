import { GoogleGenAI } from '@google/genai';

export async function calculateATSScore(resumeText: string, jobDescription: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'dummy_key' });
    const prompt = `
      You are an expert ATS (Applicant Tracking System) algorithm.
      I will provide a resume and a job description.
      
      Calculate a Match Score from 0 to 100 based on:
      - Keyword matching (hard skills & soft skills)
      - Experience alignment
      - Education requirements
      
      Also provide an array of exactly 3 missing keywords that would most improve the score.
      
      Output ONLY valid JSON in this exact format, with no markdown formatting:
      {
        "score": number,
        "missingKeywords": ["keyword1", "keyword2", "keyword3"]
      }
      
      Resume:
      ${resumeText}
      
      Job Description:
      ${jobDescription}
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
      console.error("ATS Scoring Error:", error);
      throw new Error('Failed to calculate ATS score.');
    }
  }
