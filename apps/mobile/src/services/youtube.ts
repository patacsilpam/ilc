import { api } from './api';
import { YouTubeWatchResponse, YouTubeVideoItem } from '@ilc/shared';
import realYoutubeData from '../data/realYoutubeContent.json';

// Fallback channel metadata for Island Living Channel
export const ILC_CHANNEL_ID = 'UCXATr97RfU6NQna9WPOgWlA';
export const ILC_CHANNEL_HANDLE = '@islandlivingchannel1087';
export const ILC_CHANNEL_URL = 'https://www.youtube.com/@islandlivingchannel1087';

export const fallbackWatchData: YouTubeWatchResponse = {
  live: {
    isLive: false,
    videoId: realYoutubeData.streams[0]?.id || 'P-iu1vverWQ',
    title:
      realYoutubeData.streams[0]?.title ||
      'Join Island Living Channel on a cruise adventure as we Cruise around Asia!',
    description: 'Official Island Living Channel Livestream broadcast',
    thumbnailUrl:
      realYoutubeData.streams[0]?.thumbnail ||
      'https://i.ytimg.com/vi/P-iu1vverWQ/hqdefault.jpg',
    embedUrl:
      realYoutubeData.streams[0]?.embedUrl ||
      'https://www.youtube.com/embed/P-iu1vverWQ?playsinline=1',
    channelTitle: 'Island Living Channel',
    channelId: ILC_CHANNEL_ID,
  },
  videos: realYoutubeData.videos.map((v) => ({
    id: v.id,
    title: v.title,
    description: '',
    publishedAt: v.publishedTime || 'Recently added',
    thumbnailUrl: v.thumbnail,
    durationFormatted: v.duration || 'Feature',
    isShort: false,
    videoUrl: v.videoUrl,
    embedUrl: v.embedUrl,
  })),
  shorts: realYoutubeData.shorts.map((s) => ({
    id: s.id,
    title: s.title,
    description: s.viewCount || '',
    publishedAt: '',
    thumbnailUrl: s.thumbnail,
    durationFormatted: 'Short',
    isShort: true,
    videoUrl: s.videoUrl,
    embedUrl: s.embedUrl,
  })),
  nextPageToken: null,
  source: 'feed_fallback',
  channelId: ILC_CHANNEL_ID,
  channelTitle: 'Island Living Channel',
};

export const youtubeService = {
  /**
   * Fetches latest watch data (live status, latest videos, and shorts)
   * from the backend CMS /api/youtube route with instant fallback to real scraped content.
   */
  async fetchWatchData(pageToken?: string | null): Promise<YouTubeWatchResponse> {
    try {
      const query = pageToken ? `?pageToken=${encodeURIComponent(pageToken)}` : '';
      const res = await api.fetch<{ success: boolean; data: YouTubeWatchResponse }>(
        `/youtube${query}`
      );
      if (res && res.data && res.data.videos && res.data.videos.length > 0) {
        return res.data;
      }
      return fallbackWatchData;
    } catch {
      return fallbackWatchData;
    }
  },

  /**
   * Checks live status directly from the API backend.
   */
  async checkLiveStatus(): Promise<YouTubeWatchResponse['live']> {
    const data = await this.fetchWatchData();
    return data.live;
  },

  getRealCategories() {
    return realYoutubeData.categories;
  },

  getRealShorts(): YouTubeVideoItem[] {
    return fallbackWatchData.shorts;
  },

  getRealVideos(): YouTubeVideoItem[] {
    return fallbackWatchData.videos;
  },

  getRealLiveStream() {
    return fallbackWatchData.live;
  },
};
