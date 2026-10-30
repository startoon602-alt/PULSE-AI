import React, { useState, useMemo } from 'react';
import { 
  Mic2, 
  Sparkles, 
  Play, 
  Pause, 
  Download, 
  Save,
  Loader2,
  Volume2,
  Settings2,
  CheckCircle2,
  UserCircle2,
  Search,
  Filter,
  Heart,
  Music,
  ChevronRight,
  Plus,
  History,
  Languages,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from './AuthProvider';
import { voiceLibrary, voiceCategories, VoiceCharacter } from './voices';
import { downloadBase64File } from './utils';
import { db } from './firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs, doc, setDoc } from 'firebase/firestore';

export function VoiceStudio() {
  const { user, userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedVoice, setSelectedVoice] = useState<VoiceCharacter>(voiceLibrary[0]);
  const [selectedEmotion, setSelectedEmotion] = useState('Normal');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const [pitch, setPitch] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [characterMappings, setCharacterMappings] = useState<any[]>([]);
  const [selectedMappingChar, setSelectedMappingChar] = useState('');

  // Fetch existing mappings (simulated for now, would use Firestore)
  useState(() => {
    // Mock mappings
    setCharacterMappings([
      { characterName: 'Aarav', voiceId: 'MaleNarrators_1', voiceName: 'Aarav — Warm Storyteller' },
      { characterName: 'Bhairav', voiceId: 'VillainCharacters_1', voiceName: 'Bhairav — Villain Character' }
    ]);
  });

  const saveMapping = async () => {
    if (!selectedMappingChar || !selectedVoice) return;
    const newMapping = {
      characterName: selectedMappingChar,
      voiceId: selectedVoice.id,
      voiceName: selectedVoice.displayName,
      settings: { speed, pitch, pause, emotion: selectedEmotion }
    };
    setCharacterMappings(prev => [...prev.filter(m => m.characterName !== selectedMappingChar), newMapping]);
    alert(`Voice "${selectedVoice.displayName}" locked to character "${selectedMappingChar}"`);
  };

  const filteredVoices = useMemo(() => {
    return voiceLibrary.filter(v => {
      const matchesSearch = v.displayName.toLowerCase().includes(search.toLowerCase()) || 
                           v.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || v.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  const generateVoice = async () => {
    if (!text || !user) return;
    setLoading(true);
    try {
      const res = await fetch('/api/voice/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: user.uid,
          text, 
          voiceName: selectedVoice.providerVoice, 
          style: selectedVoice.settings.style,
          speed: speed || selectedVoice.settings.speed,
          pitch: pitch || selectedVoice.settings.pitch,
          emotion: selectedEmotion,
          pause
        }),
      });
      const data = await res.json();
      if (data.audio) {
        setAudioUrl(`data:audio/wav;base64,${data.audio}`);
        // Log to generations
        await addDoc(collection(db, 'generations'), {
          userId: user.uid,
          type: 'voice',
          content: text.substring(0, 50),
          voiceId: selectedVoice.id,
          createdAt: serverTimestamp()
        });
      } else if (data.error) {
        alert(data.error);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const previewVoice = async (voice: VoiceCharacter) => {
    if (!user) return;
    setPreviewLoading(voice.id);
    try {
      const res = await fetch('/api/voice/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: user.uid,
          text: voice.previewText, 
          voiceName: voice.providerVoice, 
          style: voice.settings.style,
          speed: voice.settings.speed,
          pitch: voice.settings.pitch
        }),
      });
      const data = await res.json();
      if (data.audio) {
        const audio = new Audio(`data:audio/wav;base64,${data.audio}`);
        audio.play();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setPreviewLoading(null);
    }
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const saveToProject = async () => {
    if (!user || !audioUrl) return;
    // Implementation for saving to project assets
    alert('Voiceover saved to project assets!');
  };

  return (
    <div className="max-w-[1600px] mx-auto p-4 md:p-8 space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-white flex items-center gap-4 tracking-tighter">
            <Mic2 className="w-10 h-10 text-indigo-500" />
            Character Voice Studio
          </h1>
          <p className="text-zinc-500 text-lg">Premium 100-voice character library with emotional Hindi delivery.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Voice Library Section */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 md:p-10 space-y-8 shadow-2xl overflow-hidden relative">
             <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input 
                    type="text" 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search characters by name or personality..."
                    className="w-full bg-black border border-zinc-800 rounded-2xl pl-14 pr-6 py-4 text-white focus:outline-none focus:border-indigo-500 transition-all shadow-inner"
                  />
                </div>
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-4 text-white text-sm font-bold focus:outline-none focus:border-indigo-500 transition-all outline-none"
                >
                  <option value="All">All Categories</option>
                  {voiceCategories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[700px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                {filteredVoices.map((voice) => (
                  <motion.div
                    key={voice.id}
                    layoutId={voice.id}
                    className={`p-6 rounded-[2rem] border transition-all cursor-pointer group relative ${selectedVoice.id === voice.id ? 'bg-indigo-600/10 border-indigo-500' : 'bg-black border-zinc-800 hover:border-zinc-700'}`}
                    onClick={() => setSelectedVoice(voice)}
                  >
                    <div className="flex justify-between items-start mb-4">
                       <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                          {voice.gender === 'Male' ? <UserCircle2 className="w-8 h-8 text-indigo-500" /> : <UserCircle2 className="w-8 h-8 text-rose-500" />}
                       </div>
                       <div className="flex items-center gap-2">
                         <button 
                           onClick={(e) => { e.stopPropagation(); toggleFavorite(voice.id); }}
                           className={`p-2 rounded-xl transition-all ${favorites.includes(voice.id) ? 'text-rose-500 bg-rose-500/10' : 'text-zinc-500 hover:text-white bg-zinc-900'}`}
                         >
                            <Heart className={`w-4 h-4 ${favorites.includes(voice.id) ? 'fill-rose-500' : ''}`} />
                         </button>
                         <button 
                           disabled={previewLoading === voice.id}
                           onClick={(e) => { e.stopPropagation(); previewVoice(voice); }}
                           className="p-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20"
                         >
                            {previewLoading === voice.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
                         </button>
                       </div>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-white font-black text-lg group-hover:text-indigo-400 transition-colors">{voice.displayName}</h3>
                      <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{voice.category}</p>
                      <p className="text-xs text-zinc-400 font-medium line-clamp-2 mt-2 leading-relaxed">{voice.description}</p>
                    </div>
                    {selectedVoice.id === voice.id && (
                      <div className="absolute top-4 right-4">
                        <CheckCircle2 className="w-6 h-6 text-indigo-500" />
                      </div>
                    )}
                  </motion.div>
                ))}
             </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 md:p-10 space-y-8 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-white tracking-tighter flex items-center gap-3">
                 <Languages className="w-6 h-6 text-indigo-500" />
                 Generation Workspace
              </h2>
              <div className="px-4 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                 Voice Lock: Active
              </div>
            </div>

            <div className="space-y-6">
               <textarea 
                 value={text}
                 onChange={(e) => setText(e.target.value)}
                 placeholder="Enter Hindi script here... (e.g. एक बार की बात है, वीर नाम का एक साहसी योद्धा था...)"
                 className="w-full bg-black border border-zinc-800 rounded-3xl px-8 py-6 text-white text-xl focus:outline-none focus:border-indigo-500 transition-all resize-none shadow-inner min-h-[200px]"
               />

               <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1 space-y-3">
                     <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">Expression / Emotion</label>
                     <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                        {selectedVoice.emotions.map(e => (
                          <button
                            key={e}
                            onClick={() => setSelectedEmotion(e)}
                            className={`px-2 py-2 rounded-xl text-[9px] font-black uppercase tracking-tighter transition-all border ${selectedEmotion === e ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' : 'bg-black border-zinc-800 text-zinc-500 hover:text-white'}`}
                          >
                            {e}
                          </button>
                        ))}
                     </div>
                  </div>
                  <div className="md:w-64 flex items-end">
                    <button
                      onClick={generateVoice}
                      disabled={loading || !text}
                      className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 text-white font-black rounded-2xl transition-all flex items-center justify-center gap-3 shadow-2xl shadow-indigo-600/30 active:scale-95"
                    >
                      {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6" />}
                      Generate Voiceover
                    </button>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Selected Voice Details & Settings */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 space-y-8 sticky top-28 shadow-2xl">
              <div className="text-center space-y-4">
                 <div className="w-24 h-24 rounded-[2rem] bg-indigo-600/10 border-2 border-indigo-500/20 mx-auto flex items-center justify-center shadow-2xl">
                    <UserCircle2 className="w-12 h-12 text-indigo-500" />
                 </div>
                 <div>
                    <h2 className="text-2xl font-black text-white tracking-tighter">{selectedVoice.displayName}</h2>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{selectedVoice.category}</p>
                 </div>
              </div>

              <div className="space-y-6 pt-4 border-t border-zinc-800">
                 <div className="p-6 bg-black rounded-3xl border border-zinc-800 space-y-4">
                    <h4 className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                       <CheckCircle2 className="w-3 h-3 text-indigo-500" /> Project Voice Lock
                    </h4>
                    <div className="space-y-3">
                       <input 
                         type="text" 
                         value={selectedMappingChar}
                         onChange={(e) => setSelectedMappingChar(e.target.value)}
                         placeholder="Character Name (e.g. Dadaji)"
                         className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                       />
                       <button 
                         onClick={saveMapping}
                         className="w-full py-2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-500 transition-all"
                       >
                         Lock Voice to Character
                       </button>
                    </div>
                    {characterMappings.length > 0 && (
                      <div className="pt-2 space-y-2">
                        <p className="text-[8px] font-black text-zinc-600 uppercase">Active Mappings</p>
                        {characterMappings.map(m => (
                          <div key={m.characterName} className="flex items-center justify-between text-[10px]">
                            <span className="text-zinc-400">{m.characterName}</span>
                            <span className="text-indigo-400 font-bold">{m.voiceName.split(' ')[0]}</span>
                          </div>
                        ))}
                      </div>
                    )}
                 </div>

                 <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs font-black text-zinc-600 uppercase tracking-widest">
                       <span className="flex items-center gap-2"><Settings2 className="w-3 h-3" /> Voice Tuning</span>
                       <button className="text-indigo-500 hover:underline">Reset</button>
                    </div>
                    
                    <div className="space-y-4">
                       <div className="space-y-2">
                          <div className="flex justify-between text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                             <span>Speaking Speed</span>
                             <span className="text-indigo-500">{speed}x</span>
                          </div>
                          <input 
                            type="range" min="0.5" max="2.0" step="0.1" 
                            value={speed}
                            onChange={(e) => setSpeed(parseFloat(e.target.value))}
                            className="w-full h-1.5 bg-black rounded-lg appearance-none cursor-pointer accent-indigo-600 shadow-inner" 
                          />
                       </div>

                       <div className="space-y-2">
                          <div className="flex justify-between text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                             <span>Vocal Pitch</span>
                             <span className="text-indigo-500">{pitch > 0 ? `+${pitch}` : pitch}</span>
                          </div>
                          <input 
                            type="range" min="-10" max="10" step="1" 
                            value={pitch}
                            onChange={(e) => setPitch(parseInt(e.target.value))}
                            className="w-full h-1.5 bg-black rounded-lg appearance-none cursor-pointer accent-indigo-600 shadow-inner" 
                          />
                       </div>

                       <div className="space-y-2">
                          <div className="flex justify-between text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                             <span>Pause Gap</span>
                             <span className="text-indigo-500">{pause}ms</span>
                          </div>
                          <input 
                            type="range" min="0" max="2000" step="100" 
                            value={pause}
                            onChange={(e) => setPause(parseInt(e.target.value))}
                            className="w-full h-1.5 bg-black rounded-lg appearance-none cursor-pointer accent-indigo-600 shadow-inner" 
                          />
                       </div>
                    </div>
                 </div>

                 <div className="space-y-3 p-6 bg-black rounded-3xl border border-zinc-800 shadow-inner">
                    <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                       <Info className="w-3 h-3 text-indigo-500" /> Technical Identity
                    </h4>
                    <div className="grid grid-cols-2 gap-4 pt-2">
                       <div>
                          <p className="text-[8px] font-black text-zinc-600 uppercase mb-1">Provider ID</p>
                          <p className="text-xs font-bold text-zinc-300">{selectedVoice.providerVoice}</p>
                       </div>
                       <div>
                          <p className="text-[8px] font-black text-zinc-600 uppercase mb-1">Gender / Age</p>
                          <p className="text-xs font-bold text-zinc-300">{selectedVoice.gender} / {selectedVoice.age}</p>
                       </div>
                    </div>
                 </div>
              </div>

              <AnimatePresence>
                 {audioUrl && (
                   <motion.div
                     initial={{ opacity: 0, height: 0 }}
                     animate={{ opacity: 1, height: 'auto' }}
                     className="pt-6 border-t border-zinc-800 space-y-4"
                   >
                     <div className="flex items-center gap-4 p-4 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl">
                        <button 
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl shadow-indigo-600/20"
                        >
                           {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white translate-x-0.5" />}
                        </button>
                        <div className="flex-1 space-y-1">
                           <p className="text-xs font-black text-white uppercase tracking-widest">Master Audio Ready</p>
                           <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: isPlaying ? '100%' : '0%' }}
                                transition={{ duration: 5, ease: 'linear' }}
                                className="h-full bg-indigo-500" 
                              />
                           </div>
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-3">
                        <button 
                          onClick={() => downloadBase64File(audioUrl.split(',')[1], `${selectedVoice.displayName}_voice.wav`, 'audio/wav')}
                          className="flex items-center justify-center gap-2 py-3 bg-zinc-800 text-zinc-300 font-black rounded-xl hover:bg-zinc-700 hover:text-white transition-all text-[10px] uppercase tracking-widest"
                        >
                           <Download className="w-4 h-4" /> Download WAV
                        </button>
                        <button 
                          onClick={saveToProject}
                          className="flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white font-black rounded-xl hover:bg-indigo-500 transition-all text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-600/20"
                        >
                           <Save className="w-4 h-4" /> Save to Project
                        </button>
                     </div>
                   </motion.div>
                 )}
              </AnimatePresence>
           </div>

           <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl group cursor-pointer">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-500">
                 <History className="w-24 h-24" />
              </div>
              <h4 className="text-2xl font-black mb-2 tracking-tighter">Custom Voice Presets</h4>
              <p className="text-sm font-medium opacity-80 mb-6 leading-relaxed">Save your unique tuning as a custom character identity for recurring use.</p>
              <button className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-md border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white/30 transition-all">
                 <Plus className="w-4 h-4" /> Save as Preset
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}

