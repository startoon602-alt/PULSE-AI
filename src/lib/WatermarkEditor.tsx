import React, { useState } from 'react';
import { 
  Eraser, 
  Sparkles, 
  Video, 
  Upload, 
  Download, 
  Loader2, 
  Play, 
  Scissors, 
  Square,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

export function WatermarkEditor() {
  const [loading, setLoading] = useState(false);

  const processVideo = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 4000);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Eraser className="w-8 h-8 text-indigo-500" />
            Watermark Editor
          </h1>
          <p className="text-zinc-500">Intelligently remove or replace watermarks from your authorized video production files.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-8">
            <div className="space-y-4">
              <label className="text-sm font-medium text-zinc-400 block">Source Video</label>
              <div className="aspect-video bg-black border-2 border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-zinc-800/30 transition-all">
                <Video className="w-8 h-8 text-zinc-600" />
                <span className="text-xs text-zinc-500">Upload Video File</span>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-zinc-800">
               <h3 className="text-white font-bold flex items-center gap-2 text-sm uppercase tracking-wider">
                <Scissors className="w-4 h-4 text-indigo-500" />
                Editing Mode
              </h3>
              <div className="grid grid-cols-2 gap-2">
                 <button className="p-3 bg-indigo-600 text-white rounded-xl text-[10px] font-bold shadow-lg shadow-indigo-600/20">AI Inpainting</button>
                 <button className="p-3 bg-black border border-zinc-800 text-zinc-400 rounded-xl text-[10px] font-bold">Blur Area</button>
              </div>
            </div>

            <div className="space-y-4 pt-2">
               <div className="flex justify-between text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                  <span>Cleaning Intensity</span>
                  <span className="text-indigo-500">Fine-Tune</span>
               </div>
               <input type="range" min="0" max="100" className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
            </div>

            <div className="space-y-3">
               <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Restoration Mode</label>
               <select className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 uppercase font-black tracking-widest">
                  <option>Static (Uniform)</option>
                  <option>Temporal (Moving)</option>
                  <option>Deep Flow (Complex)</option>
               </select>
            </div>

            <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-2xl flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <p className="text-[10px] text-red-200/60 leading-relaxed font-medium uppercase tracking-tight">
                Warning: Ensure you have legal rights to modify the uploaded video content. PULSE AI does not support unauthorized copyright removal.
              </p>
            </div>

            <button
              onClick={processVideo}
              disabled={loading}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/20"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              Process AI Cleanup
            </button>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 min-h-[500px] flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Square className="w-5 h-5 text-indigo-500" />
                Area Selection
              </h2>
              <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                 <ShieldCheck className="w-3 h-3" /> Area Verified
              </div>
            </div>

            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-indigo-500" />
                <p className="font-medium animate-pulse text-lg text-white">Synthesizing frames...</p>
                <p className="text-sm max-w-xs text-center">Removing unwanted overlays and restoring background pixels.</p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-zinc-700 text-center space-y-6">
                <div className="aspect-video w-full max-w-xl bg-black border-4 border-zinc-800 rounded-2xl flex items-center justify-center relative overflow-hidden group">
                  <Play className="w-12 h-12 text-zinc-800 fill-zinc-800" />
                  {/* Mock selection box */}
                  <div className="absolute top-4 right-4 w-24 h-12 border-2 border-indigo-500 bg-indigo-500/10 flex items-center justify-center cursor-move">
                     <span className="text-[8px] font-black text-indigo-400 uppercase tracking-tighter">Cleaning Area</span>
                  </div>
                </div>
                <div className="max-w-xs">
                  <p className="font-bold text-zinc-500 mb-1">Preview Workstation</p>
                  <p className="text-sm">Upload a video and drag the selection box over the watermark to begin processing.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
