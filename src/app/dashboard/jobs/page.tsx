"use client";

import { useState, useEffect } from "react";
import { Search, MapPin, Briefcase, Clock, Bookmark, ArrowUpRight, Filter, ChevronDown, CheckCircle2, BookmarkPlus } from "lucide-react";
import { useSupabaseSync } from "@/hooks/useSupabaseSync";
import { createBrowserClient } from '@supabase/ssr';

interface Job {
  company: string;
  role: string;
  location: string;
  experience: string;
  description: string;
  applyUrl: string;
  tags: string[];
}

export default function JobsBoardPage() {
  const [isSearching, setIsSearching] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [parsedResume, setParsedResume] = useState<any>(null);

  // Auto-sync extracted resume to Supabase & manage 24-hr job alert cache
  useSupabaseSync(parsedResume);

  // Filter States
  const [roleFilter, setRoleFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  
  const [selectedExperience, setSelectedExperience] = useState<string[]>([]);
  const [selectedWorkMode, setSelectedWorkMode] = useState<string[]>([]);

  const toggleFilter = (setState: any, state: string[], value: string) => {
    if (state.includes(value)) setState(state.filter(v => v !== value));
    else setState([...state, value]);
  };

  useEffect(() => {
    try {
      // Try to load parsed resume if it exists to pass to the API for better context
      const resume = JSON.parse(localStorage.getItem('parsed_resume') || 'null');
      if (resume) setParsedResume(resume);
    } catch(e) {}
  }, []);

  const searchJobs = async () => {
    setIsSearching(true);
    setJobs([]);

    try {
      const filters = {
        role: roleFilter,
        location: locationFilter,
        experience: selectedExperience.join(' or '),
        workMode: selectedWorkMode.join(' or ')
      };

      const res = await fetch('/api/jobs/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filters, parsedResume })
      });

      // Background Search History Sync
      try {
         const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
         );
         const { data: { session } } = await supabase.auth.getSession();
         if (session) {
           await supabase.from('search_history').insert({
             user_id: session.user.id,
             query: JSON.stringify(filters),
             results_count: 10
           });
         }
      } catch(e) {} // fail silently if table is not setup yet

      const json = await res.json();
      if (json.success) {
        setJobs(json.data);
      } else {
        alert("Search failed: " + json.error);
      }
    } catch (e) {
      alert("Network error processing job search.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto animate-fade-in-up pb-20 text-gray-200">
      
      {/* Top Header & Fast Search Bar */}
      <div className="bg-[#111] p-6 rounded-2xl border border-white/5 mb-8 flex flex-col md:flex-row gap-4 items-center shadow-2xl">
        <div className="flex-1 w-full bg-black/50 border border-white/10 rounded-xl flex items-center px-4 py-3 focus-within:border-blue-500 transition-colors">
          <Search className="w-5 h-5 text-gray-400 mr-3" />
          <input 
            type="text" 
            placeholder="Role, skills, or company (e.g. MERN stack, Stripe)..." 
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="bg-transparent border-none outline-none w-full text-sm text-white placeholder-gray-500"
          />
        </div>
        
        <div className="flex-1 w-full md:max-w-xs bg-black/50 border border-white/10 rounded-xl flex items-center px-4 py-3 focus-within:border-blue-500 transition-colors">
          <MapPin className="w-5 h-5 text-gray-400 mr-3" />
          <input 
            type="text" 
            placeholder="Location (e.g. Bangalore, Remote)..." 
            value={locationFilter}
            onChange={e => setLocationFilter(e.target.value)}
            className="bg-transparent border-none outline-none w-full text-sm text-white placeholder-gray-500"
          />
        </div>

        <button 
          onClick={searchJobs}
          disabled={isSearching}
          className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSearching ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : "Search Jobs"}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Sidebar - Filters & Context */}
        <div className="w-full lg:w-64 shrink-0 space-y-6 bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 h-fit sticky top-24">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-lg flex items-center gap-2"><Filter className="w-4 h-4 text-blue-400"/> AI Filters</h3>
            {(selectedExperience.length > 0 || selectedWorkMode.length > 0) && (
              <button 
                onClick={() => {setSelectedExperience([]); setSelectedWorkMode([]);}}
                className="text-xs text-blue-400 hover:text-blue-300 font-medium"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="pt-2 mb-4">
            <h4 className="font-semibold text-sm mb-2 text-gray-300">Target Resume Context</h4>
            {parsedResume ? (
               <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3 text-xs mb-2">
                 <p className="font-bold text-blue-400 mb-1">{parsedResume.name || 'Candidate'} Loaded</p>
                 <p className="text-gray-400 mb-2 truncate">{parsedResume.summary?.substring(0, 40)}...</p>
                 <button onClick={() => { localStorage.removeItem('parsed_resume'); setParsedResume(null); }} className="text-red-400 hover:underline">Clear Context</button>
               </div>
            ) : (
              <div className="border border-dashed border-white/10 bg-white/5 rounded-xl p-4 text-center">
                 <p className="text-xs text-gray-400 mb-3">Upload your PDF resume to let the AI scrape roles based strictly on your extracted skills.</p>
                 <input 
                   type="file" 
                   accept="application/pdf"
                   id="resume-upload-jobs"
                   className="hidden"
                   onChange={async (e) => {
                     const file = e.target.files?.[0];
                     if (!file) return;
                     const formData = new FormData();
                     formData.append("resume", file);
                     
                     // Show loading state implicitly by dimming or just let the button change naturally
                     const btn = document.getElementById('upload-btn-text');
                     if(btn) btn.innerText = "Parsing...";

                     try {
                       const res = await fetch("/api/resume/parse", { method: "POST", body: formData });
                       const data = await res.json();
                       if (data.success) {
                         setParsedResume(data.data);
                         localStorage.setItem('parsed_resume', JSON.stringify(data.data));
                       } else {
                         alert("Failed to parse PDF.");
                       }
                     } catch(err) {
                       alert("Error uploading resume.");
                     } finally {
                       if(btn) btn.innerText = "Upload Resume PDF";
                     }
                   }}
                 />
                 <label htmlFor="resume-upload-jobs" className="cursor-pointer bg-white text-black hover:bg-gray-200 py-1.5 px-3 rounded-lg text-xs font-bold transition-all w-full block">
                   <span id="upload-btn-text">Upload Resume PDF</span>
                 </label>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-white/5">
            <h4 className="font-semibold text-sm mb-3 text-gray-300">Work mode</h4>
            <div className="space-y-2.5">
              {['Remote', 'Hybrid', 'On-site'].map(mode => (
                <label key={mode} className="flex items-center gap-3 cursor-pointer group" onClick={(e) => { e.preventDefault(); toggleFilter(setSelectedWorkMode, selectedWorkMode, mode); }}>
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedWorkMode.includes(mode) ? 'bg-blue-500 border-blue-500' : 'border-gray-600 group-hover:border-blue-400'}`}>
                    {selectedWorkMode.includes(mode) && <CheckCircle2 className="w-3 h-3 text-white" />}
                  </div>
                  <span className="text-sm text-gray-400 group-hover:text-gray-200">{mode}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-white/5">
            <h4 className="font-semibold text-sm mb-3 text-gray-300">Experience</h4>
            <div className="space-y-2.5">
              {['Entry Level (0-2 Yrs)', 'Mid Level (3-5 Yrs)', 'Senior (5+ Yrs)'].map(exp => (
                <label key={exp} className="flex items-center gap-3 cursor-pointer group" onClick={(e) => { e.preventDefault(); toggleFilter(setSelectedExperience, selectedExperience, exp); }}>
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedExperience.includes(exp) ? 'bg-blue-500 border-blue-500' : 'border-gray-600 group-hover:border-blue-400'}`}>
                    {selectedExperience.includes(exp) && <CheckCircle2 className="w-3 h-3 text-white" />}
                  </div>
                  <span className="text-sm text-gray-400 group-hover:text-gray-200">{exp.split(' ')[0]}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right Area - Job Cards */}
        <div className="flex-1 space-y-4">
          <div className="flex justify-between items-end mb-4 px-2">
            <p className="text-sm text-gray-400">
              {jobs.length > 0 ? `Found ${jobs.length} Active Jobs` : 'Search to browse live AI-grounded job postings.'}
            </p>
            {jobs.length > 0 && (
               <span className="text-xs font-medium text-blue-400 bg-blue-500/10 px-2 py-1 rounded">Sorted by: Relevance (AI Match)</span>
            )}
          </div>

          {isSearching && (
            <div className="h-64 flex flex-col items-center justify-center border border-white/5 rounded-2xl bg-[#0a0a0a]">
              <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4"/>
              <p className="text-sm text-blue-400 font-medium animate-pulse">Gemini is searching the live web for jobs...</p>
            </div>
          )}

          {!isSearching && jobs.map((job, idx) => (
            <div key={idx} className="bg-[#111] border border-white/5 hover:border-blue-500/30 rounded-2xl p-6 transition-all group shadow-lg hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h2 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{job.role}</h2>
                    <div className="w-10 h-10 rounded shadow-md bg-black border border-white/10 flex items-center justify-center font-bold text-lg text-gray-400 tracking-tighter shrink-0 md:hidden">
                       {job.company.substring(0,1)}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-400 mb-4 font-medium">
                    <span className="flex items-center gap-1.5 text-gray-300"><Briefcase className="w-4 h-4 text-blue-500/70" /> {job.company}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {job.experience}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {job.location}</span>
                  </div>

                  <p className="text-sm text-gray-400 leading-relaxed mb-4 line-clamp-2 pr-4">{job.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {job.tags.map((tag, i) => (
                      <span key={i} className="px-2.5 py-1 text-xs font-medium bg-white/5 text-gray-300 rounded-md border border-white/5">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col justify-between items-end gap-4 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6 shrink-0 min-w-[140px]">
                   <div className="hidden md:flex w-12 h-12 rounded-xl shadow-md bg-black border border-white/10 items-center justify-center font-bold text-2xl text-gray-500 tracking-tighter">
                      {job.company.substring(0,1)}
                   </div>
                   
                   <div className="flex md:flex-col gap-3 w-full">
                     <button 
                       onClick={async () => {
                          try {
                             const supabase = createBrowserClient(
                                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
                             );
                             const { data: { session } } = await supabase.auth.getSession();
                             if (!session) return alert("Please login to save jobs.");
                             
                             const { error } = await supabase.from('saved_jobs').insert({
                                user_id: session.user.id,
                                job_data: job
                             });
                             
                             if (error) alert("Could not save job. Ensure 'saved_jobs' table exists in your Supabase DB.");
                             else alert("Job successfully saved to your profile!");
                          } catch(e) {
                             alert("Error connecting to database to save job.");
                          }
                       }}
                       className="flex-1 md:flex-none flex justify-center items-center py-2 px-3 hover:bg-white/5 border border-white/10 rounded-lg text-sm font-medium transition-colors text-gray-300 group/btn"
                     >
                        <BookmarkPlus className="w-4 h-4 mr-2 group-hover/btn:text-blue-400" /> Save
                     </button>
                     <a 
                       href={job.applyUrl} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="flex-1 md:flex-none flex justify-center items-center py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold transition-colors shadow-lg shadow-blue-500/20"
                     >
                        Apply <ArrowUpRight className="w-4 h-4 ml-1" />
                     </a>
                   </div>
                </div>
              </div>
            </div>
          ))}

          {!isSearching && jobs.length === 0 && (
             <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-2xl">
                <Search className="w-12 h-12 text-gray-600 mb-4" />
                <h3 className="text-lg font-bold text-gray-400">Ready to find your next role.</h3>
                <p className="text-sm text-gray-500 mt-2">Enter keywords and click search to pull live job descriptions.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
