import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  ExternalLink, 
  Loader2,
  ImageIcon,
  Mic2,
  Video,
  UserCircle2,
  Music,
  Plus
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from './AuthProvider';
import { db } from './firebase';
import { collection, query, where, getDocs, orderBy, deleteDoc, doc } from 'firebase/firestore';

const assetTypes = [
  { id: 'all', label: 'All Assets', icon: Layers },
  { id: 'character', label: 'Characters', icon: UserCircle2 },
  { id: 'background', label: 'Backgrounds', icon: ImageIcon },
  { id: 'voice', label: 'Voiceovers', icon: Mic2 },
  { id: 'music', label: 'Music', icon: Music },
  { id: 'video', label: 'Videos', icon: Video },
];

export function AssetLibrary() {
  const { user } = useAuth();
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    if (user) {
      fetchAssets();
    }
  }, [user, selectedType]);

  const fetchAssets = async () => {
    if (!user) return;
    setLoading(true);
    try {
      let q = query(
        collection(db, 'assets'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      
      if (selectedType !== 'all') {
        q = query(q, where('type', '==', selectedType));
      }

      const querySnapshot = await getDocs(q);
      setAssets(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching assets:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteAsset = async (id: string) => {
    if (!confirm("Are you sure you want to delete this asset?")) return;
    try {
      await deleteDoc(doc(db, 'assets', id));
      fetchAssets();
    } catch (error) {
      console.error("Error deleting asset:", error);
    }
  };

  const filteredAssets = assets.filter(a => 
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Layers className="w-8 h-8 text-indigo-500" />
            Asset Library
          </h1>
          <p className="text-zinc-500">Centralized storage for your cartoon components.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="lg:w-64 space-y-2">
          {assetTypes.map(type => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                selectedType === type.id 
                  ? 'bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-600/20' 
                  : 'bg-zinc-900/50 text-zinc-500 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <type.icon className="w-5 h-5" />
              {type.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search your library..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-12 h-12 animate-spin text-indigo-500" />
              <p className="text-zinc-500 font-medium">Indexing your assets...</p>
            </div>
          ) : filteredAssets.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAssets.map((asset) => (
                <motion.div
                  key={asset.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden group hover:border-zinc-700 transition-all"
                >
                  <div className="aspect-square bg-black relative">
                    {asset.type === 'voice' || asset.type === 'music' ? (
                      <div className="w-full h-full flex items-center justify-center text-indigo-500/20">
                        {asset.type === 'voice' ? <Mic2 className="w-16 h-16" /> : <Music className="w-16 h-16" />}
                      </div>
                    ) : (
                      <img src={asset.url} alt={asset.name} className="w-full h-full object-cover" />
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                      <div className="flex gap-2">
                        <a 
                          href={asset.url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="p-3 rounded-xl bg-white text-black hover:bg-zinc-200 transition-all"
                        >
                          <Download className="w-5 h-5" />
                        </a>
                        <button 
                          onClick={() => deleteAsset(asset.id)}
                          className="p-3 rounded-xl bg-red-600 text-white hover:bg-red-500 transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      <button className="text-xs font-bold text-white hover:underline flex items-center gap-1">
                        Use in Project <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-white font-bold text-sm truncate">{asset.name}</h3>
                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-1">{asset.type}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <div className="w-20 h-20 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center rotate-6">
                <Layers className="w-10 h-10 text-zinc-800" />
              </div>
              <div className="max-w-xs">
                <h3 className="text-white font-bold mb-1">No Assets Found</h3>
                <p className="text-sm text-zinc-500">Generated content will appear here once saved to your library.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
