import { useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';

export function useSupabaseSync(parsedResume: any) {
  useEffect(() => {
    const syncData = async () => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const { data: { session } } = await supabase.auth.getSession();
      if (!session || !parsedResume) return;

      const userId = session.user.id;

      try {
        // Step 1: Upsert the latest resume to the 'user_profiles' or 'resumes' table
        // Note: For this to work perfectly, you need a 'resumes' table in Supabase.
        // We will fail silently if the table doesn't exist yet to not break the UI.
        await supabase.from('resumes').upsert({
          user_id: userId,
          content: parsedResume,
          updated_at: new Date().toISOString()
        });

        // Step 2: 24-Hour Job Alert Cache Check
        const lastAlertCheck = localStorage.getItem(`last_alert_${userId}`);
        const now = new Date().getTime();
        
        // If 24 hours (86400000 ms) haven't passed, do nothing
        if (lastAlertCheck && now - parseInt(lastAlertCheck) < 86400000) {
          return;
        }

        // If it's time, we would typically trigger an Edge Function or background API here.
        // For standard Next.js without a background cron, we can ping an API route that handles it.
        console.log("24 Hours Passed - Triggering Background Job Alert Cache...");
        
        // Example ping (requires building an /api/jobs/alerts route)
        /*
        await fetch('/api/jobs/alerts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, resume: parsedResume })
        });
        */

        // Update the timestamp so it waits another 24 hours
        localStorage.setItem(`last_alert_${userId}`, now.toString());

      } catch (err) {
        console.error("Supabase Sync Background Error:", err);
      }
    };

    syncData();
  }, [parsedResume]);
}
