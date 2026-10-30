import React from 'react';
import { 
  LayoutDashboard, 
  PenTool, 
  Mic2, 
  Video, 
  UserCircle2, 
  Image as ImageIcon, 
  Layers, 
  Smile, 
  Subtitles, 
  Volume2, 
  Music, 
  MonitorPlay, 
  Eraser, 
  FolderHeart, 
  History, 
  CreditCard, 
  Settings, 
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShieldAlert,
  Menu,
  X,
  Crown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from './AuthProvider';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'story', label: 'Story Studio', icon: PenTool },
  { id: 'voice', label: 'Voice Studio', icon: Mic2 },
  { id: 'video', label: 'Video Studio', icon: Video },
  { id: 'character', label: 'Character Studio', icon: UserCircle2 },
  { id: 'background', label: 'Background Generator', icon: ImageIcon },
  { id: 'png', label: 'PNG Materials', icon: Layers },
  { id: 'image', label: 'AI Image Studio', icon: ImageIcon },
  { id: 'timeline', label: 'Timeline Editor', icon: MonitorPlay },
  { id: 'lipsync', label: 'Lip Sync Studio', icon: Smile },
  { id: 'subtitle', label: 'Subtitle Studio', icon: Subtitles },
  { id: 'sfx', label: 'Sound Effects', icon: Volume2 },
  { id: 'music', label: 'Music Studio', icon: Music },
  { id: 'thumbnail', label: 'Thumbnail Maker', icon: ImageIcon },
  { id: 'watermark', label: 'Watermark Editor', icon: Eraser },
  { id: 'projects', label: 'My Projects', icon: FolderHeart },
  { id: 'history', label: 'History', icon: History },
  { id: 'credits', label: 'Credits & Billing', icon: CreditCard },
  { id: 'pricing', label: 'Pricing & Plans', icon: Crown },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'help', label: 'Help & Support', icon: HelpCircle },
];

interface SidebarProps {
  activeTab: string;
  setActiveTab: (id: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({ 
  activeTab, 
  setActiveTab, 
  isCollapsed, 
  setIsCollapsed,
  isMobileOpen,
  onCloseMobile 
}: SidebarProps) {
  const { logout, userProfile } = useAuth();

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    if (onCloseMobile) onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-zinc-950 border-r border-zinc-800 text-zinc-400 overflow-hidden">
      {/* Logo */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          {(!isCollapsed || isMobileOpen) && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-bold text-white tracking-tight whitespace-nowrap"
            >
              PULSE AI
            </motion.span>
          )}
        </div>
        {isMobileOpen && (
          <button onClick={onCloseMobile} className="p-2 text-zinc-500 hover:text-white md:hidden">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-1 scrollbar-hide">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
              activeTab === item.id 
                ? 'bg-indigo-600/10 text-indigo-400 font-medium' 
                : 'hover:bg-zinc-900 hover:text-zinc-200'
            }`}
          >
            <item.icon className={`w-5 h-5 shrink-0 ${activeTab === item.id ? 'text-indigo-400' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
            {(!isCollapsed || isMobileOpen) && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="whitespace-nowrap"
              >
                {item.label}
              </motion.span>
            )}
          </button>
        ))}

        {userProfile?.role === 'admin' && (
          <div className="pt-4 mt-4 border-t border-zinc-900">
            <p className="px-3 mb-2 text-[10px] font-black text-zinc-600 uppercase tracking-widest">Admin</p>
            <button
              onClick={() => handleNavClick('admin')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                activeTab === 'admin' 
                  ? 'bg-red-500/10 text-red-400 font-medium' 
                  : 'hover:bg-zinc-900 hover:text-zinc-200'
              }`}
            >
              <ShieldAlert className={`w-5 h-5 shrink-0 ${activeTab === 'admin' ? 'text-red-400' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
              {(!isCollapsed || isMobileOpen) && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="whitespace-nowrap"
                >
                  Admin Console
                </motion.span>
              )}
            </button>
          </div>
        )}
      </nav>

      {/* Footer / User Profile */}
      <div className="p-4 border-t border-zinc-900 space-y-4">
        {(!isCollapsed || isMobileOpen) && (
          <div className="bg-zinc-900/50 rounded-xl p-3 border border-zinc-800/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden shrink-0">
                {userProfile?.photoURL ? (
                  <img src={userProfile.photoURL} alt="User" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <UserCircle2 className="w-6 h-6 text-zinc-600" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{userProfile?.displayName || 'User'}</p>
                <p className="text-xs text-indigo-400 font-semibold">{userProfile?.credits || 0} Credits</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex w-full items-center justify-center p-2 text-zinc-500 hover:text-white transition-colors"
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCloseMobile}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <motion.aside
        initial={{ x: '-100%' }}
        animate={{ x: isMobileOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed inset-y-0 left-0 w-72 z-50 md:hidden"
      >
        {sidebarContent}
      </motion.aside>

      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 250 }}
        className="hidden md:flex flex-col h-screen sticky top-0 overflow-hidden z-20 shrink-0"
      >
        {sidebarContent}
      </motion.aside>
    </>
  );
}
