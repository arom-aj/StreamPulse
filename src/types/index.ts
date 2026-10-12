export type PlatformSlug = 'youtube' | 'reddit' | 'rss' | 'github' | 'twitch';

export interface Platform {
  id: string;
  name: string;
  slug: PlatformSlug;
  icon: string;
  apiBaseUrl: string;
  authType: 'oauth2' | 'api_key' | 'none';
  color: string;
}

export interface Source {
  id: string;
  platformId: PlatformSlug;
  externalId: string;
  title: string;
  url: string;
  avatarUrl: string;
  fetchIntervalMinutes: number;
  lastFetchedAt: string;
  status: 'active' | 'syncing' | 'error' | 'paused';
  category: 'Tech' | 'Dev' | 'Gaming' | 'News' | 'Media';
  itemCount: number;
  unreadCount: number;
  colorAccent?: string;
}

export interface FeedItem {
  id: string;
  sourceId: string;
  platform: PlatformSlug;
  externalId: string;
  title: string;
  summary: string;
  contentCleanHtml: string;
  url: string;
  mediaUrl?: string;
  mediaType?: 'youtube_video' | 'twitch_stream' | 'image' | 'code' | 'article';
  authorName: string;
  authorAvatar?: string;
  publishedAt: string;
  readTimeMinutes?: number;
  isRead: boolean;
  isBookmarked: boolean;
  metrics?: {
    upvotes?: number;
    comments?: number;
    views?: string;
    stars?: number;
    forks?: number;
    liveViewers?: string;
    language?: string;
  };
  tags: string[];
}

export interface DashboardWidget {
  id: string;
  sourceIdOrCategory: string; // specific source ID or category name
  widgetType: 'source_feed' | 'category_feed' | 'stats_radar' | 'quick_terminal';
  title: string;
  platform?: PlatformSlug;
  category?: string;
  width: number; // 1 to 4 cols
  height?: number;
  posX: number;
  posY: number;
  isCollapsed?: boolean;
  isVisible: boolean;
}

export interface UserPreferences {
  theme: 'cyber-dark' | 'deep-abyss' | 'matrix-terminal';
  refreshIntervalSeconds: number;
  soundEffects: boolean;
  autoPlayPiP: boolean;
  compactCards: boolean;
}
