import React from 'react';
import { 
  CheckCheck, 
  Layers,
  Sparkles,
  Inbox
} from 'lucide-react';
import { FeedItem, Source, PlatformSlug, DashboardWidget } from '../types';
import { WidgetCard } from './WidgetCard';

interface DesktopBunkerProps {
  sources: Source[];
  items: FeedItem[];
  widgets: DashboardWidget[];
  selectedPlatform: PlatformSlug | 'all';
  searchQuery: string;
  columns: number;
  onPlayPiP: (item: FeedItem) => void;
  onOpenReader: (item: FeedItem) => void;
  onToggleBookmark: (id: string) => void;
  onToggleRead: (id: string) => void;
  onMarkAllRead: () => void;
  onRefreshSource: (sourceId: string) => void;
  isSyncing: boolean;
  latestIngestedItem: FeedItem | null;
}

export const DesktopBunker: React.FC<DesktopBunkerProps> = ({
  sources,
  items,
  widgets,
  selectedPlatform,
  searchQuery,
  columns,
  onPlayPiP,
  onOpenReader,
  onToggleBookmark,
  onToggleRead,
  onMarkAllRead,
  onRefreshSource,
  isSyncing,
  latestIngestedItem,
}) => {
  const filteredItems = items.filter((item) => {
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPlatform = selectedPlatform === 'all' || item.platform === selectedPlatform;
    return matchesSearch && matchesPlatform;
  });

  const totalUnread = items.filter(i => !i.isRead).length;
  const totalBookmarked = items.filter(i => i.isBookmarked).length;

  const gridColsClass = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 xl:grid-cols-4',
  }[columns] || 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3';

  const visibleWidgets = widgets.filter(w => {
    if (!w.isVisible) return false;
    if (selectedPlatform === 'all') return true;
    return w.platform === selectedPlatform;
  });

  return (
    <div className="p-2.5 sm:p-5 lg:p-6 space-y-3 sm:space-y-4 noise-overlay min-h-[calc(100vh-80px)]">
      {/* Ticker Bar - Mobile Optimized compact strip vs Desktop telemetry */}
      <div className="bg-[#111726] border border-white/[0.07] rounded-xl px-3 sm:px-4 py-2 shadow-lg shadow-black/40">
        {/* Mobile View: Clean, compact 1-line strip */}
        <div className="flex sm:hidden items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-1.5 truncate text-slate-300 min-w-0">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F0FF] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00F0FF]"></span>
            </span>
            <span className="truncate text-[11px] text-slate-300">
              {latestIngestedItem ? latestIngestedItem.title : 'Feed sincronizado en vivo'}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] text-[#00F0FF] bg-[#00F0FF]/10 px-1.5 py-0.5 rounded border border-[#00F0FF]/25">
              {totalUnread} pendientes
            </span>
            {totalUnread > 0 && (
              <button
                onClick={onMarkAllRead}
                className="p-1 text-slate-400 hover:text-[#22C55E] active:text-[#22C55E]"
                title="Marcar todo leído"
              >
                <CheckCheck className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Desktop View: Full rich telemetry bar */}
        <div className="hidden sm:flex items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex items-center gap-2 text-[#00F0FF] shrink-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F0FF] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00F0FF]"></span>
              </span>
              <span>STREAM:</span>
            </div>

            <div className="text-slate-300 truncate max-w-xl">
              {latestIngestedItem ? (
                <span className="flex items-center gap-1.5 animate-fadeIn">
                  <span className="text-[#00F0FF] font-semibold uppercase">[{latestIngestedItem.platform}]</span>
                  <span className="text-slate-100 truncate">{latestIngestedItem.title}</span>
                  <span className="text-slate-500 text-[10px] shrink-0">({latestIngestedItem.publishedAt})</span>
                </span>
              ) : (
                <span className="text-slate-500">Monitoreando feeds en tiempo real...</span>
              )}
            </div>
          </div>

          {/* Counts */}
          <div className="flex items-center gap-3.5 shrink-0">
            <span className="text-slate-400">
              CANALES: <strong className="text-white">{sources.length}</strong>
            </span>
            <span className="text-slate-400">
              PENDIENTES: <strong className="text-[#00F0FF]">{totalUnread}</strong>
            </span>
            <span className="text-slate-400">
              GUARDADOS: <strong className="text-[#A5B4FC]">{totalBookmarked}</strong>
            </span>
            {totalUnread > 0 && (
              <button
                onClick={onMarkAllRead}
                className="flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-md bg-[#161F33] hover:bg-[#1E293B] text-slate-300 hover:text-white border border-white/[0.08] transition"
                title="Marcar todas las publicaciones como leídas (R)"
              >
                <CheckCheck className="w-3 h-3 text-[#22C55E]" />
                <span>Marcar Todo Leído</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid of Feed Cards - 1 column on mobile, multi-column on desktop */}
      <div className={`grid ${gridColsClass} gap-3 sm:gap-4`}>
        {visibleWidgets.map((widget) => {
          const widgetItems = filteredItems.filter(item => {
            if (widget.platform) return item.platform === widget.platform;
            return true;
          });

          const matchedSource = sources.find(s => s.platformId === widget.platform);

          return (
            <WidgetCard
              key={widget.id}
              title={widget.title}
              platform={widget.platform || 'rss'}
              source={matchedSource}
              items={widgetItems}
              onPlayPiP={onPlayPiP}
              onOpenReader={onOpenReader}
              onToggleBookmark={onToggleBookmark}
              onToggleRead={onToggleRead}
              onRefreshSource={matchedSource ? () => onRefreshSource(matchedSource.id) : undefined}
              isSyncing={isSyncing}
            />
          );
        })}
      </div>

      {/* Empty State */}
      {visibleWidgets.length > 0 && filteredItems.length === 0 && (
        <div className="py-16 sm:py-20 text-center flex flex-col items-center justify-center bg-[#111726]/40 border border-white/[0.06] rounded-2xl p-6 sm:p-8">
          <div className="w-12 h-12 rounded-2xl bg-[#161F33] border border-white/[0.08] flex items-center justify-center text-slate-500 mb-3">
            <Inbox className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-heading font-semibold text-slate-200">
            Sin publicaciones encontradas
          </h3>
          <p className="text-xs text-slate-500 font-mono mt-1 max-w-sm">
            No hay elementos para "{searchQuery}". Intenta con otra palabra clave o selecciona otra categoría.
          </p>
        </div>
      )}
    </div>
  );
};
