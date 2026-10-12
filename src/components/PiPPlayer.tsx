import React, { useState } from 'react';
import { 
  X, 
  Maximize2, 
  Minimize2, 
  ExternalLink, 
  Volume2, 
  VolumeX, 
  Tv, 
  Youtube, 
  Radio, 
  Headphones,
  Play
} from 'lucide-react';
import { FeedItem } from '../types';
import { getYouTubeEmbedUrl, getTwitchEmbedUrl } from '../utils/videoUtils';

interface PiPPlayerProps {
  item: FeedItem | null;
  onClose: () => void;
}

export const PiPPlayer: React.FC<PiPPlayerProps> = ({ item, onClose }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAudioOnly, setIsAudioOnly] = useState(false);

  if (!item) return null;

  const isYouTube = item.platform === 'youtube' || item.mediaType === 'youtube_video';
  const isTwitch = item.platform === 'twitch' || item.mediaType === 'twitch_stream';

  let embedUrl = '';
  if (isYouTube) {
    embedUrl = getYouTubeEmbedUrl(item.mediaUrl || item.externalId || item.url);
  } else if (isTwitch) {
    embedUrl = getTwitchEmbedUrl(item.mediaUrl || item.externalId || item.url);
  }

  return (
    <div 
      className={`fixed z-50 transition-all duration-200 shadow-2xl shadow-black/95 rounded-2xl border border-white/[0.12] bg-[#0E1424] overflow-hidden ${
        isAudioOnly || isMinimized
          ? 'bottom-3 left-3 right-3 sm:left-auto sm:right-4 sm:w-72 h-14' 
          : isExpanded 
            ? 'bottom-3 left-3 right-3 sm:bottom-6 sm:right-6 sm:left-auto sm:w-[600px] sm:h-[380px] h-64' 
            : 'bottom-3 left-3 right-3 sm:bottom-4 sm:right-4 sm:left-auto sm:w-96 sm:h-64 h-56'
      }`}
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 sm:py-2 bg-[#080C17] border-b border-white/[0.08] text-slate-200 select-none">
        <div className="flex items-center gap-1.5 sm:gap-2 truncate mr-2 min-w-0">
          {isYouTube ? (
            <span className="flex items-center gap-1 text-red-500 font-bold text-[10px] font-mono shrink-0">
              <Youtube className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-red-500 text-white shrink-0" />
              <span className="hidden xs:inline">YOUTUBE</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 text-purple-400 font-bold text-[10px] font-mono shrink-0">
              <Tv className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="hidden xs:inline">TWITCH</span>
            </span>
          )}
          <span className="text-slate-600 hidden xs:inline">|</span>
          <span className="text-xs font-mono font-medium truncate text-slate-200">
            {item.title}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {/* Audio-only toggle */}
          <button
            onClick={() => setIsAudioOnly(!isAudioOnly)}
            className={`p-1 sm:p-1.5 rounded-md transition ${isAudioOnly ? 'text-[#00F0FF] bg-white/[0.08]' : 'text-slate-400 hover:text-slate-200'}`}
            title={isAudioOnly ? "Volver a Video" : "Modo Solo Audio"}
          >
            <Headphones className="w-3.5 h-3.5" />
          </button>

          {/* Expand toggle (desktop only) */}
          {!isAudioOnly && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="hidden sm:block p-1.5 hover:text-white text-slate-400 rounded-md transition"
              title={isExpanded ? "Tamaño estándar" : "Expandir ventana"}
            >
              {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          )}

          {/* External Link */}
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 sm:p-1.5 hover:text-[#00F0FF] text-slate-400 rounded-md transition"
            title="Abrir en pestaña nueva"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {/* Close */}
          <button
            onClick={onClose}
            className="p-1 sm:p-1.5 hover:text-red-400 active:text-red-400 text-slate-400 rounded-md transition"
            title="Cerrar reproductor"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Video Surface or Audio-only Mode */}
      {!isAudioOnly && !isMinimized ? (
        <div className="relative w-full h-[calc(100%-34px)] sm:h-[calc(100%-37px)] bg-black">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={item.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
              <Play className="w-8 h-8 text-slate-600 mb-2" />
              <p className="text-xs font-mono">No se pudo cargar el stream</p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-between px-3 h-full text-xs text-slate-300 font-mono">
          <div className="flex items-center gap-2 text-[#00F0FF] min-w-0">
            <Volume2 className="w-4 h-4 animate-pulse shrink-0" />
            <span className="text-xs font-medium truncate">
              {isAudioOnly ? 'Audio en segundo plano' : 'PiP Minimizado'}
            </span>
          </div>
          <button 
            onClick={() => {
              setIsAudioOnly(false);
              setIsMinimized(false);
            }}
            className="text-xs text-white hover:text-[#00F0FF] underline shrink-0 ml-2"
          >
            Ver Video
          </button>
        </div>
      )}
    </div>
  );
};
