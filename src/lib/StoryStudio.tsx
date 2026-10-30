import React, { useState } from 'react';
import { 
  PenTool, 
  Sparkles, 
  RefreshCw, 
  Send, 
  Loader2, 
  Clock, 
  ChevronRight, 
  FileText,
  AlertCircle,
  Save,
  Trash2,
  Plus,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from './AuthProvider';
import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const categories = [
  'Moral Stories', 'Horror Stories', 'Mystery Stories', 'Comedy Stories', 
  'Emotional Stories', 'Family Stories', 'Adventure Stories', 'Fantasy Stories'
];

const durations = ['5 Minutes', '10 Minutes', '20 Minutes', '30 Minutes', '40 Minutes', '60 Minutes'];
const tones = ['Funny', 'Serious', 'Mysterious', 'Educational', 'Emotional'];

const pricing: Record<string, number> = {
  '5 Minutes': 25,
  '10 Minutes': 50,
  '20 Minutes': 100,
  '30 Minutes': 150,
  '40 Minutes': 200,
  '60 Minutes': 300
};

export function StoryStudio() {
  const { user, userProfile } = useAuth();
  const [step, setStep] = useState<'titles' | 'form' | 'editor'>('titles');
  const [topic, setTopic] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [titles, setTitles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState('');
  const [duration, setDuration] = useState(durations[0]);
  const [tone, setTone] = useState(tones[0]);
  const [instructions, setInstructions] = useState('');
  const [story, setStory] = useState<any>(null);

  const generateTitles = async (isMore = false) => {
    if (!topic) return;
    setLoading(true);
    try {
      const res = await fetch('/api/story/generate-titles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          topic, 
          category,
          excludeTitles: isMore ? titles : []
        }),
      });
      const data = await res.json();
      if (isMore) {
        setTitles(prev => [...prev, ...(data.titles || [])]);
      } else {
        setTitles(data.titles || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const generateStory = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/story/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: user?.uid,
          title: selectedTitle, 
          category, 
          duration, 
          tone, 
          customInstructions: instructions 
        }),
      });
      const data = await res.json();
      setStory(data);
      setStep('editor');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const saveToProject = async () => {
    if (!user || !story) return;
    try {
      await addDoc(collection(db, 'generations'), {
        userId: user.uid,
        type: 'story',
        title: selectedTitle,
        content: story,
        createdAt: serverTimestamp(),
      });
      alert('Story saved to projects!');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto p-4 md:p-8">
      {/* Progress Stepper */}
      <div className="flex items-center gap-4 mb-12 overflow-x-auto pb-4 scrollbar-hide">
        {[
          { id: 'titles', label: '1. Title Discovery' },
          { id: 'form', label: '2. Production Settings' },
          { id: 'editor', label: '3. Script Studio' }
        ].map((s, i) => (
          <React.Fragment key={s.id}>
            <div className={`flex items-center gap-3 whitespace-nowrap transition-all ${step === s.id ? 'text-indigo-500 font-black' : 'text-zinc-600'}`}>
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border-2 transition-all ${step === s.id ? 'border-indigo-500 bg-indigo-500/10 rotate-3' : 'border-zinc-800'}`}>
                {i + 1}
              </div>
              <span className="text-sm uppercase tracking-widest">{s.label}</span>
            </div>
            {i < 2 && <div className="w-12 h-px bg-zinc-800 shrink-0" />}
          </React.Fragment>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 'titles' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-4xl mx-auto space-y-10"
          >
            <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-10 md:p-14 space-y-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-5">
                 <PenTool className="w-40 h-40" />
              </div>
              <div className="space-y-3 relative z-10">
                <h2 className="text-4xl font-black text-white tracking-tighter">Brainstorm Your Story</h2>
                <p className="text-zinc-500 text-lg max-w-2xl">Describe your core idea and our AI will help you craft the perfect title for your Hindi cartoon.</p>
              </div>

              <div className="space-y-6 relative z-10">
                <div className="space-y-4">
                   <label className="text-xs font-black text-zinc-600 uppercase tracking-[0.2em]">Story Concept</label>
                   <textarea
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. A wise old owl who teaches the forest animals about patience during a drought..."
                    className="w-full bg-black border border-zinc-800 rounded-3xl px-8 py-6 text-white text-lg focus:outline-none focus:border-indigo-500 transition-all resize-none shadow-inner"
                    rows={4}
                  />
                </div>
                
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1 space-y-4">
                     <label className="text-xs font-black text-zinc-600 uppercase tracking-[0.2em]">Genre / Category</label>
                     <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-black border border-zinc-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-indigo-500 appearance-none transition-all"
                      >
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={generateTitles}
                      disabled={loading || !topic}
                      className="w-full md:w-auto px-12 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 text-white font-black rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-indigo-600/30 active:scale-95"
                    >
                      {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6" />}
                      Generate 10 Titles
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {titles.length > 0 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {titles.map((title, i) => (
                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      key={i}
                      onClick={() => {
                        setSelectedTitle(title);
                        setStep('form');
                      }}
                      className="p-6 bg-zinc-900 border border-zinc-800 rounded-3xl text-left hover:border-indigo-500 hover:bg-indigo-600/5 transition-all flex items-center justify-between group shadow-lg"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-black text-zinc-700 bg-black w-8 h-8 rounded-lg flex items-center justify-center group-hover:text-indigo-500 transition-colors">{i+1}</span>
                        <span className="text-zinc-300 font-bold group-hover:text-white transition-colors">{title}</span>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center group-hover:bg-indigo-600 transition-all">
                        <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-white" />
                      </div>
                    </motion.button>
                  ))}
                </div>
                
                <div className="flex justify-center">
                   <button
                    onClick={() => generateTitles(true)}
                    disabled={loading}
                    className="px-8 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white font-bold rounded-xl transition-all flex items-center gap-2 border border-zinc-700"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    Generate 10 More Titles
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {step === 'form' && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="max-w-3xl mx-auto space-y-8"
          >
            <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-10 md:p-14 space-y-10 shadow-2xl">
              <div className="space-y-4">
                <button 
                  onClick={() => setStep('titles')}
                  className="text-zinc-500 hover:text-white text-xs font-black uppercase tracking-widest flex items-center gap-2 mb-6 group transition-all"
                >
                  <div className="p-2 rounded-lg bg-zinc-800 group-hover:bg-indigo-600 transition-colors">
                     <ChevronRight className="w-4 h-4 rotate-180 text-white" /> 
                  </div>
                  Back to Titles
                </button>
                <h2 className="text-4xl font-black text-white tracking-tighter">Production Settings</h2>
                <p className="text-zinc-500 text-lg">Fine-tune the narrative tone and technical parameters for your script.</p>
              </div>

              <div className="space-y-8">
                <div className="p-8 bg-black rounded-[2rem] border border-zinc-800 relative group overflow-hidden">
                  <div className="absolute inset-0 bg-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="text-xs font-black text-indigo-500 uppercase tracking-[0.2em] block mb-3 relative z-10">Working Title</span>
                  <p className="text-2xl font-black text-white relative z-10">{selectedTitle}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-zinc-600 uppercase tracking-widest">Story Duration</label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full bg-black border border-zinc-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-indigo-500 transition-all appearance-none shadow-inner"
                    >
                      {durations.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black text-zinc-600 uppercase tracking-widest">Narrative Tone</label>
                    <select
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                      className="w-full bg-black border border-zinc-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-indigo-500 transition-all appearance-none shadow-inner"
                    >
                      {tones.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Suspense Level</label>
                      <input type="range" min="0" max="10" className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                   </div>
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Comedy Level</label>
                      <input type="range" min="0" max="10" className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-600" />
                   </div>
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Emotional Depth</label>
                      <input type="range" min="0" max="10" className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-rose-600" />
                   </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black text-zinc-600 uppercase tracking-widest">Director's Notes (Optional)</label>
                  <textarea
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="Describe specific characters or plot points you want to include..."
                    rows={4}
                    className="w-full bg-black border border-zinc-800 rounded-3xl px-8 py-6 text-white focus:outline-none focus:border-indigo-500 transition-all resize-none shadow-inner"
                  />
                </div>

                <div className="space-y-4">
                  <button
                    onClick={generateStory}
                    disabled={loading}
                    className="w-full py-6 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 text-white font-black rounded-3xl transition-all flex items-center justify-center gap-3 shadow-2xl shadow-indigo-600/30 active:scale-[0.98]"
                  >
                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <PenTool className="w-6 h-6" />}
                    Compose Professional Script
                  </button>
                  <div className="flex justify-between items-center px-4">
                     <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Tier: {duration}</p>
                     <p className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em]">Estimated Cost: {pricing[duration] || 25} Credits</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === 'editor' && story && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row gap-8"
          >
            {/* Story Content */}
            <div className="flex-1 space-y-8">
              <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 md:p-12 space-y-8 shadow-2xl">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                     <h2 className="text-3xl font-black text-white tracking-tighter">{selectedTitle}</h2>
                     <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest">{category} · {duration} Script</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={saveToProject} className="p-3 bg-zinc-800 text-zinc-400 hover:text-indigo-400 rounded-xl transition-all">
                      <Save className="w-5 h-5" />
                    </button>
                    <button className="p-3 bg-zinc-800 text-zinc-400 hover:text-red-400 rounded-xl transition-all">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <div className="prose prose-invert max-w-none">
                  <div className="p-10 bg-black rounded-3xl border border-zinc-800 text-zinc-400 leading-[1.8] text-lg italic shadow-inner">
                    {story.fullStory}
                  </div>
                </div>

                <div className="p-6 bg-indigo-600/5 border border-indigo-500/20 rounded-3xl flex gap-6 items-center">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-500 shrink-0">
                     <Sparkles className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-indigo-400 font-black text-xs uppercase tracking-[0.2em] mb-1">Moral Lesson</h4>
                    <p className="text-white font-bold text-lg leading-snug">{story.moral}</p>
                  </div>
                </div>
              </div>

              {/* Scenes List */}
              <div className="space-y-6">
                <h3 className="text-2xl font-black text-white flex items-center gap-3 px-2">
                  <FileText className="w-6 h-6 text-indigo-500" />
                  Production Storyboard
                </h3>
                <div className="space-y-6">
                  {story.scenes.map((scene: any) => (
                    <div key={scene.sceneNumber} className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-xl">
                      <div className="px-10 py-5 bg-zinc-800/30 border-b border-zinc-800 flex items-center justify-between">
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Phase {scene.sceneNumber}</span>
                        <div className="flex items-center gap-2">
                           <Clock className="w-3.5 h-3.5 text-indigo-500" />
                           <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{scene.location}</span>
                        </div>
                      </div>
                      <div className="p-10 space-y-8">
                        <div className="flex gap-6">
                          <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center shrink-0 shadow-lg">
                            <Send className="w-5 h-5 text-zinc-500" />
                          </div>
                          <p className="text-lg text-zinc-300 leading-relaxed font-medium">{scene.narration}</p>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-4">
                          {scene.dialogue.map((d: any, di: number) => (
                            <div key={di} className="flex flex-col md:flex-row gap-4 p-6 rounded-3xl bg-black/40 border border-zinc-800/50 group hover:border-indigo-500/30 transition-all">
                              <div className="md:w-32 shrink-0">
                                 <span className="text-xs font-black text-indigo-500 uppercase tracking-widest block mb-1">{d.character}</span>
                                 <span className="text-[9px] font-black text-zinc-600 uppercase tracking-tighter bg-zinc-800/50 px-2 py-0.5 rounded">{d.emotion}</span>
                              </div>
                              <div className="flex-1">
                                <p className="text-lg text-white leading-relaxed">{d.line}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="pt-8 border-t border-zinc-800">
                          <div className="flex items-center gap-2 mb-3">
                             <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                             <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">AI Visual Blueprint</p>
                          </div>
                          <p className="text-sm text-zinc-400 italic font-medium leading-relaxed bg-black/30 p-6 rounded-2xl border border-zinc-800/30">{scene.visualDescription}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button className="w-full py-6 border-4 border-dashed border-zinc-800 rounded-[2.5rem] text-zinc-600 font-black text-sm hover:border-indigo-500 hover:text-indigo-400 transition-all flex items-center justify-center gap-3 uppercase tracking-[0.3em] group">
                   <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform" /> Add Scene Segment
                </button>
              </div>
            </div>

            {/* Editor Sidebar */}
            <div className="lg:w-80 shrink-0">
              <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 sticky top-28 space-y-10 shadow-2xl">
                <div className="space-y-4">
                  <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3">
                    <RefreshCw className="w-4 h-4 text-indigo-500" />
                    Studio Actions
                  </h4>
                  <div className="space-y-2">
                    {[
                      'Rewrite Selected', 'Expand Dialogue', 'Shorten Scene', 
                      'Add Comedy', 'Increase Suspense', 'Fix Continuity'
                    ].map(action => (
                      <button 
                        key={action}
                        className="w-full text-left px-5 py-3.5 rounded-2xl bg-black/40 border border-zinc-800/50 text-zinc-400 font-bold text-xs hover:bg-zinc-800 hover:text-white transition-all flex items-center justify-between group"
                      >
                        {action}
                        <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all" />
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3">
                    <Download className="w-4 h-4 text-indigo-500" />
                    Export Options
                  </h4>
                  <div className="space-y-3">
                    <button className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 text-xs uppercase tracking-widest active:scale-95">
                      Save & Continue
                    </button>
                    <button className="w-full py-4 bg-zinc-800 text-zinc-400 font-black rounded-2xl hover:bg-zinc-700 hover:text-white transition-all text-xs uppercase tracking-widest active:scale-95">
                      Export PDF
                    </button>
                    <button className="w-full py-4 bg-zinc-800 text-zinc-400 font-black rounded-2xl hover:bg-zinc-700 hover:text-white transition-all text-xs uppercase tracking-widest active:scale-95">
                      Export TXT
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
