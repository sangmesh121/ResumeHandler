import Link from "next/link"
import { LayoutDashboard, FileText, Bell, Settings, Target, Zap } from "lucide-react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#050505]">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-white/5 bg-black/50 backdrop-blur-xl flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <Zap className="w-5 h-5 text-blue-500" />
            <span>ProHire AI</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-blue-500/10 text-blue-400 font-medium">
            <LayoutDashboard className="w-5 h-5" /> Overview
          </Link>
          <Link href="/dashboard/resumes" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-gray-100 hover:bg-white/5 transition-colors">
            <FileText className="w-5 h-5" /> Resume Variants
          </Link>
          <Link href="/dashboard/jobs" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-gray-100 hover:bg-white/5 transition-colors">
            <Target className="w-5 h-5" /> Job Matches
          </Link>
          <Link href="/dashboard/alerts" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-gray-100 hover:bg-white/5 transition-colors">
            <Bell className="w-5 h-5" /> Hiring Alerts
          </Link>
        </nav>

        <div className="p-4 border-t border-white/5">
          <Link href="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-gray-100 hover:bg-white/5 transition-colors">
            <Settings className="w-5 h-5" /> Settings
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 flex items-center justify-between px-8 border-b border-white/5 bg-black/20 backdrop-blur-md sticky top-0 z-20">
          <h1 className="font-semibold text-lg">Overview</h1>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-400">Pro Plan <span className="text-blue-500 border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 rounded text-xs ml-2">Active</span></div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600"></div>
          </div>
        </header>
        
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
