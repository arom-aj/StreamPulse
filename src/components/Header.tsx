import React, { useState } from 'react';
import { 
  Radio, 
  RefreshCw, 
  Search, 
  HelpCircle, 
  Plus, 
  Download, 
  Sparkles,
  SlidersHorizontal,
  Flame,
  Check
} from 'lucide-react';
import { PlatformSlug } from '../types';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface HeaderProps {
  onOpenCommandPalette: () => void;
  selectedPlatform: PlatformSlug | 'all';
  onPlatformSelect: (platform: PlatformSlug | 'all') => void;
  onSync: () => void;
  isSyncing: boolean;
  onOpenShortcuts: () => void;
  onOpenAddSource: () => void;
  columns: number;
  onColumnsChange: (cols: number) => void;
  unreadTotal: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCommandPalette,
  selectedPlatform,
  onPlatformSelect,
  onSync,
  isSyncing,
  onOpenShortcuts,
  onOpenAddSource,
  columns,
  onColumnsChange,
  unreadTotal,
}) => {
  const { isInstallable, install, isIOS } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#090D16]/95 backdrop-blur-md border-b border-white/[0.07]">
      {/* Top subtle live status bar (Desktop only to save mobile screen height) */}
      <div className="hidden md:flex items-center justify-between px-4 py-1 bg-[#060910] text-[11px] font-mono text-slate-400 border-b border-white/[0.04]">
        <div className="flex items-center gap-3 text-slate-300">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22C55E]"></span>
          </span>
          <span className="text-[#22C55E] font-medium tracking-tight">Monitoreo en Vivo</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400">Sin algoritmos ni distracciones</span>
        </div>

        <div className="flex items-center gap-3 text-slate-400">
          <span className="flex items-center gap-1">
            <span>Búsqueda Rápida</span>
            <span className="kbd-badge">⌘K</span>
          </span>
        </div>
      </div>

      {/* Main Bar - Proportional across mobile and desktop */}
      <div className="px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-3">
        {/* Brand */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#111726] border border-white/[0.1] flex items-center justify-center text-[#00F0FF] shadow-sm">
            <Radio className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <span className="font-heading font-extrabold text-sm sm:text-base tracking-tight text-white uppercase select-none">
            Stream<span className="text-[#00F0FF]">Pulse</span>
          </span>
        </div>

        {/* Omnibox Search Trigger Button */}
        <div className="flex-1 max-w-md mx-1 sm:mx-2 min-w-0">
          <button
            onClick={onOpenCommandPalette}
            className="w-full flex items-center justify-between bg-[#111726] hover:bg-[#161F33] active:bg-[#161F33] border border-white/[0.08] hover:border-white/[0.18] rounded-xl px-2.5 sm:px-3 py-1.5 text-xs text-slate-400 transition-all duration-150 group shadow-inner"
          >
            <div className="flex items-center gap-2 truncate">
              <Search className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#00F0FF] shrink-0" />
              <span className="truncate hidden sm:inline">Buscar feeds o pegar enlace de video...</span>
              <span className="truncate sm:hidden text-slate-400">Buscar...</span>
            </div>
            <div className="hidden sm:flex items-center gap-1 shrink-0 ml-1">
              <span className="kbd-badge">⌘K</span>
            </div>
          </button>
        </div>

        {/* Actions Cluster */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Desktop Grid Layout Switcher (Desktop only) */}
          <div className="hidden xl:flex items-center gap-0.5 bg-[#111726] border border-white/[0.07] rounded-lg p-0.5">
            {[2, 3, 4].map(c => (
              <button
                key={c}
                onClick={() => onColumnsChange(c)}
                className={`px-2 py-0.5 text-[11px] font-mono rounded ${
                  columns === c 
                    ? 'bg-[#1E293B] text-[#00F0FF] font-semibold border border-white/[0.08]' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title={`${c} Columnas`}
              >
                {c}C
              </button>
            ))}
          </div>

          {/* Sync Button */}
          <button
            onClick={onSync}
            disabled={isSyncing}
            className={`flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium border transition-all duration-150 ${
              isSyncing 
                ? 'bg-[#111726] border-white/[0.1] text-[#00F0FF]' 
                : 'bg-[#111726] hover:bg-[#161F33] active:bg-[#161F33] border-white/[0.08] text-slate-200'
            }`}
            title="Sincronizar feeds (S)"
          >
            <RefreshCw className={`w-3.5 h-3.5 shrink-0 ${isSyncing ? 'animate-spin text-[#00F0FF]' : 'text-slate-400'}`} />
            <span className="hidden md:inline">{isSyncing ? 'Sync...' : 'Sync'}</span>
          </button>

          {/* Add Video / Source button - Optimized for mobile tap */}
          <button
            onClick={onOpenAddSource}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-[#161F33] hover:bg-[#1E293B] active:bg-[#202B44] border border-white/[0.1] hover:border-[#00F0FF]/40 text-slate-200 hover:text-white transition-all duration-150 shadow-sm"
            title="Agregar enlace de video o canal"
          >
            <Plus className="w-3.5 h-3.5 text-[#00F0FF] shrink-0" />
            <span className="hidden sm:inline">+ Video / Fuente</span>
            <span className="sm:hidden font-sans font-semibold text-[#00F0FF] text-[11px]">+ Video</span>
          </button>

          {/* PWA Install Button */}
          {isInstallable && (
            <button
              onClick={install}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-mono font-semibold bg-[#22C55E]/15 hover:bg-[#22C55E]/25 border border-[#22C55E]/40 text-[#22C55E] transition"
              title="Instalar aplicación"
            >
              <Download className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden md:inline">Instalar</span>
            </button>
          )}

          {isIOS && (
            <button
              onClick={() => setShowIOSModal(true)}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-mono bg-[#111726] border border-white/[0.08] text-slate-400"
              title="Instalar en iOS"
            >
              <Download className="w-3.5 h-3.5 text-[#00F0FF]" />
            </button>
          )}

          {/* Shortcuts Info button (desktop only) */}
          <button
            onClick={onOpenShortcuts}
            className="hidden sm:block p-1.5 text-slate-400 hover:text-slate-200 hover:bg-[#111726] rounded-lg transition"
            title="Atajos de teclado (?)"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Ribbon - Smooth horizontal touch swipe with fade edges */}
      <div className="px-3 sm:px-4 py-1.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar border-t border-white/[0.04] text-xs scroll-smooth">
        <button
          onClick={() => onPlatformSelect('all')}
          className={`shrink-0 px-2.5 py-1 rounded-lg font-mono text-[11px] transition ${
            selectedPlatform === 'all'
              ? 'bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/35 font-medium'
              : 'text-slate-400 hover:text-slate-200 active:text-white bg-white/[0.02] border border-transparent'
          }`}
        >
          Todas {unreadTotal > 0 ? `(${unreadTotal})` : ''}
        </button>
        {[
          { slug: 'youtube' as PlatformSlug, label: 'YouTube', color: 'text-red-400', activeBg: 'bg-red-500/15 border-red-500/35 text-red-300' },
          { slug: 'rss' as PlatformSlug, label: 'RSS / Blogs', color: 'text-[#00F0FF]', activeBg: 'bg-[#00F0FF]/15 border-[#00F0FF]/35 text-[#00F0FF]' },
          { slug: 'reddit' as PlatformSlug, label: 'Reddit', color: 'text-orange-400', activeBg: 'bg-orange-500/15 border-orange-500/35 text-orange-300' },
          { slug: 'github' as PlatformSlug, label: 'GitHub', color: 'text-purple-400', activeBg: 'bg-purple-500/15 border-purple-500/35 text-purple-300' },
          { slug: 'twitch' as PlatformSlug, label: 'Twitch', color: 'text-violet-400', activeBg: 'bg-violet-500/15 border-violet-500/35 text-violet-300' },
        ].map(p => (
          <button
            key={p.slug}
            onClick={() => onPlatformSelect(p.slug)}
            className={`shrink-0 px-2.5 py-1 rounded-lg font-mono text-[11px] transition border ${
              selectedPlatform === p.slug
                ? `${p.activeBg} font-medium`
                : `${p.color} border-transparent bg-white/[0.02] hover:bg-white/[0.05]`
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* iOS Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-sm rounded-2xl bg-[#111726] border border-white/[0.1] p-5 shadow-2xl text-slate-200">
            <h3 className="text-sm font-heading font-bold text-white">Instalar StreamPulse en iOS</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed font-sans">
              1. En Safari, toca el botón de <strong>Compartir</strong> (icono de cuadrado con flecha hacia arriba).<br />
              2. Desplázate y selecciona <strong>"Agregar al Inicio"</strong>.<br />
              3. Abre StreamPulse como aplicación nativa a pantalla completa.
            </p>
            <button
              onClick={() => setShowIOSModal(false)}
              className="mt-4 w-full py-2 bg-[#00F0FF]/20 hover:bg-[#00F0FF]/30 border border-[#00F0FF]/40 text-[#00F0FF] text-xs font-mono font-medium rounded-xl transition"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
