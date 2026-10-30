import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  RefreshCcw, 
  Sparkles, 
  Gift, 
  Loader2,
  Clock,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from './AuthProvider';
import { db } from './firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';

export function CreditHistory() {
  const { user, userProfile } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'balance' | 'plans'>('balance');

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  const fetchTransactions = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, 'transactions'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc'),
        limit(50)
      );
      const querySnapshot = await getDocs(q);
      setTransactions(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-indigo-500" />
            Credits & Billing
          </h1>
          <p className="text-zinc-500">Manage your production balance and transaction history.</p>
        </div>
        <div className="flex p-1 bg-zinc-900 rounded-xl border border-zinc-800">
           <button 
             onClick={() => setView('balance')}
             className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${view === 'balance' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500'}`}
           >
             Transactions
           </button>
           <button 
             onClick={() => setView('plans')}
             className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${view === 'plans' ? 'bg-indigo-600 text-white shadow-lg' : 'text-zinc-500'}`}
           >
             Upgrade to Pro
           </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {view === 'balance' ? (
          <motion.div 
            key="balance"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Balance Card */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-600/20">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <CreditCard className="w-40 h-40" />
                </div>
                <div className="relative z-10 space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-bold uppercase tracking-widest opacity-80 mb-1">Total Balance</p>
                      <p className="text-5xl font-black tracking-tighter">{userProfile?.credits || 0}</p>
                    </div>
                    <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                      <Sparkles className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="pt-6 flex gap-3">
                    <button 
                      onClick={() => setView('plans')}
                      className="flex-1 py-4 bg-white text-indigo-600 font-bold rounded-2xl hover:bg-zinc-100 transition-all active:scale-95 shadow-xl text-sm"
                    >
                      Buy Credits
                    </button>
                    <button className="flex-1 py-4 bg-indigo-500/30 text-white font-bold rounded-2xl hover:bg-indigo-500/40 border border-white/10 transition-all active:scale-95 text-sm">
                      Redeem
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
                <h3 className="text-white font-bold mb-4">Subscription Plan</h3>
                <div className="flex items-center justify-between p-4 bg-black rounded-2xl border border-zinc-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Starter Pack</p>
                      <p className="text-xs text-zinc-500">Free Tier</p>
                    </div>
                  </div>
                  <button onClick={() => setView('plans')} className="text-xs font-bold text-indigo-400 hover:underline">Change</button>
                </div>
              </div>
            </div>

            {/* Transaction History */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-indigo-500" />
                  Recent Ledger
                </h2>
                <button onClick={fetchTransactions} className="p-2 text-zinc-500 hover:text-white transition-colors">
                  <RefreshCcw className="w-4 h-4" />
                </button>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <Loader2 className="w-12 h-12 animate-spin text-indigo-500" />
                  <p className="text-zinc-500 font-medium">Syncing ledger...</p>
                </div>
              ) : transactions.length > 0 ? (
                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-zinc-800">
                          <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Type</th>
                          <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Description</th>
                          <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((tx) => (
                          <tr key={tx.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                            <td className="px-6 py-4">
                              <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-tighter ${
                                tx.amount > 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                              }`}>
                                {tx.amount > 0 ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                                {tx.type}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm text-zinc-400 font-medium max-w-xs truncate">{tx.description}</p>
                            </td>
                            <td className={`px-6 py-4 text-sm font-bold text-right ${tx.amount > 0 ? 'text-emerald-500' : 'text-white'}`}>
                              {tx.amount > 0 ? '+' : ''}{tx.amount}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-4">
                  <Gift className="w-12 h-12 text-zinc-800" />
                  <p className="text-zinc-500 font-medium">No transactions found in your history.</p>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="plans"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 py-10"
          >
            {/* Free Plan */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-8 flex flex-col">
               <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">Free Plan</h3>
                  <p className="text-zinc-500 text-sm">Perfect for beginners exploring AI cartoon production.</p>
               </div>
               <div className="text-4xl font-black text-white">₹0 <span className="text-sm font-normal text-zinc-500">/mo</span></div>
               <ul className="space-y-4 flex-1">
                  {['5,000 Starting Credits', 'Standard Generation Queue', 'Basic Project Management', 'Access to Free Tools'].map(f => (
                    <li key={f} className="flex items-center gap-3 text-sm text-zinc-300">
                       <CheckCircle2 className="w-4 h-4 text-indigo-500" /> {f}
                    </li>
                  ))}
               </ul>
               <button disabled className="w-full py-4 bg-zinc-800 text-zinc-500 font-bold rounded-2xl cursor-not-allowed">Current Plan</button>
            </div>

            {/* Pro Plan */}
            <div className="bg-indigo-600/10 border-2 border-indigo-500 rounded-3xl p-8 space-y-8 flex flex-col relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4">
                  <div className="px-3 py-1 bg-indigo-500 rounded-full text-[10px] font-black text-white uppercase tracking-widest">Most Popular</div>
               </div>
               <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">PULSE AI PRO</h3>
                  <p className="text-indigo-200/60 text-sm">For professional creators producing multiple series per month.</p>
               </div>
               <div className="text-4xl font-black text-white">₹999 <span className="text-sm font-normal text-indigo-200/60">/mo</span></div>
               <ul className="space-y-4 flex-1">
                  {[
                    'Priority Generation Queue', 
                    'Higher Generation Limits', 
                    'Advanced Studio Tools', 
                    'Unlimited Project Storage',
                    '24/7 Priority Support',
                    'Custom Character Training'
                  ].map(f => (
                    <li key={f} className="flex items-center gap-3 text-sm text-white">
                       <Sparkles className="w-4 h-4 text-indigo-400" /> {f}
                    </li>
                  ))}
               </ul>
               <button className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 active:scale-95">Upgrade to Pro</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
