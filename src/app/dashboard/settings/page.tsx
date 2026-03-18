"use client";

import { useEffect, useState } from "react";
import { User, LogOut, Shield, Bell, CreditCard, ChevronRight, Loader2, Mail, CheckCircle2 } from "lucide-react";
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [alertSettings, setAlertSettings] = useState({ dailyEmail: true, instantMatch: false });
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
      } else {
        setUser(user);
        setFirstName(user.user_metadata?.first_name || "");
        setLastName(user.user_metadata?.last_name || "");
      }
      setIsLoading(false);
    };
    fetchUser();
  }, [supabase, router]);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    const { data, error } = await supabase.auth.updateUser({
      data: { first_name: firstName, last_name: lastName }
    });

    setIsSaving(false);
    
    if (error) {
      alert("Error saving profile: " + error.message);
    } else {
      if (data.user) setUser(data.user);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }
    setIsSavingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setIsSavingPassword(false);
    if (error) alert("Error updating password: " + error.message);
    else {
      alert("Password updated successfully!");
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const objectUrl = URL.createObjectURL(file);
    setAvatarUrl(objectUrl);
    alert("Avatar preview generated! To persist this cross-session, a Supabase Storage Bucket 'avatars' is required.");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up pb-20 text-gray-200">
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-400 text-sm">Manage your profile, preferences, and account security.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Settings Navigation Sidebar */}
        <div className="space-y-2">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center justify-between p-3 rounded-xl font-medium transition-colors ${activeTab === 'profile' ? 'bg-blue-500/10 text-blue-400' : 'hover:bg-white/5 text-gray-400'}`}
          >
            <span className="flex items-center gap-3"><User className="w-4 h-4" /> Profile Details</span>
            {activeTab === 'profile' && <ChevronRight className="w-4 h-4" />}
          </button>
          <button 
            onClick={() => setActiveTab('alerts')}
            className={`w-full flex items-center justify-between p-3 rounded-xl font-medium transition-colors ${activeTab === 'alerts' ? 'bg-blue-500/10 text-blue-400' : 'hover:bg-white/5 text-gray-400'}`}
          >
            <span className="flex items-center gap-3"><Bell className="w-4 h-4" /> Alert Preferences</span>
            {activeTab === 'alerts' && <ChevronRight className="w-4 h-4" />}
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center justify-between p-3 rounded-xl font-medium transition-colors ${activeTab === 'security' ? 'bg-blue-500/10 text-blue-400' : 'hover:bg-white/5 text-gray-400'}`}
          >
            <span className="flex items-center gap-3"><Shield className="w-4 h-4" /> Security</span>
            {activeTab === 'security' && <ChevronRight className="w-4 h-4" />}
          </button>
          <button 
            onClick={() => setActiveTab('billing')}
            className={`w-full flex items-center justify-between p-3 rounded-xl font-medium transition-colors ${activeTab === 'billing' ? 'bg-blue-500/10 text-blue-400' : 'hover:bg-white/5 text-gray-400'}`}
          >
            <span className="flex items-center gap-3"><CreditCard className="w-4 h-4" /> Billing</span>
            {activeTab === 'billing' && <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        {/* Settings Content Area */}
        <div className="md:col-span-2 space-y-6">
          
          {activeTab === 'profile' && (
            <>
              <div className="bg-[#111] border border-white/5 p-6 rounded-2xl shadow-xl animate-fade-in-up">
                <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
                
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg overflow-hidden relative group">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      user?.email?.substring(0,2).toUpperCase() || 'US'
                    )}
                    <label className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center cursor-pointer transition-all">
                      <span className="text-[10px] font-bold">Upload</span>
                      <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                    </label>
                  </div>
                  <div>
                    <label className="px-4 py-2 bg-white/10 hover:bg-white/20 text-sm font-medium rounded-lg transition-colors mb-2 cursor-pointer inline-block">
                      Change Avatar
                      <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                    </label>
                    <p className="text-xs text-gray-500 mt-2">JPG, GIF or PNG. 1MB max.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-400 mb-1 block">First Name</label>
                      <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="e.g. John" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-400 mb-1 block">Last Name</label>
                      <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="e.g. Doe" />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-400 mb-1 block">Email Address</label>
                    <div className="flex relative items-center">
                      <Mail className="w-4 h-4 absolute left-4 text-gray-500" />
                      <input type="email" readOnly className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-400 focus:outline-none cursor-not-allowed" defaultValue={user?.email || ''} />
                    </div>
                    <p className="text-xs flex items-center gap-1 text-gray-500 mt-2">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span> Verified Primary Email
                    </p>
                  </div>
                  
                  <div className="pt-4 flex items-center justify-end gap-4">
                    {saveSuccess && <span className="text-xs font-bold text-green-400 flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Saved Successfully</span>}
                    <button 
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-sm font-bold transition-colors"
                    >
                      {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-[#111] border border-red-500/20 p-6 rounded-2xl shadow-xl animate-fade-in-up">
                <h2 className="text-xl font-semibold mb-2 text-red-400">Danger Zone</h2>
                <p className="text-sm text-gray-400 mb-6">Manage your active sessions or permanently delete your account.</p>
                
                <div className="flex flex-col gap-4">
                  <button 
                    onClick={handleLogout}
                    className="flex items-center justify-between px-5 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl text-sm font-bold transition-colors w-full text-left"
                  >
                    <span className="flex items-center gap-3"><LogOut className="w-4 h-4" /> Log out of all devices</span>
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab === 'alerts' && (
             <div className="bg-[#111] border border-white/5 p-6 rounded-2xl shadow-xl animate-fade-in-up">
                <h2 className="text-xl font-semibold mb-6">Alert Preferences</h2>
                <p className="text-sm text-gray-400 mb-6">Control how and when ProHire AI notifies you about new job matches.</p>
                
                <div className="space-y-6">
                   <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                      <div>
                         <h4 className="font-bold text-sm">24-Hour Job Digest</h4>
                         <p className="text-xs text-gray-400 mt-1">Receive a daily email with the best scraped positions.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked={alertSettings.dailyEmail} onChange={(e) => setAlertSettings({...alertSettings, dailyEmail: e.target.checked})} />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                      </label>
                   </div>
                   
                   <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                      <div>
                         <h4 className="font-bold text-sm">Instant Perfect Match Alerts</h4>
                         <p className="text-xs text-gray-400 mt-1">Get an instant push notification if an ATS match score is &gt; 90%.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked={alertSettings.instantMatch} onChange={(e) => setAlertSettings({...alertSettings, instantMatch: e.target.checked})} />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                      </label>
                   </div>
                   
                   <div className="pt-4 flex justify-end">
                      <button 
                         onClick={async () => {
                            const { error } = await supabase.auth.updateUser({ data: { alerts: alertSettings } });
                            if (error) alert("Error saving preferences: " + error.message);
                            else alert("Alert Preferences Saved Successfully!");
                         }} 
                         className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold transition-colors"
                      >
                        Save Preferences
                      </button>
                   </div>
                </div>
             </div>
          )}

          {activeTab === 'security' && (
             <div className="bg-[#111] border border-white/5 p-6 rounded-2xl shadow-xl animate-fade-in-up">
                <h2 className="text-xl font-semibold mb-6">Security Settings</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-400 mb-1 block">New Password</label>
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="••••••••" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 mb-1 block">Confirm New Password</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="••••••••" />
                  </div>
                  
                  <div className="pt-4 flex justify-end">
                    <button onClick={handleChangePassword} disabled={isSavingPassword} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-sm font-bold transition-colors">
                      {isSavingPassword ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </div>
             </div>
          )}

          {activeTab === 'billing' && (
             <div className="bg-[#111] border border-white/5 p-6 rounded-2xl shadow-xl animate-fade-in-up">
                <h2 className="text-xl font-semibold mb-4">Billing & Plan</h2>
                <div className="p-6 rounded-xl bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-500/30 mb-6">
                   <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg text-white">Pro Plan</h3>
                        <p className="text-sm text-blue-300 mt-1">Your next billing date is Dec 15, 2030.</p>
                      </div>
                      <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-bold border border-blue-500/30">Active</span>
                   </div>
                   <h4 className="text-2xl font-bold text-white mb-6">$19<span className="text-sm text-gray-400 font-normal">/mo</span></h4>
                   <button className="w-full py-3 bg-white text-black hover:bg-gray-200 rounded-xl font-bold text-sm transition-colors">
                     Manage Subscription via Stripe
                   </button>
                </div>
                
                <h3 className="font-bold text-sm mb-4">Billing History</h3>
                <div className="space-y-3">
                   <div className="flex justify-between items-center py-3 border-b border-white/5 text-sm">
                      <span className="text-gray-400">Nov 15, 2026</span>
                      <span className="font-medium">Pro Plan - $19.00</span>
                      <button className="text-blue-400 hover:text-blue-300 text-xs font-bold">Receipt</button>
                   </div>
                   <div className="flex justify-between items-center py-3 border-b border-white/5 text-sm">
                      <span className="text-gray-400">Oct 15, 2026</span>
                      <span className="font-medium">Pro Plan - $19.00</span>
                      <button className="text-blue-400 hover:text-blue-300 text-xs font-bold">Receipt</button>
                   </div>
                </div>
             </div>
          )}

        </div>
      </div>
    
    </div>
  );
}
