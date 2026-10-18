import { api } from './api';
import { Video, VideoCategory, DEFAULT_CATEGORIES } from '@ilc/shared';

export interface VodResponse {
  success: boolean;
  videos: Video[];
  categories: VideoCategory[];
}

const FALLBACK_VIDEOS: Video[] = [
  {
    id: 'vid-001',
    title: 'Edge of the North: Whispers of the Ivatan',
    slug: 'edge-of-the-north-whispers-of-the-ivatan',
    description:
      'Journey into the Pacific winds where typhoon-defying stone villages celebrate ancient coastal heritage.',
    media_path: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail_path:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop',
    duration_seconds: 2300, // 38:20
    status: 'published',
    is_featured: true,
    published_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    created_by: 'usr-admin-001',
    categories: ['Culture & Festivals', 'Islands & Beaches'],
    tags: ['Batanes', 'Heritage', 'Coastal'],
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'vid-002',
    title: 'Archipelago Whispers: Apo Reef',
    slug: 'archipelago-whispers-apo-reef',
    description:
      'The second largest contiguous coral reef system in the world, teeming with pelagic life and crystal drop-offs.',
    media_path: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnail_path:
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200&auto=format&fit=crop',
    duration_seconds: 1125, // 18:45
    status: 'published',
    is_featured: false,
    published_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    created_by: 'usr-admin-001',
    categories: ['Nature Doc', 'Adventure & Diving'],
    tags: ['Apo Reef', 'Diving', 'Marine'],
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'vid-003',
    title: 'Ghost Fleets of Sangat Island',
    slug: 'ghost-fleets-of-sangat-island',
    description:
      'Exploring WWII maritime wrecks in Coron Bay and the thriving coral gardens that reclaimed them.',
    media_path: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail_path:
      'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?q=80&w=1200&auto=format&fit=crop',
    duration_seconds: 1450, // 24:10
    status: 'published',
    is_featured: false,
    published_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    created_by: 'usr-admin-001',
    categories: ['History & Wrecks', 'Adventure & Diving'],
    tags: ['Coron', 'Palawan', 'Wrecks'],
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: 'vid-004',
    title: 'Boracay Paraw: Winds of the Western Visayas',
    slug: 'boracay-paraw-winds-western-visayas',
    description:
      'Set sail aboard traditional double-outrigger paraw boats along Boracay’s powder-white coastline at golden hour.',
    media_path: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnail_path:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
    duration_seconds: 980,
    status: 'published',
    is_featured: false,
    published_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    created_by: 'usr-admin-001',
    categories: ['Islands & Beaches', 'Resorts & Stays'],
    tags: ['Boracay', 'Sailing', 'Sunset'],
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
];

export const vodService = {
  async fetchVideos(
    category?: string,
    search?: string
  ): Promise<{ videos: Video[]; categories: VideoCategory[] }> {
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (search) params.append('search', search);

      const query = params.toString() ? `?${params.toString()}` : '';
      const res = await api.fetch<VodResponse>(`/videos${query}`);
      return {
        videos: res.videos && res.videos.length > 0 ? res.videos : FALLBACK_VIDEOS,
        categories: res.categories && res.categories.length > 0 ? res.categories : DEFAULT_CATEGORIES,
      };
    } catch {
      return {
        videos: FALLBACK_VIDEOS,
        categories: DEFAULT_CATEGORIES,
      };
    }
  },

  async fetchVideoById(id: string): Promise<Video> {
    const res = await api.fetch<{ success: boolean; video: Video }>(`/videos/${id}`);
    return res.video;
  },
};
