import React, { useState } from 'react';
import { 
  Subtitles, 
  Sparkles, 
  Upload, 
  Download, 
  Loader2, 
  Video,
  Mic2,
  FileText,
  Type,
  Plus,
  Trash2,
  Play
} from 'lucide-react';
import { motion } from 'framer-motion';

export function SubtitleStudio() {
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('Hindi');

  const generate = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Subtitles className="w-8 h-8 text-indigo-500" />
            Subtitle Studio
          </h1>
          <p className="text-zinc-500">Transcribe audio and generate synchronized subtitles for your cartoon videos.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-6">
            <div className="space-y-4">
              <label className="text-sm font-medium text-zinc-400 block">Source Media</label>
              <div className="aspect-video bg-black border-2 border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-zinc-800/30 transition-all">
                <Video className="w-8 h-8 text-zinc-600" />
                <span className="text-xs text-zinc-500">Upload Video/Audio</span>
              </div>
            </div>

            <div className="space-y-6 pt-2 border-t border-zinc-800">
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Subtitle Style</label>
                  <select className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 uppercase font-black tracking-widest">
                     <option>Classic White</option>
                     <option>Modern Yellow</option>
                     <option>Outline Bold</option>
                     <option>Dynamic Karaoke</option>
                  </select>
               </div>

               <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Vertical Position</label>
                  <select className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 uppercase font-black tracking-widest">
                     <option>Bottom (10%)</option>
                     <option>Middle</option>
                     <option>Top</option>
                  </select>
               </div>

               <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Auto-Translate</label>
                    <button className="w-8 h-4 bg-zinc-800 rounded-full relative p-0.5"><div className="w-3 h-3 bg-zinc-600 rounded-full" /></button>
                  </div>
               </div>
            </div>

            <button
              onClick={generate}
              disabled={loading}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/20"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              Auto-Transcribe
            </button>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 min-h-[500px] flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-500" />
                Subtitle Editor
              </h2>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-zinc-800 text-white text-xs font-bold rounded-lg hover:bg-zinc-700 transition-all flex items-center gap-2">
                  <Download className="w-3.5 h-3.5" /> Export SRT
                </button>
                <button className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-500 transition-all">
                  Burn to Video
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-indigo-500" />
                <p className="font-medium animate-pulse">Analyzing audio and generating timestamps...</p>
              </div>
            ) : (
              <div className="flex-1 space-y-4">
                <div className="bg-black rounded-2xl p-6 border border-zinc-800 flex items-center gap-6">
                  <div className="w-32 aspect-video bg-zinc-900 rounded-lg flex items-center justify-center">
                    <Play className="w-6 h-6 text-zinc-700" />
                  </div>
                  <div className="flex-1">
                    <p className="text-zinc-500 text-xs font-bold uppercase mb-1">00:00 - 00:05</p>
                    <p className="text-white text-lg font-medium">नमस्ते दोस्तों! आज हम एक बहुत ही मजेदार कहानी सुनेंगे।</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-zinc-600 hover:text-white"><Type className="w-4 h-4" /></button>
                    <button className="p-2 text-zinc-600 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>

                <button className="w-full py-4 border-2 border-dashed border-zinc-800 rounded-2xl text-zinc-600 font-bold text-sm hover:border-zinc-700 hover:text-zinc-400 transition-all flex items-center justify-center gap-2 uppercase tracking-widest">
                  <Plus className="w-4 h-4" /> Add Subtitle Segment
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
