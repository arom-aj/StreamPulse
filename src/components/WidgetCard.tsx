import React, { useState } from 'react';
import { 
  Youtube, 
  Rss, 
  MessageSquare, 
  GitBranch, 
  Tv, 
  RefreshCw, 
  Bookmark, 
  Play, 
  BookOpen, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  GripVertical, 
  Flame, 
  Star, 
  MessageCircle, 
  Eye
} from 'lucide-react';
import { FeedItem, Source, PlatformSlug } from '../types';

interface WidgetCardProps {
  title: string;
  platform: PlatformSlug;
  source?: Source;
  items: FeedItem[];
  onPlayPiP: (item: FeedItem) => void;
  onOpenReader: (item: FeedItem) => void;
  onToggleBookmark: (id: string) => void;
  onToggleRead: (id: string) => void;
  onRefreshSource?: () => void;
  isSyncing?: boolean;
}

export const WidgetCard: React.FC<WidgetCardProps> = ({
  title,
  platform,
  source,
  items,
  onPlayPiP,
  onOpenReader,
  onToggleBookmark,
  onToggleRead,
  onRefreshSource,
  isSyncing,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia && !window.matchMedia('(pointer: fine)').matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Platform specific icon & branding
  const platformConfig = {
    youtube: {
      icon: <Youtube className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500" />,
      tagColor: 'text-red-400 bg-red-950/40 border-red-900/40',
      accentColor: '#EF4444'
    },
    reddit: {
      icon: <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500" />,
      tagColor: 'text-orange-400 bg-orange-950/40 border-orange-900/40',
      accentColor: '#F97316'
    },
    rss: {
      icon: <Rss className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00F0FF]" />,
      tagColor: 'text-[#00F0FF] bg-[#00F0FF]/10 border-[#00F0FF]/25',
      accentColor: '#00F0FF'
    },
    github: {
      icon: <GitBranch className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400" />,
      tagColor: 'text-purple-300 bg-purple-950/40 border-purple-900/40',
      accentColor: '#A855F7'
    },
    twitch: {
      icon: <Tv className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-violet-400" />,
      tagColor: 'text-violet-300 bg-violet-950/40 border-violet-900/40',
      accentColor: '#8B5CF6'
    }
  }[platform] || {
    icon: <Rss className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />,
    tagColor: 'text-slate-400 bg-slate-800 border-slate-700',
    accentColor: '#00F0FF'
  };

  const unreadCount = items.filter(i => !i.isRead).length;

  return (
    <div 
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative rounded-2xl bg-[#0F1626] border border-white/[0.08] shadow-xl shadow-black/50 overflow-hidden flex flex-col transition-all duration-200 group/widget"
    >
      {/* Dynamic Cursor Spotlight Overlay (Desktop only) */}
      {isHovered && (
        <div 
          className="pointer-events-none absolute -inset-px transition-opacity duration-300 opacity-100 z-0 hidden sm:block"
          style={{
            background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0, 240, 255, 0.04), transparent 80%)`,
          }}
        />
      )}

      {/* Widget Header - Proportional for mobile */}
      <div className="relative z-10 flex items-center justify-between px-3 sm:px-3.5 py-2 sm:py-2.5 bg-[#0A0F1D] border-b border-white/[0.06]">
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <GripVertical className="hidden sm:block w-3.5 h-3.5 text-slate-600 hover:text-slate-400 cursor-grab shrink-0 transition" />
          <div className="flex items-center gap-2 truncate">
            {platformConfig.icon}
            <h2 className="text-xs sm:text-xs font-heading font-semibold tracking-tight text-white uppercase truncate">
              {title}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {unreadCount > 0 ? (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#00F0FF]/15 border border-[#00F0FF]/35 text-[#00F0FF] font-semibold">
              {unreadCount} nuevo{unreadCount > 1 ? 's' : ''}
            </span>
          ) : (
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded text-slate-500">
              Al día
            </span>
          )}

          {onRefreshSource && (
            <button
              onClick={onRefreshSource}
              disabled={isSyncing}
              className="p-1 hover:text-[#00F0FF] active:text-[#00F0FF] text-slate-500 rounded transition"
              title="Actualizar canal"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-[#00F0FF]' : ''}`} />
            </button>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 hover:text-slate-200 active:text-slate-200 text-slate-500 rounded transition"
            title={isCollapsed ? "Expandir" : "Colapsar"}
          >
            {isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Shimmer loading state when syncing */}
      {isSyncing && (
        <div className="p-3 space-y-2">
          <div className="skeleton-shimmer h-16 rounded-xl"></div>
          <div className="skeleton-shimmer h-16 rounded-xl"></div>
        </div>
      )}

      {/* Feed Items Container */}
      {!isCollapsed && !isSyncing && (
        <div className="relative z-10 p-2 sm:p-2.5 space-y-2 sm:max-h-[540px] sm:overflow-y-auto touch-pan-y">
          {items.length === 0 ? (
            <div className="py-10 text-center text-xs text-slate-500 font-mono">
              Sin publicaciones en este canal.
            </div>
          ) : (
            items.map((item) => {
              const isVideo = item.platform === 'youtube' || item.platform === 'twitch' || item.mediaType === 'youtube_video' || item.mediaType === 'twitch_stream';

              return (
                <article
                  key={item.id}
                  className={`group relative rounded-xl p-2.5 sm:p-3 transition-all duration-150 border flex flex-col justify-between touch-pan-y ${
                    item.isRead
                      ? 'bg-[#0B101D]/70 hover:bg-[#12192A] active:bg-[#12192A] border-white/[0.04] text-slate-400'
                      : 'bg-[#131B2D] hover:bg-[#172238] active:bg-[#172238] border-white/[0.08] hover:border-white/[0.18] text-slate-100 shadow-sm'
                  }`}
                >
                  {/* Top Metadatos */}
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1 sm:mb-1.5">
                    <div className="flex items-center gap-1.5 truncate max-w-[200px] sm:max-w-[240px]">
                      {!item.isRead ? (
                        <span 
                          className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] shadow-[0_0_8px_#00F0FF] shrink-0" 
                          title="No leído"
                        />
                      ) : (
                        <span 
                          className="w-1.5 h-1.5 rounded-full bg-slate-600 shrink-0" 
                          title="Leído"
                        />
                      )}

                      <span className="truncate font-medium text-slate-300">
                        {item.authorName}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 text-[10px] text-slate-500">
                      {item.readTimeMinutes !== undefined && item.readTimeMinutes > 0 && (
                        <span className="text-slate-400 hidden xs:inline">
                          {item.readTimeMinutes} min •
                        </span>
                      )}
                      <span>{item.publishedAt}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3
                    onClick={() => isVideo ? onPlayPiP(item) : onOpenReader(item)}
                    className="text-xs sm:text-[13px] font-heading font-semibold tracking-tight leading-snug cursor-pointer transition-colors text-slate-200 group-hover:text-white line-clamp-2"
                  >
                    {item.title}
                  </h3>

                  {/* Summary / Snippet */}
                  {item.summary && (
                    <p 
                      onClick={() => isVideo ? onPlayPiP(item) : onOpenReader(item)}
                      className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed cursor-pointer"
                    >
                      {item.summary}
                    </p>
                  )}

                  {/* Tag chips */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1 mt-1.5">
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

                  {/* Bottom Strip: Metrics + Action Buttons (Adaptive wrap for mobile) */}
                  <div className="flex flex-wrap items-center justify-between gap-1.5 mt-2 pt-1.5 border-t border-white/[0.05] text-[11px] font-mono">
                    {/* Metrics indicators */}
                    <div className="flex items-center gap-2 text-slate-500 shrink-0">
                      {item.metrics?.views && (
                        <span className="flex items-center gap-1 text-slate-400" title="Vistas">
                          <Eye className="w-3 h-3 text-slate-500" />
                          <span className="text-[10px]">{item.metrics.views}</span>
                        </span>
                      )}
                      {item.metrics?.upvotes !== undefined && (
                        <span className="flex items-center gap-1 text-orange-400" title="Votos">
                          <Flame className="w-3 h-3 text-orange-500" />
                          <span className="text-[10px]">{item.metrics.upvotes}</span>
                        </span>
                      )}
                      {item.metrics?.comments !== undefined && (
                        <span className="flex items-center gap-1 text-slate-400" title="Comentarios">
                          <MessageCircle className="w-3 h-3 text-slate-500" />
                          <span className="text-[10px]">{item.metrics.comments}</span>
                        </span>
                      )}
                      {item.metrics?.stars !== undefined && (
                        <span className="flex items-center gap-1 text-amber-400" title="GitHub Stars">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <span className="text-[10px]">{item.metrics.stars.toLocaleString()}</span>
                        </span>
                      )}
                      {item.metrics?.liveViewers && (
                        <span className="flex items-center gap-1 text-[#22C55E] font-medium" title="En directo">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse"></span>
                          <span className="text-[10px]">{item.metrics.liveViewers}</span>
                        </span>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1 shrink-0 ml-auto">
                      {isVideo ? (
                        <button
                          onClick={() => onPlayPiP(item)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#00F0FF]/15 hover:bg-[#00F0FF]/25 active:bg-[#00F0FF]/30 border border-[#00F0FF]/35 text-[#00F0FF] text-[11px] font-medium transition"
                          title="Reproducir en Picture-in-Picture"
                        >
                          <Play className="w-2.5 h-2.5 fill-current" />
                          <span>PiP</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => onOpenReader(item)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#1B253B] hover:bg-[#253350] active:bg-[#253350] border border-white/[0.08] text-slate-200 text-[11px] font-medium transition"
                          title="Abrir en modo lectura"
                        >
                          <BookOpen className="w-2.5 h-2.5 text-[#00F0FF]" />
                          <span>Leer</span>
                        </button>
                      )}

                      {/* Bookmark button */}
                      <button
                        onClick={() => onToggleBookmark(item.id)}
                        className={`p-1.5 rounded-md border transition active:scale-95 ${
                          item.isBookmarked
                            ? 'text-amber-400 bg-amber-950/40 border-amber-900/40'
                            : 'text-slate-400 hover:text-slate-300 bg-[#161F33]/60 border-white/[0.06]'
                        }`}
                        title={item.isBookmarked ? "Guardado en favoritos" : "Guardar para después"}
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${item.isBookmarked ? 'fill-current' : ''}`} />
                      </button>

                      {/* Mark Read toggle */}
                      <button
                        onClick={() => onToggleRead(item.id)}
                        className={`p-1.5 rounded-md border transition active:scale-95 ${
                          item.isRead
                            ? 'text-[#22C55E] bg-[#22C55E]/15 border-[#22C55E]/30'
                            : 'text-slate-400 hover:text-slate-300 bg-[#161F33]/60 border-white/[0.06]'
                        }`}
                        title={item.isRead ? "Marcar como no leído" : "Marcar como leído"}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
