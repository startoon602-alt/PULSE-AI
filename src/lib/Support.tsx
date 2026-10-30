import React, { useState } from 'react';
import { 
  HelpCircle, 
  Search, 
  MessageSquare, 
  BookOpen, 
  Video, 
  FileQuestion, 
  Bug, 
  ChevronRight,
  ExternalLink,
  Loader2,
  Send
} from 'lucide-react';
import { motion } from 'framer-motion';

export function Support() {
  const [loading, setLoading] = useState(false);

  const faqs = [
    { q: 'How do I claim my 5,000 welcome credits?', a: 'New verified users automatically receive 5,000 credits upon first sign-in. Check your Credits & Billing page for details.' },
    { q: 'Is the generated content copyright-free?', a: 'Yes, all AI-generated characters, backgrounds, and music in PULSE AI are royalty-free and can be used for YouTube monetization.' },
    { q: 'Can I reuse characters across different projects?', a: 'Absolutely! Save your character to the Asset Library to reuse them with consistent traits and voices in any project.' },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 text-center md:text-left">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center md:justify-start gap-3">
            <HelpCircle className="w-8 h-8 text-indigo-500" />
            Help & Support
          </h1>
          <p className="text-zinc-500">Need help with your production? We're here to assist you.</p>
        </div>
        <div className="flex items-center gap-3 justify-center">
           <button className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-500 transition-all flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Live Chat
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[
           { label: 'Video Tutorials', icon: Video, desc: 'Watch step-by-step guides on cartoon production.', color: 'indigo' },
           { label: 'Documentation', icon: BookOpen, desc: 'Detailed reference for all AI studio tools.', color: 'purple' },
           { label: 'Community Forum', icon: ExternalLink, desc: 'Connect with other cartoon creators.', color: 'blue' },
         ].map((box, i) => (
           <button key={i} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 text-left hover:border-indigo-500 transition-all group">
              <div className={`w-12 h-12 rounded-2xl bg-${box.color}-500/10 text-${box.color}-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                 <box.icon className="w-6 h-6" />
              </div>
              <h3 className="text-white font-bold mb-1">{box.label}</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">{box.desc}</p>
           </button>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-8">
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-6">
               <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <FileQuestion className="w-5 h-5 text-indigo-500" />
                  Frequently Asked Questions
               </h2>
               <div className="space-y-4">
                  {faqs.map((faq, i) => (
                    <div key={i} className="p-5 bg-black rounded-2xl border border-zinc-800 space-y-2">
                       <h4 className="text-sm font-bold text-white">{faq.q}</h4>
                       <p className="text-xs text-zinc-500 leading-relaxed">{faq.a}</p>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         <div className="space-y-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-6">
               <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                     <Bug className="w-5 h-5 text-red-500" />
                     Report an Issue
                  </h3>
                  <p className="text-xs text-zinc-500">Encountered a bug or have a suggestion? Let us know.</p>
               </div>
               <div className="space-y-4">
                  <input type="text" placeholder="Subject" className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-indigo-500 outline-none" />
                  <textarea rows={4} placeholder="Describe the issue..." className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-indigo-500 outline-none resize-none" />
                  <button className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/20">
                     <Send className="w-4 h-4" /> Send Message
                  </button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
