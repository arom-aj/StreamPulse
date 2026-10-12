/**
 * Utility functions for video ID extraction and embed URLs
 */

export function extractYouTubeId(urlOrId: string | undefined | null): string {
  if (!urlOrId) return 'dQw4w9WgXcQ';
  const str = urlOrId.trim();

  // If already a clean 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(str)) {
    return str;
  }

  const patterns = [
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts\/|watch\?v=|watch\?.+&v=))([\w-]{11})/,
    /[?&]v=([\w-]{11})/,
    /\/embed\/([\w-]{11})/,
    /\/shorts\/([\w-]{11})/
  ];

  for (const pattern of patterns) {
    const match = str.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  // Fallback if ID couldn't be parsed
  return str.length === 11 ? str : 'dQw4w9WgXcQ';
}

export function extractTwitchChannel(urlOrName: string | undefined | null): string {
  if (!urlOrName) return 'theprimeagen';
  const str = urlOrName.trim();
  const match = str.match(/twitch\.tv\/([a-zA-Z0-9_]+)/i);
  if (match) return match[1].toLowerCase();
  return str.replace(/^@/, '').toLowerCase();
}

export function getYouTubeEmbedUrl(urlOrId: string | undefined | null): string {
  const videoId = extractYouTubeId(urlOrId);
  return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&enablejsapi=1&rel=0`;
}

export function getTwitchEmbedUrl(channelOrUrl: string | undefined | null): string {
  const channel = extractTwitchChannel(channelOrUrl);
  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  return `https://player.twitch.tv/?channel=${channel}&parent=${hostname}&muted=false`;
}
