import { NextRequest, NextResponse } from 'next/server';
import {
  YouTubeWatchResponse,
  YouTubeVideoItem,
  YouTubeLiveStatus,
} from '@ilc/shared';

export const dynamic = 'force-dynamic';

// Official verified Channel ID for @islandlivingchannel1087
const OFFICIAL_ILC_CHANNEL_ID = 'UCXATr97RfU6NQna9WPOgWlA';
const OFFICIAL_ILC_HANDLE = '@islandlivingchannel1087';

/**
 * Parses ISO 8601 duration (e.g., PT4M12S, PT1H2M10S, PT45S) into total seconds.
 */
function parseIsoDuration(durationStr: string): number {
  if (!durationStr) return 0;
  const match = durationStr.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);
  return hours * 3600 + minutes * 60 + seconds;
}

/**
 * Formats seconds into MM:SS or H:MM:SS
 */
function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return '0:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) {
    return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  }
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

/**
 * Clean XML string escaping
 */
function unescapeXml(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

/**
 * Determines whether a video should be classified as a Short.
 * Documented strategy:
 * 1. Explicit YouTube API check or duration <= 60 seconds.
 * 2. Presence of #shorts or #short in title or description.
 * 3. Fallback heuristic: check if title contains #shorts or tags.
 */
function isVideoShort(
  title: string,
  description: string,
  durationSeconds?: number | null
): boolean {
  const combinedText = `${title} ${description}`.toLowerCase();
  const hasShortsHashtag = combinedText.includes('#shorts') || combinedText.includes('#short');

  // If duration is explicitly known via YouTube Data API
  if (typeof durationSeconds === 'number' && durationSeconds > 0) {
    // Shorts are <= 60 seconds (or recently up to 3 mins with 9:16 aspect ratio).
    // If <= 60s or marked with #shorts, it's classified as a Short.
    if (durationSeconds <= 60) return true;
    if (durationSeconds <= 180 && hasShortsHashtag) return true;
    return false;
  }

  // Fallback when duration is not available (e.g. RSS feed fallback)
  return hasShortsHashtag;
}

/**
 * Fetch from YouTube Data API v3 when YOUTUBE_API_KEY is available.
 */
async function fetchFromYouTubeApi(
  apiKey: string,
  channelId: string,
  pageToken?: string | null
): Promise<YouTubeWatchResponse> {
  const headers = { Accept: 'application/json' };

  // 1. Check live status: search for eventType=live for channel
  const liveUrl = new URL('https://www.googleapis.com/youtube/v3/search');
  liveUrl.searchParams.set('part', 'snippet');
  liveUrl.searchParams.set('channelId', channelId);
  liveUrl.searchParams.set('eventType', 'live');
  liveUrl.searchParams.set('type', 'video');
  liveUrl.searchParams.set('key', apiKey);

  // 1b. Check upcoming scheduled live broadcast
  const upcomingUrl = new URL('https://www.googleapis.com/youtube/v3/search');
  upcomingUrl.searchParams.set('part', 'snippet');
  upcomingUrl.searchParams.set('channelId', channelId);
  upcomingUrl.searchParams.set('eventType', 'upcoming');
  upcomingUrl.searchParams.set('type', 'video');
  upcomingUrl.searchParams.set('key', apiKey);

  // 2. Fetch channel upload playlist ID & channel details
  const channelDetailsUrl = new URL('https://www.googleapis.com/youtube/v3/channels');
  channelDetailsUrl.searchParams.set('part', 'snippet,contentDetails');
  channelDetailsUrl.searchParams.set('id', channelId);
  channelDetailsUrl.searchParams.set('key', apiKey);

  const [liveRes, upcomingRes, channelRes] = await Promise.all([
    fetch(liveUrl.toString(), { headers }),
    fetch(upcomingUrl.toString(), { headers }),
    fetch(channelDetailsUrl.toString(), { headers }),
  ]);

  let liveStatus: YouTubeLiveStatus = {
    isLive: false,
    videoId: null,
    title: null,
    description: null,
    scheduledStartTime: null,
    actualStartTime: null,
    thumbnailUrl: null,
    embedUrl: null,
    channelTitle: 'Island Living Channel',
    channelId,
  };

  if (liveRes.ok) {
    const liveData = await liveRes.json();
    const liveItem = liveData.items && liveData.items[0];
    if (liveItem && liveItem.id && liveItem.id.videoId) {
      const vId = liveItem.id.videoId;
      liveStatus = {
        isLive: true,
        videoId: vId,
        title: liveItem.snippet.title,
        description: liveItem.snippet.description,
        scheduledStartTime: null,
        actualStartTime: liveItem.snippet.publishedAt,
        thumbnailUrl:
          liveItem.snippet.thumbnails?.high?.url ||
          liveItem.snippet.thumbnails?.medium?.url ||
          `https://i.ytimg.com/vi/${vId}/hqdefault.jpg`,
        embedUrl: `https://www.youtube.com/embed/${vId}?autoplay=1&playsinline=1`,
        channelTitle: liveItem.snippet.channelTitle,
        channelId,
      };
    }
  }

  // If not currently live, check for upcoming stream
  if (!liveStatus.isLive && upcomingRes.ok) {
    const upcomingData = await upcomingRes.json();
    const upcomingItem = upcomingData.items && upcomingData.items[0];
    if (upcomingItem && upcomingItem.id && upcomingItem.id.videoId) {
      const uId = upcomingItem.id.videoId;
      liveStatus = {
        isLive: false,
        videoId: uId,
        title: upcomingItem.snippet.title,
        description: upcomingItem.snippet.description,
        scheduledStartTime: upcomingItem.snippet.publishedAt,
        thumbnailUrl:
          upcomingItem.snippet.thumbnails?.high?.url ||
          upcomingItem.snippet.thumbnails?.medium?.url ||
          `https://i.ytimg.com/vi/${uId}/hqdefault.jpg`,
        embedUrl: `https://www.youtube.com/embed/${uId}?playsinline=1`,
        channelTitle: upcomingItem.snippet.channelTitle,
        channelId,
      };
    }
  }

  // 3. Get channel uploads playlist
  let uploadsPlaylistId = 'UU' + channelId.substring(2);
  let channelTitle = 'Island Living Channel';

  if (channelRes.ok) {
    const cData = await channelRes.json();
    const cItem = cData.items && cData.items[0];
    if (cItem) {
      channelTitle = cItem.snippet?.title || channelTitle;
      const relatedUploads = cItem.contentDetails?.relatedPlaylists?.uploads;
      if (relatedUploads) {
        uploadsPlaylistId = relatedUploads;
      }
    }
  }

  // 4. Fetch videos from upload playlist
  const playlistItemsUrl = new URL('https://www.googleapis.com/youtube/v3/playlistItems');
  playlistItemsUrl.searchParams.set('part', 'snippet,contentDetails');
  playlistItemsUrl.searchParams.set('playlistId', uploadsPlaylistId);
  playlistItemsUrl.searchParams.set('maxResults', '30');
  if (pageToken) {
    playlistItemsUrl.searchParams.set('pageToken', pageToken);
  }
  playlistItemsUrl.searchParams.set('key', apiKey);

  const playlistRes = await fetch(playlistItemsUrl.toString(), { headers });
  if (!playlistRes.ok) {
    throw new Error(`YouTube API playlistItems returned status ${playlistRes.status}`);
  }

  const playlistData = await playlistRes.json();
  const rawItems = playlistData.items || [];
  const videoIds = rawItems
    .map((item: any) => item.contentDetails?.videoId)
    .filter(Boolean);

  // 5. Fetch video contentDetails for exact duration
  let videoDurations: Record<string, { durationSeconds: number; formatted: string }> = {};
  if (videoIds.length > 0) {
    const videosUrl = new URL('https://www.googleapis.com/youtube/v3/videos');
    videosUrl.searchParams.set('part', 'contentDetails');
    videosUrl.searchParams.set('id', videoIds.join(','));
    videosUrl.searchParams.set('key', apiKey);

    const vRes = await fetch(videosUrl.toString(), { headers });
    if (vRes.ok) {
      const vData = await vRes.json();
      for (const vItem of vData.items || []) {
        const sec = parseIsoDuration(vItem.contentDetails?.duration);
        videoDurations[vItem.id] = {
          durationSeconds: sec,
          formatted: formatDuration(sec),
        };
      }
    }
  }

  const allItems: YouTubeVideoItem[] = rawItems.map((item: any) => {
    const vId = item.contentDetails?.videoId;
    const snippet = item.snippet || {};
    const title = snippet.title || 'Untitled';
    const description = snippet.description || '';
    const publishedAt = snippet.publishedAt || new Date().toISOString();
    const durationInfo = videoDurations[vId] || { durationSeconds: null, formatted: '' };

    const isShort = isVideoShort(title, description, durationInfo.durationSeconds);
    const thumb =
      snippet.thumbnails?.maxres?.url ||
      snippet.thumbnails?.high?.url ||
      snippet.thumbnails?.medium?.url ||
      `https://i.ytimg.com/vi/${vId}/hqdefault.jpg`;

    return {
      id: vId,
      title,
      description,
      publishedAt,
      thumbnailUrl: thumb,
      durationSeconds: durationInfo.durationSeconds,
      durationFormatted: durationInfo.formatted,
      isShort,
      videoUrl: `https://www.youtube.com/watch?v=${vId}`,
      embedUrl: `https://www.youtube.com/embed/${vId}?playsinline=1&modestbranding=1&rel=0`,
    };
  });

  const videos = allItems.filter((v) => !v.isShort);
  const shorts = allItems.filter((v) => v.isShort);

  return {
    live: liveStatus,
    videos,
    shorts,
    nextPageToken: playlistData.nextPageToken || null,
    source: 'api',
    channelId,
    channelTitle,
  };
}

/**
 * Public RSS Feed & Web fallback when API credentials are not set.
 * Reads the official YouTube Channel XML feed for real, authentic video items.
 */
async function fetchFromYouTubeFeedFallback(channelId: string): Promise<YouTubeWatchResponse> {
  const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;

  const feedRes = await fetch(feedUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; IslandLivingDigital/1.0)',
      Accept: 'application/atom+xml, application/xml, text/xml',
    },
  });

  if (!feedRes.ok) {
    throw new Error(`Failed to fetch official YouTube RSS feed (status ${feedRes.status})`);
  }

  const xml = await feedRes.text();
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  const entries: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = entryRegex.exec(xml)) !== null) {
    entries.push(match[1]);
  }

  const allItems: YouTubeVideoItem[] = entries.map((entryXml) => {
    const idMatch = entryXml.match(/<yt:videoId>([\s\S]*?)<\/yt:videoId>/);
    const titleMatch = entryXml.match(/<title>([\s\S]*?)<\/title>/);
    const publishedMatch = entryXml.match(/<published>([\s\S]*?)<\/published>/);
    const descMatch = entryXml.match(/<media:description>([\s\S]*?)<\/media:description>/);
    const thumbMatch = entryXml.match(/<media:thumbnail url="([^"]+)"/);

    const vId = idMatch ? idMatch[1].trim() : '';
    const rawTitle = titleMatch ? titleMatch[1].trim() : 'Island Living Channel Video';
    const title = unescapeXml(rawTitle);
    const description = descMatch ? unescapeXml(descMatch[1].trim()) : '';
    const publishedAt = publishedMatch ? publishedMatch[1].trim() : new Date().toISOString();
    const thumbnailUrl = thumbMatch
      ? thumbMatch[1]
      : `https://i.ytimg.com/vi/${vId}/hqdefault.jpg`;

    const isShort = isVideoShort(title, description, null);

    return {
      id: vId,
      title,
      description,
      publishedAt,
      thumbnailUrl,
      durationSeconds: null,
      durationFormatted: '',
      isShort,
      videoUrl: `https://www.youtube.com/watch?v=${vId}`,
      embedUrl: `https://www.youtube.com/embed/${vId}?playsinline=1&modestbranding=1&rel=0`,
    };
  });

  // Verify live status via official channel /live endpoint
  let liveStatus: YouTubeLiveStatus = {
    isLive: false,
    videoId: null,
    title: null,
    description: null,
    scheduledStartTime: null,
    thumbnailUrl: null,
    embedUrl: null,
    channelTitle: 'Island Living Channel',
    channelId,
  };

  try {
    const liveCheckRes = await fetch(`https://www.youtube.com/channel/${channelId}/live`, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (liveCheckRes.ok) {
      const liveHtml = await liveCheckRes.text();
      // Look for confirmed active live stream signals
      const isConfirmedLive =
        (liveHtml.includes('"isLive":true') || liveHtml.includes('"isLiveNow":true')) &&
        !liveHtml.includes('"status":"LIVE_STREAM_OFFLINE"');

      if (isConfirmedLive) {
        const canonicalMatch = liveHtml.match(
          /<link rel="canonical" href="https:\/\/www\.youtube\.com\/watch\?v=([^"]+)">/
        );
        const liveVid = canonicalMatch ? canonicalMatch[1] : null;

        if (liveVid) {
          const titleMatch = liveHtml.match(/<meta property="og:title" content="([^"]+)">/);
          liveStatus = {
            isLive: true,
            videoId: liveVid,
            title: titleMatch ? unescapeXml(titleMatch[1]) : 'Island Living Channel Live Broadcast',
            description: 'Official Live Broadcast from Island Living Channel',
            thumbnailUrl: `https://i.ytimg.com/vi/${liveVid}/hqdefault.jpg`,
            embedUrl: `https://www.youtube.com/embed/${liveVid}?autoplay=1&playsinline=1`,
            channelTitle: 'Island Living Channel',
            channelId,
          };
        }
      }
    }
  } catch (liveErr) {
    console.warn('[ILC YouTube Fallback] Live stream probe error:', liveErr);
  }

  const videos = allItems.filter((v) => !v.isShort);
  const shorts = allItems.filter((v) => v.isShort);

  return {
    live: liveStatus,
    videos,
    shorts,
    nextPageToken: null,
    source: 'feed_fallback',
    channelId,
    channelTitle: 'Island Living Channel',
  };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const pageToken = searchParams.get('pageToken') || null;
    const channelId =
      searchParams.get('channelId') ||
      process.env.YOUTUBE_CHANNEL_ID ||
      OFFICIAL_ILC_CHANNEL_ID;

    const apiKey = process.env.YOUTUBE_API_KEY;

    let responseData: YouTubeWatchResponse;

    if (apiKey && apiKey.trim() !== '') {
      try {
        responseData = await fetchFromYouTubeApi(apiKey, channelId, pageToken);
      } catch (apiErr: any) {
        console.warn(
          '[ILC YouTube] API request failed, falling back to public feed:',
          apiErr.message
        );
        responseData = await fetchFromYouTubeFeedFallback(channelId);
      }
    } else {
      // Official public fallback strategy
      responseData = await fetchFromYouTubeFeedFallback(channelId);
    }

    return NextResponse.json(
      {
        success: true,
        data: responseData,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      }
    );
  } catch (error: any) {
    console.error('[ILC YouTube] Route error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to retrieve YouTube content',
      },
      { status: 500 }
    );
  }
}
