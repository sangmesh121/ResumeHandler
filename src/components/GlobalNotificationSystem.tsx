"use client";

import { useEffect } from 'react';
import { useHiringAlerts } from '@/hooks/useHiringAlerts';
import { Zap, X } from 'lucide-react';
import { useState } from 'react';

// For the MVP, we assume a static user ID or fetch from context.
// In production, this comes from Supabase Auth context.
const MOCK_USER_ID = "00000000-0000-0000-0000-000000000000";

export function GlobalNotificationSystem() {
  const alerts = useHiringAlerts(MOCK_USER_ID);
  const [visibleAlerts, setVisibleAlerts] = useState<typeof alerts>([]);

  // Sync new alerts to visibility
  useEffect(() => {
    if (alerts.length > 0) {
      setVisibleAlerts(alerts);
      
      // Auto dismiss after 8 seconds
      const timer = setTimeout(() => {
          setVisibleAlerts([]);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [alerts]);

  const dismissAlert = (id: string) => {
      setVisibleAlerts(prev => prev.filter(alert => alert.id !== id));
  }

  if (visibleAlerts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {visibleAlerts.slice(0, 3).map((alert) => (
        <div key={alert.id} className="animate-fade-in-up glass-panel p-4 rounded-xl border-l-4 border-l-pink-500 shadow-2xl flex gap-4 w-96 relative">
          <button onClick={() => dismissAlert(alert.id)} className="absolute top-2 right-2 text-gray-500 hover:text-white">
              <X className="w-4 h-4" />
          </button>
          
          <div className="w-10 h-10 rounded-full bg-pink-500/20 flex flex-shrink-0 items-center justify-center">
            <Zap className="text-pink-400 w-5 h-5" />
          </div>
          
          <div>
            <h4 className="font-bold text-sm text-white">Live Alert: {alert.company}</h4>
            <p className="text-xs text-gray-300 mt-1">Detected new opening: {alert.role}</p>
            <button className="mt-3 text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded transition-colors w-full font-medium">
                Auto-Optimize Resume
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
