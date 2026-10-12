import React, { useState } from 'react';
import { 
  Home, 
  Grid, 
  Bookmark, 
  Settings, 
  Share2, 
  Play, 
  BookOpen, 
  Check, 
  Search, 
  Download, 
  RefreshCw,
  Flame,
  Star,
  Sparkles,
  Layers,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { FeedItem, Source } from '../types';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface MobilePWAViewProps {
  items: FeedItem[];
  sources: Source[];
  onPlayPiP: (item: FeedItem) => void;
  onOpenReader: (item: FeedItem) => void;
  onToggleBookmark: (id: string) => void;
  onToggleRead: (id: string) => void;
  onSync: () => void;
  isSyncing: boolean;
  onOpenArchitecture: () => void;
}

export const MobilePWAView: React.FC<MobilePWAViewProps> = ({
  items,
  sources,
  onPlayPiP,
  onOpenReader,
  onToggleBookmark,
  onToggleRead,
  onSync,
  isSyncing,
  onOpenArchitecture,
}) => {
  const [activeTab, setActiveTab] = useState<'feed' | 'categories' | 'saved' | 'settings'>('feed');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchMobile, setSearchMobile] = useState('');
  const [swipeFeedback, setSwipeFeedback] = useState<string | null>(null);

  const { isInstallable, install } = usePWAInstall();

  const triggerHaptic = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(10);
      } catch (e) {
        // ignore
      }
    }
  };

  const handleTabChange = (tab: 'feed' | 'categories' | 'saved' | 'settings') => {
    triggerHaptic();
    setActiveTab(tab);
  };

  const handleSwipeAction = (item: FeedItem, direction: 'right' | 'left') => {
    triggerHaptic();
    if (direction === 'right') {
      onToggleBookmark(item.id);
      setSwipeFeedback(`"${item.title.slice(0, 20)}..." guardado en favoritos`);
    } else {
      onToggleRead(item.id);
      setSwipeFeedback(`"${item.title.slice(0, 20)}..." marcado como leído`);
    }
    setTimeout(() => setSwipeFeedback(null), 2000);
  };

  // Filter items
  const displayedItems = items.filter((item) => {
    if (activeTab === 'saved') {
      return item.isBookmarked;
    }
    if (activeTab === 'categories' && activeCategory !== 'All') {
      const source = sources.find(s => s.id === item.sourceId);
      if (source && source.category !== activeCategory) return false;
    }
    if (searchMobile.trim()) {
      const q = searchMobile.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.authorName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const categories = ['All', 'Dev', 'Tech', 'Gaming', 'News'];

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#090D16] text-slate-100 flex flex-col relative pb-28 border-x border-white/[0.06] shadow-2xl">
      {/* Top Native Mobile Header */}
      <div className="sticky top-0 z-30 bg-[#0B101D]/90 backdrop-blur-md border-b border-white/[0.06] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22C55E]"></span>
          </span>
          <span className="font-heading font-extrabold text-sm tracking-tight text-white">
            STREAMPULSE
          </span>
          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/[0.06] border border-white/[0.08] text-slate-400">
            PWA
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              triggerHaptic();
              onSync();
            }}
            disabled={isSyncing}
            className="p-1.5 rounded-lg bg-[#141C2E] border border-white/[0.08] text-slate-300 hover:text-white"
            title="Sincronizar"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-[#00F0FF]' : ''}`} />
          </button>

          {isInstallable && (
            <button
              onClick={() => {
                triggerHaptic();
                install();
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#22C55E]/15 border border-[#22C55E]/30 text-[#22C55E] text-[11px] font-mono font-medium"
            >
              <Download className="w-3 h-3" />
              Instalar
            </button>
          )}
        </div>
      </div>

      {/* Search Input */}
      <div className="px-4 pt-3 pb-1">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchMobile}
            onChange={(e) => setSearchMobile(e.target.value)}
            placeholder="Buscar publicaciones..."
            className="w-full bg-[#111726] border border-white/[0.07] focus:border-white/[0.18] rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none font-sans"
          />
        </div>
      </div>

      {/* Category Pills */}
      {(activeTab === 'feed' || activeTab === 'categories') && (
        <div className="px-4 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                triggerHaptic();
                setActiveCategory(cat);
              }}
              className={`px-3 py-1 rounded-full text-xs font-mono transition ${
                activeCategory === cat
                  ? 'bg-white/[0.12] text-white font-medium border border-white/[0.16]'
                  : 'bg-[#111726] text-slate-400 hover:text-slate-200 border border-white/[0.05]'
              }`}
            >
              {cat === 'All' ? 'Todo' : cat}
            </button>
          ))}
        </div>
      )}

      {/* Gesture Helper Hint */}
      <div className="px-4 py-1 flex items-center justify-between text-[10px] text-slate-500 font-mono">
        <span className="flex items-center gap-1">
          <ArrowRight className="w-2.5 h-2.5 text-amber-400" /> Deslizar der: Guardar
        </span>
        <span className="flex items-center gap-1">
          Deslizar izq: Leído <ArrowLeft className="w-2.5 h-2.5 text-[#22C55E]" />
        </span>
      </div>

      {/* Feedback Toast */}
      {swipeFeedback && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#161F33] border border-white/[0.12] text-white text-xs font-sans px-4 py-2 rounded-full shadow-2xl animate-fadeIn">
          {swipeFeedback}
        </div>
      )}

      {/* Feed List */}
      <div className="flex-1 px-3 py-2 space-y-2">
        {displayedItems.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-500 font-mono">
            {activeTab === 'saved' ? 'No tienes elementos guardados.' : 'Sin publicaciones.'}
          </div>
        ) : (
          displayedItems.map((item) => {
            const isVideo = item.platform === 'youtube' || item.platform === 'twitch' || item.mediaType === 'youtube_video' || item.mediaType === 'twitch_stream';

            return (
              <div
                key={item.id}
                className={`relative rounded-xl p-3 border transition-all duration-150 ${
                  item.isRead
                    ? 'bg-[#0B101D]/75 border-white/[0.04] text-slate-400'
                    : 'bg-[#131B2D] border-white/[0.08] text-slate-100 shadow-sm'
                }`}
              >
                {/* Platform & Author */}
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1.5">
                  <div className="flex items-center gap-1.5 truncate max-w-[200px]">
                    {!item.isRead ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] shadow-[0_0_6px_#00F0FF] shrink-0" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-600 shrink-0" />
                    )}
                    <span className="text-[10px] font-semibold text-[#00F0FF] uppercase">
                      [{item.platform}]
                    </span>
                    <span className="truncate text-slate-300 font-medium">
                      {item.authorName}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500">{item.publishedAt}</span>
                </div>

                {/* Title */}
                <h3
                  onClick={() => {
                    triggerHaptic();
                    isVideo ? onPlayPiP(item) : onOpenReader(item);
                  }}
                  className="text-[13px] font-heading font-semibold text-slate-100 active:text-[#00F0FF] leading-snug cursor-pointer"
                >
                  {item.title}
                </h3>

                {/* Summary */}
                {item.summary && (
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {item.summary}
                  </p>
                )}

                {/* Tag chips */}
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1 mt-2">
                    {item.tags.slice(0, 3).map((tag) => (
                      <span 
                        key={tag}
                        className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/[0.04] border border-white/[0.06] text-slate-400"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Mobile Action Ribbon & Gestures */}
                <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-white/[0.05] text-[11px] font-mono">
                  {/* Left: Metrics */}
                  <div className="flex items-center gap-2 text-slate-500 text-[10px]">
                    {item.metrics?.upvotes !== undefined && (
                      <span className="flex items-center gap-1 text-orange-400">
                        <Flame className="w-3 h-3 text-orange-500" />
                        {item.metrics.upvotes}
                      </span>
                    )}
                    {item.metrics?.stars !== undefined && (
                      <span className="flex items-center gap-1 text-amber-400">
                        <Star className="w-3 h-3 fill-amber-400" />
                        {item.metrics.stars}
                      </span>
                    )}
                  </div>

                  {/* Right: Quick Touch Actions */}
                  <div className="flex items-center gap-1.5">
                    {isVideo ? (
                      <button
                        onClick={() => {
                          triggerHaptic();
                          onPlayPiP(item);
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/30 text-[11px] font-medium"
                      >
                        <Play className="w-2.5 h-2.5 fill-current" />
                        <span>Ver</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          triggerHaptic();
                          onOpenReader(item);
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#161F33] text-slate-200 border border-white/[0.08] text-[11px]"
                      >
                        <BookOpen className="w-2.5 h-2.5 text-[#00F0FF]" />
                        <span>Leer</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleSwipeAction(item, 'right')}
                      className={`p-1.5 rounded-md border ${
                        item.isBookmarked
                          ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                          : 'bg-[#161F33] border-white/[0.07] text-slate-400'
                      }`}
                      title="Guardar"
                    >
                      <Bookmark className={`w-3 h-3 ${item.isBookmarked ? 'fill-current' : ''}`} />
                    </button>

                    <button
                      onClick={() => handleSwipeAction(item, 'left')}
                      className={`p-1.5 rounded-md border ${
                        item.isRead
                          ? 'text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/20'
                          : 'bg-[#161F33] border-white/[0.07] text-slate-500'
                      }`}
                      title="Marcar leído"
                    >
                      <Check className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Floating Translucent Bottom Navigation Bar (Linear / Arc Mobile style) */}
      <nav className="fixed bottom-3 left-4 right-4 max-w-md mx-auto z-40 bg-[#111726]/90 backdrop-blur-xl border border-white/[0.1] rounded-2xl shadow-2xl shadow-black/80 px-4 py-2 flex items-center justify-around">
        <button
          onClick={() => handleTabChange('feed')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
            activeTab === 'feed' ? 'text-[#00F0FF] font-medium' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="w-4 h-4" />
          <span className="text-[10px] font-mono">Feed</span>
        </button>

        <button
          onClick={() => handleTabChange('categories')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
            activeTab === 'categories' ? 'text-[#00F0FF] font-medium' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span className="text-[10px] font-mono">Canales</span>
        </button>

        <button
          onClick={() => handleTabChange('saved')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
            activeTab === 'saved' ? 'text-amber-400 font-medium' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span className="text-[10px] font-mono">Guardados</span>
        </button>

        <button
          onClick={() => {
            handleTabChange('settings');
            onOpenArchitecture();
          }}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
            activeTab === 'settings' ? 'text-[#6366F1] font-medium' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span className="text-[10px] font-mono">Blueprint</span>
        </button>
      </nav>
    </div>
  );
};
