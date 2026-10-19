import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
  Image,
  ScrollView,
  Linking,
} from 'react-native';
import {
  H1,
  H2,
  MuteText,
  ProtoButton,
} from '../components/PrototypePrimitives';
import { YouTubeEmbed } from '../components/YouTubeEmbed';
import {
  PROTOTYPE_THEMES,
  SERIF_FONT,
  ThemeMode,
} from '../constants/prototypeTheme';
import {
  YouTubeWatchResponse,
  YouTubeVideoItem,
  YouTubeLiveStatus,
} from '@ilc/shared';
import { youtubeService, ILC_CHANNEL_HANDLE, ILC_CHANNEL_URL } from '../services/youtube';

interface WatchScreenProps {
  theme: ThemeMode;
  onSelectVideo: (video: YouTubeVideoItem) => void;
  onPushToast: (title: string, msg: string) => void;
}

export const WatchScreen: React.FC<WatchScreenProps> = ({
  theme,
  onSelectVideo,
  onPushToast,
}) => {
  const t = PROTOTYPE_THEMES[theme];

  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [watchData, setWatchData] = useState<YouTubeWatchResponse | null>(null);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  const livePollTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadData = async (isRefresh: boolean = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      const res = await youtubeService.fetchWatchData();
      setWatchData(res);
      setNextPageToken(res.nextPageToken || null);
    } catch (err: any) {
      console.warn('[WatchScreen] Error loading YouTube data:', err);
      setError(err.message || 'Could not connect to YouTube service. Please check your network.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
    livePollTimer.current = setInterval(async () => {
      try {
        const liveRes = await youtubeService.checkLiveStatus();
        setWatchData((prev) => {
          if (!prev) return prev;
          return { ...prev, live: liveRes };
        });
      } catch {
        // silent probe
      }
    }, 45000);
    return () => {
      if (livePollTimer.current) clearInterval(livePollTimer.current);
    };
  }, []);

  const handleLoadMore = async () => {
    if (!nextPageToken || loadingMore) return;
    try {
      setLoadingMore(true);
      const res = await youtubeService.fetchWatchData(nextPageToken);
      setWatchData((prev) => {
        if (!prev) return res;
        return {
          ...prev,
          videos: [...prev.videos, ...res.videos],
          shorts: [...prev.shorts, ...res.shorts],
          nextPageToken: res.nextPageToken || null,
        };
      });
      setNextPageToken(res.nextPageToken || null);
    } catch (err: any) {
      onPushToast('Error', err.message || 'Could not fetch additional videos');
    } finally {
      setLoadingMore(false);
    }
  };

  const renderLiveSection = (live: YouTubeLiveStatus | undefined) => {
    const isLive = !!live?.isLive;
    if (isLive && live) {
      return (
        <View style={styles.liveSectionCard}>
          <View style={styles.liveHeaderRow}>
            <View style={styles.redBadge}>
              <View style={styles.liveBlinkDot} />
              <Text style={styles.redBadgeText}>LIVE NOW</Text>
            </View>
            <Text style={[styles.channelLabel, { color: t.ink }]}>
              {live.channelTitle || 'Island Living Channel'}
            </Text>
          </View>
          <View
            style={[
              styles.playerWrapper,
              Platform.OS === 'web' && ({ boxShadow: '0 16px 36px rgba(225,37,27,0.30)' } as any),
            ]}
          >
            <YouTubeEmbed
              embedUrl={live.embedUrl || `https://www.youtube.com/embed/${live.videoId}?autoplay=1`}
              title={live.title || 'ILC Live Stream'}
              aspectRatio={16 / 9}
              autoPlay
            />
          </View>
          <Text style={[styles.liveTitle, { color: t.ink, fontFamily: SERIF_FONT }]}>
            {live.title}
          </Text>
          {live.description ? (
            <MuteText theme={theme} style={styles.liveDesc}>
              {live.description}
            </MuteText>
          ) : null}
        </View>
      );
    }

    return (
      <View style={[styles.offairBanner, { backgroundColor: t.surf, borderColor: t.line }]}>
        <View style={styles.offairLeft}>
          <Text style={styles.offairIcon}>📡</Text>
          <View>
            <Text style={[styles.offairTitle, { color: t.ink }]}>Currently Off-Air</Text>
            <MuteText theme={theme} style={styles.offairSub}>No live broadcast right now</MuteText>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.youtubeBtn, { borderColor: t.line }]}
          onPress={() => Linking.openURL(ILC_CHANNEL_URL).catch(() => {})}
          activeOpacity={0.8}
        >
          <Text style={[styles.youtubeBtnText, { color: t.tabOnColor }]}>Subscribe</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderVideosSection = (videos: YouTubeVideoItem[]) => {
    if (videos.length === 0) return null;
    const featured = videos[0];
    const rest = videos.slice(1);
    return (
      <View style={styles.section}>
        <View style={styles.sectionTitleRow}>
          <H2 theme={theme} style={{ marginBottom: 0 }}>Videos</H2>
          <MuteText theme={theme} style={styles.sectionMeta}>{ILC_CHANNEL_HANDLE}</MuteText>
        </View>
        {featured && (
          <TouchableOpacity
            style={[
              styles.featuredCard,
              { backgroundColor: t.surf, borderColor: t.line },
              Platform.OS === 'web' && ({ boxShadow: '0 12px 24px rgba(0,0,0,0.25)' } as any),
            ]}
            onPress={() => onSelectVideo(featured)}
            activeOpacity={0.9}
          >
            <View style={styles.featuredThumbWrap}>
              <Image source={{ uri: featured.thumbnailUrl }} style={styles.featuredThumb} resizeMode="cover" />
              <View style={styles.featuredPlayOverlay}>
                <View style={styles.playCircle}>
                  <Text style={styles.playTriangle}>▶</Text>
                </View>
              </View>
              {featured.durationFormatted ? (
                <View style={styles.durationBadge}>
                  <Text style={styles.durationText}>{featured.durationFormatted}</Text>
                </View>
              ) : null}
              <View style={styles.latestBadge}>
                <Text style={styles.latestBadgeText}>LATEST</Text>
              </View>
            </View>
            <View style={styles.featuredInfo}>
              <Text style={[styles.featuredTitle, { color: t.ink, fontFamily: SERIF_FONT }]} numberOfLines={2}>
                {featured.title}
              </Text>
              <MuteText theme={theme} style={styles.videoDate}>
                {new Date(featured.publishedAt).toLocaleDateString()}
              </MuteText>
            </View>
          </TouchableOpacity>
        )}
        {rest.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScrollContent}>
            {rest.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.hVideoCard, { backgroundColor: t.surf, borderColor: t.line }]}
                onPress={() => onSelectVideo(item)}
                activeOpacity={0.85}
              >
                <View style={styles.hThumbWrap}>
                  <Image source={{ uri: item.thumbnailUrl }} style={styles.hThumb} resizeMode="cover" />
                  {item.durationFormatted ? (
                    <View style={styles.durationBadge}>
                      <Text style={styles.durationText}>{item.durationFormatted}</Text>
                    </View>
                  ) : null}
                </View>
                <View style={styles.hVideoInfo}>
                  <Text style={[styles.hVideoTitle, { color: t.ink }]} numberOfLines={2}>{item.title}</Text>
                  <MuteText theme={theme} style={styles.videoDate}>
                    {new Date(item.publishedAt).toLocaleDateString()}
                  </MuteText>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
        {nextPageToken && (
          <View style={styles.loadMoreWrap}>
            <ProtoButton theme={theme} alt label={loadingMore ? 'Loading...' : 'Load More Videos'} onPress={handleLoadMore} />
          </View>
        )}
      </View>
    );
  };

  const renderShortsSection = (shorts: YouTubeVideoItem[]) => {
    return (
      <View style={styles.section}>
        <View style={styles.sectionTitleRow}>
          <View style={styles.shortsSectionBrand}>
            <View style={styles.shortsIconBg}>
              <Text style={styles.shortsIconText}>⚡</Text>
            </View>
            <H2 theme={theme} style={{ marginBottom: 0 }}>Shorts</H2>
          </View>
          {shorts.length > 0 && (
            <MuteText theme={theme} style={styles.sectionMeta}>
              {shorts.length} short{shorts.length !== 1 ? 's' : ''}
            </MuteText>
          )}
        </View>

        {shorts.length === 0 ? (
          /* Empty state — channel hasn't posted any Shorts yet */
          <View style={[styles.shortsEmptyCard, { backgroundColor: t.surf, borderColor: t.line }]}>
            <Text style={styles.shortsEmptyIcon}>📱</Text>
            <Text style={[styles.shortsEmptyTitle, { color: t.ink }]}>
              Shorts coming soon
            </Text>
            <MuteText theme={theme} style={styles.shortsEmptyBody}>
              Vertical short-form videos will appear here once{'\n'}
              Island Living Channel starts posting Shorts.
            </MuteText>
            <TouchableOpacity
              style={[styles.shortsEmptyBtn, { borderColor: t.line }]}
              onPress={() => Linking.openURL('https://www.youtube.com/@islandlivingchannel1087/shorts').catch(() => {})}
              activeOpacity={0.8}
            >
              <Text style={[styles.shortsEmptyBtnText, { color: t.tabOnColor }]}>
                Follow on YouTube
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <MuteText theme={theme} style={styles.shortsSub}>
              Bite-sized island moments — shot vertical.
            </MuteText>
            <View style={styles.shortsGrid}>
              {shorts.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.shortCard,
                    { backgroundColor: t.surf, borderColor: t.line },
                    Platform.OS === 'web' && ({ boxShadow: '0 8px 20px rgba(0,0,0,0.28)' } as any),
                  ]}
                  onPress={() => onSelectVideo(item)}
                  activeOpacity={0.88}
                >
                  <View style={styles.shortThumbWrapper}>
                    <Image source={{ uri: item.thumbnailUrl }} style={styles.shortThumb} resizeMode="cover" />
                    <View style={styles.shortsBadge}>
                      <Text style={styles.shortsBadgeText}>Shorts</Text>
                    </View>
                    <View style={styles.shortPlayOverlay}>
                      <View style={styles.shortPlayCircle}>
                        <Text style={styles.shortPlayIcon}>▶</Text>
                      </View>
                    </View>
                    {item.durationFormatted ? (
                      <View style={[styles.durationBadge, styles.shortDurationBadge]}>
                        <Text style={styles.durationText}>{item.durationFormatted}</Text>
                      </View>
                    ) : null}
                  </View>
                  <View style={styles.shortInfo}>
                    <Text style={[styles.shortTitle, { color: t.ink }]} numberOfLines={2}>{item.title}</Text>
                    <MuteText theme={theme} style={styles.shortDate}>
                      {new Date(item.publishedAt).toLocaleDateString()}
                    </MuteText>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerArea}>
        <H1 theme={theme}>Watch</H1>
        <MuteText theme={theme} style={styles.subtitle}>
          Official streams, episodes, and shorts from Island Living Channel.
        </MuteText>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={t.tabOnColor} />
          <Text style={[styles.loadingText, { color: t.mute }]}>
            Connecting to Island Living Channel...
          </Text>
        </View>
      )}

      {!loading && error && (
        <View style={[styles.errorContainer, { backgroundColor: t.bannerBg, borderColor: t.bannerBorder }]}>
          <Text style={[styles.errorTitle, { color: t.ink }]}>Unable to load channel</Text>
          <Text style={[styles.errorMsg, { color: t.bannerText }]}>{error}</Text>
          <ProtoButton theme={theme} label="Retry" onPress={() => loadData(false)} />
        </View>
      )}

      {!loading && !error && watchData && (
        <>
          {renderLiveSection(watchData.live)}
          {renderVideosSection(watchData.videos)}
          {renderShortsSection(watchData.shorts)}
          {watchData.videos.length === 0 && watchData.shorts.length === 0 && (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: t.mute }]}>
                No content available from {ILC_CHANNEL_HANDLE} right now.
              </Text>
              <ProtoButton
                theme={theme}
                alt
                label="Open Channel on YouTube"
                onPress={() => Linking.openURL(ILC_CHANNEL_URL).catch(() => {})}
                style={{ marginTop: 12 }}
              />
            </View>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingBottom: 24 },
  headerArea: { marginBottom: 16 },
  subtitle: { marginTop: 4 },

  liveSectionCard: { marginBottom: 28 },
  liveHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  redBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#E1251B', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 6,
  },
  liveBlinkDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FFFFFF' },
  redBadgeText: { color: '#FFFFFF', fontWeight: '800', fontSize: 11, letterSpacing: 0.5 },
  channelLabel: { fontSize: 13, fontWeight: '600' },
  playerWrapper: {
    width: '100%', aspectRatio: 16 / 9,
    borderRadius: 20, overflow: 'hidden', backgroundColor: '#000000', marginBottom: 12,
  },
  liveTitle: { fontSize: 19, lineHeight: 25, fontWeight: '600', marginBottom: 4 },
  liveDesc: { fontSize: 13.5, lineHeight: 19 },

  offairBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderRadius: 18, borderWidth: 1, padding: 14, marginBottom: 24,
  },
  offairLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  offairIcon: { fontSize: 22 },
  offairTitle: { fontSize: 14, fontWeight: '700' },
  offairSub: { fontSize: 12, marginTop: 1 },
  youtubeBtn: { borderWidth: 1, borderRadius: 10, paddingVertical: 6, paddingHorizontal: 12 },
  youtubeBtnText: { fontSize: 12, fontWeight: '700' },

  section: { marginBottom: 30 },
  sectionTitleRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12,
  },
  sectionMeta: { fontSize: 12 },

  featuredCard: { borderRadius: 20, overflow: 'hidden', borderWidth: 1, marginBottom: 14 },
  featuredThumbWrap: { width: '100%', aspectRatio: 16 / 9, position: 'relative', backgroundColor: '#000' },
  featuredThumb: { width: '100%', height: '100%' },
  featuredPlayOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.18)',
  },
  playCircle: {
    width: 54, height: 54, borderRadius: 27,
    backgroundColor: 'rgba(0,0,0,0.60)', borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.7)', alignItems: 'center', justifyContent: 'center',
  },
  playTriangle: { color: '#FFFFFF', fontSize: 20, marginLeft: 3 },
  latestBadge: {
    position: 'absolute', top: 10, left: 10,
    backgroundColor: 'rgba(0,0,0,0.65)', paddingVertical: 3, paddingHorizontal: 8, borderRadius: 6,
  },
  latestBadgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: '800', letterSpacing: 0.4 },
  durationBadge: {
    position: 'absolute', right: 7, bottom: 7,
    backgroundColor: 'rgba(0,0,0,0.75)', paddingVertical: 2, paddingHorizontal: 6, borderRadius: 6,
  },
  durationText: { color: '#FFFFFF', fontSize: 11, fontWeight: '600' },
  featuredInfo: { padding: 14 },
  featuredTitle: { fontSize: 17, lineHeight: 22, fontWeight: '600', marginBottom: 4 },
  videoDate: { fontSize: 11.5 },

  hScrollContent: { gap: 12, paddingRight: 4, paddingBottom: 4 },
  hVideoCard: { width: 160, borderRadius: 16, overflow: 'hidden', borderWidth: 1 },
  hThumbWrap: { width: '100%', aspectRatio: 16 / 9, backgroundColor: '#000', position: 'relative' },
  hThumb: { width: '100%', height: '100%' },
  hVideoInfo: { padding: 9 },
  hVideoTitle: { fontSize: 12, fontWeight: '600', lineHeight: 16, marginBottom: 4 },
  loadMoreWrap: { marginTop: 14, alignItems: 'center' },

  shortsSectionBrand: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  shortsIconBg: {
    width: 28, height: 28, borderRadius: 8, backgroundColor: '#FF0050',
    alignItems: 'center', justifyContent: 'center',
  },
  shortsIconText: { fontSize: 14, color: '#FFFFFF' },
  shortsSub: { fontSize: 13, marginBottom: 14, marginTop: -4 },
  shortsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 },
  shortCard: { width: '48%', borderRadius: 18, overflow: 'hidden', borderWidth: 1, marginBottom: 4 },
  shortThumbWrapper: { width: '100%', aspectRatio: 9 / 16, position: 'relative', backgroundColor: '#000' },
  shortThumb: { width: '100%', height: '100%' },
  shortsBadge: {
    position: 'absolute', top: 8, left: 8, backgroundColor: '#FF0050',
    paddingVertical: 2, paddingHorizontal: 7, borderRadius: 5,
  },
  shortsBadgeText: { color: '#FFFFFF', fontSize: 9, fontWeight: '800', letterSpacing: 0.3 },
  shortPlayOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center',
  },
  shortPlayCircle: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.52)',
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.7)', alignItems: 'center', justifyContent: 'center',
  },
  shortPlayIcon: { color: '#FFFFFF', fontSize: 15, marginLeft: 2 },
  shortDurationBadge: { right: 6, bottom: 6 },
  shortInfo: { padding: 10 },
  shortTitle: { fontSize: 12, fontWeight: '600', lineHeight: 16, marginBottom: 3 },
  shortDate: { fontSize: 10.5 },

  loadingContainer: { paddingVertical: 60, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { fontSize: 13 },
  errorContainer: { padding: 20, borderRadius: 18, borderWidth: 1, alignItems: 'center', gap: 10, marginVertical: 20 },
  errorTitle: { fontSize: 16, fontWeight: '700' },
  errorMsg: { fontSize: 13, textAlign: 'center' },
  emptyContainer: { paddingVertical: 40, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: 14, fontStyle: 'italic', textAlign: 'center' },

  // Shorts empty state
  shortsEmptyCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
  },
  shortsEmptyIcon: { fontSize: 36, marginBottom: 12 },
  shortsEmptyTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  shortsEmptyBody: { fontSize: 13, lineHeight: 19, textAlign: 'center', marginBottom: 16 },
  shortsEmptyBtn: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 18,
  },
  shortsEmptyBtnText: { fontSize: 13, fontWeight: '700' },
});
