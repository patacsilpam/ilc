import { api } from './api';
import { YouTubeWatchResponse } from '@ilc/shared';

// Fallback channel metadata for Island Living Channel
export const ILC_CHANNEL_ID = 'UCXATr97RfU6NQna9WPOgWlA';
export const ILC_CHANNEL_HANDLE = '@islandlivingchannel1087';
export const ILC_CHANNEL_URL = 'https://www.youtube.com/@islandlivingchannel1087';

export const youtubeService = {
  /**
   * Fetches latest watch data (live status, latest videos, and shorts)
   * from the backend CMS /api/youtube route.
   */
  async fetchWatchData(pageToken?: string | null): Promise<YouTubeWatchResponse> {
    const query = pageToken ? `?pageToken=${encodeURIComponent(pageToken)}` : '';
    const res = await api.fetch<{ success: boolean; data: YouTubeWatchResponse }>(
      `/youtube${query}`
    );
    return res.data;
  },

  /**
   * Checks live status directly from the API backend.
   */
  async checkLiveStatus(): Promise<YouTubeWatchResponse['live']> {
    const data = await this.fetchWatchData();
    return data.live;
  },
};
