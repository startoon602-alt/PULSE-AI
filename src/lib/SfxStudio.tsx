import React, { useState } from 'react';
import { 
  Volume2, 
  Sparkles, 
  Search, 
  Download, 
  Play, 
  Pause, 
  Loader2, 
  Music, 
  Grid,
  Filter,
  Save,
  Plus
} from 'lucide-react';
import { motion } from 'framer-motion';

const sfxCategories = [
  'All', 'Ambient', 'Characters', 'Magic', 'Action', 'Household', 'Animals'
];

const sampleSfx = [
  { id: '1', name: 'Footsteps on Mud', category: 'Ambient', duration: '0:03' },
  { id: '2', name: 'Crowd Murmur', category: 'Ambient', duration: '0:15' },
  { id: '3', name: 'Magic Spell Sparkle', category: 'Magic', duration: '0:02' },
  { id: '4', name: 'Character Laugh', category: 'Characters', duration: '0:04' },
  { id: '5', name: 'Door Creak', category: 'Household', duration: '0:02' },
  { id: '6', name: 'Cow Mooing', category: 'Animals', duration: '0:03' },
];

export function SfxStudio() {
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setCategory] = useState('All');
  const [prompt, setPrompt] = useState('');

  const generateSfx = async () => {
    if (!prompt) return;
    setLoading(true);
    try {
      const res = await fetch('/api/sfx/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: 'test-user', // In real app, get from auth
          prompt, 
          category: selectedCategory 
        }),
      });
      const data = await res.json();
      if (data.audio) {
        const audio = new Audio(`data:audio/wav;base64,${data.audio}`);
        audio.play();
        // Add to list for persistence in session
        const newSfx = {
          id: Date.now().toString(),
          name: prompt.substring(0, 20),
          category: selectedCategory,
          duration: '0:05',
          url: `data:audio/wav;base64,${data.audio}`
        };
        // This is a local update for the UI
        sampleSfx.unshift(newSfx as any);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSfx = sampleSfx.filter(s => 
    (selectedCategory === 'All' || s.category === selectedCategory) &&
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Volume2 className="w-8 h-8 text-indigo-500" />
            Sound Effects Studio
          </h1>
          <p className="text-zinc-500">Search 10,000+ cartoon SFX or generate custom sounds with AI prompts.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Search & Library */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search sound effects library..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all shadow-inner"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
              {sfxCategories.map(c => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                    selectedCategory === c 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 min-h-[400px] overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 bg-black/20">
                    <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Preview</th>
                    <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Name</th>
                    <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Category</th>
                    <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] text-right">Length</th>
                    <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {filteredSfx.map((sfx) => (
                    <tr key={sfx.id} className="group hover:bg-zinc-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <button className="w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center hover:scale-110 active:scale-95 transition-all">
                          <Play className="w-4 h-4 fill-indigo-500" />
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{sfx.name}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded bg-zinc-800 text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">{sfx.category}</span>
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-xs text-zinc-500">
                        {sfx.duration}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 text-zinc-500 hover:text-white transition-all"><Download className="w-4 h-4" /></button>
                          <button className="p-2 text-zinc-500 hover:text-indigo-400 transition-all"><Plus className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* AI SFX Generator */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-6 sticky top-28 shadow-2xl">
            <div className="space-y-4">
              <h3 className="text-white font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                Custom SFX Generator
              </h3>
              <div className="space-y-2">
                <label className="text-xs font-black text-zinc-600 uppercase tracking-widest">Sound Prompt</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. A cart with wooden wheels rolling on uneven stone road..."
                  rows={4}
                  className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all resize-none shadow-inner"
                />
              </div>
            </div>

            <div className="space-y-6 pt-2 border-t border-zinc-800">
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Sample Rate</label>
                  <select className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 uppercase font-black tracking-widest shadow-inner">
                     <option>44.1 kHz (Standard)</option>
                     <option>48 kHz (Pro)</option>
                     <option>96 kHz (Lossless)</option>
                  </select>
               </div>

               <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Audio Format</label>
                  <select className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 uppercase font-black tracking-widest shadow-inner">
                     <option>WAV (Uncompressed)</option>
                     <option>MP3 (High Bitrate)</option>
                     <option>FLAC</option>
                  </select>
               </div>
            </div>

            <button
              onClick={generateSfx}
              disabled={loading || !prompt}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 text-white font-black rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/20"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              Generate Sound
            </button>

            <div className="flex justify-between items-center px-1">
              <span className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">Cost</span>
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">2 Credits</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-3xl p-6 text-white overflow-hidden relative shadow-2xl">
             <div className="absolute top-0 right-0 p-4 opacity-10"><Volume2 className="w-20 h-20" /></div>
             <h4 className="font-bold text-lg mb-1">Atmospheric Packs</h4>
             <p className="text-xs opacity-80 mb-4 font-medium leading-relaxed">Download complete village or city ambient sound packs for your timeline.</p>
             <button className="w-full py-3 bg-white/20 backdrop-blur-md rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/30 transition-all border border-white/10">Browse Packs</button>
          </div>
        </div>
      </div>
    </div>
  );
}
