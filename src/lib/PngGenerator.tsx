import React, { useState } from 'react';
import { 
  Layers, 
  Sparkles, 
  Search, 
  Download, 
  Save, 
  Loader2, 
  Plus, 
  Image as ImageIcon,
  Grid,
  Filter,
  Package
} from 'lucide-react';
import { motion } from 'framer-motion';

const categories = [
  'All', 'Food', 'Kitchen', 'Household', 'Furniture', 'Village Objects', 'Props'
];

const sampleAssets = [
  { id: '1', name: 'Samosa', category: 'Food', color: 'indigo' },
  { id: '2', name: 'Pressure Cooker', category: 'Kitchen', color: 'purple' },
  { id: '3', name: 'Village Door', category: 'Village Objects', color: 'blue' },
  { id: '4', name: 'Wooden Chair', category: 'Furniture', color: 'orange' },
  { id: '5', name: 'Water Bucket', category: 'Household', color: 'emerald' },
  { id: '6', name: 'Jalebi Plate', category: 'Food', color: 'rose' },
];

export function PngGenerator() {
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setCategory] = useState('All');
  const [prompt, setPrompt] = useState('');

  const generateVariation = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  const filteredSamples = sampleAssets.filter(a => 
    (selectedCategory === 'All' || a.category === selectedCategory) &&
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Layers className="w-8 h-8 text-indigo-500" />
            PNG Material Generator
          </h1>
          <p className="text-zinc-500">Create transparent 2D digital assets and props for your cartoon scenes.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Selection & Samples */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search sample props..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
              {categories.map(c => (
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

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 min-h-[400px]">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Grid className="w-5 h-5 text-indigo-500" />
                Sample Asset Library
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredSamples.map((asset) => (
                <motion.div
                  key={asset.id}
                  whileHover={{ scale: 1.05 }}
                  className="bg-black border border-zinc-800 rounded-2xl p-4 cursor-pointer group hover:border-indigo-500 transition-all text-center space-y-4"
                >
                  <div className={`aspect-square rounded-xl bg-${asset.color}-500/10 flex items-center justify-center text-${asset.color}-500`}>
                    <Package className="w-12 h-12" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{asset.name}</p>
                    <p className="text-[10px] text-zinc-600 uppercase font-black tracking-widest">{asset.category}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Generation Controls */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-6 sticky top-28">
            <div className="space-y-4">
              <h3 className="text-white font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                Custom Generator
              </h3>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Modification Prompt</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. Add steam to the samosa, make it look hot..."
                  rows={4}
                  className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all resize-none"
                />
              </div>
            </div>

            <div className="space-y-6 pt-2 border-t border-zinc-800">
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Artistic Style</label>
                  <select className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 uppercase font-black tracking-widest">
                     <option>Hand-Painted</option>
                     <option>Vector Flat</option>
                     <option>3D Render</option>
                     <option>Pixel Art</option>
                  </select>
               </div>

               <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Edge Quality</label>
                  <select className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 uppercase font-black tracking-widest">
                     <option>Smooth (AA)</option>
                     <option>Crisp (Aliased)</option>
                     <option>Soft / Glow</option>
                  </select>
               </div>
            </div>

            <div className="p-4 bg-indigo-600/5 border border-indigo-500/20 rounded-2xl">
               <div className="flex items-center gap-2 text-indigo-400 font-bold text-[10px] uppercase tracking-widest mb-1">
                  <ImageIcon className="w-3 h-3" /> Alpha Transparency
               </div>
               <p className="text-[10px] text-zinc-500 leading-relaxed font-medium">
                  Every asset is automatically masked with 8-bit alpha transparency for seamless integration into your studio scenes.
               </p>
            </div>

            <button
              onClick={generateVariation}
              disabled={loading}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/20"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              Generate Asset
            </button>

            <div className="flex justify-between items-center px-1">
              <span className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">Cost</span>
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">5 Credits</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
