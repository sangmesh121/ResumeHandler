"use client";

import { useState } from "react";
import { FileText, Target, Zap, Activity, ArrowUpRight, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [testJob, setTestJob] = useState("");
  const [isTesting, setIsTesting] = useState(false);

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
        // Just demonstrating it worked, normally we'd save to DB and navigate
        alert("Optimization successful! Routing to Resume Vault to view results.");
        router.push("/dashboard/resumes");
      } else {
        alert("Action Failed: " + json.error);
      }
    } catch (error) {
       alert("Network error.");
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up">
      
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-panel p-6 rounded-2xl">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <FileText className="text-blue-400 w-5 h-5" />
            </div>
            <span className="text-green-400 flex items-center text-sm font-medium"><ArrowUpRight className="w-3 h-3 mr-1" /> 12%</span>
          </div>
          <h2 className="text-3xl font-bold mb-1">14</h2>
          <p className="text-gray-400 text-sm">Resumes Generated</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border-purple-500/30">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Activity className="text-purple-400 w-5 h-5" />
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-1">94%</h2>
          <p className="text-gray-400 text-sm">Avg ATS Match Score</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center">
              <Target className="text-pink-400 w-5 h-5" />
            </div>
            <span className="text-green-400 flex items-center text-sm font-medium"><ArrowUpRight className="w-3 h-3 mr-1" /> 4 New</span>
          </div>
          <h2 className="text-3xl font-bold mb-1">8</h2>
          <p className="text-gray-400 text-sm">Active Hiring Alerts</p>
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
            <button className="text-sm text-blue-400 hover:text-blue-300">View All</button>
          </h3>
          
          <div className="space-y-4">
            {/* Item 1 */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded bg-gray-800 flex items-center justify-center text-xs font-mono text-gray-400 border border-gray-700">PDF</div>
                <div>
                  <h4 className="font-medium">Google_MLEngineer_v2.pdf</h4>
                  <p className="text-sm text-gray-400">Target: Google • Optimized 2 hrs ago</p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-green-400 font-bold bg-green-400/10 px-2 py-1 rounded text-sm">96% Match</span>
                <span className="text-xs text-gray-500 mt-1">Ready to apply</span>
              </div>
            </div>

            {/* Item 2 */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded bg-gray-800 flex items-center justify-center text-xs font-mono text-gray-400 border border-gray-700">PDF</div>
                <div>
                  <h4 className="font-medium">OpenAI_Researcher.pdf</h4>
                  <p className="text-sm text-gray-400">Target: OpenAI • Optimized 1 day ago</p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-yellow-400 font-bold bg-yellow-400/10 px-2 py-1 rounded text-sm">88% Match</span>
                <span className="text-xs text-gray-500 mt-1">Missing: Kubernetes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Hiring Signals */}
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 blur-[50px] rounded-full"></div>
          
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            Live Hiring Signals
          </h3>
          
          <div className="space-y-6">
            <div className="relative pl-6 border-l-2 border-blue-500/30">
              <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-blue-500"></div>
              <p className="text-sm font-medium">Meta opened 4 AI roles</p>
              <p className="text-xs text-gray-400 mt-1">L4 Machine Learning Engineer</p>
              <button 
                onClick={() => router.push("/dashboard/resumes")}
                className="text-xs text-blue-400 mt-2 font-medium hover:underline"
              >
                Auto-Optimize Resume
              </button>
            </div>

            <div className="relative pl-6 border-l-2 border-white/10">
              <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-gray-600"></div>
              <p className="text-sm font-medium text-gray-300">Stripe expanding Data Team</p>
              <p className="text-xs text-gray-500 mt-1">Data Scientist (Remote)</p>
            </div>
          </div>
          
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
