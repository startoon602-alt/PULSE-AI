import React, { useState, useEffect } from 'react';
import { 
  User, 
  Palette, 
  Sparkles, 
  Mic2, 
  Video, 
  UserCircle2, 
  ImageIcon, 
  Layers, 
  MonitorPlay, 
  HardDrive, 
  Bell, 
  ShieldCheck, 
  Search, 
  Save, 
  RotateCcw,
  ChevronRight,
  Globe,
  Clock,
  Type,
  Layout,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from './AuthProvider';
import { db } from './firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

interface SettingsCategory {
  id: string;
  label: string;
  icon: React.ElementType;
  description: string;
}

const categories: SettingsCategory[] = [
  { id: 'account', label: 'Account', icon: User, description: 'Manage your profile, email, and authentication.' },
  { id: 'appearance', label: 'Appearance', icon: Palette, description: 'Customize the theme, colors, and layout of the studio.' },
  { id: 'ai', label: 'AI Generation', icon: Sparkles, description: 'Default AI models, quality, and generation preferences.' },
  { id: 'story', label: 'Story Studio', icon: Sliders, description: 'Default story duration, tone, and formatting.' },
  { id: 'voice', label: 'Voice Studio', icon: Mic2, description: 'Voice styles, speed, pitch, and character locks.' },
  { id: 'video', label: 'Video Studio', icon: Video, description: 'Animation resolution, frame rate, and defaults.' },
  { id: 'character', label: 'Character Studio', icon: UserCircle2, description: 'Consistent character traits and art styles.' },
  { id: 'background', label: 'Background & PNG', icon: ImageIcon, description: 'Art styles, environment defaults, and edge quality.' },
  { id: 'timeline', label: 'Timeline & Audio', icon: MonitorPlay, description: 'Snapping, track layout, and autosave intervals.' },
  { id: 'storage', label: 'Storage & Projects', icon: HardDrive, description: 'Storage usage, organization, and auto-backups.' },
  { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Configure email and in-app alerts.' },
  { id: 'security', label: 'Security & Privacy', icon: ShieldCheck, description: 'Two-factor auth, session logs, and data controls.' },
];

export function Settings() {
  const { user, userProfile } = useAuth();
  const [activeCategory, setActiveCategory] = useState('account');
  const [searchQuery, setSearchQuery] = useState('');
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      fetchSettings();
    }
  }, [user]);

  const fetchSettings = async () => {
    if (!user) return;
    try {
      const docRef = doc(db, 'settings', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSettings(docSnap.data());
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user || !settings) return;
    setSaving(true);
    try {
      const docRef = doc(db, 'settings', user.uid);
      await updateDoc(docRef, {
        ...settings,
        updatedAt: serverTimestamp()
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setSaving(false);
    }
  };

  const updateNestedSetting = (category: string, key: string, value: any) => {
    setSettings((prev: any) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Loading Studio Preferences...</p>
      </div>
    );
  }

  const filteredCategories = categories.filter(cat => 
    cat.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
    cat.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-[1600px] mx-auto p-4 md:p-8 space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Settings Center</h1>
          <p className="text-zinc-500 font-medium">Fine-tune every aspect of your production workspace.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search settings..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl pl-12 pr-6 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all w-full md:w-64 shadow-inner"
            />
          </div>
          <button 
            onClick={handleSave}
            disabled={saving}
            className={`px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 shadow-xl active:scale-[0.98] ${
              success ? 'bg-emerald-600 text-white shadow-emerald-500/20' : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-600/20'
            }`}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : success ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {success ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-250px)]">
        {/* Sidebar */}
        <aside className="lg:col-span-3 bg-zinc-950 border border-zinc-900 rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl">
          <div className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-hide">
            {filteredCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${
                  activeCategory === cat.id 
                    ? 'bg-indigo-600/10 text-white shadow-inner' 
                    : 'text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300'
                }`}
              >
                <div className={`p-2.5 rounded-xl transition-all ${activeCategory === cat.id ? 'bg-indigo-600 text-white shadow-lg' : 'bg-zinc-900 text-zinc-600 group-hover:text-zinc-400'}`}>
                   <cat.icon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-black uppercase tracking-widest">{cat.label}</p>
                </div>
                <ChevronRight className={`w-4 h-4 ml-auto transition-transform ${activeCategory === cat.id ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'}`} />
              </button>
            ))}
          </div>
        </aside>

        {/* Content Area */}
        <main className="lg:col-span-9 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] flex flex-col shadow-2xl overflow-hidden relative">
          <div className="p-10 md:p-14 overflow-y-auto flex-1 scrollbar-hide space-y-12">
            <div className="space-y-2 border-b border-zinc-800 pb-8">
              <h2 className="text-3xl font-black text-white tracking-tight uppercase">
                {categories.find(c => c.id === activeCategory)?.label}
              </h2>
              <p className="text-zinc-500 font-medium">{categories.find(c => c.id === activeCategory)?.description}</p>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-10 pb-20"
              >
                {activeCategory === 'account' && (
                  <div className="space-y-8 max-w-2xl">
                    <div className="flex items-center gap-8 p-8 bg-black rounded-[2.5rem] border border-zinc-800 shadow-inner group">
                      <div className="w-24 h-24 rounded-[2rem] bg-zinc-900 border-2 border-zinc-800 overflow-hidden shrink-0 relative group-hover:border-indigo-500 transition-all">
                        {userProfile?.photoURL ? (
                          <img src={userProfile.photoURL} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User className="w-10 h-10 text-zinc-700" />
                          </div>
                        )}
                        <button className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] font-black text-white uppercase tracking-widest">Change</button>
                      </div>
                      <div className="space-y-2">
                        <p className="text-2xl font-black text-white tracking-tight">{userProfile?.displayName || 'Studio Creator'}</p>
                        <div className="flex items-center gap-2 px-3 py-1 bg-indigo-600/10 border border-indigo-500/20 rounded-full w-fit">
                          <Sparkles className="w-3 h-3 text-indigo-400" />
                          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">{userProfile?.plan || 'Free'} Plan</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-3">
                         <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-4">Full Name</label>
                         <input type="text" value={userProfile?.displayName || ''} readOnly className="w-full bg-black border border-zinc-800 rounded-2xl px-6 py-4 text-white font-medium focus:outline-none focus:border-indigo-500 transition-all shadow-inner" />
                       </div>
                       <div className="space-y-3">
                         <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-4">Email Address</label>
                         <input type="email" value={userProfile?.email || ''} readOnly className="w-full bg-black border border-zinc-800 rounded-2xl px-6 py-4 text-zinc-500 font-medium focus:outline-none transition-all shadow-inner cursor-not-allowed" />
                       </div>
                    </div>

                    <div className="pt-8 border-t border-zinc-800 space-y-4">
                       <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">Regional Preferences</h3>
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-2">
                            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest ml-2">Language</p>
                            <div className="flex items-center gap-3 p-4 bg-black rounded-xl border border-zinc-800">
                               <Globe className="w-4 h-4 text-zinc-500" />
                               <span className="text-sm font-bold text-white">English (US)</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest ml-2">Timezone</p>
                            <div className="flex items-center gap-3 p-4 bg-black rounded-xl border border-zinc-800">
                               <Clock className="w-4 h-4 text-zinc-500" />
                               <span className="text-sm font-bold text-white">UTC +5:30</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest ml-2">Date Format</p>
                            <div className="flex items-center gap-3 p-4 bg-black rounded-xl border border-zinc-800">
                               <Layout className="w-4 h-4 text-zinc-500" />
                               <span className="text-sm font-bold text-white">DD/MM/YYYY</span>
                            </div>
                          </div>
                       </div>
                    </div>
                  </div>
                )}

                {activeCategory === 'appearance' && (
                  <div className="space-y-12 max-w-4xl">
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                          { id: 'dark', label: 'Dark Mode', icon: Palette, active: settings?.appearance?.theme === 'dark' },
                          { id: 'light', label: 'Light Mode', icon: Sparkles, active: settings?.appearance?.theme === 'light' },
                          { id: 'system', label: 'System Sync', icon: Globe, active: settings?.appearance?.theme === 'system' },
                        ].map(theme => (
                          <button 
                            key={theme.id}
                            onClick={() => updateNestedSetting('appearance', 'theme', theme.id)}
                            className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-4 ${theme.active ? 'bg-indigo-600/10 border-indigo-600 shadow-xl' : 'bg-black border-zinc-800 hover:border-zinc-700'}`}
                          >
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${theme.active ? 'bg-indigo-600 text-white' : 'bg-zinc-900 text-zinc-500'}`}>
                               <theme.icon className="w-6 h-6" />
                            </div>
                            <span className={`text-xs font-black uppercase tracking-widest ${theme.active ? 'text-white' : 'text-zinc-500'}`}>{theme.label}</span>
                          </button>
                        ))}
                     </div>

                     <div className="space-y-6">
                        <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">Studio Accent Color</h3>
                        <div className="flex flex-wrap gap-4">
                           {['indigo', 'purple', 'emerald', 'blue', 'orange', 'rose'].map(color => (
                             <button 
                               key={color}
                               onClick={() => updateNestedSetting('appearance', 'accentColor', color)}
                               className={`w-12 h-12 rounded-2xl transition-all shadow-xl flex items-center justify-center ${
                                 settings?.appearance?.accentColor === color ? 'ring-4 ring-white ring-offset-4 ring-offset-black scale-110' : 'opacity-60 hover:opacity-100'
                               }`}
                               style={{ backgroundColor: `var(--${color}-600, ${color})` }}
                             >
                               {settings?.appearance?.accentColor === color && <CheckCircle2 className="w-6 h-6 text-white" />}
                             </button>
                           ))}
                        </div>
                     </div>

                     <div className="space-y-6 pt-8 border-t border-zinc-800">
                        <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">Interface Density</h3>
                        <div className="flex gap-4">
                           {['compact', 'spacious'].map(density => (
                             <button 
                               key={density}
                               onClick={() => updateNestedSetting('appearance', 'density', density)}
                               className={`flex-1 p-6 rounded-[2rem] border-2 transition-all flex items-center gap-4 ${settings?.appearance?.density === density ? 'bg-indigo-600/10 border-indigo-600 text-white' : 'bg-black border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}
                             >
                               <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center">
                                  <Layout className="w-5 h-5" />
                               </div>
                               <span className="text-xs font-black uppercase tracking-[0.2em]">{density}</span>
                             </button>
                           ))}
                        </div>
                     </div>
                  </div>
                )}

                {activeCategory === 'ai' && (
                  <div className="space-y-10 max-w-4xl">
                     <div className="p-8 bg-amber-600/5 border border-amber-600/20 rounded-[2.5rem] flex gap-6 items-start shadow-xl">
                        <AlertTriangle className="w-8 h-8 text-amber-500 shrink-0" />
                        <div>
                           <h4 className="text-white font-black text-lg tracking-tight uppercase mb-1">Compute Safety Notice</h4>
                           <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                              Higher quality models and resolutions consume more credits per generation. Professional plans get access to experimental and low-latency models first.
                           </p>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-6">
                           <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">Default Production Model</h3>
                           <div className="space-y-3">
                              {[
                                { id: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash (Speed Optimized)', badge: 'Free' },
                                { id: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro (Accuracy Focused)', badge: 'Pro' },
                                { id: 'gemini-argon', label: 'Gemini Argon (Narrative Specialist)', badge: 'Experimental' },
                              ].map(model => (
                                <button 
                                  key={model.id}
                                  onClick={() => updateNestedSetting('ai', 'defaultModel', model.id)}
                                  className={`w-full p-5 rounded-2xl border-2 transition-all flex items-center justify-between group ${settings?.ai?.defaultModel === model.id ? 'bg-indigo-600/10 border-indigo-600' : 'bg-black border-zinc-800 hover:border-zinc-700'}`}
                                >
                                  <div className="flex items-center gap-4">
                                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${settings?.ai?.defaultModel === model.id ? 'bg-indigo-600 text-white shadow-lg' : 'bg-zinc-900 text-zinc-600'}`}>
                                        <Sparkles className="w-5 h-5" />
                                     </div>
                                     <span className={`text-xs font-black uppercase tracking-widest ${settings?.ai?.defaultModel === model.id ? 'text-white' : 'text-zinc-500'}`}>{model.label}</span>
                                  </div>
                                  <span className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.2em] bg-zinc-900 px-2 py-1 rounded">{model.badge}</span>
                                </button>
                              ))}
                           </div>
                        </div>

                        <div className="space-y-10">
                           <div className="space-y-6">
                              <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">Output Fidelity</h3>
                              <div className="grid grid-cols-2 gap-4">
                                 {['Standard', 'Ultra High'].map(quality => (
                                   <button 
                                     key={quality}
                                     onClick={() => updateNestedSetting('ai', 'quality', quality.toLowerCase())}
                                     className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${settings?.ai?.quality === quality.toLowerCase() ? 'bg-indigo-600/10 border-indigo-600 text-white' : 'bg-black border-zinc-800 text-zinc-500'}`}
                                   >
                                     <MonitorPlay className="w-6 h-6" />
                                     <span className="text-[10px] font-black uppercase tracking-widest">{quality}</span>
                                   </button>
                                 ))}
                              </div>
                           </div>

                           <div className="space-y-6">
                              <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">Generation Behavior</h3>
                              <div className="space-y-4">
                                 <div className="flex items-center justify-between p-4 bg-black rounded-2xl border border-zinc-800">
                                    <span className="text-xs font-bold text-zinc-400">Prompt Enhancement</span>
                                    <button className="w-12 h-6 bg-indigo-600 rounded-full relative p-1"><div className="w-4 h-4 bg-white rounded-full ml-auto" /></button>
                                 </div>
                                 <div className="flex items-center justify-between p-4 bg-black rounded-2xl border border-zinc-800 opacity-50">
                                    <span className="text-xs font-bold text-zinc-400">Deterministic Seeds (Pro)</span>
                                    <button className="w-12 h-6 bg-zinc-800 rounded-full relative p-1"><div className="w-4 h-4 bg-zinc-600 rounded-full" /></button>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
                )}

                {/* Default fallback for other categories */}
                {!['account', 'appearance', 'ai'].includes(activeCategory) && (
                  <div className="space-y-8 flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-24 h-24 rounded-[2rem] bg-zinc-950 border border-zinc-800 flex items-center justify-center text-indigo-500 shadow-2xl mb-6">
                       {categories.find(c => c.id === activeCategory)?.icon && React.createElement(categories.find(c => c.id === activeCategory)!.icon, { className: "w-10 h-10" })}
                    </div>
                    <div className="max-w-md space-y-4">
                      <h3 className="text-2xl font-black text-white tracking-tight uppercase">Advanced {categories.find(c => c.id === activeCategory)?.label} Control</h3>
                      <p className="text-zinc-500 font-medium leading-relaxed">
                        We are currently expanding the granular configurations for the {categories.find(c => c.id === activeCategory)?.label} workspace. Check back soon for the full release of these options.
                      </p>
                    </div>
                    <div className="flex gap-4">
                       <button className="px-8 py-3 bg-zinc-800 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-zinc-700 transition-all">Request Feature</button>
                       <button className="px-8 py-3 bg-indigo-600 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20">Read Docs</button>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="p-6 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between">
             <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Sync Status: Securely Connected</span>
             </div>
             <button 
               onClick={() => fetchSettings()}
               className="text-[10px] font-black text-zinc-600 hover:text-white uppercase tracking-[0.3em] flex items-center gap-2 transition-all"
             >
                <RotateCcw className="w-3 h-3" /> Reset to Defaults
             </button>
          </div>
        </main>
      </div>
    </div>
  );
}
