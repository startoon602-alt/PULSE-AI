import React, { useState } from 'react';
import { 
  ImageIcon, 
  Sparkles, 
  Upload, 
  Download, 
  Save, 
  Loader2, 
  Maximize, 
  Scissors,
  Wand2,
  RefreshCw,
  LayoutGrid
} from 'lucide-react';
import { motion } from 'framer-motion';

export function ImageStudio() {
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'text' | 'image'>('text');
  const [prompt, setPrompt] = useState('');
  const [ratio, setAspect] = useState('1:1');

  const generate = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <ImageIcon className="w-8 h-8 text-indigo-500" />
            AI Image Studio
          </h1>
          <p className="text-zinc-500">Advanced 2D cartoon image generation and creative editing.</p>
        </div>
        <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800 self-start">
          <button
            onClick={() => setMode('text')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${mode === 'text' ? 'bg-indigo-600 text-white' : 'text-zinc-500'}`}
          >
            Text-to-Image
          </button>
          <button
            onClick={() => setMode('image')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${mode === 'image' ? 'bg-indigo-600 text-white' : 'text-zinc-500'}`}
          >
            Image-to-Image
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-6">
            <div className="space-y-4">
              <label className="text-sm font-medium text-zinc-400 block">Creative Prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. A digital painting of a mystical cave with glowing crystals, 2D cartoon style..."
                rows={5}
                className="w-full bg-black border border-zinc-800 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all resize-none text-sm"
              />
              <button className="flex items-center gap-2 text-[10px] font-black text-indigo-500 uppercase tracking-widest hover:text-indigo-400 transition-colors">
                <Wand2 className="w-3 h-3" /> Enhance Prompt
              </button>
            </div>

            <div className="space-y-4 pt-2 border-t border-zinc-800">
               <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Negative Prompt (Avoid)</label>
               <textarea
                 placeholder="e.g. text, blurry, distorted, low quality, 3D render..."
                 rows={2}
                 className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500/50 transition-all resize-none text-[10px]"
               />
            </div>

            {mode === 'image' && (
              <div className="space-y-4">
                <label className="text-sm font-medium text-zinc-400 block">Source Image</label>
                <div className="aspect-square bg-black border-2 border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-zinc-800/30 transition-all">
                  <Upload className="w-8 h-8 text-zinc-600" />
                  <span className="text-xs text-zinc-500">Upload Reference</span>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <label className="text-xs font-bold text-zinc-600 uppercase tracking-widest block">Settings</label>
              <div className="grid grid-cols-2 gap-3">
                <select className="bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500">
                  <option>1:1 Square</option>
                  <option>16:9 Cinema</option>
                  <option>4:3 Classic</option>
                  <option>9:16 Story</option>
                </select>
                <select className="bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500">
                  <option>1 Variation</option>
                  <option>2 Variations</option>
                  <option>4 Variations</option>
                </select>
              </div>
            </div>

            <button
              onClick={generate}
              disabled={loading || !prompt}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/20"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              Generate Canvas
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex flex-col items-center gap-3 p-4 rounded-3xl bg-zinc-900 border border-zinc-800 hover:border-indigo-500 transition-all">
              <Maximize className="w-5 h-5 text-indigo-500" />
              <span className="text-[10px] font-bold text-white uppercase tracking-tighter">Upscale 4K</span>
            </button>
            <button className="flex flex-col items-center gap-3 p-4 rounded-3xl bg-zinc-900 border border-zinc-800 hover:border-purple-500 transition-all">
              <Scissors className="w-5 h-5 text-purple-500" />
              <span className="text-[10px] font-bold text-white uppercase tracking-tighter">Remove BG</span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 min-h-[600px] flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <LayoutGrid className="w-5 h-5 text-indigo-500" />
                Creative Output
              </h2>
              <button className="p-2 text-zinc-500 hover:text-white transition-colors">
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>

            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-indigo-500" />
                <p className="font-medium animate-pulse">Our AI artist is painting your imagination...</p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-zinc-700 text-center space-y-4">
                <div className="w-24 h-24 rounded-3xl border-4 border-zinc-800 flex items-center justify-center">
                  <ImageIcon className="w-10 h-10" />
                </div>
                <div className="max-w-xs">
                  <p className="font-bold text-zinc-500 mb-1">Canvas is Empty</p>
                  <p className="text-sm">Enter a creative prompt to generate professional 2D cartoon illustrations.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
