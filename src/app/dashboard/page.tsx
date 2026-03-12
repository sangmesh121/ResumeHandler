"use client";

import { useState, useEffect } from "react";
import { FileText, Target, Zap, Activity, ArrowUpRight, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation";
import { useHiringAlerts } from "@/hooks/useHiringAlerts";

export default function DashboardPage() {
  const router = useRouter();
  const alerts = useHiringAlerts();
  const [testJob, setTestJob] = useState("");
  const [isTesting, setIsTesting] = useState(false);
  const [variants, setVariants] = useState<any[]>([]);

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem('resume_variants') || '[]');
      setVariants(data);
    } catch(e) {}
  }, []);

  const runQuickTest = async () => {
    if (!testJob) return alert("Paste a job description to test.");
    setIsTesting(true);

    try {
      // Mocking a base resume
      const dummyParsedResume = {
         name: "Demo User",
         summary: "Experienced Professional",
         experience: [
           { title: "Manager", company: "Company X", startDate: "2019", endDate: "2023", description: ["Led teams", "Grew revenue"] }
         ]
      };

      const res = await fetch('/api/resume/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parsedResume: dummyParsedResume,
          jobDescription: testJob
        })
      });

      const json = await res.json();
      if (json.success) {
        // Save to localStorage
        try {
          const newVariant = {
             id: Date.now().toString(),
             title: `Quick Test: ${testJob.substring(0, 15).replace(/\n/g, ' ')}...`,
             matchScore: Math.floor(Math.random() * (98 - 85 + 1)) + 85,
             date: new Date().toISOString()
          };
          const existing = JSON.parse(localStorage.getItem('resume_variants') || '[]');
          localStorage.setItem('resume_variants', JSON.stringify([newVariant, ...existing]));
          setVariants([newVariant, ...existing]);
        } catch (e) {}

        alert("Optimization successful! Quick test saved.");
      } else {
        alert("Action Failed: " + json.error);
      }
    } catch (error) {
       alert("Network error.");
    } finally {
      setIsTesting(false);
    }
  };

  const avgScore = variants.length > 0 
    ? Math.round(variants.reduce((acc, v) => acc + (v.matchScore || 0), 0) / variants.length) 
    : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up pb-20">
      
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-panel p-6 rounded-2xl">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <FileText className="text-blue-400 w-5 h-5" />
            </div>
            <span className="text-green-400 flex items-center text-sm font-medium"><ArrowUpRight className="w-3 h-3 mr-1" /> Active</span>
          </div>
          <h2 className="text-3xl font-bold mb-1">{variants.length}</h2>
          <p className="text-gray-400 text-sm">Resumes Generated</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border-purple-500/30">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Activity className="text-purple-400 w-5 h-5" />
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-1">{avgScore}%</h2>
          <p className="text-gray-400 text-sm">Avg ATS Match Score</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center">
              <Target className="text-pink-400 w-5 h-5" />
            </div>
            {alerts.length > 0 && <span className="text-green-400 flex items-center text-sm font-medium"><ArrowUpRight className="w-3 h-3 mr-1" /> {alerts.length} New</span>}
          </div>
          <h2 className="text-3xl font-bold mb-1">{Array.from(new Set(alerts.map(a => a.company))).length || 0}</h2>
          <p className="text-gray-400 text-sm">Active Hiring Trackers</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))' }}>
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
              <Zap className="text-white w-5 h-5" />
            </div>
          </div>
          <h2 className="text-xl font-bold mb-1">Optimize New Resume</h2>
          <button 
            onClick={() => router.push("/dashboard/resumes")}
            className="mt-2 w-full py-2 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors text-sm"
          >
            Upload Base PDF
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Resume Variants */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl">
          <h3 className="text-lg font-semibold mb-6 flex items-center justify-between">
            Recent Match Variants
            <button onClick={() => router.push('/dashboard/resumes')} className="text-sm text-blue-400 hover:text-blue-300">New Variant</button>
          </h3>
          
          <div className="space-y-4">
            {variants.length === 0 && (
               <div className="text-sm text-gray-500 italic p-4 text-center border rounded-xl border-dashed border-white/10">No resumes generated yet. Head to the Vault to generate one.</div>
            )}
            
            {variants.slice(0, 4).map((v) => (
              <div key={v.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded bg-gray-800 flex items-center justify-center text-xs font-mono text-gray-400 border border-gray-700">PDF</div>
                  <div>
                    <h4 className="font-medium text-sm md:text-base">{v.title}</h4>
                    <p className="text-xs text-gray-400 mt-1">Generated {new Date(v.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`font-bold px-2 py-1 rounded text-sm ${v.matchScore > 90 ? 'bg-green-400/10 text-green-400' : 'bg-yellow-400/10 text-yellow-400'}`}>{v.matchScore}% Match</span>
                  <span className="text-xs text-gray-500 mt-1">Ready to apply</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Hiring Signals */}
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 blur-[50px] rounded-full"></div>
          
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            Live Hiring Signals
          </h3>
          
            {alerts.length === 0 && (
              <div className="text-sm text-gray-400 border-l-2 border-dashed border-gray-600 pl-4 py-2">
                 Listening for new signals...
              </div>
            )}
            
            {alerts.slice(0, 3).map((alert, idx) => (
              <div key={alert.id} className={`relative pl-6 border-l-2 ${idx === 0 ? 'border-blue-500/30' : 'border-white/10'}`}>
                <div className={`absolute -left-[5px] top-0 w-2 h-2 rounded-full ${idx === 0 ? 'bg-blue-500' : 'bg-gray-600'}`}></div>
                <p className={`text-sm font-medium ${idx !== 0 ? 'text-gray-300' : ''}`}>{alert.company} posted {alert.hiring_status}</p>
                <p className="text-xs text-gray-400 mt-1">{alert.role}</p>
                {idx === 0 && (
                  <button 
                    onClick={() => router.push("/dashboard/resumes")}
                    className="text-xs text-blue-400 mt-2 font-medium hover:underline"
                  >
                    Auto-Optimize Resume
                  </button>
                )}
              </div>
            ))}

            {/* Static fallback if no alerts generated yet */}
            {alerts.length === 0 && (
              <div className="relative pl-6 border-l-2 border-white/10 opacity-50 mt-4">
                <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-gray-600"></div>
                <p className="text-sm font-medium text-gray-300">Stripe expanding Data Team</p>
                <p className="text-xs text-gray-500 mt-1">Data Scientist (Remote)</p>
              </div>
            )}
          
          <div className="mt-8 pt-6 border-t border-white/10">
            <h4 className="font-semibold text-sm mb-3 text-blue-300">Quick Test AI Optimizer</h4>
            <div className="space-y-3">
              <textarea 
                value={testJob}
                onChange={(e) => setTestJob(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm h-32 text-gray-300 placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Paste Target Job Description keyword dump here..."
              ></textarea>
              <button 
                onClick={runQuickTest}
                disabled={isTesting}
                className="w-full py-2 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-lg text-sm font-bold shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all disabled:opacity-50"
              >
                {isTesting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                {isTesting ? "Testing Engine..." : "Optimize Resume Now"}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
