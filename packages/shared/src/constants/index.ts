export const BRAND_COLORS = {
  // Island Living Channel Phase 1 Prototype Palette
  deepOcean: '#061A0E',      // Dark forest phone surface (#061A0E)
  oceanSurface: '#0A2414',   // Dark card surface (#0A2414)
  islandTeal: '#0B6A2E',     // Brand emerald green (#0B6A2E)
  tealLight: '#EAF2E6',      // Light mode sage canvas (#EAF2E6)
  skyBlue: '#79AA34',        // Tide leaf green (#79AA34)
  warmSand: '#C9DC3F',       // Signature lime-chartreuse brand accent (#C9DC3F)
  goldDark: '#9CC83A',       // Button gradient start (#9CC83A)
  passportCream: '#F3F7F0',  // Light surface tint (#F3F7F0)
  passportBorder: '#DCEB5C', // Lime highlight (#DCEB5C)
  coralAccent: '#E1251B',    // Live TV red badge (#E1251B)
  warmIvory: '#EAF2E6',      // Light background (#EAF2E6)
  surface: '#FFFFFF',        // Light phone surface (#FFFFFF)
  canvas: '#04150B',         // Dark stage background (#04150B)
  surfaceSubtle: '#F3F7F0',  // Subtle surface (#F3F7F0)
  ink: '#F2F7EC',            // Dark mode primary text (#F2F7EC)
  inkLight: '#0B2A16',       // Light mode primary text (#0B2A16)
  mutedText: '#98B39E',      // Dark mode muted text (#98B39E)
  mutedTextLight: '#587160', // Light mode muted text (#587160)
  border: 'rgba(255,255,255,0.1)',

  // Legacy aliases for compatibility
  palmGreen: '#0B6A2E',
  palmDark: '#061A0E',
  palmLight: '#EAF2E6',
  channelRed: '#E1251B',
  channelRedLight: '#FEE2E2',
  sunGold: '#C9DC3F',
  sunGoldBright: '#E2EA4B',
  sunTint: '#F3F7F0',

  // Status colors
  success: '#2E8B3A',
  warning: '#F2A65A',
  error: '#E1251B',
  info: '#79AA34',
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
