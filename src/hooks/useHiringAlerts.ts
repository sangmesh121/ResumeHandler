import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export type JobAlert = {
  id: string;
  company: string;
  role: string;
  hiring_status: string;
};

export function useHiringAlerts(userId: string) {
  const [alerts, setAlerts] = useState<JobAlert[]>([]);
  const supabase = createClient();

  useEffect(() => {
    if (!userId) return;

    // Listen to inserts on the 'jobs' table
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'jobs',
        },
        (payload) => {
          const newJob = payload.new as JobAlert;
          
          // Optionally filter here to only show alerts user is subscribed to via job_alerts table
          setAlerts((prev) => [newJob, ...prev]);
          
          // Trigger browser notification if permitted
          if (Notification.permission === "granted") {
             new Notification(`New Hiring Alert: ${newJob.company}`, {
                 body: `Role: ${newJob.role} is now ${newJob.hiring_status}`,
             });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, supabase]);

  return alerts;
}
