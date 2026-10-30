import React, { useState } from 'react';
import { AuthProvider, useAuth } from './lib/AuthProvider';
import { Sidebar } from './lib/Sidebar';
import { Dashboard } from './lib/Dashboard';
import { Sparkles, Play, Shield, Zap, ArrowRight, Video, Mic2, PenTool } from 'lucide-react';
import { motion } from 'framer-motion';

function LandingPage() {
  const { signIn } = useAuth();

  return (
    <div className="min-h-screen bg-black text-white selection:bg-indigo-500 selection:text-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">PULSE AI</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <a href="#" className="hover:text-white transition-colors">Features</a>
          <a href="#" className="hover:text-white transition-colors">Pricing</a>
          <a href="#" className="hover:text-white transition-colors">Showcase</a>
        </div>
        <button 
          onClick={signIn}
          className="px-6 py-2.5 rounded-full bg-white text-black font-bold text-sm hover:bg-zinc-200 transition-all active:scale-95"
        >
          Sign In
        </button>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/20 blur-[120px] -z-10 rounded-full" />
          
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-medium"
            >
              <Zap className="w-3 h-3 text-indigo-500 fill-indigo-500" />
              The Future of Cartoon Production
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]"
            >
              CRAFT HINDI CARTOONS <br />
              <span className="text-indigo-600">WITH AI POWER.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-zinc-500 max-w-2xl mx-auto leading-relaxed"
            >
              All-in-one production studio for creators. Generate scripts, voices, 
              characters, and 2D animations in minutes. Optimized for Hindi moral stories.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6"
            >
              <button 
                onClick={signIn}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 shadow-2xl shadow-indigo-600/40 active:scale-95"
              >
                Start Creating Free
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-zinc-900 text-white font-bold hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 border border-zinc-800 active:scale-95">
                <Play className="w-4 h-4 fill-white" />
                Watch Demo
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-24 px-6 bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4 hover:border-indigo-500/50 transition-colors group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                <PenTool className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Story Studio</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Generate compelling moral stories and scripts in Hindi. Our AI understands village settings and cultural nuances.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4 hover:border-purple-500/50 transition-colors group">
              <div className="w-12 h-12 rounded-2xl bg-purple-600/10 flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
                <Mic2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Voice Studio</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Over 50+ character voices. From wise grandmothers to playful kids, get the perfect Hindi voiceover instantly.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4 hover:border-blue-500/50 transition-colors group">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                <Video className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Animation Studio</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Transform images and text into professional 2D cartoon animations. Consistent character movements and expressions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Safety */}
      <section className="py-20 px-6 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 text-zinc-500">
          <div className="flex items-center gap-4">
            <Shield className="w-10 h-10 text-indigo-500/20" />
            <div>
              <h4 className="text-white font-bold">Commercial Use</h4>
              <p className="text-xs">Full rights to all generated content for YouTube.</p>
            </div>
          </div>
          <div className="h-px w-full md:w-px md:h-12 bg-zinc-900" />
          <div className="flex items-center gap-4 text-center md:text-left">
            <Zap className="w-10 h-10 text-indigo-500/20" />
            <div>
              <h4 className="text-white font-bold">10x Production Speed</h4>
              <p className="text-xs">From script to final video in hours, not weeks.</p>
            </div>
          </div>
          <div className="h-px w-full md:w-px md:h-12 bg-zinc-900" />
          <div className="flex items-center gap-4">
            <Sparkles className="w-10 h-10 text-indigo-500/20" />
            <div>
              <h4 className="text-white font-bold">Free Credits</h4>
              <p className="text-xs">100 monthly credits for every new creator.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-8 border-t border-zinc-900 max-w-7xl mx-auto text-zinc-600 text-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2 grayscale opacity-50">
          <div className="w-6 h-6 rounded bg-zinc-800 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-zinc-400" />
          </div>
          <span className="font-bold">PULSE AI</span>
        </div>
        <div className="flex gap-8">
          <a href="#" className="hover:text-white">Terms</a>
          <a href="#" className="hover:text-white">Privacy</a>
          <a href="#" className="hover:text-white">Contact</a>
        </div>
        <p>© 2026 PULSE AI Studio. All rights reserved.</p>
      </footer>
    </div>
  );
}

import { StoryStudio } from './lib/StoryStudio';
import { CharacterStudio } from './lib/CharacterStudio';
import { BackgroundGenerator } from './lib/BackgroundGenerator';
import { VoiceStudio } from './lib/VoiceStudio';
import { ProjectManager } from './lib/ProjectManager';
import { AssetLibrary } from './lib/AssetLibrary';
import { GenerationHistory } from './lib/GenerationHistory';
import { CreditHistory } from './lib/CreditHistory';
import { AdminDashboard } from './lib/AdminDashboard';
import { VideoStudio } from './lib/VideoStudio';
import { PngGenerator } from './lib/PngGenerator';
import { ImageStudio } from './lib/ImageStudio';
import { TimelineEditor } from './lib/TimelineEditor';
import { LipSyncStudio } from './lib/LipSyncStudio';
import { SubtitleStudio } from './lib/SubtitleStudio';
import { SfxStudio } from './lib/SfxStudio';
import { MusicStudio } from './lib/MusicStudio';
import { ThumbnailMaker } from './lib/ThumbnailMaker';
import { WatermarkEditor } from './lib/WatermarkEditor';
import { Settings } from './lib/Settings';
import { Support } from './lib/Support';
import { Pricing } from './lib/Pricing';
import { Menu, X } from 'lucide-react';

function MainApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard setActiveTab={setActiveTab} />;
      case 'story':
        return <StoryStudio />;
      case 'voice':
        return <VoiceStudio />;
      case 'video':
        return <VideoStudio />;
      case 'character':
        return <CharacterStudio />;
      case 'background':
        return <BackgroundGenerator />;
      case 'png':
        return <PngGenerator />;
      case 'image':
        return <ImageStudio />;
      case 'timeline':
        return <TimelineEditor />;
      case 'lipsync':
        return <LipSyncStudio />;
      case 'subtitle':
        return <SubtitleStudio />;
      case 'sfx':
        return <SfxStudio />;
      case 'music':
        return <MusicStudio />;
      case 'thumbnail':
        return <ThumbnailMaker />;
      case 'watermark':
        return <WatermarkEditor />;
      case 'projects':
        return <ProjectManager onOpenProject={(id) => { console.log('Open', id); setActiveTab('timeline'); }} />;
      case 'assets':
        return <AssetLibrary />;
      case 'history':
        return <GenerationHistory />;
      case 'credits':
        return <CreditHistory />;
      case 'pricing':
        return <Pricing />;
      case 'settings':
        return <Settings />;
      case 'help':
        return <Support />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)] text-center p-8">
            <div className="w-20 h-20 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-indigo-500 mb-6">
              <Sparkles className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('-', ' ')}</h2>
            <p className="text-zinc-500 max-w-md">
              We're currently building out this professional production workspace. 
              Stay tuned for the full release of the {activeTab.replace('-', ' ')}!
            </p>
            <button 
              onClick={() => setActiveTab('dashboard')}
              className="mt-8 px-6 py-2.5 rounded-xl bg-zinc-900 text-white font-medium hover:bg-zinc-800 border border-zinc-800 transition-all"
            >
              Back to Dashboard
            </button>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-black text-zinc-300">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />
      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
        <header className="h-16 border-b border-zinc-900 flex items-center justify-between px-4 md:px-8 bg-black/50 backdrop-blur-xl sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 text-zinc-400 hover:text-white md:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-zinc-500 hidden sm:inline">Workspace /</span>
              <span className="text-sm font-bold text-white uppercase tracking-wider">{activeTab.replace('-', ' ')}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="hidden sm:flex p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-all relative">
              <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-zinc-900" />
              <Zap className="w-5 h-5" />
            </button>
            <div className="h-8 w-px bg-zinc-900 hidden sm:block" />
            <div className="flex items-center gap-3 bg-zinc-900/50 border border-zinc-800/50 rounded-full pl-2 pr-4 py-1">
              <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs font-bold text-white tracking-wide">PULSE PRO</span>
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto overflow-x-hidden bg-[#050505]">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center"
        >
          <Sparkles className="w-6 h-6 text-white" />
        </motion.div>
      </div>
    );
  }

  return user ? <MainApp /> : <LandingPage />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
