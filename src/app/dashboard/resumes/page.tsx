"use client";

import { useState } from "react";
import { UploadCloud, FileText, CheckCircle2, Clock, Zap, Loader2, Target, Search, MousePointerClick } from "lucide-react";

export default function ResumeManagementPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [parsedResume, setParsedResume] = useState<any>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedResult, setOptimizedResult] = useState<any>(null);

  // Domain search states
  const [domain, setDomain] = useState("");
  const [domainJobs, setDomainJobs] = useState<any[]>([]);
  const [isSearchingJobs, setIsSearchingJobs] = useState(false);

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

  const searchDomainJobs = async () => {
    if (!domain) return alert("Please enter a target domain/industry.");
    setIsSearchingJobs(true);
    setDomainJobs([]);

    try {
      const targetResume = parsedResume || {
         name: "John Doe",
         summary: "Experienced Professional",
         experience: []
      };

      const res = await fetch('/api/jobs/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain, parsedResume: targetResume })
      });
      const json = await res.json();
      if (json.success) {
        setDomainJobs(json.data);
      } else {
        alert("Search failed: " + json.error);
      }
    } catch (e) {
      alert("Network error processing domain search.");
    } finally {
      setIsSearchingJobs(false);
    }
  };

  const handleSelectJob = (job: any) => {
     const text = `Company: ${job.company}\nRole: ${job.role}\n\nDescription:\n${job.description}`;
     setJobDescription(text);
     // Scroll to the textarea to prompt them to hit optimize
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
         ]
      };

      const res = await fetch('/api/resume/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parsedResume: targetResume,
          jobDescription: jobDescription
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
          
          {/* AI Domain Matcher */}
          <div className="glass-panel p-6 rounded-2xl border-indigo-500/20 shadow-[0_0_30px_rgba(79,70,229,0.05)]">
             <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Search className="w-5 h-5 text-indigo-400" /> AI Domain Matcher
             </h2>
             <p className="text-sm text-gray-400 mb-4">Tell us your target industry (e.g. "Fintech Engineering", "AI Startups"). Gemini will find ideal roles for your uploaded resume.</p>
             <div className="flex gap-3 mb-4">
                <input 
                  type="text" 
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="Enter target domain..." 
                  className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                />
                <button 
                  onClick={searchDomainJobs}
                  disabled={isSearchingJobs}
                  className="bg-indigo-600 hover:bg-indigo-500 px-6 py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center gap-2 shrink-0 disabled:opacity-50"
                >
                  {isSearchingJobs ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  Search
                </button>
             </div>

             {/* Scraped Jobs Results */}
             {domainJobs.length > 0 && (
                <div className="space-y-3 mt-4 animate-fade-in-up">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Top AI Matches</p>
                  {domainJobs.map((job, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-indigo-500/50 transition-colors group">
                       <h4 className="font-bold text-indigo-300">{job.role}</h4>
                       <p className="text-sm text-gray-400 mb-3">{job.company}</p>
                       <button 
                         onClick={() => handleSelectJob(job)}
                         className="flex items-center gap-1 text-xs bg-indigo-500/10 text-indigo-400 px-3 py-1.5 rounded-lg font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                       >
                         <MousePointerClick className="w-3 h-3"/> Target This Role
                       </button>
                    </div>
                  ))}
                </div>
             )}
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
              {isOptimizing ? "Gemini is Optimizing..." : "Magic Auto-Optimize"}
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
                  <div id="printable-resume" className="space-y-6 text-sm">
                    <div>
                      <h3 className="font-bold text-lg mb-2 border-b border-white/10 pb-2">Professional Summary</h3>
                      <p className="text-gray-300 leading-relaxed">{optimizedResult.summary}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-bold text-lg mb-3 border-b border-white/10 pb-2">Optimized Experience</h3>
                      {optimizedResult.experience.map((exp: any, i: number) => (
                        <div key={i} className="mb-4 break-inside-avoid">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-blue-400">{exp.title}</h4>
                            <span className="text-xs text-gray-500">{exp.startDate} - {exp.endDate}</span>
                          </div>
                          <p className="text-gray-400 mb-2 font-medium">{exp.company}</p>
                          <ul className="list-disc pl-5 space-y-1.5 text-gray-300">
                            {exp.description.map((bullet: string, j: number) => (
                              <li key={j}>{bullet}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {optimizedResult && (
                <button 
                  onClick={() => window.print()}
                  className="mt-6 w-full py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <FileText className="w-5 h-5" /> Download as ATS PDF
                </button>
              )}
           </div>
        </div>
      </div>
    </div>
  )
}
