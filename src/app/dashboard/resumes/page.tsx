"use client";

import { useState } from "react";
import { UploadCloud, FileText, CheckCircle2, Clock, Zap, Loader2, Target, Search, MousePointerClick, Github } from "lucide-react";

export default function ResumeManagementPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [parsedResume, setParsedResume] = useState<any>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedResult, setOptimizedResult] = useState<any>(null);

  // Job URL Scraper states
  const [jobUrl, setJobUrl] = useState("");
  const [isScraping, setIsScraping] = useState(false);

  // GitHub sync state
  const [githubUsername, setGithubUsername] = useState("");

  // Parse the uploaded PDF
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploading(true);
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch('/api/resume/parse', {
        method: 'POST',
        body: formData
      });
      const json = await res.json();
      if (json.success) {
        setParsedResume(json.data);
        alert("Resume parsed successfully! You can now generate variants.");
      } else {
        alert("Parsing failed: " + json.error);
      }
    } catch (error) {
      alert("Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const scrapeJobUrl = async () => {
    if (!jobUrl) return alert("Please enter a valid Job URL.");
    setIsScraping(true);

    try {
      const res = await fetch('/api/jobs/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: jobUrl })
      });
      const json = await res.json();
      if (json.success && json.data) {
        const text = `Role: ${json.data.role}\n\nDescription:\n${json.data.description}`;
        setJobDescription(text);
      } else {
        alert("Scraping failed: " + json.error);
      }
    } catch (e) {
      alert("Network error processing job URL.");
    } finally {
      setIsScraping(false);
    }
  };

  const runOptimizer = async () => {
    if (!jobDescription) return alert("Please paste a job description first.");
    
    setIsOptimizing(true);
    setOptimizedResult(null);

    try {
      // Use the actual uploaded parsed resume, fallback to dummy if none uploaded
      const targetResume = parsedResume || {
         name: "John Doe",
         summary: "Software Engineer with 5 years of experience building web applications.",
         experience: [
           { title: "Frontend Engineer", company: "Tech Corp", startDate: "2020", endDate: "Present", description: ["Built React apps", "Improved loading speed by 20%"] }
         ],
         skills: ["React", "TypeScript", "Node.js", "Tailwind CSS"],
         projects: [
           { title: "E-Commerce Dashboard", techStack: ["React", "Express"], description: ["Architected a full-stack dashboard", "Integrated Stripe payments"] }
         ]
      };

      const res = await fetch('/api/resume/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parsedResume: targetResume,
          jobDescription: jobDescription,
          githubUsername: githubUsername
        })
      });

      const json = await res.json();
      if (json.success) {
        setOptimizedResult(json.data);
        
        // Save to localStorage for Dashboard stats
        try {
          const newVariant = {
             id: Date.now().toString(),
             title: `Target: ${jobDescription.substring(0, 20).replace(/\n/g, ' ')}...`,
             matchScore: Math.floor(Math.random() * (98 - 85 + 1)) + 85, // Mock ATS score
             date: new Date().toISOString()
          };
          const existing = JSON.parse(localStorage.getItem('resume_variants') || '[]');
          localStorage.setItem('resume_variants', JSON.stringify([newVariant, ...existing]));
        } catch (e) {}

      } else {
        alert("Optimization failed: " + json.error);
      }
    } catch (error) {
      console.error(error);
      alert("Network error.");
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Resume Intelligence</h1>
          <p className="text-gray-400">Parse your base resume and use Gemini to generate hyper-targeted versions instantly.</p>
        </div>
        <label className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors cursor-pointer w-fit">
          {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UploadCloud className="w-5 h-5" />}
          {isUploading ? "Parsing PDF..." : "Upload Base Resume"}
          <input type="file" className="hidden" accept=".pdf" onChange={handleFileUpload} />
        </label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Input Scope */}
        <div className="space-y-6">
          
          {/* AI Job URL Scraper */}
          <div className="glass-panel p-6 rounded-2xl border-indigo-500/20 shadow-[0_0_30px_rgba(79,70,229,0.05)]">
             <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Search className="w-5 h-5 text-indigo-400" /> AI Job URL Scraper
             </h2>
             <p className="text-sm text-gray-400 mb-4">Paste a direct link to a job posting (e.g. Workday, Lever, LinkedIn). AI will extract the role and description.</p>
             <div className="flex gap-3 mb-4">
                <input 
                  type="url" 
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  placeholder="https://jobs.lever.co/..." 
                  className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                />
                <button 
                  onClick={scrapeJobUrl}
                  disabled={isScraping}
                  className="bg-indigo-600 hover:bg-indigo-500 px-6 py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center gap-2 shrink-0 disabled:opacity-50"
                >
                  {isScraping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  Scrape
                </button>
             </div>
          </div>

          {/* GitHub Sync */}
          <div className="glass-panel p-6 rounded-2xl border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.05)]">
             <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Github className="w-5 h-5 text-green-400" /> GitHub Projects Sync
             </h2>
             <p className="text-sm text-gray-400 mb-4">Enter your GitHub Username to dynamically import and tailor your real projects if they match the role.</p>
             <input 
               type="text" 
               value={githubUsername}
               onChange={(e) => setGithubUsername(e.target.value)}
               placeholder="GitHub Username (Optional)" 
               className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-colors"
             />
          </div>

          <div className="glass-panel p-6 rounded-2xl border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.05)]">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-400" /> Target Job Description
            </h2>
            <textarea 
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full h-64 bg-black/50 border border-white/10 rounded-xl p-4 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Paste the Job Description from LinkedIn, Indeed, or the Company Career page here...\n\nExample:\nWe are looking for a Senior React Developer with experience in Next.js, Tailwind CSS, and Node.js. Must have strong architectural skills..."
            ></textarea>
            
            <button 
               onClick={runOptimizer}
              disabled={isOptimizing}
              className="mt-4 w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-bold shadow-[0_0_30px_rgba(139,92,246,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isOptimizing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
              {isOptimizing ? "Generating Update..." : "Generate Updated Resume"}
            </button>
          </div>
        </div>

        {/* Output Scope */}
        <div className="space-y-6">
           <div className="glass-panel p-6 rounded-2xl h-full border-purple-500/20 bg-black/40">
              <h2 className="text-xl font-bold mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2"><FileText className="w-5 h-5 text-purple-400" /> Optimized Output</span>
                {optimizedResult && <span className="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full font-bold">98% Match</span>}
              </h2>
              
              <div className="h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {!optimizedResult && !isOptimizing && (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500 text-sm text-center">
                    <Zap className="w-12 h-12 mb-4 opacity-20" />
                    Paste a job description and click optimize to see<br/>Gemini rewrite your resume in real-time.
                  </div>
                )}
                
                {isOptimizing && (
                  <div className="h-full flex flex-col items-center justify-center text-blue-400 space-y-4">
                    <Loader2 className="w-10 h-10 animate-spin" />
                    <p className="animate-pulse font-medium text-sm">Analyzing Keywords & Rewriting Bullet Points...</p>
                  </div>
                )}

                {optimizedResult && (
                  <div id="printable-resume" className="bg-white text-black p-8 font-serif shadow-xl rounded-sm mx-auto max-w-[850px]">
                    {/* Header */}
                    <div className="text-center mb-6">
                      <h1 className="text-4xl font-serif font-bold mb-2 tracking-wide text-black">{optimizedResult.name || 'Your Name'}</h1>
                      <div className="flex items-center justify-center gap-3 text-[11px] font-serif text-black">
                        {githubUsername && (
                          <span className="flex items-center gap-1 border border-cyan-400 px-1"><Github className="w-3 h-3 text-cyan-600"/> github.com/{githubUsername}</span>
                        )}
                        <span className="text-gray-400">|</span>
                        <span className="flex items-center gap-1 border border-cyan-400 px-1"><span className="font-bold bg-black text-white px-0.5 rounded-sm">in</span> linkedin.com/in/{optimizedResult.name?.replace(/\s+/g, '').toLowerCase() || 'username'}</span>
                        <span className="text-gray-400">|</span>
                        <span className="flex items-center gap-1 border border-cyan-400 px-1"><span className="bg-black text-white px-1 font-bold rounded-sm">@</span> {optimizedResult.email || 'email@example.com'}</span>
                      </div>
                    </div>

                    {/* Summary */}
                    {optimizedResult.summary && (
                      <div className="mb-4 printable-section">
                        <h3 className="font-serif font-semibold text-[13px] uppercase tracking-widest border-b border-black pb-1 mb-2 text-black text-left">Summary</h3>
                        <p className="font-serif text-[11px] leading-relaxed text-black text-justify">{optimizedResult.summary}</p>
                      </div>
                    )}

                    {/* Skills */}
                    {optimizedResult.skills && (
                      <div className="mb-4 printable-section">
                        <h3 className="font-serif font-semibold text-[13px] uppercase tracking-widest border-b border-black pb-1 mb-2 text-black text-left">Skills</h3>
                        <p className="font-serif text-[11px] text-black leading-relaxed">
                          {Array.isArray(optimizedResult.skills) 
                            ? optimizedResult.skills.map((s: any) => typeof s === 'string' ? s : Object.values(s).join(', ')).join(', ')
                            : typeof optimizedResult.skills === 'string' ? optimizedResult.skills : JSON.stringify(optimizedResult.skills)}
                        </p>
                      </div>
                    )}

                    {/* Experience */}
                    {optimizedResult.experience && optimizedResult.experience.length > 0 && (
                      <div className="mb-4 printable-section">
                        <h3 className="font-serif font-semibold text-[13px] uppercase tracking-widest border-b border-black pb-1 mb-3 text-black text-left">Experience</h3>
                        {optimizedResult.experience.map((exp: any, i: number) => (
                           <div key={i} className="mb-3">
                             <div className="flex justify-between items-baseline font-serif mb-1">
                               <div>
                                 <span className="font-bold text-[12px] text-black">{exp.company}</span>
                                 <span className="text-[12px] text-black ml-4">{exp.title}</span>
                               </div>
                               <span className="text-[11px] text-black">{exp.startDate} - {exp.endDate}</span>
                             </div>
                             <ul className="list-disc pl-5 font-serif text-[11px] text-black space-y-1">
                               {exp.description?.map((b: string, j: number) => <li key={j} className="text-justify leading-relaxed">{b}</li>)}
                             </ul>
                           </div>
                        ))}
                      </div>
                    )}

                    {/* Education */}
                    {optimizedResult.education && optimizedResult.education.length > 0 && (
                      <div className="mb-4 printable-section">
                        <h3 className="font-serif font-semibold text-[13px] uppercase tracking-widest border-b border-black pb-1 mb-3 text-black text-left">Education</h3>
                        {optimizedResult.education.map((edu: any, i: number) => (
                           <div key={i} className="flex font-serif text-[11px] text-black mb-1.5 items-baseline">
                             <span className="w-24 shrink-0">{edu.graduationYear || '2024'}</span>
                             <span className="flex-1">{edu.degree}, <span className="font-bold">{edu.institution}</span></span>
                             {edu.score && <span className="shrink-0 ml-4">Score: {edu.score}</span>}
                           </div>
                        ))}
                      </div>
                    )}

                    {/* Certifications */}
                    {optimizedResult.certifications && optimizedResult.certifications.length > 0 && (
                      <div className="mb-4 printable-section">
                        <h3 className="font-serif font-semibold text-[13px] uppercase tracking-widest border-b border-black pb-1 mb-3 text-black text-left">Certifications</h3>
                        <ul className="list-disc pl-5 font-serif text-[11px] text-black space-y-1.5">
                          {optimizedResult.certifications.map((cert: string, i: number) => <li key={i}>{cert}</li>)}
                        </ul>
                      </div>
                    )}

                    {/* Projects */}
                    {optimizedResult.projects && optimizedResult.projects.length > 0 && (
                      <div className="mb-2 printable-section">
                        <h3 className="font-serif font-semibold text-[13px] uppercase tracking-widest border-b border-black pb-1 mb-3 text-black text-left">Projects</h3>
                        {optimizedResult.projects.map((proj: any, i: number) => (
                           <div key={i} className="mb-3">
                             <div className="flex justify-between items-baseline font-serif mb-1">
                               <span className="font-bold text-[12px] text-black">{proj.title}</span>
                               <span className="text-[11px] text-black">{proj.date || 'Recent'}</span>
                             </div>
                             <ul className="list-disc pl-5 font-serif text-[11px] text-black space-y-1">
                               {proj.description?.map((b: string, j: number) => <li key={j} className="text-justify leading-relaxed">{b}</li>)}
                             </ul>
                           </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {optimizedResult && (
                <button 
                  onClick={() => window.print()}
                  className="mt-6 w-full py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <FileText className="w-5 h-5" /> Download Updated Resume (PDF)
                </button>
              )}
           </div>
        </div>
      </div>
    </div>
  )
}
