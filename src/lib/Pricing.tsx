import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Sparkles, 
  Zap, 
  Rocket, 
  Crown, 
  ShieldCheck, 
  ArrowRight,
  ChevronRight,
  Star,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from './AuthProvider';

interface Plan {
  id: string;
  name: string;
  price: { monthly: number; yearly: number };
  description: string;
  features: string[];
  credits: number;
  icon: React.ElementType;
  color: string;
  popular?: boolean;
}

const plans: Plan[] = [
  {
    id: 'free',
    name: 'FREE',
    price: { monthly: 0, yearly: 0 },
    description: 'Perfect for beginners exploring AI cartoon production.',
    credits: 5000,
    icon: Star,
    color: 'zinc',
    features: [
      'Account dashboard',
      'Basic Story Studio access',
      'Limited story generation',
      'Basic Hindi narration',
      'Basic character creation',
      'Basic background generation',
      'Basic AI image generation',
      'Standard export options',
      'Community support'
    ]
  },
  {
    id: 'starter',
    name: 'STARTER',
    price: { monthly: 299, yearly: 2990 },
    description: 'For growing creators who need more power and speed.',
    credits: 15000,
    icon: Zap,
    color: 'blue',
    features: [
      'Everything in FREE, plus:',
      'Higher monthly credits',
      'More story generations',
      'Advanced story editing',
      'More Hindi voice styles',
      'Additional character variations',
      'Priority support queue',
      'More generation history'
    ]
  },
  {
    id: 'creator',
    name: 'CREATOR',
    price: { monthly: 599, yearly: 5990 },
    description: 'The ultimate toolkit for serious animation series.',
    credits: 40000,
    icon: Rocket,
    color: 'purple',
    popular: true,
    features: [
      'Everything in STARTER, plus:',
      'Advanced Story Studio workflow',
      'Character Voice Lock',
      'Advanced Background Generator',
      'Timeline Editor access',
      'Lip Sync Studio',
      'Music & SFX Studio',
      'Watermark Editor'
    ]
  },
  {
    id: 'pro',
    name: 'PULSE AI PRO',
    price: { monthly: 999, yearly: 9990 },
    description: 'Complete production suite for professional studios.',
    credits: 100000,
    icon: Crown,
    color: 'indigo',
    features: [
      'Everything in CREATOR, plus:',
      'Access to ALL available studios',
      'Highest generation priority',
      'Maximum project storage',
      'Advanced character consistency',
      'Bulk project organization',
      'Early access to features',
      'Dedicated account manager'
    ]
  }
];

export function Pricing() {
  const { user, userProfile } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState<string | null>(null);

  const handleUpgrade = async (planId: string) => {
    if (!user) return;
    if (planId === 'free' || userProfile?.plan === planId) return;

    setLoading(planId);
    try {
      const res = await fetch('/api/subscriptions/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.uid,
          planId,
          billingCycle
        }),
      });
      const data = await res.json();
      if (data.success) {
        window.location.reload(); // Refresh to update profile across app
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(null);
    }
  };

  const getPlanColor = (color: string) => {
    switch (color) {
      case 'blue': return 'from-blue-600 to-cyan-600 border-blue-500/50 shadow-blue-500/20';
      case 'purple': return 'from-purple-600 to-pink-600 border-purple-500/50 shadow-purple-500/20';
      case 'indigo': return 'from-indigo-600 to-violet-600 border-indigo-500/50 shadow-indigo-500/20';
      default: return 'from-zinc-800 to-zinc-900 border-zinc-700 shadow-zinc-900/50';
    }
  };

  const getBadgeColor = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-500 text-white';
      case 'purple': return 'bg-purple-500 text-white';
      case 'indigo': return 'bg-indigo-500 text-white';
      default: return 'bg-zinc-700 text-zinc-300';
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto p-4 md:p-8 space-y-16 py-20">
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black uppercase tracking-widest"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Production-Ready Plans
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-black text-white tracking-tighter"
        >
          CHOOSE YOUR <br />
          <span className="text-indigo-500">PRODUCTION POWER.</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-zinc-500 text-xl font-medium"
        >
          Scale your Hindi cartoon channel with our advanced AI animation engine. 
          Save 20% with yearly billing.
        </motion.p>
      </div>

      {/* Billing Switch */}
      <div className="flex items-center justify-center gap-4">
        <span className={`text-sm font-black uppercase tracking-widest transition-colors ${billingCycle === 'monthly' ? 'text-white' : 'text-zinc-600'}`}>Monthly</span>
        <button 
          onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
          className="w-16 h-8 bg-zinc-900 border border-zinc-800 rounded-full p-1 relative transition-colors hover:border-indigo-500"
        >
          <motion.div 
            animate={{ x: billingCycle === 'monthly' ? 0 : 32 }}
            className="w-6 h-6 bg-indigo-600 rounded-full shadow-lg"
          />
        </button>
        <span className={`text-sm font-black uppercase tracking-widest transition-colors ${billingCycle === 'yearly' ? 'text-white' : 'text-zinc-600'}`}>Yearly (Save 20%)</span>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`flex flex-col bg-zinc-950 border-2 rounded-[2.5rem] p-8 relative overflow-hidden transition-all duration-500 group hover:translate-y-[-8px] ${
              plan.popular ? 'border-indigo-600 shadow-2xl shadow-indigo-600/20' : 'border-zinc-900 hover:border-zinc-700'
            }`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 p-6">
                <div className="px-4 py-1 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-xl">
                  Most Popular
                </div>
              </div>
            )}

            <div className="space-y-6 flex-1">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getPlanColor(plan.color)} flex items-center justify-center text-white mb-6 shadow-xl`}>
                <plan.icon className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl font-black text-white tracking-tight">{plan.name}</h3>
                <p className="text-zinc-500 text-sm font-medium leading-relaxed">{plan.description}</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">₹{billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly}</span>
                <span className="text-zinc-500 text-sm font-bold uppercase tracking-widest">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
              </div>

              <div className="pt-6 space-y-4">
                <div className="flex items-center gap-3 p-3 bg-zinc-900/50 rounded-2xl border border-zinc-800/50">
                  <Sparkles className="w-5 h-5 text-indigo-400" />
                  <div>
                    <p className="text-xs font-black text-white uppercase tracking-widest">{plan.credits.toLocaleString()}</p>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase">Production Credits</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {plan.features.map((feature, fi) => (
                    <div key={fi} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                      <span className="text-xs text-zinc-400 font-medium leading-tight">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-10">
              <button 
                onClick={() => handleUpgrade(plan.id)}
                disabled={userProfile?.plan === plan.id || !!loading}
                className={`w-full py-5 rounded-3xl font-black uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-3 active:scale-[0.98] ${
                  userProfile?.plan === plan.id 
                    ? 'bg-zinc-900 text-zinc-500 cursor-not-allowed border border-zinc-800' 
                    : plan.popular 
                      ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-xl shadow-indigo-600/30' 
                      : 'bg-white text-black hover:bg-zinc-200'
                }`}
              >
                {loading === plan.id ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {userProfile?.plan === plan.id ? 'Current Plan' : 'Select Plan'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Comparison Section */}
      <div className="pt-20 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-black text-white tracking-tight uppercase">Full Feature Comparison</h2>
          <p className="text-zinc-500 max-w-xl mx-auto">Compare every studio and limit to find the right fit for your channel.</p>
        </div>

        <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-900/30">
                <th className="px-8 py-6 text-xs font-black text-zinc-500 uppercase tracking-widest">Features</th>
                <th className="px-8 py-6 text-xs font-black text-zinc-500 uppercase tracking-widest text-center">Free</th>
                <th className="px-8 py-6 text-xs font-black text-zinc-500 uppercase tracking-widest text-center">Starter</th>
                <th className="px-8 py-6 text-xs font-black text-zinc-500 uppercase tracking-widest text-center">Creator</th>
                <th className="px-8 py-6 text-xs font-black text-indigo-500 uppercase tracking-widest text-center">Pro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {[
                { name: 'Story Studio', free: 'Basic', starter: 'Standard', creator: 'Advanced', pro: 'Full Access' },
                { name: 'Voice Studio', free: 'Basic', starter: 'Advanced', creator: 'Premium', pro: 'Unlimited Control' },
                { name: 'Character Studio', free: 'Basic', starter: 'Standard', creator: 'Advanced', pro: 'Consistency Locked' },
                { name: 'Video Studio', free: '—', starter: '—', creator: 'Standard', pro: 'Full Studio' },
                { name: 'Timeline Editor', free: '—', starter: '—', creator: 'Standard', pro: 'Advanced' },
                { name: 'Processing Priority', free: 'Normal', starter: 'High', creator: 'High', pro: 'Highest' },
                { name: 'Export Quality', free: '720p', starter: '1080p', creator: '4K', pro: 'Lossless' },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-zinc-900/10 transition-colors">
                  <td className="px-8 py-6 text-sm font-bold text-white">{row.name}</td>
                  <td className="px-8 py-6 text-xs font-medium text-zinc-500 text-center">{row.free}</td>
                  <td className="px-8 py-6 text-xs font-medium text-zinc-400 text-center">{row.starter}</td>
                  <td className="px-8 py-6 text-xs font-medium text-zinc-300 text-center">{row.creator}</td>
                  <td className="px-8 py-6 text-xs font-black text-indigo-400 text-center">{row.pro}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-20 border-t border-zinc-900">
        <div className="flex items-center gap-6 p-8 bg-zinc-900/20 rounded-[2rem] border border-zinc-900/50">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 shrink-0">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-white font-black text-lg uppercase tracking-tight">Secure Billing</h4>
            <p className="text-xs text-zinc-500 font-medium">Industry-standard encryption for all transactions.</p>
          </div>
        </div>
        <div className="flex items-center gap-6 p-8 bg-zinc-900/20 rounded-[2rem] border border-zinc-900/50">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-white font-black text-lg uppercase tracking-tight">Fair Use AI</h4>
            <p className="text-xs text-zinc-500 font-medium">Transparent monthly limits on compute-heavy tasks.</p>
          </div>
        </div>
        <div className="flex items-center gap-6 p-8 bg-zinc-900/20 rounded-[2rem] border border-zinc-900/50">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
            <Star className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-white font-black text-lg uppercase tracking-tight">24/7 Support</h4>
            <p className="text-xs text-zinc-500 font-medium">Priority queue for Creator and Pro members.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
