import React, { useState, useEffect } from 'react';
import { 
  FolderHeart, 
  Search, 
  Plus, 
  MoreVertical, 
  Edit2, 
  Copy, 
  Trash2, 
  Filter, 
  Clock, 
  ChevronRight,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from './AuthProvider';
import { db } from './firebase';
import { collection, query, where, getDocs, orderBy, deleteDoc, doc, addDoc, serverTimestamp, updateDoc } from 'firebase/firestore';

export function ProjectManager({ onOpenProject }: { onOpenProject: (id: string) => void }) {
  const { user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  const fetchProjects = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, 'projects'),
        where('userId', '==', user.uid),
        orderBy('updatedAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const projs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProjects(projs);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const createProject = async () => {
    if (!user) return;
    const name = prompt("Enter project name:");
    if (!name) return;

    try {
      const newProj = {
        userId: user.uid,
        name,
        description: '',
        category: 'General',
        status: 'draft',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      const docRef = await addDoc(collection(db, 'projects'), newProj);
      fetchProjects();
      onOpenProject(docRef.id);
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await deleteDoc(doc(db, 'projects', id));
      fetchProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) && 
    (filter === 'all' || p.status === filter)
  );

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <FolderHeart className="w-8 h-8 text-indigo-500" />
            My Projects
          </h1>
          <p className="text-zinc-500">Manage your cartoon series and moral stories.</p>
        </div>
        <button 
          onClick={createProject}
          className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-500 transition-all flex items-center gap-2 shadow-xl shadow-indigo-600/20"
        >
          <Plus className="w-5 h-5" />
          New Project
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all"
          />
        </div>
        <div className="flex gap-2">
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="draft">Drafts</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
          <button className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-400 hover:text-white transition-all">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-500" />
          <p className="text-zinc-500 font-medium">Loading projects...</p>
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden group hover:border-zinc-700 transition-all flex flex-col"
            >
              <div className="aspect-video bg-black relative">
                {project.thumbnailUrl ? (
                  <img src={project.thumbnailUrl} alt={project.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-800">
                    <FolderHeart className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button 
                    onClick={() => onOpenProject(project.id)}
                    className="p-3 rounded-xl bg-white text-black hover:bg-zinc-200 transition-all shadow-xl"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => deleteProject(project.id)}
                    className="p-3 rounded-xl bg-red-600 text-white hover:bg-red-500 transition-all shadow-xl"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="absolute top-4 left-4">
                  <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                    project.status === 'completed' ? 'bg-emerald-500 text-white' : 
                    project.status === 'active' ? 'bg-indigo-500 text-white' : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    {project.status}
                  </span>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-white font-bold mb-1 truncate">{project.name}</h3>
                <p className="text-xs text-zinc-500 mb-4 line-clamp-2">{project.description || 'No description provided.'}</p>
                <div className="mt-auto pt-4 border-t border-zinc-800 flex items-center justify-between text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {project.updatedAt?.toDate().toLocaleDateString()}
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
            <FolderHeart className="w-10 h-10 text-zinc-800" />
          </div>
          <div className="max-w-xs">
            <h3 className="text-white font-bold mb-1">No Projects Found</h3>
            <p className="text-sm text-zinc-500">Create your first project to start organizing your cartoon production.</p>
          </div>
          <button 
            onClick={createProject}
            className="mt-4 px-6 py-2.5 rounded-xl bg-zinc-900 text-white font-medium hover:bg-zinc-800 border border-zinc-800 transition-all"
          >
            Create Project
          </button>
        </div>
      )}
    </div>
  );
}
