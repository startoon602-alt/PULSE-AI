import React, { useState } from 'react';
import { 
  MonitorPlay, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Scissors, 
  Trash2, 
  Copy, 
  Download, 
  Save, 
  Plus, 
  Layers,
  Volume2,
  Mic2,
  Music,
  Smile,
  ImageIcon,
  Video,
  Type
} from 'lucide-react';
import { motion } from 'framer-motion';

const tracks = [
  { id: 'video', label: 'Video', icon: Video, color: 'indigo' },
  { id: 'image', label: 'Images', icon: ImageIcon, color: 'purple' },
  { id: 'character', label: 'Characters', icon: Smile, color: 'blue' },
  { id: 'narration', label: 'Narration', icon: Mic2, color: 'emerald' },
  { id: 'dialogue', label: 'Dialogue', icon: Volume2, color: 'orange' },
  { id: 'music', label: 'Music', icon: Music, color: 'rose' },
  { id: 'subtitle', label: 'Subtitles', icon: Type, color: 'zinc' },
];

export function TimelineEditor() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoom, setZoom] = useState(1);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-[#0a0a0a]">
      {/* Editor Header */}
      <div className="h-14 border-b border-zinc-900 bg-black flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-6">
          <h2 className="text-white font-bold flex items-center gap-2">
            <MonitorPlay className="w-5 h-5 text-indigo-500" />
            Production Timeline
          </h2>
          <div className="h-6 w-px bg-zinc-800" />
          <div className="flex items-center gap-1">
            <button className="p-2 text-zinc-500 hover:text-white transition-all"><Scissors className="w-4 h-4" /></button>
            <button className="p-2 text-zinc-500 hover:text-white transition-all"><Copy className="w-4 h-4" /></button>
            <button className="p-2 text-zinc-500 hover:text-white transition-all"><Trash2 className="w-4 h-4" /></button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-lg">
             <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Snap</span>
             <button className="w-8 h-4 bg-indigo-600 rounded-full relative p-0.5"><div className="w-3 h-3 bg-white rounded-full ml-auto" /></button>
          </div>
          <button className="px-4 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-bold text-white hover:bg-zinc-800 transition-all">Save Project</button>
          <button className="px-4 py-1.5 bg-indigo-600 rounded-lg text-xs font-bold text-white hover:bg-indigo-500 transition-all flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Final
          </button>
        </div>
      </div>

      {/* Main Preview Area */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row">
        {/* Playback Preview */}
        <div className="flex-1 bg-black flex items-center justify-center p-4 md:p-8">
          <div className="aspect-video w-full max-w-4xl bg-zinc-950 border border-zinc-900 rounded-2xl shadow-2xl flex items-center justify-center relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
             <Play className="w-20 h-20 text-zinc-800 opacity-20 group-hover:scale-110 transition-transform" />
             <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[10px] font-black text-white uppercase tracking-widest border border-white/10">00:12:45 / 05:00:00</span>
                <div className="flex gap-2">
                  <button className="p-2 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-white"><Plus className="w-4 h-4" /></button>
                </div>
             </div>
          </div>
        </div>

        {/* Media Bin */}
        <div className="w-full lg:w-80 border-l border-zinc-900 bg-[#050505] flex flex-col shrink-0">
          <div className="p-4 border-b border-zinc-900 flex items-center justify-between">
            <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest">Asset Bin</h3>
            <button className="p-1 text-zinc-500 hover:text-white"><Layers className="w-4 h-4" /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="p-3 bg-zinc-900/50 border border-zinc-800 rounded-xl flex items-center gap-3 group hover:border-indigo-500 cursor-pointer transition-all">
                <div className="w-12 h-8 bg-black rounded border border-zinc-800 overflow-hidden shrink-0">
                  <div className="w-full h-full bg-indigo-600/10" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-white truncate">Scene_{i}_Render.mp4</p>
                  <p className="text-[9px] text-zinc-600 font-medium">10.2 MB · 00:05</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline Controls */}
      <div className="h-12 border-t border-zinc-900 bg-black flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-2">
          <button className="p-2 text-zinc-500 hover:text-white"><SkipBack className="w-4 h-4" /></button>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-black" /> : <Play className="w-5 h-5 fill-black translate-x-0.5" />}
          </button>
          <button className="p-2 text-zinc-500 hover:text-white"><SkipForward className="w-4 h-4" /></button>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black text-zinc-600 uppercase">Zoom</span>
            <input 
              type="range" 
              min="0.5" 
              max="2" 
              step="0.1" 
              value={zoom} 
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-32 accent-indigo-600"
            />
          </div>
          <div className="h-6 w-px bg-zinc-800" />
          <span className="text-sm font-mono text-indigo-500 font-bold tracking-tighter">00:00:12:45</span>
        </div>
      </div>

      {/* Multi-track Timeline */}
      <div className="h-72 border-t border-zinc-900 bg-[#050505] overflow-y-auto shrink-0 flex">
        {/* Track Headers */}
        <div className="w-48 border-r border-zinc-900 bg-black sticky left-0 z-10 shrink-0">
          {tracks.map(track => (
            <div key={track.id} className="h-10 border-b border-zinc-900 px-4 flex items-center gap-3 group hover:bg-zinc-900/50 transition-colors">
              <track.icon className={`w-3.5 h-3.5 text-${track.color}-500`} />
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest group-hover:text-zinc-300">{track.label}</span>
            </div>
          ))}
        </div>

        {/* Tracks Area */}
        <div className="flex-1 relative overflow-x-auto min-w-0">
          <div className="absolute top-0 bottom-0 left-[200px] w-px bg-indigo-500 z-20 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
          {tracks.map(track => (
            <div key={track.id} className="h-10 border-b border-zinc-900 relative group">
              {/* Sample Clips */}
              {track.id === 'video' && (
                <div className="absolute left-[50px] top-1 bottom-1 w-[300px] rounded bg-indigo-600/20 border border-indigo-500/50 flex items-center px-3 cursor-move">
                   <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-tighter">Scene_01_Base.mp4</span>
                </div>
              )}
              {track.id === 'narration' && (
                <div className="absolute left-[50px] top-1 bottom-1 w-[400px] rounded bg-emerald-600/20 border border-emerald-500/50 flex items-center px-3 cursor-move">
                   <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-tighter">Narration_Full.wav</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
