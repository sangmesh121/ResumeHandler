"use client";

import Link from "next/link"
import { LayoutDashboard, FileText, Bell, Settings, Target, Zap } from "lucide-react"
import { useEffect, useState } from "react";
import { createBrowserClient } from '@supabase/ssr';
import { useRouter, usePathname } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      } else {
        setUser(session.user);
      }
    };
    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.push('/login');
      else setUser(session.user);
    });

    return () => subscription.unsubscribe();
  }, [supabase, router]);

  if (!user) {
     return <div className="min-h-screen bg-[#050505] flex items-center justify-center">Loading...</div>;
  }

  const isActive = (path: string) => pathname === path;

  return (
    <div className="flex min-h-screen bg-[#050505] text-gray-200">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-white/5 bg-black/50 backdrop-blur-xl flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <Zap className="w-5 h-5 text-blue-500" />
            <span className="text-white">ProHire AI</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link href="/dashboard" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive('/dashboard') ? 'bg-blue-500/10 text-blue-400 font-medium' : 'text-gray-400 hover:text-gray-100 hover:bg-white/5'}`}>
            <LayoutDashboard className="w-5 h-5" /> Overview
          </Link>
          <Link href="/dashboard/resumes" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive('/dashboard/resumes') ? 'bg-blue-500/10 text-blue-400 font-medium' : 'text-gray-400 hover:text-gray-100 hover:bg-white/5'}`}>
            <FileText className="w-5 h-5" /> Resume Builder
          </Link>
          <Link href="/dashboard/jobs" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive('/dashboard/jobs') ? 'bg-blue-500/10 text-blue-400 font-medium' : 'text-gray-400 hover:text-gray-100 hover:bg-white/5'}`}>
            <Target className="w-5 h-5" /> Job Board
          </Link>
          <Link href="/dashboard/alerts" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive('/dashboard/alerts') ? 'bg-blue-500/10 text-blue-400 font-medium' : 'text-gray-400 hover:text-gray-100 hover:bg-white/5'}`}>
            <Bell className="w-5 h-5" /> Auto Alerts
          </Link>
        </nav>

        <div className="p-4 border-t border-white/5">
          <Link href="/dashboard/settings" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive('/dashboard/settings') ? 'bg-blue-500/10 text-blue-400 font-medium' : 'text-gray-400 hover:text-gray-100 hover:bg-white/5'}`}>
            <Settings className="w-5 h-5" /> Settings
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 flex items-center justify-between px-8 border-b border-white/5 bg-black/20 backdrop-blur-md sticky top-0 z-20">
          <h1 className="font-semibold text-lg text-white capitalize">{pathname.split('/').pop() === 'dashboard' ? 'Overview' : pathname.split('/').pop()}</h1>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-400 hidden sm:block">Pro Plan <span className="text-blue-500 border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 rounded text-xs ml-2">Active</span></div>
            <Link href="/dashboard/settings" className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-lg cursor-pointer hover:opacity-80 transition-opacity">
              {user?.email?.substring(0,2).toUpperCase() || 'US'}
            </Link>
          </div>
        </header>
        
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
