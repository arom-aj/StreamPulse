import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Bookmark, 
  Share2, 
  ExternalLink, 
  Clock, 
  User, 
  Check, 
  Sparkles,
  BookOpen
} from 'lucide-react';
import { FeedItem } from '../types';

interface CleanReaderModalProps {
  item: FeedItem | null;
  onClose: () => void;
  onToggleBookmark: (id: string) => void;
}

export const CleanReaderModal: React.FC<CleanReaderModalProps> = ({
  item,
  onClose,
  onToggleBookmark,
}) => {
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [fontFamily, setFontFamily] = useState<'serif' | 'sans'>('serif');
  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    setScrollProgress(0);
  }, [item]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight > clientHeight) {
      const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    }
  };

  if (!item) return null;

  const handleShare = async () => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(item.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const fontSizeClass = {
    sm: 'text-sm sm:text-base leading-relaxed',
    base: 'text-base sm:text-lg leading-relaxed',
    lg: 'text-lg sm:text-xl leading-loose',
  }[fontSize];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-md transition-opacity duration-200">
      {/* Click outside backdrop to dismiss */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Slide-in Drawer from Right */}
      <div className="relative w-full max-w-2xl h-full bg-[#0D1322] border-l border-white/[0.08] shadow-2xl flex flex-col z-10 animate-slideLeft">
        {/* Top Reading Progress Bar */}
        <div className="h-0.5 w-full bg-white/[0.05]">
          <div 
            className="h-full bg-[#00F0FF] transition-all duration-75"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        {/* Top Control Bar - Scaled for mobile */}
        <div className="flex items-center justify-between px-3 sm:px-5 py-2.5 sm:py-3.5 bg-[#090D16] border-b border-white/[0.06] text-slate-300 gap-1.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#00F0FF]/10 border border-[#00F0FF]/25 text-[#00F0FF] text-[10px] sm:text-[11px] font-mono shrink-0">
              <BookOpen className="w-3 h-3 text-[#00F0FF]" />
              <span className="hidden xs:inline">LECTURA LIMPIA</span>
            </span>
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* Font Style Toggle */}
            <div className="flex items-center gap-0.5 bg-[#141C2E] p-0.5 rounded-lg border border-white/[0.06] text-xs font-mono">
              <button
                onClick={() => setFontFamily('serif')}
                className={`px-1.5 sm:px-2 py-0.5 rounded text-[11px] sm:text-xs ${fontFamily === 'serif' ? 'bg-[#1E293B] text-white font-serif' : 'text-slate-400'}`}
              >
                Serif
              </button>
              <button
                onClick={() => setFontFamily('sans')}
                className={`px-1.5 sm:px-2 py-0.5 rounded text-[11px] sm:text-xs ${fontFamily === 'sans' ? 'bg-[#1E293B] text-white' : 'text-slate-400'}`}
              >
                Sans
              </button>
            </div>

            {/* Font Size Toggle */}
            <div className="flex items-center gap-0.5 bg-[#141C2E] p-0.5 rounded-lg border border-white/[0.06] text-xs font-mono">
              <button
                onClick={() => setFontSize('sm')}
                className={`px-1.5 py-0.5 rounded text-[11px] ${fontSize === 'sm' ? 'bg-[#1E293B] text-white' : 'text-slate-400'}`}
              >
                A-
              </button>
              <button
                onClick={() => setFontSize('base')}
                className={`px-1.5 py-0.5 rounded text-[11px] ${fontSize === 'base' ? 'bg-[#1E293B] text-white' : 'text-slate-400'}`}
              >
                A
              </button>
              <button
                onClick={() => setFontSize('lg')}
                className={`px-1.5 py-0.5 rounded text-[11px] ${fontSize === 'lg' ? 'bg-[#1E293B] text-white' : 'text-slate-400'}`}
              >
                A+
              </button>
            </div>

            {/* Bookmark */}
            <button
              onClick={() => onToggleBookmark(item.id)}
              className={`p-1.5 rounded-lg border transition ${
                item.isBookmarked
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                  : 'bg-[#141C2E] border-white/[0.06] text-slate-400 hover:text-slate-200'
              }`}
              title={item.isBookmarked ? "Guardado" : "Guardar para después"}
            >
              <Bookmark className={`w-3.5 h-3.5 ${item.isBookmarked ? 'fill-current' : ''}`} />
            </button>

            {/* Copy / Share */}
            <button
              onClick={handleShare}
              className="p-1.5 rounded-lg bg-[#141C2E] border border-white/[0.06] text-slate-400 hover:text-slate-200 transition"
              title="Copiar enlace"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#22C55E]" /> : <Share2 className="w-3.5 h-3.5" />}
            </button>

            {/* Original Link */}
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-[#141C2E] border border-white/[0.06] text-slate-400 hover:text-white transition"
              title="Abrir en fuente original"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-[#141C2E] hover:bg-red-950/40 border border-white/[0.06] hover:border-red-500/40 text-slate-400 hover:text-red-300 transition"
              title="Cerrar (Esc)"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Content Body with scroll listener */}
        <div 
          ref={contentRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-4 sm:px-8 md:px-10 py-5 sm:py-8 text-slate-200"
        >
          <header className="mb-5 sm:mb-6 border-b border-white/[0.06] pb-4 sm:pb-5">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 font-mono mb-2">
              <span className="flex items-center gap-1 text-slate-300">
                <User className="w-3 h-3 text-slate-500" />
                {item.authorName}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-400">
                <Clock className="w-3 h-3 text-slate-500" />
                {item.publishedAt}
              </span>
              {item.readTimeMinutes !== undefined && (
                <>
                  <span>•</span>
                  <span className="text-[#22C55E] font-medium">
                    {item.readTimeMinutes} min de lectura
                  </span>
                </>
              )}
            </div>

            <h1 className="text-lg sm:text-2xl font-heading font-bold text-white tracking-tight leading-snug">
              {item.title}
            </h1>

            {/* Tags */}
            {item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2.5">
                {item.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.07] text-slate-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Clean Article Content */}
          <article 
            className={`prose prose-invert max-w-none ${fontFamily === 'serif' ? 'font-reader' : 'font-sans'} ${fontSizeClass} text-slate-300 space-y-4`}
          >
            <div 
              dangerouslySetInnerHTML={{ __html: item.contentCleanHtml }} 
              className="[&>h2]:text-base sm:[&>h2]:text-lg [&>h2]:font-bold [&>h2]:text-white [&>h2]:mt-5 [&>h2]:mb-2 [&>h3]:text-sm sm:[&>h3]:text-base [&>h3]:font-semibold [&>h3]:text-slate-200 [&>p]:mb-3 sm:[&>p]:mb-4 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5 [&>blockquote]:border-l-2 [&>blockquote]:border-[#00F0FF] [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-slate-400 [&>code]:bg-[#141C2E] [&>code]:text-[#00F0FF] [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded [&>code]:font-mono [&>pre]:bg-[#090D16] [&>pre]:p-3 sm:[&>pre]:p-4 [&>pre]:rounded-xl [&>pre]:border [&>pre]:border-white/[0.08] [&>pre]:overflow-x-auto"
            />
          </article>

          <footer className="mt-10 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>Extraído y sanitizado por Readability</span>
            <a 
              href={item.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#00F0FF] hover:underline flex items-center gap-1"
            >
              Ver original <ExternalLink className="w-3 h-3" />
            </a>
          </footer>
        </div>
      </div>
    </div>
  );
};
