import { api } from './api';
import { Video, VideoCategory } from '@ilc/shared';

export interface VodResponse {
  success: boolean;
  videos: Video[];
  categories: VideoCategory[];
}

export const vodService = {
  async fetchVideos(category?: string, search?: string): Promise<{ videos: Video[]; categories: VideoCategory[] }> {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);

    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await api.fetch<VodResponse>(`/videos${query}`);
    return {
      videos: res.videos || [],
      categories: res.categories || [],
    };
  },

  async fetchVideoById(id: string): Promise<Video> {
    const res = await api.fetch<{ success: boolean; video: Video }>(`/videos/${id}`);
    return res.video;
  },
};
