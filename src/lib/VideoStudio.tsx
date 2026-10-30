import React, { useState } from 'react';
import { 
  Video, 
  Sparkles, 
  Upload, 
  Play, 
  Download, 
  Loader2, 
  Plus, 
  Clapperboard,
  Layout,
  Settings2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function VideoStudio() {
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'text' | 'image' | 'script'>('text');
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspect] = useState('16:9');
  const [duration, setDuration] = useState('5s');

  const generateVideo = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Video className="w-8 h-8 text-indigo-500" />
            Video Studio
          </h1>
          <p className="text-zinc-500">Produce high-quality 2D cartoon animations from text, images, or scripts.</p>
        </div>
        <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800 self-start">
          {['text', 'image', 'script'].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m as any)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-widest ${
                mode === m ? 'bg-indigo-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {m}-to-Video
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Production Controls */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-6">
            <div className="space-y-4">
              <label className="text-sm font-medium text-zinc-400 block">
                {mode === 'text' ? 'Scene Description' : mode === 'image' ? 'Animation Prompt' : 'Paste Script'}
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={mode === 'script' ? "Paste your scene-by-scene script here..." : "e.g. A character walking through a vibrant Indian village market, 2D cartoon style..."}
                rows={mode === 'script' ? 10 : 5}
                className="w-full bg-black border border-zinc-800 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all resize-none"
              />
            </div>

            {mode === 'image' && (
              <div className="space-y-4">
                <label className="text-sm font-medium text-zinc-400 block">Reference Image</label>
                <div className="aspect-video bg-black border-2 border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-zinc-800/30 transition-all group">
                  <Upload className="w-8 h-8 text-zinc-600 group-hover:text-indigo-500 transition-colors" />
                  <span className="text-xs text-zinc-500">Upload character or background</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Aspect Ratio</label>
                <select 
                  value={aspectRatio}
                  onChange={(e) => setAspect(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
                >
                  <option>16:9 Landscape</option>
                  <option>9:16 Portrait</option>
                  <option>1:1 Square</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Duration</label>
                <select 
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
                >
                  <option>5 Seconds</option>
                  <option>10 Seconds</option>
                </select>
              </div>
            </div>

            <div className="space-y-6 pt-4 border-t border-zinc-800">
               <div className="space-y-3">
                  <div className="flex justify-between text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                    <span>Motion Intensity</span>
                    <span className="text-indigo-500">Medium</span>
                  </div>
                  <input type="range" min="0" max="10" className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
               </div>

               <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Camera Movement</label>
                  <select className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 uppercase font-black tracking-widest">
                     <option>Static</option>
                     <option>Zoom In</option>
                     <option>Zoom Out</option>
                     <option>Pan Left</option>
                     <option>Pan Right</option>
                     <option>Tilt Up</option>
                  </select>
               </div>

               <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Animation Style</label>
                  <div className="grid grid-cols-2 gap-2">
                     {['Traditional', 'Digital', '3D Stylized', 'Anime'].map(s => (
                       <button key={s} className="px-3 py-2 bg-black border border-zinc-800 rounded-lg text-[9px] font-black text-zinc-500 uppercase tracking-tighter hover:border-indigo-500 hover:text-white transition-all">
                          {s}
                       </button>
                     ))}
                  </div>
               </div>
            </div>

            <button
              onClick={generateVideo}
              disabled={loading || !prompt}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/20"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              Generate Animation
            </button>

            <div className="pt-4 border-t border-zinc-800">
              <div className="flex justify-between items-center px-1">
                <span className="text-xs text-zinc-500 font-medium">Estimated Cost</span>
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">50 Credits</span>
              </div>
            </div>
          </div>

          <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
            <p className="text-xs text-amber-200/60 leading-relaxed">
              Video generation is an expensive AI operation. Pro users get priority processing and higher resolution options.
            </p>
          </div>
        </div>

        {/* Preview & Output */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 min-h-[500px] flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Clapperboard className="w-5 h-5 text-indigo-500" />
                Production Preview
              </h2>
              <div className="flex gap-2">
                <button className="p-2 text-zinc-500 hover:text-white transition-colors">
                  <Layout className="w-5 h-5" />
                </button>
                <button className="p-2 text-zinc-500 hover:text-white transition-colors">
                  <Settings2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 gap-6">
                <div className="relative">
                  <Loader2 className="w-16 h-16 animate-spin text-indigo-600" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Video className="w-6 h-6 text-indigo-400" />
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <p className="text-lg font-bold text-white animate-pulse">Rendering Scene...</p>
                  <p className="text-sm max-w-xs">Our AI is stitching together frames for your 2D animation.</p>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-zinc-700 text-center space-y-6">
                <div className="w-32 h-32 rounded-full border-4 border-zinc-800 flex items-center justify-center bg-black shadow-2xl">
                  <Play className="w-12 h-12 text-zinc-800 fill-zinc-800" />
                </div>
                <div className="max-w-md">
                  <h3 className="text-white font-bold text-lg mb-2">No Animation Rendered</h3>
                  <p className="text-zinc-500 text-sm">
                    Enter your scene details on the left to begin the production. 
                    You can generate scene-by-scene or upload a full script.
                  </p>
                </div>
                <button className="px-8 py-3 bg-zinc-800 text-white font-bold rounded-xl hover:bg-zinc-700 transition-all border border-zinc-700">
                  Import Reference Asset
                </button>
              </div>
            )}
          </div>

          {/* Scene List Placeholder */}
          <div className="space-y-4">
            <h3 className="text-white font-bold flex items-center gap-2">
              <Plus className="w-4 h-4 text-indigo-500" />
              Scene Queue
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-video bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-zinc-700 group cursor-pointer hover:border-indigo-500 transition-all">
                  <div className="flex flex-col items-center gap-1">
                    <Clapperboard className="w-6 h-6" />
                    <span className="text-[10px] font-black uppercase tracking-tighter">Scene {i}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
