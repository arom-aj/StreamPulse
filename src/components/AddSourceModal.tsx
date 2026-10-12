import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Youtube, 
  Rss, 
  MessageSquare, 
  GitBranch, 
  Tv, 
  Sparkles, 
  Play, 
  Video, 
  Radio, 
  Check,
  Link,
  Flame,
  Film
} from 'lucide-react';
import { PlatformSlug, Source, FeedItem } from '../types';

export function extractYouTubeId(urlOrId: string): string | null {
  if (!urlOrId) return null;
  const trimmed = urlOrId.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  const watchMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch) return watchMatch[1];
  const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return shortMatch[1];
  const embedMatch = trimmed.match(/youtube\.com\/(?:embed|v)\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch) return embedMatch[1];
  const shortsMatch = trimmed.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (shortsMatch) return shortsMatch[1];
  return null;
}

export function extractTwitchChannel(urlOrName: string): string {
  const trimmed = urlOrName.trim();
  const match = trimmed.match(/twitch\.tv\/([a-zA-Z0-9_]+)/i);
  if (match) return match[1].toLowerCase();
  return trimmed.replace(/^@/, '').toLowerCase();
}

interface AddSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSource: (source: Partial<Source>) => void;
  onAddDirectVideo?: (videoItem: {
    platform: 'youtube' | 'twitch';
    videoId: string;
    title: string;
    authorName: string;
    url: string;
    playImmediately?: boolean;
  }) => void;
}

export const AddSourceModal: React.FC<AddSourceModalProps> = ({
  isOpen,
  onClose,
  onAddSource,
  onAddDirectVideo,
}) => {
  // Mode: 'direct_video' vs 'channel_source'
  const [modalTab, setModalTab] = useState<'video' | 'source'>('video');

  // Direct video form state
  const [videoUrl, setVideoUrl] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [videoAuthor, setVideoAuthor] = useState('');
  const [playImmediately, setPlayImmediately] = useState(true);
  const [detectedVideoId, setDetectedVideoId] = useState<string | null>(null);

  // Channel/Source form state
  const [platform, setPlatform] = useState<PlatformSlug>('youtube');
  const [sourceTitle, setSourceTitle] = useState('');
  const [sourceTarget, setSourceTarget] = useState('');
  const [category, setCategory] = useState<'Dev' | 'Tech' | 'Gaming' | 'News' | 'Media'>('Dev');
  const [interval, setInterval] = useState(15);

  if (!isOpen) return null;

  const handleVideoUrlChange = (value: string) => {
    setVideoUrl(value);
    const ytid = extractYouTubeId(value);
    if (ytid) {
      setDetectedVideoId(ytid);
      if (!videoTitle) {
        setVideoTitle(`Video de YouTube (${ytid})`);
      }
      if (!videoAuthor) {
        setVideoAuthor('YouTube Creator');
      }
    } else if (value.includes('twitch.tv/')) {
      const channel = extractTwitchChannel(value);
      setDetectedVideoId(channel);
      if (!videoTitle) setVideoTitle(`Stream en Vivo: ${channel}`);
      if (!videoAuthor) setVideoAuthor(channel);
    } else {
      setDetectedVideoId(null);
    }
  };

  const handleDirectVideoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl.trim()) return;

    const isTwitch = videoUrl.includes('twitch.tv');
    let videoId = detectedVideoId;

    if (!videoId) {
      if (isTwitch) {
        videoId = extractTwitchChannel(videoUrl);
      } else {
        videoId = extractYouTubeId(videoUrl) || 'dQw4w9WgXcQ';
      }
    }

    if (onAddDirectVideo) {
      onAddDirectVideo({
        platform: isTwitch ? 'twitch' : 'youtube',
        videoId: videoId,
        title: videoTitle.trim() || (isTwitch ? `Stream: ${videoId}` : `Video ${videoId}`),
        authorName: videoAuthor.trim() || (isTwitch ? 'Twitch Streamer' : 'YouTube Channel'),
        url: videoUrl.startsWith('http') ? videoUrl : `https://${videoUrl}`,
        playImmediately: playImmediately,
      });
    }

    // Reset and close
    setVideoUrl('');
    setVideoTitle('');
    setVideoAuthor('');
    setDetectedVideoId(null);
    onClose();
  };

  const handleChannelSourceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceTitle.trim() || !sourceTarget.trim()) return;

    onAddSource({
      platformId: platform,
      title: sourceTitle.trim(),
      url: sourceTarget.trim().startsWith('http') ? sourceTarget.trim() : `https://${sourceTarget.trim()}`,
      externalId: sourceTarget.trim(),
      category: category,
      fetchIntervalMinutes: interval,
      itemCount: 1,
      unreadCount: 1,
      status: 'active'
    });

    setSourceTitle('');
    setSourceTarget('');
    onClose();
  };

  // Quick preset sample videos for easy 1-click testing
  const presets = [
    { title: 'Laravel 11 Reverb WebSockets', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', author: 'Laravel Daily', id: 'dQw4w9WgXcQ' },
    { title: 'PHP 8.3 & Redis Extreme Benchmark', url: 'https://www.youtube.com/watch?v=L_LUpnjgPso', author: 'DevOps Central', id: 'L_LUpnjgPso' },
    { title: 'ThePrimeagen Live Dev', url: 'https://twitch.tv/theprimeagen', author: 'ThePrimeagen', id: 'theprimeagen' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 animate-fadeIn">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto bg-[#0F1626] border border-white/[0.1] rounded-2xl shadow-2xl p-4 sm:p-6 z-10 text-slate-200 overscroll-contain">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.07] mb-3 sm:mb-4">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#161F33] border border-white/[0.08] flex items-center justify-center text-[#00F0FF] shrink-0">
              <Film className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="font-heading font-bold text-xs sm:text-sm tracking-tight text-white uppercase truncate">
                Agregar Video o Canal
              </h3>
              <p className="text-[10px] sm:text-[11px] text-slate-400 font-mono truncate">
                Ingestión instantánea para PiP o monitoreo
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg transition shrink-0 ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher: Direct Video vs Full Channel */}
        <div className="flex items-center p-1 bg-[#090D16] border border-white/[0.07] rounded-xl mb-3 sm:mb-4 text-[11px] sm:text-xs font-mono gap-1">
          <button
            onClick={() => setModalTab('video')}
            className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition text-center ${
              modalTab === 'video'
                ? 'bg-[#182238] text-white font-medium shadow-sm border border-white/[0.08]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-500 fill-red-500 shrink-0" />
            <span className="truncate">Video Directo (PiP)</span>
          </button>

          <button
            onClick={() => setModalTab('source')}
            className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition text-center ${
              modalTab === 'source'
                ? 'bg-[#182238] text-white font-medium shadow-sm border border-white/[0.08]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#00F0FF] shrink-0" />
            <span className="truncate">Canal Completo</span>
          </button>
        </div>

        {/* TAB 1: Direct Video Input */}
        {modalTab === 'video' ? (
          <form onSubmit={handleDirectVideoSubmit} className="space-y-3 text-xs font-mono">
            <div>
              <label className="block text-slate-300 mb-1 font-medium">
                URL de YouTube o Stream de Twitch
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={videoUrl}
                  onChange={(e) => handleVideoUrlChange(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... o youtu.be/..."
                  className="w-full bg-[#090D16] border border-white/[0.09] focus:border-[#00F0FF] rounded-xl pl-3 pr-8 py-2 text-slate-100 placeholder-slate-500 focus:outline-none transition text-xs"
                />
                {detectedVideoId && (
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#22C55E] flex items-center gap-1">
                    <Check className="w-3 h-3" /> Detectado
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Soporta links de YouTube, enlaces cortos (youtu.be), Shorts y Twitch.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">
                  Título del Video
                </label>
                <input
                  type="text"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  placeholder="Ej: Video destacado..."
                  className="w-full bg-[#090D16] border border-white/[0.09] focus:border-[#00F0FF] rounded-xl px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">
                  Canal / Creador
                </label>
                <input
                  type="text"
                  value={videoAuthor}
                  onChange={(e) => setVideoAuthor(e.target.value)}
                  placeholder="Ej: Nombre del canal..."
                  className="w-full bg-[#090D16] border border-white/[0.09] focus:border-[#00F0FF] rounded-xl px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none text-xs"
                />
              </div>
            </div>

            {/* Play immediately checkbox */}
            <div className="flex items-center gap-2 pt-0.5">
              <input
                type="checkbox"
                id="playPiPImmediately"
                checked={playImmediately}
                onChange={(e) => setPlayImmediately(e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-[#00F0FF] focus:ring-0 shrink-0"
              />
              <label htmlFor="playPiPImmediately" className="text-slate-300 cursor-pointer select-none text-[11px] sm:text-xs">
                Reproducir de inmediato en ventana flotante (PiP)
              </label>
            </div>

            {/* Quick Demo Presets */}
            <div className="pt-2 border-t border-white/[0.06]">
              <span className="text-[10px] text-slate-500 uppercase block mb-1.5 font-bold">
                O prueba con un clic:
              </span>
              <div className="space-y-1">
                {presets.map((p, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => {
                      handleVideoUrlChange(p.url);
                      setVideoTitle(p.title);
                      setVideoAuthor(p.author);
                      setDetectedVideoId(p.id);
                    }}
                    className="w-full text-left p-1.5 rounded-lg bg-[#090D16] hover:bg-[#141D30] border border-white/[0.04] text-[11px] text-slate-300 flex items-center justify-between transition"
                  >
                    <span className="truncate">{p.title}</span>
                    <span className="text-[10px] text-[#00F0FF] shrink-0 font-mono">Cargar →</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 font-semibold text-white shadow-lg transition flex items-center justify-center gap-2 font-sans"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Agregar Video al Feed & PiP</span>
              </button>
            </div>
          </form>
        ) : (
          /* TAB 2: Full Channel Source Monitoring */
          <form onSubmit={handleChannelSourceSubmit} className="space-y-3.5 text-xs font-mono">
            <div>
              <label className="block text-slate-300 mb-1.5 font-medium">
                Plataforma del Canal
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {[
                  { slug: 'youtube' as PlatformSlug, label: 'YouTube', icon: <Youtube className="w-3.5 h-3.5 text-red-500" /> },
                  { slug: 'rss' as PlatformSlug, label: 'RSS', icon: <Rss className="w-3.5 h-3.5 text-[#00F0FF]" /> },
                  { slug: 'reddit' as PlatformSlug, label: 'Reddit', icon: <MessageSquare className="w-3.5 h-3.5 text-orange-400" /> },
                  { slug: 'github' as PlatformSlug, label: 'GitHub', icon: <GitBranch className="w-3.5 h-3.5 text-purple-400" /> },
                  { slug: 'twitch' as PlatformSlug, label: 'Twitch', icon: <Tv className="w-3.5 h-3.5 text-violet-400" /> },
                ].map(p => (
                  <button
                    type="button"
                    key={p.slug}
                    onClick={() => setPlatform(p.slug)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl border text-center transition ${
                      platform === p.slug
                        ? 'bg-[#18233C] border-[#00F0FF]/50 text-white font-semibold'
                        : 'bg-[#090D16] border-white/[0.06] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {p.icon}
                    <span className="text-[10px]">{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-medium">
                Nombre del Canal / Fuente
              </label>
              <input
                type="text"
                required
                value={sourceTitle}
                onChange={(e) => setSourceTitle(e.target.value)}
                placeholder="Ej: Fireship, Laravel Daily..."
                className="w-full bg-[#090D16] border border-white/[0.09] focus:border-[#00F0FF] rounded-xl px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-medium">
                Identificador o URL del Canal
              </label>
              <input
                type="text"
                required
                value={sourceTarget}
                onChange={(e) => setSourceTarget(e.target.value)}
                placeholder={platform === 'youtube' ? 'Handle (@LaravelDaily) o Channel ID' : 'URL de feed o identificador'}
                className="w-full bg-[#090D16] border border-white/[0.09] focus:border-[#00F0FF] rounded-xl px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Categoría</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-[#090D16] border border-white/[0.09] rounded-xl px-2.5 py-2 text-slate-200 focus:outline-none"
                >
                  <option value="Dev">Dev</option>
                  <option value="Tech">Tech</option>
                  <option value="Gaming">Gaming</option>
                  <option value="News">News</option>
                  <option value="Media">Media</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Frecuencia</label>
                <select
                  value={interval}
                  onChange={(e) => setInterval(Number(e.target.value))}
                  className="w-full bg-[#090D16] border border-white/[0.09] rounded-xl px-2.5 py-2 text-slate-200 focus:outline-none"
                >
                  <option value={5}>Cada 5 min</option>
                  <option value={15}>Cada 15 min</option>
                  <option value={30}>Cada 30 min</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 font-semibold text-white shadow-lg transition flex items-center justify-center gap-1.5 font-sans"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Iniciar Monitoreo Asíncrono</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
