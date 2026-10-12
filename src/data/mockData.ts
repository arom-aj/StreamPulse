import { Platform, Source, FeedItem, DashboardWidget } from '../types';

export const PLATFORMS: Platform[] = [
  {
    id: '1',
    name: 'YouTube',
    slug: 'youtube',
    icon: 'Youtube',
    apiBaseUrl: 'https://www.googleapis.com/youtube/v3',
    authType: 'api_key',
    color: '#ef4444'
  },
  {
    id: '2',
    name: 'Reddit',
    slug: 'reddit',
    icon: 'MessageSquare',
    apiBaseUrl: 'https://oauth.reddit.com',
    authType: 'oauth2',
    color: '#f97316'
  },
  {
    id: '3',
    name: 'RSS / Atom',
    slug: 'rss',
    icon: 'Rss',
    apiBaseUrl: '',
    authType: 'none',
    color: '#06b6d4'
  },
  {
    id: '4',
    name: 'GitHub',
    slug: 'github',
    icon: 'GitBranch',
    apiBaseUrl: 'https://api.github.com',
    authType: 'oauth2',
    color: '#a855f7'
  },
  {
    id: '5',
    name: 'Twitch',
    slug: 'twitch',
    icon: 'Tv',
    apiBaseUrl: 'https://api.twitch.tv/helix',
    authType: 'oauth2',
    color: '#8b5cf6'
  }
];

export const INITIAL_SOURCES: Source[] = [
  {
    id: 'src-yt-1',
    platformId: 'youtube',
    externalId: 'UC_x5XG1OV2P6uZZ5FSM9Ttw',
    title: 'Laravel Daily',
    url: 'https://www.youtube.com/@LaravelDaily',
    avatarUrl: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=100&auto=format&fit=crop&q=60',
    fetchIntervalMinutes: 15,
    lastFetchedAt: 'Hace 3 min',
    status: 'active',
    category: 'Dev',
    itemCount: 4,
    unreadCount: 2,
    colorAccent: '#ef4444'
  },
  {
    id: 'src-reddit-1',
    platformId: 'reddit',
    externalId: 'r/programming',
    title: 'r/programming',
    url: 'https://reddit.com/r/programming',
    avatarUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=100&auto=format&fit=crop&q=60',
    fetchIntervalMinutes: 10,
    lastFetchedAt: 'Hace 1 min',
    status: 'active',
    category: 'Dev',
    itemCount: 4,
    unreadCount: 1,
    colorAccent: '#f97316'
  },
  {
    id: 'src-rss-hn',
    platformId: 'rss',
    externalId: 'https://news.ycombinator.com/rss',
    title: 'Hacker News Frontpage',
    url: 'https://news.ycombinator.com',
    avatarUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=100&auto=format&fit=crop&q=60',
    fetchIntervalMinutes: 5,
    lastFetchedAt: 'Justo ahora',
    status: 'active',
    category: 'Tech',
    itemCount: 4,
    unreadCount: 3,
    colorAccent: '#06b6d4'
  },
  {
    id: 'src-github-1',
    platformId: 'github',
    externalId: 'trending/php-ts',
    title: 'GitHub Trending (PHP & TS)',
    url: 'https://github.com/trending',
    avatarUrl: 'https://images.unsplash.com/photo-1618401479427-c8ef9465fbe1?w=100&auto=format&fit=crop&q=60',
    fetchIntervalMinutes: 20,
    lastFetchedAt: 'Hace 8 min',
    status: 'active',
    category: 'Dev',
    itemCount: 3,
    unreadCount: 1,
    colorAccent: '#a855f7'
  },
  {
    id: 'src-twitch-1',
    platformId: 'twitch',
    externalId: 'twitch/dev-streams',
    title: 'Software & Game Dev Live',
    url: 'https://twitch.tv/directory/game/Software%20and%20Game%20Development',
    avatarUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100&auto=format&fit=crop&q=60',
    fetchIntervalMinutes: 5,
    lastFetchedAt: 'Hace 2 min',
    status: 'active',
    category: 'Gaming',
    itemCount: 2,
    unreadCount: 1,
    colorAccent: '#8b5cf6'
  }
];

export const INITIAL_FEED_ITEMS: FeedItem[] = [
  {
    id: 'item-yt-1',
    sourceId: 'src-yt-1',
    platform: 'youtube',
    externalId: 'dQw4w9WgXcQ', // fallback or real video id
    title: 'Laravel 11 Reverb + Horizon: Configuración de WebSockets de Alta Concurrencia',
    summary: 'Aprende a configurar el nuevo servidor de WebSockets nativo Laravel Reverb junto con Redis y Horizon para procesar 100,000 conexiones concurrentes sin cuellos de botella.',
    contentCleanHtml: `
      <h2>Dominando Laravel Reverb en Producción</h2>
      <p>Laravel 11 introdujo <strong>Reverb</strong>, un servidor de WebSockets de alto rendimiento diseñado específicamente para el ecosistema de Laravel.</p>
      <h3>Arquitectura recomendada</h3>
      <ul>
        <li><strong>Nginx Reverse Proxy:</strong> Terminación SSL y balanceo con cabeceras Upgrade.</li>
        <li><strong>Redis Pub/Sub:</strong> Distribución de eventos entre múltiples servidores Laravel workers.</li>
        <li><strong>Supervisor:</strong> Monitorización de procesos daemon <code>php artisan reverb:start</code>.</li>
      </ul>
      <p>En este tutorial analizamos la configuración de escalado horizontal con Docker Swarm y Kubernetes, reduciendo la latencia de ingestión a menos de 15ms.</p>
    `,
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    mediaUrl: 'dQw4w9WgXcQ',
    mediaType: 'youtube_video',
    authorName: 'Laravel Daily',
    authorAvatar: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=100&auto=format&fit=crop&q=60',
    publishedAt: 'Hace 25 min',
    readTimeMinutes: 14,
    isRead: false,
    isBookmarked: true,
    metrics: {
      views: '12.4K',
      upvotes: 940,
      comments: 78
    },
    tags: ['Laravel 11', 'WebSockets', 'Reverb', 'PHP 8.3']
  },
  {
    id: 'item-rss-1',
    sourceId: 'src-rss-hn',
    platform: 'rss',
    externalId: 'hn-39882104',
    title: 'Show HN: StreamPulse - Feed Aggregator con Ingestión Asíncrona en Laravel 11',
    summary: 'Presentamos una arquitectura desacoplada para agregación de noticias en tiempo real con SimplePie, colas Redis distribuidas y modo lectura sin trackers ni JavaScript invasivo.',
    contentCleanHtml: `
      <h2>StreamPulse: Privacidad, Rendimiento y Cero Algoritmos</h2>
      <p>Los algoritmos de redes sociales están optimizados para retención adictiva en lugar de consumo de información productivo. StreamPulse nació para solucionar esto en computadoras de alto rendimiento y teléfonos móviles.</p>
      <h3>Puntos Clave del Pipeline:</h3>
      <ol>
        <li><strong>Normalización de Fuentes:</strong> Cada API externa (RSS, Reddit JSON, YouTube Data API v3, GitHub Events) se procesa a través de un contrato estricto <code>SourceAdapterInterface</code>.</li>
        <li><strong>Limpieza con Readability:</strong> Extraemos el DOM principal eliminando iframes de anuncios, banners de suscripción y scripts de telemetría.</li>
        <li><strong>Desduplicación por Hash & External ID:</strong> Prevención de colisiones en base de datos mediante índice compuesto <code>(source_id, external_id)</code>.</li>
      </ol>
      <p>Resultados preliminares muestran un ahorro del 82% en consumo de datos móviles y un tiempo de carga inicial de 180ms gracias a Service Workers.</p>
    `,
    url: 'https://news.ycombinator.com/item?id=39882104',
    mediaType: 'article',
    authorName: 'dang',
    publishedAt: 'Hace 42 min',
    readTimeMinutes: 5,
    isRead: false,
    isBookmarked: false,
    metrics: {
      upvotes: 412,
      comments: 139
    },
    tags: ['Architecture', 'OpenSource', 'Performance', 'Laravel']
  },
  {
    id: 'item-reddit-1',
    sourceId: 'src-reddit-1',
    platform: 'reddit',
    externalId: 'reddit-t3_1bp6z7',
    title: 'Por qué cambiamos nuestro stack frontend a Livewire 3 + Alpine.js en 2024',
    summary: 'Discusión en r/programming sobre la reducción de complejidad al eliminar microservicios frontend redundantes y volver a componentes reactivos impulsados por el servidor con Alpine para animaciones táctiles.',
    contentCleanHtml: `
      <h2>La fatiga del ecosistema SPA y el renacimiento de Livewire 3</h2>
      <p>Durante 5 años mantuvimos dos repositorios separados: una API en PHP/Laravel y un frontend en Next.js con GraphQL. La carga cognitiva y la duplicación de tipos TypeScript se volvió insostenible.</p>
      <h3>Ventajas experimentadas con Livewire 3:</h3>
      <ul>
        <li><strong>Morfing inteligente de DOM:</strong> El nuevo algoritmo de Alpine.js fusiona diferencias sin romper el estado del reproductor de video o elementos en foco.</li>
        <li><strong>Lazy loading nativo:</strong> Las tarjetas de feeds se renderizan bajo demanda con un simple atributo <code>wire:navigate</code>.</li>
        <li><strong>Cero endpoints REST huérfanos:</strong> La lógica de validación reside 100% en las clases PHP del componente.</li>
      </ul>
      <blockquote>"Menos código que mantener equivale a más tiempo optimizando consultas de base de datos e índices en MySQL."</blockquote>
    `,
    url: 'https://reddit.com/r/programming/comments/1bp6z7',
    mediaType: 'article',
    authorName: 'u/fullstack_architect',
    publishedAt: 'Hace 1 hora',
    readTimeMinutes: 6,
    isRead: true,
    isBookmarked: true,
    metrics: {
      upvotes: 890,
      comments: 245
    },
    tags: ['Livewire 3', 'Alpine.js', 'Frontend Architecture', 'PHP']
  },
  {
    id: 'item-gh-1',
    sourceId: 'src-github-1',
    platform: 'github',
    externalId: 'gh-livewire-livewire',
    title: 'livewire/livewire v3.5.0: Soporte mejorado para WebSockets Reverb y File Uploads Concurrentes',
    summary: 'Nueva versión oficial con listeners de eventos en tiempo real sin polling continuo, optimizaciones de memoria en uploads pesados y hooks nativos para Gridstack y Drag-and-Drop.',
    contentCleanHtml: `
      <h2>Novedades en Livewire v3.5.0</h2>
      <p>El equipo de Livewire ha liberado una versión mayor enfocada en rendimiento en tiempo real y compatibilidad con interfaces táctiles móviles.</p>
      <h3>Changelog destacado:</h3>
      <ul>
        <li><code>@listenToReverb('FeedItemIngested')</code>: Vinculación declarativa directa en vistas Blade.</li>
        <li>Soporte de gestos táctiles tipo swipe para aplicaciones instaladas como PWA.</li>
        <li>Reducción del tamaño del payload JSON en un 38% mediante compresión LZString opcional.</li>
      </ul>
    `,
    url: 'https://github.com/livewire/livewire/releases/tag/v3.5.0',
    mediaType: 'code',
    authorName: 'calebporzio',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60',
    publishedAt: 'Hace 2 horas',
    readTimeMinutes: 3,
    isRead: false,
    isBookmarked: false,
    metrics: {
      stars: 28400,
      forks: 1820,
      language: 'PHP'
    },
    tags: ['GitHub', 'Release', 'Livewire', 'Open Source']
  },
  {
    id: 'item-twitch-1',
    sourceId: 'src-twitch-1',
    platform: 'twitch',
    externalId: 'twitch-stream-primeagen',
    title: 'EN VIVO: Refactorizando el pipeline de ingestión con Redis Streams y PHP 8.3 JIT',
    summary: 'Stream técnico en vivo: benchmark comparativo entre MySQL bulk inserts vs Redis pipeline, pruebas de carga con k6 simulando 50,000 requests/sec.',
    contentCleanHtml: `
      <h2>Stream en Vivo: Ingestión a Escala Extrema</h2>
      <p>Estamos optimizando la ingestión masiva de feeds de noticias utilizando Redis Streams como buffer temporal antes del batch insert en PostgreSQL/MySQL.</p>
      <h3>Tópicos en la sesión:</h3>
      <ul>
        <li>PHP 8.3 Typed Class Constants y Dynamic Class Fetch.</li>
        <li>Cómo prevenir bloqueos de tabla en feeds de alta frecuencia.</li>
        <li>Configuración de supervisor con 16 workers paralelos.</li>
      </ul>
    `,
    url: 'https://twitch.tv/ThePrimeagen',
    mediaUrl: 'theprimeagen',
    mediaType: 'twitch_stream',
    authorName: 'ThePrimeagen',
    publishedAt: 'En directo ahora',
    readTimeMinutes: 0,
    isRead: false,
    isBookmarked: false,
    metrics: {
      liveViewers: '4.8K',
      language: 'English'
    },
    tags: ['Twitch', 'Live', 'PHP', 'Redis', 'Performance']
  },
  {
    id: 'item-yt-2',
    sourceId: 'src-yt-1',
    platform: 'youtube',
    externalId: 'L_LUpnjgPso',
    title: 'Laravel Horizon & Redis Queues: Prevención de Memory Leaks en Workers 24/7',
    summary: 'Técnicas esenciales para monitorear el consumo de memoria RAM en tareas prolongadas de scraping y parsing de XML/RSS, configurando auto-reinicio seguro con --max-jobs.',
    contentCleanHtml: `
      <h2>Gestión de Recursos en Laravel Queues de Alta Exigencia</h2>
      <p>Cuando los workers de Laravel procesan miles de feeds RSS con SimplePie y DOMDocument, la memoria en PHP puede fragmentarse si no se gestionan adecuadamente las instancias de objetos.</p>
      <p>En este video revisamos cómo implementar <code>gc_collect_cycles()</code> y cómo Horizon monitoriza el uso de CPU y memoria en tiempo real.</p>
    `,
    url: 'https://www.youtube.com/watch?v=L_LUpnjgPso',
    mediaUrl: 'L_LUpnjgPso',
    mediaType: 'youtube_video',
    authorName: 'Laravel Daily',
    publishedAt: 'Hace 5 horas',
    readTimeMinutes: 18,
    isRead: true,
    isBookmarked: false,
    metrics: {
      views: '8.2K',
      upvotes: 620,
      comments: 45
    },
    tags: ['Laravel Horizon', 'Queues', 'Redis', 'DevOps']
  }
];

export const INITIAL_WIDGETS: DashboardWidget[] = [
  {
    id: 'w-youtube',
    sourceIdOrCategory: 'youtube',
    widgetType: 'source_feed',
    title: 'YouTube Broadcast Monitor',
    platform: 'youtube',
    width: 2,
    posX: 0,
    posY: 0,
    isVisible: true
  },
  {
    id: 'w-rss-hn',
    sourceIdOrCategory: 'rss',
    widgetType: 'source_feed',
    title: 'RSS Intel Feeds (Hacker News & Tech)',
    platform: 'rss',
    width: 2,
    posX: 2,
    posY: 0,
    isVisible: true
  },
  {
    id: 'w-reddit',
    sourceIdOrCategory: 'reddit',
    widgetType: 'source_feed',
    title: 'Reddit Radar (r/programming)',
    platform: 'reddit',
    width: 2,
    posX: 0,
    posY: 1,
    isVisible: true
  },
  {
    id: 'w-github',
    sourceIdOrCategory: 'github',
    widgetType: 'source_feed',
    title: 'GitHub Repos & Releases',
    platform: 'github',
    width: 2,
    posX: 2,
    posY: 1,
    isVisible: true
  },
  {
    id: 'w-twitch',
    sourceIdOrCategory: 'twitch',
    widgetType: 'source_feed',
    title: 'Twitch Dev Live Streams',
    platform: 'twitch',
    width: 2,
    posX: 0,
    posY: 2,
    isVisible: true
  }
];
