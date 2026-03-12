"use client";

import { useState } from "react";
import { Bell, Briefcase, Zap, Building2, Eye, ShieldAlert, FileSearch, Loader2 } from "lucide-react";
import { useHiringAlerts } from "@/hooks/useHiringAlerts";

export default function JobAlertsPage() {
  const [jobText, setJobText] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [keywords, setKeywords] = useState<string[]>([]);
  const alerts = useHiringAlerts();

  const uniqueCompanies = Array.from(new Set(alerts.map(a => a.company)));

  const extractKeywords = async () => {
    if (!jobText) return alert("Please paste a job description first.");
    setIsExtracting(true);
    setKeywords([]);
    
    try {
      const res = await fetch('/api/jobs/keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription: jobText })
      });
      const data = await res.json();
      if (data.success) {
        setKeywords(data.keywords);
      } else {
        alert("Extraction failed.");
      }
    } catch (e) {
      alert("Network error.");
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Hiring Intelligence</h1>
          <p className="text-gray-400">Monitor your target companies for hidden hiring signals.</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors shadow-[0_0_20px_rgba(59,130,246,0.5)]">
          <Bell className="w-5 h-5" />
          Create Alert
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Active Trackers */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-4">
             <h2 className="text-xl font-semibold">Active Company Trackers</h2>
             <span className="text-sm bg-white/10 px-3 py-1 rounded-full text-gray-300">{uniqueCompanies.length || 2} Active</span>
          </div>
          
          {uniqueCompanies.length === 0 && (
             <div className="text-sm text-gray-500 italic p-4">Waiting for first signal to establish tracker...</div>
          )}

          {uniqueCompanies.map((company, idx) => (
             <div key={idx} className="glass-panel p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between border-l-4 border-l-blue-500 gap-4 mb-4">
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center p-2 shrink-0">
                   <Building2 className="w-6 h-6 text-black" />
                 </div>
                 <div>
                   <h3 className="text-lg font-bold">{company}</h3>
                   <p className="text-sm text-gray-400">Tracking: Active Roles & Openings</p>
                 </div>
               </div>
               <div className="flex items-center gap-3 shrink-0">
                 <span className="flex items-center gap-1 text-sm font-bold text-red-500 bg-red-500/10 px-3 py-1 rounded-full animate-pulse">
                   <Zap className="w-3 h-3" /> Hiring Now
                 </span>
                 <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"><Eye className="w-5 h-5" /></button>
               </div>
             </div>
          ))}

          {/* Keep a fallback static monitor for optics if no dynamic data yet */}
          {uniqueCompanies.length < 2 && (
            <div className="glass-panel p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between border-l-4 border-l-gray-600 gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center p-2 shrink-0">
                  <Building2 className="w-6 h-6 text-gray-300" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Stripe</h3>
                  <p className="text-sm text-gray-400">Tracking: Data Science, Analytics</p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="flex items-center gap-1 text-sm text-gray-400 bg-white/5 px-3 py-1 rounded-full">
                  Monitoring...
                </span>
                <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"><Eye className="w-5 h-5" /></button>
              </div>
            </div>
          )}

          {/* Interactive AI Keyword Extractor */}
          <div className="mt-10 pt-8 border-t border-white/10">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><FileSearch className="w-5 h-5 text-blue-400" /> AI Keyword Extraction Engine</h2>
            <p className="text-sm text-gray-400 mb-4">Paste a job URL or description to extract the exact keywords ATS systems scan for.</p>
            
            <div className="space-y-4">
              <textarea 
                value={jobText}
                onChange={(e) => setJobText(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-sm h-32 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Paste Job Description..."
              ></textarea>
              
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                 <button 
                  onClick={extractKeywords}
                  disabled={isExtracting}
                  className="w-full sm:w-auto py-3 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl font-bold shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 shrink-0"
                 >
                   {isExtracting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                   {isExtracting ? "Extracting..." : "Extract Keywords"}
                 </button>

                 {/* Keyword Output Tags */}
                 <div className="flex-1 flex flex-wrap gap-2">
                    {keywords.map((kw, idx) => (
                      <span key={idx} className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-1.5 rounded-lg text-xs font-bold font-mono">
                        {kw}
                      </span>
                    ))}
                    {!isExtracting && keywords.length === 0 && (
                      <span className="text-sm text-gray-600 italic">Extracted keywords will appear here...</span>
                    )}
                 </div>
              </div>
            </div>
          </div>

        </div>

        {/* Intelligence Feed */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><ShieldAlert className="w-5 h-5 text-yellow-500" /> Live Signals Feed</h2>
          
          {alerts.length === 0 && (
            <div className="text-sm text-gray-400 p-4 border border-dashed border-white/20 rounded-xl text-center">Monitoring database for new signals...</div>
          )}

          {alerts.map((alert, idx) => (
             <div key={alert.id} className={`glass-panel p-5 rounded-2xl relative overflow-hidden group ${idx===0 ? 'border-l-4 border-l-pink-500' : ''}`}>
               {idx === 0 && <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/10 rounded-full blur-2xl"></div>}
               <p className="text-xs text-purple-400 font-bold mb-2 flex items-center gap-1">
                 {idx===0 && <Zap className="w-3 h-3"/>}
                 {new Date((alert as any).created_at || Date.now()).toLocaleTimeString()}
               </p>
               <h4 className="font-bold text-md mb-1">{alert.company} posted {alert.role}</h4>
               <p className="text-sm text-gray-400 mb-4">Status: {alert.hiring_status}</p>
               <button className="w-full py-2 bg-white/10 text-white rounded-lg text-sm font-medium hover:bg-white/20 transition-colors">
                 Auto-Optimize Resumes
               </button>
             </div>
          ))}

          {/* Static Backup for Demo */}
          {alerts.length === 0 && (
            <div className="glass-panel p-5 rounded-2xl opacity-50">
              <p className="text-xs text-gray-500 font-bold mb-2 border-b border-white/5 pb-2">2 hours ago</p>
              <h4 className="font-bold text-md mb-2 mt-2">Google Cloud expanding AI Team</h4>
              <p className="text-sm text-gray-400">Detected new department budget allocation for Q3. Prepare your portfolio.</p>
            </div>
          )}

        </div>

      </div>
    </div>
  )
}
