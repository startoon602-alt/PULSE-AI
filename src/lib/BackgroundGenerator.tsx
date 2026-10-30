import React, { useState } from 'react';
import { 
  ImageIcon, 
  Sparkles, 
  Search, 
  Download, 
  Save,
  Loader2,
  Filter,
  Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const backgroundCategories = [
  'Village', 'City', 'Market', 'Shop', 'House', 'Kitchen', 'Bedroom', 
  'Forest', 'River', 'Mountain', 'Palace', 'Haunted House', 'School', 'Farm'
];

const timeOfDay = ['Day', 'Night', 'Golden Hour', 'Rainy', 'Sunset'];

export function BackgroundGenerator() {
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [category, setCategory] = useState(backgroundCategories[0]);
  const [time, setTime] = useState(timeOfDay[0]);
  const [results, setResults] = useState<string[]>([]);

  const generateBackground = async () => {
    if (!prompt) return;
    setLoading(true);
    try {
      const res = await fetch('/api/image/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: 'test-user', // In real app, get from auth
          prompt, 
          category, 
          style: 'Digital Painting', 
          time,
          aspect: "16:9"
        }),
      });
      const data = await res.json();
      if (data.images) {
        setResults(data.images.map((img: string) => img.startsWith('http') ? img : `data:image/png;base64,${img}`));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <ImageIcon className="w-8 h-8 text-indigo-500" />
            Background Generator
          </h1>
          <p className="text-zinc-500">Professional hand-painted 2D digital backgrounds for your scenes.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Controls */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-6">
            <div className="space-y-4">
              <label className="text-sm font-medium text-zinc-400 block">Prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. A peaceful Indian village scene with mud houses and a big banyan tree, afternoon sun..."
                rows={4}
                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all resize-none"
              />
            </div>

            <div className="space-y-4">
              <label className="text-sm font-medium text-zinc-400 block">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
              >
                {backgroundCategories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-medium text-zinc-400 block">Time of Day</label>
              <div className="grid grid-cols-2 gap-2">
                {timeOfDay.map(t => (
                  <button 
                    key={t}
                    onClick={() => setTime(t)}
                    className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${time === t ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6 pt-4 border-t border-zinc-800">
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Weather Effects</label>
                  <select className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 uppercase font-black tracking-widest">
                     <option>Clear Sky</option>
                     <option>Foggy / Misty</option>
                     <option>Rainy Storm</option>
                     <option>Snowing</option>
                     <option>Dust Storm</option>
                  </select>
               </div>

               <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Lighting Style</label>
                  <select className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 uppercase font-black tracking-widest">
                     <option>Cinematic</option>
                     <option>Flat 2D</option>
                     <option>High Contrast</option>
                     <option>Soft Diffused</option>
                     <option>Backlit</option>
                  </select>
               </div>

               <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Artistic Style</label>
                  <div className="grid grid-cols-2 gap-2">
                     {['Oil Painting', 'Watercolor', 'Digital Vector', 'Pencil Sketch'].map(s => (
                       <button key={s} className="px-3 py-2 bg-black border border-zinc-800 rounded-lg text-[9px] font-black text-zinc-500 uppercase tracking-tighter hover:border-indigo-500 hover:text-white transition-all">
                          {s}
                       </button>
                     ))}
                  </div>
               </div>
            </div>

            <button
              onClick={generateBackground}
              disabled={loading || !prompt}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/20"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              Generate Background
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 min-h-[600px] flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold text-white">Generated Backgrounds</h2>
                <div className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-widest border border-indigo-500/20">
                  Style: 2D Digital Painting
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-zinc-500 hover:text-white transition-colors">
                  <Filter className="w-5 h-5" />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-indigo-500" />
                <p className="font-medium animate-pulse">Painting your environment...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {results.map((url, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="group relative aspect-video bg-black border border-zinc-800 rounded-2xl overflow-hidden"
                  >
                    <img src={url} alt="Background" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4">
                      <div className="flex gap-3">
                        <button className="p-4 rounded-2xl bg-white text-black hover:bg-zinc-200 transition-all shadow-xl">
                          <Download className="w-6 h-6" />
                        </button>
                        <button className="p-4 rounded-2xl bg-indigo-600 text-white hover:bg-indigo-500 transition-all shadow-xl">
                          <Save className="w-6 h-6" />
                        </button>
                        <button className="p-4 rounded-2xl bg-zinc-800 text-white hover:bg-zinc-700 transition-all shadow-xl">
                          <Maximize2 className="w-6 h-6" />
                        </button>
                      </div>
                      <p className="text-white text-sm font-bold tracking-tight">Add to Current Project</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-zinc-700 text-center space-y-4">
                <div className="w-24 h-24 rounded-3xl border-4 border-zinc-800 flex items-center justify-center rotate-3">
                  <ImageIcon className="w-10 h-10" />
                </div>
                <div className="max-w-xs">
                  <p className="font-bold text-zinc-500 mb-1">Environmental Canvas Empty</p>
                  <p className="text-sm">Enter a prompt to generate cinematic backgrounds for your Hindi moral stories.</p>
                </div>
              </div>
            )}
          </div>

          {/* Quick Browse */}
          <div className="space-y-4">
            <h3 className="text-white font-bold flex items-center gap-2">
              <Search className="w-4 h-4 text-indigo-500" />
              Popular Categories
            </h3>
            <div className="flex flex-wrap gap-3">
              {backgroundCategories.slice(0, 8).map(c => (
                <button key={c} className="px-5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 text-sm hover:border-indigo-500 hover:text-white transition-all">
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
