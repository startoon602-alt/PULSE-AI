import React, { useState, useEffect } from 'react';
import { 
  Users, 
  BarChart3, 
  Settings as SettingsIcon, 
  ShieldCheck, 
  CreditCard, 
  AlertCircle, 
  Search, 
  Filter, 
  MoreVertical, 
  ArrowUpRight, 
  ArrowDownLeft, 
  RefreshCcw,
  Zap,
  Globe,
  Loader2,
  Trash2,
  Edit2,
  CheckCircle2,
  Database,
  Lock,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from './AuthProvider';
import { db } from './firebase';
import { collection, query, getDocs, doc, updateDoc, serverTimestamp, orderBy, limit, where } from 'firebase/firestore';

export function AdminDashboard() {
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState<any>({
    totalUsers: 0,
    totalCredits: 0,
    activeSubscriptions: 0,
    totalGenerations: 0
  });

  useEffect(() => {
    if (userProfile?.role === 'admin') {
      fetchData();
    }
  }, [userProfile]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const usersSnap = await getDocs(query(collection(db, 'users'), limit(100)));
      const usersData = usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      setUsers(usersData);

      // Simple stats aggregation (in production would use cloud functions)
      setStats({
        totalUsers: usersData.length,
        totalCredits: usersData.reduce((acc: number, u: any) => acc + (u.credits || 0), 0),
        activeSubscriptions: usersData.filter((u: any) => u.plan !== 'free').length,
        totalGenerations: usersData.reduce((acc: number, u: any) => acc + (u.totalGenerations || 0), 0)
      });
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserPlan = async (userId: string, newPlan: string) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        plan: newPlan,
        updatedAt: serverTimestamp()
      });
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  if (userProfile?.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] text-center p-8 space-y-6">
        <div className="w-24 h-24 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-4 animate-pulse">
          <ShieldCheck className="w-12 h-12" />
        </div>
        <div className="max-w-md space-y-2">
          <h2 className="text-3xl font-black text-white tracking-tight uppercase">Restricted Access</h2>
          <p className="text-zinc-500 font-medium leading-relaxed">
            This workspace requires higher clearance level. If you believe this is an error, contact the system administrator.
          </p>
        </div>
        <button className="px-10 py-4 bg-zinc-900 text-white font-black rounded-3xl text-xs uppercase tracking-widest hover:bg-zinc-800 transition-all border border-zinc-800">
           Request Permission
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto p-4 md:p-8 space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Admin Console</h1>
          <p className="text-zinc-500 font-medium">System-wide control and performance monitoring.</p>
        </div>
        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 px-5 py-2.5 rounded-2xl shadow-xl">
           <Lock className="w-4 h-4 text-red-500" />
           <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Master Authorization Active</span>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Creators', value: stats.totalUsers, icon: Users, color: 'blue' },
          { label: 'Circulating Credits', value: stats.totalCredits.toLocaleString(), icon: CreditCard, color: 'emerald' },
          { label: 'Active Subscriptions', value: stats.activeSubscriptions, icon: Zap, color: 'indigo' },
          { label: 'Total Productions', value: stats.totalGenerations, icon: Activity, color: 'purple' },
        ].map((stat, i) => (
          <div key={i} className="bg-zinc-950 border border-zinc-900 rounded-[2rem] p-8 space-y-4 shadow-2xl relative overflow-hidden group">
            <div className={`absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity`}>
               <stat.icon className="w-32 h-32" />
            </div>
            <div className="flex items-center justify-between relative z-10">
               <div className={`p-3 rounded-2xl bg-${stat.color}-500/10 text-${stat.color}-500`}>
                  <stat.icon className="w-6 h-6" />
               </div>
               <div className="flex items-center gap-1 text-emerald-500 text-[10px] font-black">
                  <ArrowUpRight className="w-3 h-3" /> +12%
               </div>
            </div>
            <div className="relative z-10">
               <p className="text-3xl font-black text-white tracking-tight">{stat.value}</p>
               <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] shadow-2xl overflow-hidden min-h-[600px] flex flex-col">
        {/* Tab Navigation */}
        <div className="flex items-center gap-2 p-4 border-b border-zinc-800 bg-black/40">
          {[
            { id: 'overview', label: 'User Ledger', icon: Users },
            { id: 'plans', label: 'Subscription Plans', icon: Zap },
            { id: 'providers', label: 'AI Providers', icon: Database },
            { id: 'analytics', label: 'Revenue Analytics', icon: BarChart3 },
            { id: 'settings', label: 'Global Config', icon: SettingsIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === tab.id 
                  ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' 
                  : 'text-zinc-500 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 p-8 overflow-y-auto scrollbar-hide">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input 
                      type="text" 
                      placeholder="Search users by name or email..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-black border border-zinc-800 rounded-2xl pl-12 pr-6 py-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all shadow-inner"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="px-5 py-4 bg-zinc-800 text-white rounded-2xl border border-zinc-700 hover:bg-zinc-700 transition-all">
                       <Filter className="w-4 h-4" />
                    </button>
                    <button onClick={fetchData} className="px-5 py-4 bg-zinc-800 text-white rounded-2xl border border-zinc-700 hover:bg-zinc-700 transition-all">
                       <RefreshCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="bg-black border border-zinc-800 rounded-[2rem] overflow-hidden shadow-2xl">
                   <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-zinc-900/30 border-b border-zinc-800">
                            <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">User</th>
                            <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Plan</th>
                            <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Credits</th>
                            <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Role</th>
                            <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-900">
                          {loading ? (
                            [1,2,3,4,5].map(i => (
                              <tr key={i} className="animate-pulse">
                                <td colSpan={5} className="px-8 py-6 h-16 bg-zinc-900/10"></td>
                              </tr>
                            ))
                          ) : users.map((u) => (
                            <tr key={u.id} className="hover:bg-zinc-900/20 transition-colors group">
                              <td className="px-8 py-6">
                                <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 overflow-hidden shrink-0">
                                    {u.photoURL ? <img src={u.photoURL} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-zinc-600"><Users className="w-5 h-5" /></div>}
                                  </div>
                                  <div>
                                    <p className="text-sm font-black text-white">{u.displayName || 'Unnamed'}</p>
                                    <p className="text-xs text-zinc-500 font-medium">{u.email}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-8 py-6">
                                <select 
                                  value={u.plan} 
                                  onChange={(e) => updateUserPlan(u.id, e.target.value)}
                                  className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-[10px] font-black text-indigo-400 uppercase tracking-widest outline-none focus:border-indigo-600"
                                >
                                  <option value="free">Free</option>
                                  <option value="starter">Starter</option>
                                  <option value="creator">Creator</option>
                                  <option value="pro">Pro</option>
                                </select>
                              </td>
                              <td className="px-8 py-6">
                                <span className="text-sm font-black text-white">{(u.credits || 0).toLocaleString()}</span>
                              </td>
                              <td className="px-8 py-6">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter ${u.role === 'admin' ? 'bg-red-500/10 text-red-500' : 'bg-zinc-800 text-zinc-500'}`}>{u.role}</span>
                              </td>
                              <td className="px-8 py-6">
                                <div className="flex items-center gap-2">
                                  <button className="p-2 text-zinc-600 hover:text-white transition-colors"><Edit2 className="w-4 h-4" /></button>
                                  <button className="p-2 text-zinc-600 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                  <button className="p-2 text-zinc-600 hover:text-white transition-colors"><MoreVertical className="w-4 h-4" /></button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                   </div>
                </div>
              </motion.div>
            )}

            {activeTab !== 'overview' && (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                <div className="w-20 h-20 rounded-[2rem] bg-zinc-950 border border-zinc-900 flex items-center justify-center text-indigo-500 shadow-2xl mb-4">
                   <Zap className="w-10 h-10" />
                </div>
                <div className="max-w-md space-y-2">
                  <h3 className="text-2xl font-black text-white tracking-tight uppercase">Feature Expansion in Progress</h3>
                  <p className="text-zinc-500 font-medium leading-relaxed">
                    The {activeTab} administrative tools are being finalized to support the new subscription architecture.
                  </p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
