import { Briefcase, FileText, Activity, ArrowRight, Zap } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col items-center pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Background Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Hero Section */}
      <div className="text-center z-10 max-w-4xl mx-auto mb-20 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-8 text-sm font-medium border-white/10 text-blue-200">
          <Zap className="w-4 h-4 text-accent" />
          <span>Gemini-Powered Resume Intelligence v2.0 is Live</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
          Hack the <span className="text-gradient">Hiring Process</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl mx-auto">
          Upload one master resume. Let AI generate hyper-optimized versions for every job and alert you the second companies start hiring.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/dashboard" className="glass-button px-8 py-4 rounded-xl text-white font-semibold flex items-center justify-center gap-2">
            Go to Dashboard <ArrowRight className="w-5 h-5" />
          </Link>
          <button className="px-8 py-4 rounded-xl text-gray-300 font-semibold border border-white/10 hover:bg-white/5 transition-colors">
            View Live Openings
          </button>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto w-full z-10">
        <div className="glass-panel p-8 rounded-2xl">
          <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-6">
            <FileText className="text-blue-400 w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold mb-3">AI Resume Parsing</h3>
          <p className="text-gray-400 text-sm">
            Our engine breaks down your resume and compares your skills against millions of data points to find gaps.
          </p>
        </div>

        <div className="glass-panel p-8 rounded-2xl border-purple-500/30 shadow-[0_0_30px_rgba(139,92,246,0.1)]">
          <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mb-6">
            <Activity className="text-purple-400 w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold mb-3">Real-time ATS Scoring</h3>
          <p className="text-gray-400 text-sm">
            Get instant feedback on how your resume performs against automated tracking systems before you apply.
          </p>
        </div>

        <div className="glass-panel p-8 rounded-2xl">
          <div className="w-12 h-12 rounded-lg bg-pink-500/20 flex items-center justify-center mb-6">
            <Briefcase className="text-pink-400 w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold mb-3">Hiring Intelligence</h3>
          <p className="text-gray-400 text-sm">
            Receive push notifications the moment your target companies open a role that perfectly matches your profile.
          </p>
        </div>
      </div>
    </div>
  )
}
