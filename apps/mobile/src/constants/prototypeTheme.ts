import { Platform } from 'react-native';

export type ThemeMode = 'dark' | 'light';
export type PrototypeTab = 'home' | 'live' | 'rewards' | 'travel' | 'more';

export type VideoCategoryFilter =
  | 'All'
  | 'Explore'
  | 'Food'
  | 'Hotels & Resorts'
  | 'Festivals'
  | 'Philippines'
  | 'International';

export interface PrototypeVideo {
  id: string;
  t: string;
  m: string;
  category: 'Explore' | 'Food' | 'Hotels & Resorts' | 'Festivals';
  region: 'Philippines' | 'International';
  sceneIndex: number;
  videoUrl?: string;
  imageUrl?: string;
}

export interface WatchHistoryItem {
  videoId: string;
  progress: number; // 0 to 100
  lastWatched: string;
}

export interface PrototypeMerchant {
  id: string;
  n: string;
  c: string;
  t: string;
  address: string;
  hours: string;
  offer: string;
  description: string;
  sceneIndex: number;
}

export interface PrototypeFeedback {
  w: string;
  r: number;
  t: string;
}

export interface PrototypeTravelQuery {
  type: 'Flights' | 'Ferries' | 'Stays';
  from: string;
  to: string;
  date: string;
}

export interface NotificationItem {
  id: string;
  type: 'geo' | 'announcement';
  title: string;
  msg: string;
  time: string;
  read: boolean;
}

export const VIDEO_CATEGORIES: VideoCategoryFilter[] = [
  'All',
  'Explore',
  'Food',
  'Hotels & Resorts',
  'Festivals',
];

export const SCENE_PHOTOS: string[] = [
  'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1200&q=80', // 0: Siquijor beach & slow island life
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80', // 1: Iloilo street food & culinary
  'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1000&q=80', // 2: Cebu ferry & island hopping
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80', // 3: Bacolod golden sunset
  'https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&w=1000&q=80', // 4: Guimaras hidden beach
  'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80', // 5: Mactan diving & reef
];

export const INITIAL_VIDEOS: PrototypeVideo[] = [
  {
    id: 'vid-1',
    t: 'Siquijor: island of slow days',
    m: '6:20',
    category: 'Explore',
    region: 'Philippines',
    sceneIndex: 0,
    imageUrl:
      'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1200&q=80',
    videoUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  },
  {
    id: 'vid-2',
    t: 'Street food crawl in Iloilo',
    m: '4:45',
    category: 'Food',
    region: 'Philippines',
    sceneIndex: 1,
    imageUrl:
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80',
    videoUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  },
  {
    id: 'vid-3',
    t: 'Cebu by ferry, island to island',
    m: '8:10',
    category: 'Explore',
    region: 'Philippines',
    sceneIndex: 2,
    imageUrl:
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1000&q=80',
    videoUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  },
  {
    id: 'vid-4',
    t: 'Weekend in Bacolod: sweets and sunsets',
    m: '5:30',
    category: 'Festivals',
    region: 'Philippines',
    sceneIndex: 3,
    imageUrl:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    videoUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  },
  {
    id: 'vid-5',
    t: 'Hidden beaches of Guimaras',
    m: '3:55',
    category: 'Hotels & Resorts',
    region: 'Philippines',
    sceneIndex: 4,
    imageUrl:
      'https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&w=1000&q=80',
    videoUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
  },
  {
    id: 'vid-6',
    t: 'Dive day at Mactan',
    m: '7:05',
    category: 'Hotels & Resorts',
    region: 'Philippines',
    sceneIndex: 5,
    imageUrl:
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80',
    videoUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
  },
  {
    id: 'vid-7',
    t: 'MassKara Festival: City of Smiles after dark',
    m: '9:15',
    category: 'Festivals',
    region: 'Philippines',
    sceneIndex: 3,
    imageUrl:
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'vid-8',
    t: 'Bali & Lombok: Coastal sanctuaries across the sea',
    m: '11:40',
    category: 'Hotels & Resorts',
    region: 'International',
    sceneIndex: 0,
    imageUrl:
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1000&q=80',
  },
];

export const INITIAL_CONTINUE_WATCHING: WatchHistoryItem[] = [
  { videoId: 'vid-2', progress: 64, lastWatched: '2m left' },
  { videoId: 'vid-5', progress: 38, lastWatched: '2m 25s left' },
];

export const MERCHANTS: PrototypeMerchant[] = [
  {
    id: 'merch-1',
    n: 'Harbor Roast Café',
    c: 'Bacolod',
    t: 'Coffee',
    address: '21st Lacson Street, Bacolod City, Negros Occidental',
    hours: 'Daily · 6:30 AM – 10:00 PM',
    offer: '5% off all espresso & specialty brews + Welcome Gift redemption partner',
    description:
      'Artisanal single-origin Negros highland coffee roasted in small batches, paired with warm piaya and coastal pastries.',
    sceneIndex: 0,
  },
  {
    id: 'merch-2',
    n: 'Punta Taza Grill',
    c: 'Bacolod',
    t: 'Dining',
    address: 'Pala-Pala Coastal Walk, Bacolod City, Negros Occidental',
    hours: 'Tue – Sun · 11:00 AM – 11:00 PM',
    offer: '5% off total dining bill with your ILC Digital Member Card',
    description:
      'Open-air sunset grill serving authentic chicken inasal,charcoal-grilled blue marlin, and fresh Guimaras mango salads.',
    sceneIndex: 3,
  },
  {
    id: 'merch-3',
    n: 'Sugarlands Boutique Inn',
    c: 'Iloilo',
    t: 'Stay',
    address: 'General Luna Heritage District, Iloilo City',
    hours: 'Front Desk · 24 Hours (Check-in 2:00 PM)',
    offer: '5% off best available room rate + complimentary welcome drink',
    description:
      'Restored heritage courtyard sanctuary blending colonial Visayan architecture with tranquil tropical gardens.',
    sceneIndex: 4,
  },
  {
    id: 'merch-4',
    n: 'Molo Weekend Market',
    c: 'Iloilo',
    t: 'Shopping',
    address: 'Molo Plaza Artisan Arcade, Iloilo City',
    hours: 'Fri – Sun · 8:00 AM – 8:00 PM',
    offer: '5% off hablon weaves, tablea cacao, and curated island crafts',
    description:
      'Handwoven hablon textiles, heirloom Panay delicacies, and coastal homeware crafted by local Visayan artisans.',
    sceneIndex: 1,
  },
  {
    id: 'merch-5',
    n: 'Sunrise Island Tours',
    c: 'Cebu',
    t: 'Tours',
    address: 'Pier 1 Marina Terminal, Cebu City',
    hours: 'Daily · 5:30 AM – 6:00 PM',
    offer: '5% off private island-hopping charters & marine sanctuary passes',
    description:
      'Guided outrigger and speedboat expeditions across Nalusuan, Gilutongan, and Olango Island marine sanctuaries.',
    sceneIndex: 2,
  },
  {
    id: 'merch-6',
    n: 'Mactan Dive Hub',
    c: 'Cebu',
    t: 'Activities',
    address: 'Punta Engaño Coastal Road, Lapu-Lapu City, Mactan',
    hours: 'Daily · 7:00 AM – 7:00 PM',
    offer: '5% off PADI fun dives, nitrox fills, and reef gear rental',
    description:
      'PADI 5-Star dive center offering guided wall dives, house reef snorkeling, and underwater photography excursions.',
    sceneIndex: 5,
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'geo',
    title: 'Welcome to Bacolod!',
    msg: 'Touchdown at Bacolod-Silay Airport. Show your ILC card for 5% off at Harbor Roast Café and Punta Taza Grill.',
    time: 'Just now',
    read: false,
  },
  {
    id: 'notif-2',
    type: 'announcement',
    title: 'New Episode Premiere',
    msg: 'Siquijor: island of slow days is now streaming in Watch.',
    time: '2 hours ago',
    read: false,
  },
  {
    id: 'notif-3',
    type: 'geo',
    title: 'Welcome to Cebu!',
    msg: 'Near Mactan-Cebu Airport: Enjoy 5% off island charters with Sunrise Island Tours.',
    time: 'Yesterday',
    read: true,
  },
  {
    id: 'notif-4',
    type: 'announcement',
    title: 'Live Tonight at 7:00 PM',
    msg: 'MassKara street dance broadcasts live from Bacolod on Live TV.',
    time: '2 days ago',
    read: true,
  },
];

export const HUBS: Record<string, string> = {
  'Bacolod-Silay Airport': 'Bacolod',
  'Iloilo Airport': 'Iloilo',
  'Mactan-Cebu Airport': 'Cebu',
  'Cebu Pier 1': 'Cebu',
};

export const TABS: [PrototypeTab, string][] = [
  ['home', 'Watch'],
  ['live', 'Live TV'],
  ['rewards', 'Rewards'],
  ['travel', 'Travel'],
  ['more', 'Profile'],
];

export const LIVE_SCHEDULE: [string, string][] = [
  ['Today, 7:00 PM', 'MassKara street dance, live from Bacolod'],
  ['Sat, 10:00 AM', 'Dinagyang preview with the festival team'],
  ['Sun, 6:30 PM', 'Island Living Weekly: new episodes'],
];

export const TRAVEL_RESULTS: [string, string, string][] = [
  ['Morning', '₱1,890', '7:10 – 8:05'],
  ['Midday', '₱2,240', '12:30 – 13:25'],
  ['Evening', '₱1,740', '18:45 – 19:40'],
];

export const SERIF_FONT = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  default: '"Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif',
});

export const SANS_FONT = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: '"Avenir Next", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
});

export const PROTOTYPE_THEMES = {
  dark: {
    bg: '#04150B',
    surf: '#0A2414',
    phoneBg: '#061A0E',
    sheetBg: '#061A0E',
    ink: '#F5F7F4',
    mute: '#90A495',
    line: 'rgba(255,255,255,0.08)',
    brand: '#2E8B3A',
    hib: '#2E8B3A',
    tide: '#2E8B3A',
    on: '#FFFFFF',
    tabsBg: 'rgba(6,26,14,0.92)',
    tabsBorder: 'rgba(255,255,255,0.1)',
    tabOnBg: 'rgba(11,106,46,0.3)',
    tabOnColor: '#FFFFFF',
    btnBg: '#0B6A2E',
    btnGradient: 'linear-gradient(90deg,#0B6A2E,#2E8B3A)',
    btnText: '#FFFFFF',
    btnShadow: 'rgba(11,106,46,0.3)',
    btnAltColor: '#86EFAC',
    btnAltBorder: 'rgba(134,239,172,0.4)',
    chipOnBg: '#0B6A2E',
    chipOnText: '#FFFFFF',
    promoBorder: 'rgba(255,255,255,0.1)',
    promoBg: 'rgba(255,255,255,0.04)',
    promoGradient: 'none',
    inputBg: 'rgba(255,255,255,0.04)',
    inputBorder: 'rgba(255,255,255,0.08)',
    giftBg: 'rgba(255,255,255,0.03)',
    statBg: 'rgba(255,255,255,0.04)',
    statNum: '#86EFAC',
    bannerBg: 'rgba(8,36,20,0.95)',
    bannerText: '#F5F7F4',
    bannerBorder: 'rgba(255,255,255,0.14)',
    adminBg: 'rgba(10,29,36,0.95)',
    adminBorder: 'rgba(255,255,255,0.08)',
    modeBg: 'rgba(255,255,255,0.05)',
    modeOnBg: '#0B6A2E',
    modeOnText: '#FFFFFF',
    stageGradient: '#04150B',
  },
  light: {
    bg: '#EAF2E6',
    surf: '#FFFFFF',
    phoneBg: '#FFFFFF',
    sheetBg: '#FFFFFF',
    ink: '#0B2A16',
    mute: '#587160',
    line: 'rgba(6,36,15,0.12)',
    brand: '#0B6A2E',
    hib: '#0B6A2E',
    tide: '#2E8B3A',
    on: '#FFFFFF',
    tabsBg: 'rgba(255,255,255,0.86)',
    tabsBorder: 'rgba(6,36,15,0.12)',
    tabOnBg: 'rgba(11,106,46,0.12)',
    tabOnColor: '#0B6A2E',
    btnBg: '#0B6A2E',
    btnGradient: 'linear-gradient(90deg,#0B6A2E,#2E8B3A)',
    btnText: '#FFFFFF',
    btnShadow: 'rgba(11,106,46,0.28)',
    btnAltColor: '#0B6A2E',
    btnAltBorder: 'rgba(11,106,46,0.55)',
    chipOnBg: '#0B6A2E',
    chipOnText: '#FFFFFF',
    promoBorder: 'rgba(11,106,46,0.35)',
    promoBg: 'rgba(11,106,46,0.08)',
    promoGradient:
      'linear-gradient(160deg,rgba(11,106,46,0.12),rgba(11,106,46,0.02))',
    inputBg: '#F3F7F0',
    inputBorder: 'rgba(6,36,15,0.14)',
    giftBg: '#F3F7F0',
    statBg: '#F3F7F0',
    statNum: '#0B6A2E',
    bannerBg: 'rgba(255,255,255,0.96)',
    bannerText: '#0B2A16',
    bannerBorder: 'rgba(11,106,46,0.4)',
    adminBg: 'rgba(255,255,255,0.9)',
    adminBorder: 'rgba(6,36,15,0.1)',
    modeBg: 'rgba(255,255,255,0.7)',
    modeOnBg: '#0B6A2E',
    modeOnText: '#FFFFFF',
    stageGradient: '#EAF2E6',
  },
} as const;

export function computeMemberId(email: string): string {
  const clean = email || 'guest';
  const num = clean
    .split('')
    .reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 90000, 10000);
  return `ILC-${num}`;
}

export function generateQrMatrix(seed: string): boolean[][] {
  let h = 0;
  for (const c of seed || 'guest') {
    h = (h * 31 + c.charCodeAt(0)) >>> 0;
  }
  const f = (x: number, y: number) =>
    (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13);

  const matrix: boolean[][] = [];
  for (let y = 0; y < 21; y++) {
    const row: boolean[] = [];
    for (let x = 0; x < 21; x++) {
      let on: boolean;
      if (f(x, y)) {
        const a = x > 13 ? x - 14 : x;
        const b = y > 13 ? y - 14 : y;
        on =
          a === 0 ||
          a === 6 ||
          b === 0 ||
          b === 6 ||
          (a > 1 && a < 5 && b > 1 && b < 5);
      } else {
        h = (Math.imul(h, 1103515245) + 12345) >>> 0;
        on = Boolean((h >>> 16) & 1);
      }
      row.push(on);
    }
    matrix.push(row);
  }
  return matrix;
}

const gr = (id: string, a: string, b: string) =>
  `<linearGradient id='${id}' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='${a}'/><stop offset='1' stop-color='${b}'/></linearGradient>`;

const palm = (x: number, y: number, s: number, c: string) =>
  `<g fill='${c}' transform='translate(${x} ${y}) scale(${s})'><path d='M0 0Q3 -18 -2 -34L1 -34Q7 -18 3 0Z'/><path d='M-1 -34Q-14 -38 -22 -28Q-10 -34 -1 -31ZM0 -34Q12 -42 24 -32Q10 -36 1 -31ZM0 -34Q-6 -46 -16 -48Q-6 -44 -1 -33ZM1 -34Q8 -46 18 -46Q8 -42 2 -32Z'/></g>`;

const bg = (id: string, a: string, b: string, y?: number, h?: number) =>
  `<defs>${gr(id, a, b)}</defs><rect y='${y || 0}' width='160' height='${h || 100}' fill='url(#${id})'/>`;

export const SC: (() => string)[] = [
  () =>
    bg('s', '#183d63', '#f6a04d') +
    bg('w', '#1e9da0', '#0b4f5d', 58, 42) +
    `<circle cx='108' cy='54' r='15' fill='#ffe3a1'/><path d='M96 62h24M100 66h16M92 70h30' stroke='#ffe3a1' stroke-width='1.2' opacity='.6'/><path d='M0 100V86Q70 74 160 90V100Z' fill='#f1d9a8'/>` +
    palm(22, 90, 1.1, '#06240f') +
    palm(42, 93, 0.8, '#0b3d1e'),
  () =>
    bg('s', '#3a2467', '#ff9a62') +
    `<circle cx='130' cy='28' r='6' fill='#ffe9b8'/><path d='M40 100V58H54V44L66 30L78 44V58H92V100Z' fill='#241438'/><path d='M66 30V21M63 24H69' stroke='#241438' stroke-width='2'/><rect x='62' y='62' width='8' height='14' rx='4' fill='#ffc86b'/><rect x='46' y='66' width='4' height='8' rx='2' fill='#ffc86b'/><rect x='82' y='66' width='4' height='8' rx='2' fill='#ffc86b'/><path d='M0 100V88H160V100Z' fill='#150b24'/><g fill='#ffd27a'><circle cx='14' cy='80' r='2.2'/><circle cx='28' cy='82' r='2.2'/><circle cx='108' cy='82' r='2.2'/><circle cx='124' cy='80' r='2.2'/><circle cx='144' cy='82' r='2.2'/></g>`,
  () =>
    bg('s', '#4fb8ea', '#dff4ff') +
    bg('w', '#1b8fc0', '#0a4d78', 58, 42) +
    `<circle cx='28' cy='20' r='9' fill='#fff3b0'/><ellipse cx='100' cy='18' rx='18' ry='5' fill='#fff' opacity='.8'/><path d='M100 58Q122 34 160 52V58Z' fill='#2f8f5b'/><path d='M0 58Q30 44 60 58Z' fill='#3aa56a' opacity='.8'/><path d='M34 68H92L84 78H42Z' fill='#fff'/><rect x='48' y='56' width='30' height='12' rx='2' fill='#f4f7f8'/><rect x='52' y='59' width='22' height='4' fill='#1b8fc0'/><rect x='60' y='50' width='12' height='6' fill='#e1251b'/><path d='M20 80H80M96 74H140M10 90H60' stroke='#fff' stroke-width='1' opacity='.4'/>`,
  () =>
    bg('s', '#7b2d8b', '#ff8a5c') +
    `<circle cx='80' cy='62' r='22' fill='#ffd36e'/><path d='M0 100V74H16V62H28V74H38V54H50V74H64V68H78V60H88V74H100V66H114V76H130V62H142V74H160V100Z' fill='#3a1850'/>` +
    palm(18, 100, 1.2, '#1c0b2b') +
    palm(144, 100, 1, '#1c0b2b'),
  () =>
    bg('s', '#79d0f0', '#eaf9ff') +
    bg('w', '#25c9c4', '#0a8c94', 58, 42) +
    `<circle cx='30' cy='22' r='11' fill='#fff1a8'/><path d='M70 60Q100 26 140 60Z' fill='#2e8b3a'/><path d='M110 60Q130 40 160 58V60Z' fill='#1f6d2c'/><path d='M0 100V82Q50 70 160 86V100Z' fill='#f5e3b5'/>` +
    palm(128, 90, 1, '#0b3d1e'),
  () =>
    bg('s', '#0f7ea0', '#031c29') +
    `<g fill='#9be8ff' opacity='.12'><path d='M30 0H42L24 100H0Z'/><path d='M70 0H84L66 100H40Z'/><path d='M110 0H120L110 100H84Z'/></g><g fill='#ffb347'><ellipse cx='60' cy='40' rx='9' ry='5'/><path d='M69 40L77 35V45Z'/></g><g fill='#ff6f91'><ellipse cx='108' cy='28' rx='6' ry='3.5'/><path d='M114 28L120 24V32Z'/></g><g fill='#ffe066'><ellipse cx='36' cy='62' rx='5' ry='3'/><path d='M41 62L46 59V65Z'/></g><g fill='#e8575d'><circle cx='14' cy='94' r='9'/><circle cx='34' cy='97' r='8'/><circle cx='120' cy='95' r='10'/></g><g fill='#ffb347'><circle cx='70' cy='98' r='9'/><circle cx='150' cy='96' r='8'/></g><g fill='none' stroke='#fff' opacity='.4'><circle cx='80' cy='60' r='2'/><circle cx='84' cy='50' r='1.4'/><circle cx='78' cy='44' r='1'/></g>`,
];

export const IC: Record<PrototypeTab, string> = {
  home: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M10 9.5l5 2.5-5 2.5z"/>',
  live: '<circle cx="12" cy="12" r="2"/><path d="M7.8 7.8a6 6 0 000 8.4M16.2 7.8a6 6 0 010 8.4M4.9 4.9a10 10 0 000 14.2M19.1 4.9a10 10 0 010 14.2"/>',
  rewards:
    '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M5 12v8h14v-8M12 8v12M12 8C9.5 8 8 7 8 5.5S9.5 3 12 8zM12 8c2.5 0 4-1 4-2.5S14.5 3 12 8z"/>',
  travel:
    '<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>',
  more: '<circle cx="12" cy="8" r="4"/><path d="M5 20c0-3.8 3.1-6 7-6s7 2.2 7 6"/>',
};
