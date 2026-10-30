import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  PenTool, 
  Mic2, 
  Video, 
  UserCircle2, 
  Image as ImageIcon, 
  Layers, 
  MonitorPlay,
  TrendingUp,
  Clock,
  Plus,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from './AuthProvider';
import { db } from './firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string;
  color: string;
}

function StatCard({ label, value, icon: Icon, trend, color }: StatCardProps) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl bg-${color}-500/10 text-${color}-500 group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <span className="text-emerald-500 text-xs font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {trend}
          </span>
        )}
      </div>
      <h3 className="text-zinc-500 text-sm font-medium mb-1">{label}</h3>
      <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
    </div>
  );
}

interface QuickActionProps {
  label: string;
  icon: React.ElementType;
  onClick: () => void;
  description: string;
  color: string;
}

function QuickAction({ label, icon: Icon, onClick, description, color }: QuickActionProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-start gap-4 p-4 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/50 transition-all text-left group"
    >
      <div className={`p-3 rounded-xl bg-${color}-500/10 text-${color}-500 group-hover:scale-110 transition-transform`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h4 className="text-white font-semibold mb-1 group-hover:text-indigo-400 transition-colors">{label}</h4>
        <p className="text-zinc-500 text-xs leading-relaxed">{description}</p>
      </div>
    </button>
  );
}

export function Dashboard({ setActiveTab }: { setActiveTab: (id: string) => void }) {
  const { user, userProfile } = useAuth();
  const [counts, setCounts] = useState({ projects: 0, generations: 0, assets: 0 });

  useEffect(() => {
    if (user) {
      fetchCounts();
    }
  }, [user]);

  const fetchCounts = async () => {
    // In a real app, use collection counts or separate stat docs
    // For this build, we'll fetch and count as a simple approach
    const projSnap = await getDocs(query(collection(db, 'projects'), where('userId', '==', user?.uid)));
    const genSnap = await getDocs(query(collection(db, 'generations'), where('userId', '==', user?.uid)));
    const assetSnap = await getDocs(query(collection(db, 'assets'), where('userId', '==', user?.uid)));
    
    setCounts({
      projects: projSnap.size,
      generations: genSnap.size,
      assets: assetSnap.size
    });
  };

  const stats = [
    { label: 'Available Credits', value: userProfile?.credits || 0, icon: Sparkles, color: 'indigo' },
    { label: 'Total Projects', value: counts.projects, icon: MonitorPlay, color: 'purple' },
    { label: 'Generations', value: counts.generations, icon: ImageIcon, color: 'blue' },
    { label: 'Saved Assets', value: counts.assets, icon: Layers, color: 'zinc' },
  ];

  const quickActions = [
    { label: 'Write a New Story', icon: PenTool, description: 'AI-powered script writing for Hindi cartoons.', color: 'indigo', id: 'story' },
    { label: 'Generate Voiceover', icon: Mic2, description: 'Natural character voices in multiple tones.', color: 'purple', id: 'voice' },
    { label: 'Create Character', icon: UserCircle2, description: 'Design unique cartoon characters from prompts.', color: 'blue', id: 'character' },
    { label: 'Generate AI Video', icon: Video, description: 'Turn scripts and images into 2D animations.', color: 'emerald', id: 'video' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, <span className="text-indigo-500">{userProfile?.displayName?.split(' ')[0] || 'Creator'}</span>!
          </h1>
          <p className="text-zinc-500">Ready to produce your next cartoon masterpiece?</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveTab('projects')}
            className="px-5 py-2.5 rounded-xl bg-zinc-900 text-white font-medium hover:bg-zinc-800 border border-zinc-800 transition-all flex items-center gap-2"
          >
            My Projects
          </button>
          <button 
            onClick={() => setActiveTab('story')}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Project
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              Quick Create
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickActions.map((action, i) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.1 }}
              >
                <QuickAction 
                  {...action} 
                  onClick={() => setActiveTab(action.id)} 
                />
              </motion.div>
            ))}
          </div>

          {/* Recent Generations Placeholder */}
          <div className="space-y-6 pt-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-500" />
                Recent Generations
              </h2>
              <button className="text-sm text-zinc-500 hover:text-white transition-colors flex items-center gap-1 group">
                View All
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-video bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden group relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 flex items-center justify-center text-zinc-700">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          {/* Credit Usage */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Credit Usage</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium uppercase tracking-wider text-zinc-500">
                  <span>Usage this month</span>
                  <span>{100 - (userProfile?.credits || 0)} / 100</span>
                </div>
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${100 - (userProfile?.credits || 0)}%` }}
                    className="h-full bg-indigo-500 rounded-full"
                  />
                </div>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Credits are used for AI story writing, voice generation, and video production. Your balance resets on the 1st of every month.
              </p>
              <button className="w-full py-3 rounded-xl bg-indigo-600/10 text-indigo-400 text-sm font-bold hover:bg-indigo-600/20 transition-colors">
                Upgrade Plan
              </button>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
            <h3 className="text-lg font-bold mb-2">Pro Tip</h3>
            <p className="text-sm text-indigo-100 leading-relaxed mb-4">
              Use "Character Lock" in the Voice Studio to keep your character voices consistent across all episodes!
            </p>
            <button className="text-sm font-bold flex items-center gap-2 hover:gap-3 transition-all">
              Learn More <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
