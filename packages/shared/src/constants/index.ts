export const BRAND_COLORS = {
  deepOcean: '#123B52',
  islandTeal: '#1F7A78',
  skyBlue: '#6DB7E8',
  warmSand: '#F1D39A',
  coralAccent: '#E47E63',
  warmIvory: '#FAF7F0',
  ink: '#20272B',
  mutedText: '#66747A',
  surface: '#FFFFFF',
  border: '#E5E8E7',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
} as const;

export const DEFAULT_BRAND_LOGO = 'https://www.islandlivingchannel.tv/wp-content/uploads/2022/02/ff.png';

export const DEFAULT_CATEGORIES = [
  { id: 'cat-1', name: 'Islands & Beaches', slug: 'islands-beaches' },
  { id: 'cat-2', name: 'Food & Dining', slug: 'food-dining' },
  { id: 'cat-3', name: 'Resorts & Stays', slug: 'resorts-stays' },
  { id: 'cat-4', name: 'Culture & Festivals', slug: 'culture-festivals' },
  { id: 'cat-5', name: 'Adventure & Diving', slug: 'adventure-diving' },
  { id: 'cat-6', name: 'Wellness & Nature', slug: 'wellness-nature' },
];

export const DEFAULT_SETTINGS = {
  youtube_live_stream_id: 'live_stream_ilc',
  youtube_fallback_url: 'https://www.youtube.com/@islandlivingchannel',
  otamigo_booking_base_url: 'https://otamigo.com',
  otamigo_affiliate_id: 'ilc_official',
  push_provider_configured: false,
  geofence_simulation_enabled: true,
};
