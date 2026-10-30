import React, { useState } from 'react';
import { 
  Smile, 
  Sparkles, 
  Upload, 
  Play, 
  Download, 
  Loader2, 
  UserCircle2,
  Mic2,
  Settings,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

export function LipSyncStudio() {
  const [loading, setLoading] = useState(false);

  const generate = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Smile className="w-8 h-8 text-indigo-500" />
            Lip Sync Studio
          </h1>
          <p className="text-zinc-500">Automatically sync character mouth movements with your audio recordings.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-8">
            <div className="space-y-4">
              <label className="text-sm font-medium text-zinc-400 block">Character Image/Video</label>
              <div className="aspect-square bg-black border-2 border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-zinc-800/30 transition-all">
                <UserCircle2 className="w-10 h-10 text-zinc-600" />
                <span className="text-xs text-zinc-500">Upload Character</span>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-medium text-zinc-400 block">Audio File</label>
              <div className="p-6 bg-black border-2 border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-zinc-800/30 transition-all">
                <Mic2 className="w-8 h-8 text-zinc-600" />
                <span className="text-xs text-zinc-500">Upload Dialogue (MP3/WAV)</span>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-zinc-800">
              <h3 className="text-white font-bold flex items-center gap-2 text-sm">
                <Settings className="w-4 h-4 text-indigo-500" />
                Sync Settings
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between text-xs font-bold text-zinc-500 uppercase tracking-widest">
                  <span>Sync Intensity</span>
                  <span className="text-indigo-500 font-black">85%</span>
                </div>
                <input type="range" min="0" max="100" className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
              </div>

              <div className="space-y-3">
                 <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Mouth Shape</label>
                 <select className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 uppercase font-black tracking-widest">
                    <option>Natural (Soft)</option>
                    <option>Cartoon (Exaggerated)</option>
                    <option>Minimalist</option>
                 </select>
              </div>

              <div className="space-y-3">
                 <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Processing FPS</label>
                 <select className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 uppercase font-black tracking-widest">
                    <option>24 FPS (Standard)</option>
                    <option>30 FPS (Smooth)</option>
                    <option>60 FPS (Pro)</option>
                 </select>
              </div>
            </div>

            <button
              onClick={generate}
              disabled={loading}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/20"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              Generate Lip Sync
            </button>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 min-h-[500px] flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-white">Result Preview</h2>
            </div>

            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-indigo-500" />
                <p className="font-medium animate-pulse">Analyzing phonemes and mapping movements...</p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-zinc-700 text-center space-y-6">
                <div className="w-32 h-32 rounded-3xl border-4 border-zinc-800 flex items-center justify-center bg-black">
                  <Play className="w-10 h-10 text-zinc-800 fill-zinc-800" />
                </div>
                <div className="max-w-xs">
                  <p className="font-bold text-zinc-500 mb-1">No Sync Generated</p>
                  <p className="text-sm">Upload your character and dialogue on the left to create an animated talking head.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
