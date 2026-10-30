import React, { useState } from 'react';
import { 
  Music, 
  Sparkles, 
  Search, 
  Download, 
  Play, 
  Pause, 
  Loader2, 
  Grid,
  Filter,
  Save,
  Plus,
  Radio,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';

const genres = ['Traditional Hindi', 'Epic Orchestral', 'Playful Cartoon', 'Suspenseful', 'Emotional', 'Village Folk'];

export function MusicStudio() {
  const [loading, setLoading] = useState(false);
  const [genre, setGenre] = useState(genres[0]);
  const [duration, setDuration] = useState('1m');
  const [prompt, setPrompt] = useState('');

  const generateMusic = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 3500);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Music className="w-8 h-8 text-indigo-500" />
            Music Studio
          </h1>
          <p className="text-zinc-500">Generate professional cinematic scores and background music for your cartoons.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-6">
            <div className="space-y-4">
              <label className="text-sm font-medium text-zinc-400 block">Musical Direction</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. A flute-heavy peaceful melody for an Indian village scene at sunrise..."
                rows={5}
                className="w-full bg-black border border-zinc-800 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all resize-none text-sm"
              />
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold text-zinc-600 uppercase tracking-widest block">Genre / Style</label>
              <select 
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-indigo-500"
              >
                {genres.map(g => <option key={g}>{g}</option>)}
              </select>
            </div>

            <div className="space-y-6 pt-4 border-t border-zinc-800">
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Tempo (BPM)</label>
                  <select className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 uppercase font-black tracking-widest">
                     <option>Slow (70-90)</option>
                     <option>Moderate (100-120)</option>
                     <option>Fast (140+)</option>
                  </select>
               </div>

               <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Instrument Focus</label>
                  <div className="grid grid-cols-2 gap-2">
                     {['Flute', 'Sitar', 'Tabla', 'Violin'].map(i => (
                       <button key={i} className="px-3 py-2 bg-black border border-zinc-800 rounded-lg text-[9px] font-black text-zinc-500 uppercase tracking-tighter hover:border-indigo-500 hover:text-white transition-all">
                          {i}
                       </button>
                     ))}
                  </div>
               </div>
            </div>

            <button
              onClick={generateMusic}
              disabled={loading || !prompt}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/20"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              Generate Theme
            </button>

            <div className="flex justify-between items-center px-1">
              <span className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">Cost</span>
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">20 Credits</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 min-h-[500px] flex flex-col">
             <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Radio className="w-5 h-5 text-indigo-500" />
                  Generated Score
                </h2>
             </div>

             {loading ? (
               <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 gap-6">
                 <div className="relative">
                   <div className="w-24 h-24 rounded-full border-4 border-zinc-800 flex items-center justify-center">
                     <Music className="w-10 h-10 text-indigo-500 animate-bounce" />
                   </div>
                   <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin" />
                 </div>
                 <div className="text-center">
                   <p className="text-lg font-bold text-white mb-1">Composing Your Score...</p>
                   <p className="text-sm">Synthesizing instruments and arranging melodies.</p>
                 </div>
               </div>
             ) : (
               <div className="flex-1 flex flex-col items-center justify-center text-zinc-700 text-center space-y-6">
                 <div className="w-20 h-20 rounded-full border-4 border-zinc-800 flex items-center justify-center">
                   <Music className="w-10 h-10 text-zinc-800" />
                 </div>
                 <div className="max-w-xs">
                   <p className="font-bold text-zinc-500 mb-1">No Music Generated</p>
                   <p className="text-sm">Enter musical directions on the left to create unique, copyright-free background scores.</p>
                 </div>
               </div>
             )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
                  <Plus className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1 text-sm uppercase tracking-tight">Loop Creator</h4>
                  <p className="text-xs text-zinc-500">Create short 5-10 second seamless loops for ambient background noise.</p>
                </div>
             </div>
             <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                  <Download className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1 text-sm uppercase tracking-tight">Stem Export</h4>
                  <p className="text-xs text-zinc-500">Pro feature: Export individual instrument tracks for final mixing.</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
