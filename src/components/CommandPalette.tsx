import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Youtube, 
  Rss, 
  MessageSquare, 
  GitBranch, 
  Tv, 
  RefreshCw, 
  Bookmark, 
  Code2, 
  Monitor, 
  Smartphone, 
  Check, 
  ArrowRight,
  Sparkles,
  Command,
  CornerDownLeft,
  X,
  Plus
} from 'lucide-react';
import { FeedItem, PlatformSlug } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  items: FeedItem[];
  onSelectItem: (item: FeedItem) => void;
  onSync: () => void;
  onToggleViewMode: () => void;
  onOpenArchitecture: () => void;
  onSelectPlatform: (p: PlatformSlug | 'all') => void;
  onOpenAddSource?: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  items,
  onSelectItem,
  onSync,
  onToggleViewMode,
  onOpenArchitecture,
  onSelectPlatform,
  onOpenAddSource,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
      setQuery('');
    }
  }, [isOpen]);

  // Global keydown for ⌘K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open trigger handled in parent
        }
      }
      if (isOpen && e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filter actions and items
  const actions = [
    { id: 'act-add-video', title: 'Agregar Video o Canal (YouTube / Twitch / RSS)', icon: <Plus className="w-4 h-4 text-[#00F0FF]" />, action: () => { onOpenAddSource?.(); onClose(); }, category: 'Acciones Rápidas', shortcut: 'V' },
    { id: 'act-sync', title: 'Sincronizar todos los feeds ahora', icon: <RefreshCw className="w-4 h-4 text-[#00F0FF]" />, action: () => { onSync(); onClose(); }, category: 'Acciones del Sistema', shortcut: 'S' },
    { id: 'act-yt', title: 'Filtrar por canal YouTube', icon: <Youtube className="w-4 h-4 text-red-400" />, action: () => { onSelectPlatform('youtube'); onClose(); }, category: 'Filtros Rápidos' },
    { id: 'act-rss', title: 'Filtrar por RSS / Atom', icon: <Rss className="w-4 h-4 text-[#00F0FF]" />, action: () => { onSelectPlatform('rss'); onClose(); }, category: 'Filtros Rápidos' },
    { id: 'act-reddit', title: 'Filtrar por Reddit', icon: <MessageSquare className="w-4 h-4 text-orange-400" />, action: () => { onSelectPlatform('reddit'); onClose(); }, category: 'Filtros Rápidos' },
    { id: 'act-gh', title: 'Filtrar por GitHub', icon: <GitBranch className="w-4 h-4 text-purple-400" />, action: () => { onSelectPlatform('github'); onClose(); }, category: 'Filtros Rápidos' },
  ];

  const matchedActions = actions.filter(a => a.title.toLowerCase().includes(query.toLowerCase()));
  const matchedItems = items.filter(i => 
    i.title.toLowerCase().includes(query.toLowerCase()) || 
    i.authorName.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 6);

  const combinedResults: { type: 'action' | 'item'; data: any }[] = [
    ...matchedActions.map(a => ({ type: 'action' as const, data: a })),
    ...matchedItems.map(i => ({ type: 'item' as const, data: i }))
  ];

  const handleKeyDownNav = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, combinedResults.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + combinedResults.length) % Math.max(1, combinedResults.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const current = combinedResults[selectedIndex];
      if (current) {
        if (current.type === 'action') {
          current.data.action();
        } else {
          onSelectItem(current.data);
          onClose();
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-4 sm:pt-[12vh] px-3 sm:px-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      {/* Click outside to dismiss */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Raycast-style Omnibox Container */}
      <div className="relative w-full max-w-xl max-h-[88vh] bg-[#111726] border border-white/[0.1] rounded-2xl shadow-2xl shadow-black/90 overflow-hidden z-10 flex flex-col">
        {/* Input Bar */}
        <div className="flex items-center px-3 sm:px-4 py-3 sm:py-3.5 border-b border-white/[0.07] bg-[#141C2E]">
          <Search className="w-4 h-4 text-[#00F0FF] mr-2.5 sm:mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDownNav}
            placeholder="Buscar feeds o ejecutar comandos..."
            className="w-full bg-transparent text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none font-sans"
          />
          <div className="flex items-center gap-1 shrink-0 ml-2">
            <button 
              onClick={onClose} 
              className="sm:hidden text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
            <span className="hidden sm:inline-block kbd-badge">ESC</span>
          </div>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-1">
          {combinedResults.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500 font-mono">
              No se encontraron comandos o publicaciones para "{query}"
            </div>
          ) : (
            combinedResults.map((res, index) => {
              const isSelected = index === selectedIndex;

              if (res.type === 'action') {
                const act = res.data;
                return (
                  <div
                    key={act.id}
                    onClick={act.action}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150 ${
                      isSelected 
                        ? 'bg-[#1A2337] text-white shadow-sm border border-white/[0.08]' 
                        : 'text-slate-300 hover:bg-[#151D2E] border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <div className="p-1 rounded-md bg-white/[0.04]">
                        {act.icon}
                      </div>
                      <span className="text-xs font-medium truncate">{act.title}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {act.shortcut && (
                        <span className="kbd-badge">{act.shortcut}</span>
                      )}
                      {isSelected && (
                        <CornerDownLeft className="w-3.5 h-3.5 text-[#00F0FF]" />
                      )}
                    </div>
                  </div>
                );
              } else {
                const item = res.data;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      onSelectItem(item);
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150 ${
                      isSelected 
                        ? 'bg-[#1A2337] text-white shadow-sm border border-white/[0.08]' 
                        : 'text-slate-300 hover:bg-[#151D2E] border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate mr-2">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.06] text-[#00F0FF] uppercase shrink-0">
                        {item.platform}
                      </span>
                      <span className="text-xs font-medium truncate text-slate-200">
                        {item.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 text-[11px] text-slate-500 font-mono">
                      <span>{item.authorName}</span>
                      {isSelected && (
                        <CornerDownLeft className="w-3.5 h-3.5 text-[#00F0FF]" />
                      )}
                    </div>
                  </div>
                );
              }
            })
          )}
        </div>

        {/* Raycast Footer Helper */}
        <div className="px-4 py-2 bg-[#0C111C] border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="kbd-badge">↑</span> <span className="kbd-badge">↓</span> navegar
            </span>
            <span className="flex items-center gap-1">
              <span className="kbd-badge">↵</span> seleccionar
            </span>
          </div>
          <span className="text-slate-500">StreamPulse Command Palette</span>
        </div>
      </div>
    </div>
  );
};
