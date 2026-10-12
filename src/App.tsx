/**
 * StreamPulse - Command Center
 * Centro de Comando de Feeds y Tendencias de Alto Rendimiento
 * Estética Luxury Dark Dense UI (Linear / Raycast / Vercel / Arc / Supabase)
 * Laravel 11 Backend Architecture + Livewire 3 / Desktop Bunker & Mobile PWA
 */

import React, { useState, useEffect, useCallback } from 'react';
import { PlatformSlug, Source, FeedItem, DashboardWidget } from './types';
import { INITIAL_SOURCES, INITIAL_FEED_ITEMS, INITIAL_WIDGETS } from './data/mockData';
import { Header } from './components/Header';
import { DesktopBunker } from './components/DesktopBunker';
import { PiPPlayer } from './components/PiPPlayer';
import { CleanReaderModal } from './components/CleanReaderModal';
import { AddSourceModal } from './components/AddSourceModal';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { CommandPalette } from './components/CommandPalette';
import { extractYouTubeId, extractTwitchChannel } from './utils/videoUtils';

export default function App() {
  const [sources, setSources] = useState<Source[]>(INITIAL_SOURCES);
  const [items, setItems] = useState<FeedItem[]>(INITIAL_FEED_ITEMS);
  const [widgets, setWidgets] = useState<DashboardWidget[]>(INITIAL_WIDGETS);
  
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformSlug | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [columns, setColumns] = useState<number>(3);

  // Active PiP video and Reader Item
  const [pipItem, setPipItem] = useState<FeedItem | null>(null);
  const [readerItem, setReaderItem] = useState<FeedItem | null>(null);

  // Modals & Command Palette
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isAddSourceOpen, setIsAddSourceOpen] = useState(false);
  
  // Real-time states
  const [isSyncing, setIsSyncing] = useState(false);
  const [latestIngestedItem, setLatestIngestedItem] = useState<FeedItem | null>(INITIAL_FEED_ITEMS[0]);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  // Register PWA Service Worker
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV !== 'test') {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => console.log('StreamPulse Service Worker registrado:', reg.scope))
        .catch((err) => console.log('Error registrando Service Worker:', err));
    }

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync action (simulates Redis queue ingestion & Reverb broadcast)
  const handleSync = useCallback(() => {
    setIsSyncing(true);

    setTimeout(() => {
      const newItem: FeedItem = {
        id: `item-live-${Date.now()}`,
        sourceId: 'src-rss-hn',
        platform: 'rss',
        externalId: `hn-${Date.now()}`,
        title: `Actualización en Tiempo Real: Micro-benchmarks de PHP 8.3 JIT vs Node.js 22 en Ingestión HTTP`,
        summary: 'Nuevos resultados de pruebas de concurrencia muestran un throughput sostenido de 45k req/segundo con Laravel Octane y Swoole.',
        contentCleanHtml: `
          <h2>Rendimiento Extremo con PHP 8.3 JIT</h2>
          <p>La combinación del nuevo compilador JIT en PHP 8.3 junto con la arquitectura asíncrona de Laravel Reverb y Redis Streams reduce la latencia de ingestión de feeds a menos de 5 milisegundos.</p>
          <p>StreamPulse procesa colecciones de DTOs en memoria sin recargar el framework en cada solicitud.</p>
        `,
        url: 'https://news.ycombinator.com',
        mediaType: 'article',
        authorName: 'Hacker News Bot',
        publishedAt: 'Justo ahora',
        readTimeMinutes: 4,
        isRead: false,
        isBookmarked: false,
        metrics: {
          upvotes: 68,
          comments: 14
        },
        tags: ['Benchmark', 'PHP 8.3', 'Performance', 'Redis']
      };

      setItems(prev => [newItem, ...prev]);
      setLatestIngestedItem(newItem);
      setIsSyncing(false);
    }, 850);
  }, []);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
        return;
      }

      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      const key = e.key.toUpperCase();
      if (key === 'S') {
        e.preventDefault();
        handleSync();
      } else if (key === 'R') {
        e.preventDefault();
        handleMarkAllRead();
      } else if (key === '2') {
        setColumns(2);
      } else if (key === '3') {
        setColumns(3);
      } else if (key === '4') {
        setColumns(4);
      } else if (e.key === '?') {
        setIsShortcutsOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSync]);

  // Toggle Bookmark
  const handleToggleBookmark = (id: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, isBookmarked: !item.isBookmarked };
      }
      return item;
    }));

    if (readerItem && readerItem.id === id) {
      setReaderItem(prev => prev ? { ...prev, isBookmarked: !prev.isBookmarked } : null);
    }
  };

  // Toggle Read
  const handleToggleRead = (id: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, isRead: !item.isRead };
      }
      return item;
    }));
  };

  // Mark All Read
  const handleMarkAllRead = () => {
    setItems(prev => prev.map(item => ({ ...item, isRead: true })));
  };

  // Refresh single source
  const handleRefreshSource = (sourceId: string) => {
    setIsSyncing(true);
    setTimeout(() => {
      setSources(prev => prev.map(s => s.id === sourceId ? { ...s, lastFetchedAt: 'Justo ahora' } : s));
      setIsSyncing(false);
    }, 700);
  };

  // Add Source
  const handleAddSource = (newSourceData: Partial<Source>) => {
    const newId = `src-${newSourceData.platformId}-${Date.now()}`;
    const newSource: Source = {
      id: newId,
      platformId: newSourceData.platformId || 'rss',
      externalId: newSourceData.externalId || 'custom-feed',
      title: newSourceData.title || 'Nueva Fuente',
      url: newSourceData.url || 'https://news.ycombinator.com/rss',
      avatarUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=100&auto=format&fit=crop&q=60',
      fetchIntervalMinutes: newSourceData.fetchIntervalMinutes || 15,
      lastFetchedAt: 'Justo ahora',
      status: 'active',
      category: newSourceData.category || 'Tech',
      itemCount: 1,
      unreadCount: 1
    };

    setSources(prev => [newSource, ...prev]);

    const isYt = newSource.platformId === 'youtube';
    const isTwitchSource = newSource.platformId === 'twitch';
    const parsedId = isYt 
      ? extractYouTubeId(newSource.url) 
      : isTwitchSource 
        ? extractTwitchChannel(newSource.url) 
        : `ext-${Date.now()}`;

    const newItem: FeedItem = {
      id: `item-${Date.now()}`,
      sourceId: newId,
      platform: newSource.platformId,
      externalId: parsedId,
      title: `[Canal Conectado] Primer monitoreo activo para: ${newSource.title}`,
      summary: `Fuente agregada exitosamente al pipeline de ingestión de StreamPulse. Escaneo programado cada ${newSource.fetchIntervalMinutes} minutos.`,
      contentCleanHtml: `
        <h2>Canal Conectado Exitosamente</h2>
        <p>Se ha registrado un nuevo canal en la tabla <code>sources</code> con URL <code>${newSource.url}</code>.</p>
        <p>El Job de Laravel <code>FetchSingleSourceJob</code> procesará las actualizaciones según el intervalo estipulado.</p>
      `,
      url: newSource.url,
      mediaUrl: (isYt || isTwitchSource) ? parsedId : undefined,
      mediaType: isYt ? 'youtube_video' : isTwitchSource ? 'twitch_stream' : 'article',
      authorName: newSource.title,
      publishedAt: 'Justo ahora',
      readTimeMinutes: 2,
      isRead: false,
      isBookmarked: false,
      tags: [newSource.category, 'Nuevo Canal']
    };

    setItems(prev => [newItem, ...prev]);
    setLatestIngestedItem(newItem);

    // If it's a video source, auto-open PiP
    if (isYt || isTwitchSource) {
      setPipItem(newItem);
    }

    if (!widgets.some(w => w.platform === newSource.platformId)) {
      setWidgets(prev => [
        ...prev,
        {
          id: `w-${newSource.platformId}-${Date.now()}`,
          sourceIdOrCategory: newSource.platformId,
          widgetType: 'source_feed',
          title: `${newSource.title} Feed`,
          platform: newSource.platformId,
          width: 2,
          posX: 0,
          posY: 3,
          isVisible: true
        }
      ]);
    }
  };

  // Add Direct Video or Stream (YouTube / Twitch)
  const handleAddDirectVideo = (videoData: {
    platform: 'youtube' | 'twitch';
    videoId: string;
    title: string;
    authorName: string;
    url: string;
    playImmediately?: boolean;
  }) => {
    const isTwitch = videoData.platform === 'twitch';
    const sourceId = isTwitch ? 'src-twitch-1' : 'src-yt-1';
    const cleanVideoId = isTwitch 
      ? extractTwitchChannel(videoData.videoId || videoData.url)
      : extractYouTubeId(videoData.videoId || videoData.url);

    const newVideoItem: FeedItem = {
      id: `item-video-${Date.now()}`,
      sourceId: sourceId,
      platform: videoData.platform,
      externalId: cleanVideoId,
      title: videoData.title.trim() || (isTwitch ? `Stream de ${cleanVideoId}` : `Video de YouTube (${cleanVideoId})`),
      summary: isTwitch
        ? `Transmisión en directo del canal ${videoData.authorName || cleanVideoId}. Agregado al centro de monitoreo PiP.`
        : `Video de YouTube (${cleanVideoId}) integrado al centro de monitoreo StreamPulse.`,
      contentCleanHtml: `
        <h2>${videoData.title || cleanVideoId}</h2>
        <p>Video integrado desde ${isTwitch ? 'Twitch' : 'YouTube'} (${videoData.url}).</p>
        <p>Reproducible sin publicidad invasiva en el visor Picture-in-Picture.</p>
      `,
      url: videoData.url.startsWith('http') ? videoData.url : (isTwitch ? `https://twitch.tv/${cleanVideoId}` : `https://www.youtube.com/watch?v=${cleanVideoId}`),
      mediaUrl: cleanVideoId,
      mediaType: isTwitch ? 'twitch_stream' : 'youtube_video',
      authorName: videoData.authorName.trim() || (isTwitch ? cleanVideoId : 'YouTube Creator'),
      publishedAt: 'Recién agregado',
      readTimeMinutes: isTwitch ? 0 : 12,
      isRead: false,
      isBookmarked: false,
      metrics: isTwitch ? { liveViewers: 'En Vivo' } : { views: '1.4K', upvotes: 42 },
      tags: ['Video', isTwitch ? 'Twitch' : 'YouTube']
    };

    setItems(prev => [newVideoItem, ...prev]);
    setLatestIngestedItem(newVideoItem);

    // Launch floating PiP window immediately
    setPipItem(newVideoItem);
  };

  const handleSelectItemFromPalette = (item: FeedItem) => {
    const isVideo = item.platform === 'youtube' || item.platform === 'twitch' || item.mediaType === 'youtube_video' || item.mediaType === 'twitch_stream';
    if (isVideo) {
      setPipItem(item);
    } else {
      setReaderItem(item);
      handleToggleRead(item.id);
    }
  };

  const unreadTotal = items.filter(i => !i.isRead).length;

  return (
    <div className="min-h-screen bg-[#090D16] text-[#E2E8F0] flex flex-col font-sans selection:bg-[#00F0FF]/25 selection:text-[#00F0FF]">
      {/* Offline Status Warning Bar */}
      {!isOnline && (
        <div className="bg-amber-600/90 text-white text-xs font-mono text-center py-1 px-4 flex items-center justify-center gap-2 z-50">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
          <span>MODO OFFLINE — Visualizando datos en caché local con Service Worker v1.2</span>
        </div>
      )}

      {/* Main Command Header */}
      <Header
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        selectedPlatform={selectedPlatform}
        onPlatformSelect={setSelectedPlatform}
        onSync={handleSync}
        isSyncing={isSyncing}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onOpenAddSource={() => setIsAddSourceOpen(true)}
        columns={columns}
        onColumnsChange={setColumns}
        unreadTotal={unreadTotal}
      />

      {/* Main Content Area - Responsive Bunker Grid */}
      <main className="flex-1">
        <DesktopBunker
          sources={sources}
          items={items}
          widgets={widgets}
          selectedPlatform={selectedPlatform}
          searchQuery={searchQuery}
          columns={columns}
          onPlayPiP={(item) => setPipItem(item)}
          onOpenReader={(item) => {
            setReaderItem(item);
            handleToggleRead(item.id);
          }}
          onToggleBookmark={handleToggleBookmark}
          onToggleRead={handleToggleRead}
          onMarkAllRead={handleMarkAllRead}
          onRefreshSource={handleRefreshSource}
          isSyncing={isSyncing}
          latestIngestedItem={latestIngestedItem}
        />
      </main>

      {/* Command Palette (Raycast Omnibox Cmd+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        items={items}
        onSelectItem={handleSelectItemFromPalette}
        onSync={handleSync}
        onToggleViewMode={() => {}}
        onOpenArchitecture={() => {}}
        onSelectPlatform={setSelectedPlatform}
        onOpenAddSource={() => setIsAddSourceOpen(true)}
      />

      {/* Floating Picture-in-Picture Player (YouTube / Twitch) */}
      <PiPPlayer
        item={pipItem}
        onClose={() => setPipItem(null)}
      />

      {/* Clean Readability Drawer / Modal */}
      <CleanReaderModal
        item={readerItem}
        onClose={() => setReaderItem(null)}
        onToggleBookmark={handleToggleBookmark}
      />

      {/* Add Source Modal */}
      <AddSourceModal
        isOpen={isAddSourceOpen}
        onClose={() => setIsAddSourceOpen(false)}
        onAddSource={handleAddSource}
        onAddDirectVideo={handleAddDirectVideo}
      />

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
}
