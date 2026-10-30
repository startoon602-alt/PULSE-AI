import React, { useState } from 'react';
import { 
  ImageIcon, 
  Sparkles, 
  Type, 
  UserCircle2, 
  Layers, 
  Download, 
  Plus, 
  Layout, 
  Box,
  Settings2,
  Trash2,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';

export function ThumbnailMaker() {
  const [loading, setLoading] = useState(false);

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
            Thumbnail Maker
          </h1>
          <p className="text-zinc-500">Design high-CTR YouTube thumbnails for your Hindi cartoon series.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-8">
            <div className="space-y-4">
              <h3 className="text-white font-bold flex items-center gap-2 text-sm uppercase tracking-wider">
                <Layout className="w-4 h-4 text-indigo-500" />
                Canvas Layers
              </h3>
              <div className="space-y-2">
                {[
                  { name: 'Overlay Text', icon: Type },
                  { name: 'Main Character', icon: UserCircle2 },
                  { name: 'Background', icon: ImageIcon },
                ].map((layer, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-black rounded-xl border border-zinc-800 group hover:border-indigo-500 transition-all">
                    <div className="flex items-center gap-3">
                      <layer.icon className="w-4 h-4 text-zinc-500" />
                      <span className="text-xs font-bold text-white">{layer.name}</span>
                    </div>
                    <button className="p-1 text-zinc-700 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                ))}
                <button className="w-full py-2.5 border border-dashed border-zinc-800 rounded-xl text-[10px] font-black text-zinc-600 uppercase tracking-widest hover:border-indigo-500 hover:text-indigo-400 transition-all">
                   Add New Layer
                </button>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-zinc-800">
               <h3 className="text-white font-bold flex items-center gap-2 text-sm uppercase tracking-wider">
                <Layout className="w-4 h-4 text-indigo-500" />
                Production Templates
              </h3>
              <div className="grid grid-cols-1 gap-2">
                 {['Moral Story Classic', 'Clickbait Dynamic', 'Action Showcase'].map(t => (
                   <button key={t} className="px-4 py-3 bg-black border border-zinc-800 rounded-xl text-[10px] font-black text-zinc-500 uppercase tracking-widest hover:border-indigo-500 hover:text-white text-left flex items-center justify-between group transition-all">
                      {t}
                      <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all" />
                   </button>
                 ))}
              </div>
            </div>

            <div className="space-y-4 pt-4">
               <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Typography Style</label>
               <select className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 uppercase font-black tracking-widest">
                  <option>Impact Bold</option>
                  <option>Hindi Calligraphy</option>
                  <option>Modern Sans</option>
                  <option>Playful Comic</option>
               </select>
            </div>

            <button
              onClick={generate}
              disabled={loading}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/20"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              AI Layout Assist
            </button>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 min-h-[500px] flex flex-col items-center justify-center">
             <div className="aspect-video w-full max-w-4xl bg-black border border-zinc-800 rounded-2xl relative overflow-hidden group shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-purple-900/20" />
                {/* Sample thumbnail layout */}
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="text-center space-y-4">
                      <div className="w-24 h-24 rounded-full border-4 border-zinc-800 flex items-center justify-center mx-auto bg-zinc-900">
                         <ImageIcon className="w-10 h-10 text-zinc-700" />
                      </div>
                      <p className="text-zinc-600 font-bold uppercase tracking-widest text-xs">Drop assets here to compose</p>
                   </div>
                </div>
                {/* Text Overlay mockup */}
                <div className="absolute top-10 left-10 max-w-md">
                   <h2 className="text-4xl font-black text-white italic drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)] leading-tight uppercase tracking-tighter">
                     Professional <br />
                     <span className="text-indigo-500">Cartoon Title</span>
                   </h2>
                </div>
                <div className="absolute inset-0 border-4 border-transparent group-hover:border-indigo-500 transition-all pointer-events-none" />
             </div>

             <div className="mt-8 flex gap-4">
                <button className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-all flex items-center gap-2 shadow-xl">
                   <Download className="w-5 h-5" /> Export HD PNG
                </button>
                <button className="px-8 py-3 bg-zinc-900 border border-zinc-800 text-white font-bold rounded-xl hover:bg-zinc-800 transition-all">
                   Save Template
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
