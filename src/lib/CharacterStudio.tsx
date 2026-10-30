import React, { useState } from 'react';
import { 
  UserCircle2, 
  Sparkles, 
  Upload, 
  RefreshCw, 
  Download, 
  Save,
  Loader2,
  ChevronRight,
  Smile,
  Scissors,
  Layers,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from './AuthProvider';

export function CharacterStudio() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'create' | 'modify'>('create');
  const [prompt, setPrompt] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [results, setResults] = useState<string[]>([]);
  const [activePart, setActivePart] = useState('Face');

  const bodyParts = ['Face', 'Torso', 'Arms', 'Hands', 'Legs', 'Feet'];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        setMode('modify');
      };
      reader.readAsDataURL(file);
    }
  };

  const generateCharacter = async () => {
    if (!prompt) return;
    setLoading(true);
    try {
      const res = await fetch('/api/image/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: user?.uid,
          prompt: mode === 'modify' ? `Modify this character's ${activePart}: ${prompt}` : prompt, 
          category: 'Character', 
          style: '2D Traditional',
          aspect: "1:1"
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
    <div className="max-w-[1600px] mx-auto p-4 md:p-8 space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white mb-2 flex items-center gap-4 tracking-tighter">
            <UserCircle2 className="w-10 h-10 text-indigo-500" />
            Character Studio
          </h1>
          <p className="text-zinc-500 text-lg">Design and edit consistent 2D cartoon characters with production-grade AI.</p>
        </div>
        <div className="flex items-center gap-2 p-1 bg-zinc-900 rounded-2xl border border-zinc-800 self-start shadow-xl">
          <button 
            onClick={() => setMode('create')}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${mode === 'create' ? 'bg-indigo-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            Create New
          </button>
          <button 
            onClick={() => setMode('modify')}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${mode === 'modify' ? 'bg-indigo-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            Modify Existing
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Editing Column */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 md:p-10 space-y-10 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-5">
               <Smile className="w-32 h-32" />
            </div>

            {mode === 'modify' && (
              <div className="space-y-6 relative z-10">
                <div className="flex items-center justify-between">
                   <label className="text-xs font-black text-zinc-600 uppercase tracking-[0.2em]">Source Component</label>
                   <select 
                     value={activePart} 
                     onChange={(e) => setActivePart(e.target.value)}
                     className="bg-black border border-zinc-800 rounded-lg px-3 py-1 text-[10px] font-black text-indigo-500 uppercase outline-none"
                   >
                      {bodyParts.map(p => <option key={p}>{p}</option>)}
                   </select>
                </div>
                <div className="aspect-square bg-black border-4 border-dashed border-zinc-800 rounded-[2rem] overflow-hidden relative group shadow-inner">
                  {uploadedImage ? (
                    <>
                      <img src={uploadedImage} alt="Uploaded" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                         <button onClick={() => setUploadedImage(null)} className="p-4 bg-red-600 text-white rounded-2xl shadow-xl hover:bg-red-500 transition-all"><X className="w-6 h-6" /></button>
                         <button className="p-4 bg-white text-black rounded-2xl shadow-xl hover:bg-zinc-200 transition-all"><RefreshCw className="w-6 h-6" /></button>
                      </div>
                    </>
                  ) : (
                    <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-800/30 transition-all group">
                      <div className="w-16 h-16 rounded-3xl bg-zinc-800/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                         <Upload className="w-8 h-8 text-zinc-500 group-hover:text-indigo-500 transition-colors" />
                      </div>
                      <span className="text-xs font-black text-zinc-600 uppercase tracking-widest">Click to upload {activePart}</span>
                      <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
                    </label>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-4 relative z-10">
              <label className="text-xs font-black text-zinc-600 uppercase tracking-[0.2em]">Creative Prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={mode === 'create' ? "e.g. A young village boy with messy hair, wearing a traditional kurta, curious expression..." : "e.g. Change the expression to happy, add a small gold earring..."}
                rows={5}
                className="w-full bg-black border border-zinc-800 rounded-3xl px-8 py-6 text-white focus:outline-none focus:border-indigo-500 transition-all resize-none shadow-inner text-sm font-medium"
              />
            </div>

            <div className="space-y-6 relative z-10">
              <span className="text-xs font-black text-zinc-600 uppercase tracking-[0.2em] block">Production Style</span>
              <div className="grid grid-cols-2 gap-3">
                {['2D Traditional', 'Modern Digital', 'Abstract', 'Sketch'].map(opt => (
                  <button key={opt} className="px-4 py-3 rounded-2xl bg-black border border-zinc-800 text-[10px] font-black uppercase text-zinc-500 hover:text-white hover:border-indigo-500 transition-all shadow-sm">
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-zinc-800 relative z-10">
               <div className="space-y-4">
                  <div className="flex items-center justify-between">
                     <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Face Shape</label>
                     <select className="bg-black border border-zinc-800 rounded px-2 py-1 text-[9px] text-white uppercase outline-none">
                        <option>Round</option>
                        <option>Oval</option>
                        <option>Square</option>
                     </select>
                  </div>
                  <div className="flex items-center justify-between">
                     <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Hair Style</label>
                     <select className="bg-black border border-zinc-800 rounded px-2 py-1 text-[9px] text-white uppercase outline-none">
                        <option>Short Messy</option>
                        <option>Long Straight</option>
                        <option>Curly</option>
                        <option>Turban</option>
                     </select>
                  </div>
                  <div className="flex items-center justify-between">
                     <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Eye Color</label>
                     <div className="flex gap-2">
                        {['#000', '#543', '#248'].map(c => <div key={c} className="w-4 h-4 rounded-full border border-zinc-700" style={{ backgroundColor: c }} />)}
                     </div>
                  </div>
                  <div className="flex items-center justify-between">
                     <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Outfit Type</label>
                     <select className="bg-black border border-zinc-800 rounded px-2 py-1 text-[9px] text-white uppercase outline-none">
                        <option>Traditional Kurta</option>
                        <option>Farmer Wear</option>
                        <option>School Uniform</option>
                        <option>Modern</option>
                     </select>
                  </div>
               </div>
            </div>

            <button
              onClick={generateCharacter}
              disabled={loading || (mode === 'modify' && !uploadedImage) || !prompt}
              className="w-full py-6 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 text-white font-black rounded-3xl transition-all flex items-center justify-center gap-3 shadow-[0_10px_40px_rgba(79,70,229,0.3)] active:scale-[0.98]"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6" />}
              {mode === 'create' ? 'Forge Character' : 'Modify Component'}
            </button>
          </div>

          <div className="p-8 bg-indigo-600/5 border border-indigo-500/20 rounded-[2rem] flex gap-6 items-start shadow-xl">
            <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-400 shrink-0">
              <Smile className="w-8 h-8" />
            </div>
            <div>
              <p className="text-lg font-black text-white mb-2 tracking-tight">Identity Lock</p>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Our system ensures that character facial features and clothing styles remain 85%+ consistent across generations.
              </p>
            </div>
          </div>
        </div>

        {/* Output Column */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 md:p-12 min-h-[600px] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl font-black text-white tracking-tight">Studio Variations</h2>
              {results.length > 0 && (
                <button 
                  onClick={() => setResults([])}
                  className="px-4 py-2 text-xs font-black text-zinc-500 hover:text-white uppercase tracking-widest transition-colors"
                >
                  Discard All
                </button>
              )}
            </div>

            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 gap-8">
                <div className="relative">
                   <Loader2 className="w-20 h-20 animate-spin text-indigo-600" />
                   <div className="absolute inset-0 flex items-center justify-center">
                      <UserCircle2 className="w-8 h-8 text-indigo-400" />
                   </div>
                </div>
                <div className="text-center space-y-2">
                   <p className="text-xl font-black text-white tracking-tight animate-pulse">Sketching Your Vision...</p>
                   <p className="text-sm max-w-xs">Our AI artist is finalizing the digital ink and paint for your character.</p>
                </div>
              </div>
            ) : results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {results.map((url, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="group relative aspect-square bg-black border border-zinc-800 rounded-[2rem] overflow-hidden shadow-2xl"
                  >
                    <img src={url} alt="Result" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-6 p-6">
                      <div className="flex gap-4">
                        <button className="p-5 rounded-2xl bg-white text-black hover:scale-110 active:scale-95 transition-all shadow-2xl">
                          <Download className="w-6 h-6" />
                        </button>
                        <button className="p-5 rounded-2xl bg-indigo-600 text-white hover:scale-110 active:scale-95 transition-all shadow-2xl shadow-indigo-600/40">
                          <Save className="w-6 h-6" />
                        </button>
                      </div>
                      <div className="space-y-3 text-center">
                         <button className="text-xs font-black text-white uppercase tracking-widest hover:text-indigo-400 transition-colors flex items-center justify-center gap-2 w-full">
                            Set as Master Reference <ChevronRight className="w-4 h-4" />
                         </button>
                         <button className="text-xs font-black text-zinc-500 uppercase tracking-widest hover:text-indigo-400 transition-colors flex items-center justify-center gap-2 w-full">
                            Open in Component Editor <ChevronRight className="w-4 h-4" />
                         </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-zinc-700 text-center space-y-8">
                <div className="w-40 h-40 rounded-[3rem] border-4 border-zinc-800 flex items-center justify-center bg-black shadow-2xl rotate-6 group hover:rotate-0 transition-transform">
                  <UserCircle2 className="w-20 h-20 text-zinc-800" />
                </div>
                <div className="max-w-md space-y-2">
                  <h3 className="text-white font-black text-xl tracking-tight uppercase">Artist Canvas Waiting</h3>
                  <p className="text-zinc-500 leading-relaxed font-medium">
                    Configure your character traits on the left. You can define specific physical features or use our artistic templates to start.
                  </p>
                </div>
                <button className="px-8 py-3 bg-zinc-800 text-white font-black rounded-2xl hover:bg-zinc-700 transition-all uppercase tracking-widest text-xs border border-zinc-700">
                   Load Sample Character
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 flex gap-6 items-center group hover:border-orange-500/50 transition-all shadow-xl">
              <div className="p-5 rounded-2xl bg-orange-500/10 text-orange-500 shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                <Scissors className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-white font-black text-lg tracking-tight mb-1 uppercase">Body-Part Extraction</h4>
                <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                  Automatically slice characters into animatable components for the timeline.
                </p>
              </div>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 flex gap-6 items-center group hover:border-purple-500/50 transition-all shadow-xl">
              <div className="p-5 rounded-2xl bg-purple-500/10 text-purple-500 shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                <Layers className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-white font-black text-lg tracking-tight mb-1 uppercase">Prop Generator</h4>
                <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                  Create unique items, weapons, or pets that match your character's visual style.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
