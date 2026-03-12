import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export type JobAlert = {
  id: string;
  company: string;
  role: string;
  hiring_status: string;
};

export function useHiringAlerts() {
  const [alerts, setAlerts] = useState<JobAlert[]>([]);
  const supabase = createClient();

  useEffect(() => {
    // Fetch initial latest jobs
    const fetchJobs = async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('id, company, role, hiring_status, created_at')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (data && !error) {
        setAlerts(data as JobAlert[]);
      }
    };

    fetchJobs();

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
          
          setAlerts((prev) => [newJob, ...prev]);
          
          // Trigger browser notification if permitted
          if (Notification && Notification.permission === "granted") {
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
  }, [supabase]);

  return alerts;
}
