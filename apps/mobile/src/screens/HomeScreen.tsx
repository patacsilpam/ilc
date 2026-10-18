import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {
  H1,
  H2,
  H3,
  MuteText,
  PromoBox,
  ProtoButton,
} from '../components/PrototypePrimitives';
import { VideoCard } from '../components/VideoCard';
import {
  PrototypeVideo,
  ThemeMode,
  PROTOTYPE_THEMES,
  SERIF_FONT,
} from '../constants/prototypeTheme';
import { YouTubeVideoItem } from '@ilc/shared';
import { youtubeService } from '../services/youtube';

interface HomeScreenProps {
  theme: ThemeMode;
  videos: PrototypeVideo[];
  isRegistered: boolean;
  memberName: string;
  gift: { text: string; days: number };
  onPlayVideo: (index: number) => void;
  onOpenRegister: () => void;
  onSelectYouTubeVideo?: (video: YouTubeVideoItem) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  theme,
  videos,
  isRegistered,
  memberName,
  gift,
  onPlayVideo,
  onOpenRegister,
  onSelectYouTubeVideo,
}) => {
  const t = PROTOTYPE_THEMES[theme];
  const firstName = (memberName || 'Juan').split(' ')[0];
  const featured = videos[0] || {
    t: 'Siquijor: island of slow days',
    m: '6:20',
  };

  const [ytVideos, setYtVideos] = useState<YouTubeVideoItem[]>([]);
  const [ytShorts, setYtShorts] = useState<YouTubeVideoItem[]>([]);
  const [loadingYt, setLoadingYt] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const data = await youtubeService.fetchWatchData();
        if (isMounted) {
          setYtVideos(data.videos || []);
          setYtShorts(data.shorts || []);
        }
      } catch (err) {
        console.warn('[HomeScreen] Could not load YouTube content:', err);
      } finally {
        if (isMounted) setLoadingYt(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <View style={styles.container}>
      <H1 theme={theme}>
        {isRegistered ? `Welcome back, ${firstName}` : 'Stories from the islands'}
      </H1>
      <MuteText theme={theme} style={styles.subtitle}>
        Travel and lifestyle films, live events and member rewards.
      </MuteText>

      {/* Featured Hero Story */}
      <VideoCard
        video={featured}
        index={0}
        onPress={() => onPlayVideo(0)}
        theme={theme}
        layout="hero"
      />

      {/* Free Registration Promo */}
      {!isRegistered && (
        <PromoBox theme={theme} style={{ marginTop: 16 }}>
          <H3 theme={theme}>Join free, get a welcome gift</H3>
          <MuteText theme={theme} style={styles.promoSub}>
            {gift.text}. Valid {gift.days} days after you register.
          </MuteText>
          <ProtoButton
            theme={theme}
            label="Create free account"
            full
            onPress={onOpenRegister}
          />
        </PromoBox>
      )}

      {/* DEDICATED YOUTUBE SHORTS SECTION (Portrait Rectangle Cards) */}
      <View style={styles.sectionHeader}>
        <View>
          <View style={styles.sectionBadgeRow}>
            <View style={styles.shortsTag}>
              <Text style={styles.shortsTagIcon}>⚡</Text>
              <Text style={styles.shortsTagText}>ILC SHORTS</Text>
            </View>
          </View>
          <H2 theme={theme} style={{ marginTop: 2, marginBottom: 0 }}>
            YouTube Shorts
          </H2>
        </View>
        <MuteText theme={theme} style={styles.shortsSubHint}>
          Vertical stories
        </MuteText>
      </View>

      {loadingYt ? (
        <View style={styles.sectionLoading}>
          <ActivityIndicator size="small" color={t.tabOnColor} />
          <Text style={[styles.loadingHint, { color: t.mute }]}>Loading Shorts...</Text>
        </View>
      ) : ytShorts.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.shortsCarousel}
        >
          {ytShorts.map((short) => (
            <TouchableOpacity
              key={short.id}
              style={[
                styles.shortCard,
                {
                  backgroundColor: t.surf,
                  borderColor: t.line,
                },
                Platform.OS === 'web' &&
                  ({
                    boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                  } as any),
              ]}
              onPress={() => onSelectYouTubeVideo && onSelectYouTubeVideo(short)}
              activeOpacity={0.88}
            >
              <View style={styles.shortThumbWrapper}>
                <Image
                  source={{ uri: short.thumbnailUrl }}
                  style={styles.shortThumb}
                  resizeMode="cover"
                />
                <View style={styles.shortOverlayGradient} />
                <View style={styles.shortPlayBadge}>
                  <Text style={styles.shortPlayTriangle}>▶</Text>
                </View>
                <View style={styles.shortDurationPill}>
                  <Text style={styles.shortDurationText}>Short</Text>
                </View>
              </View>
              <View style={styles.shortMeta}>
                <Text
                  style={[styles.shortTitle, { color: t.ink }]}
                  numberOfLines={2}
                >
                  {short.title}
                </Text>
                <Text style={[styles.shortDate, { color: t.mute }]}>
                  {new Date(short.publishedAt).toLocaleDateString()}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <View style={[styles.emptyBox, { borderColor: t.line }]}>
          <Text style={[styles.emptyText, { color: t.mute }]}>
            Shorts will appear here when posted on @islandlivingchannel1087
          </Text>
        </View>
      )}

      {/* DEDICATED OFFICIAL YOUTUBE VIDEOS SECTION */}
      {ytVideos.length > 0 && (
        <View style={{ marginTop: 20 }}>
          <View style={styles.sectionHeader}>
            <View>
              <H2 theme={theme} style={{ marginBottom: 0 }}>
                Official Channel Videos
              </H2>
              <MuteText theme={theme} style={{ marginTop: 2 }}>
                From @islandlivingchannel1087
              </MuteText>
            </View>
          </View>

          <View style={styles.ytVideosGrid}>
            {ytVideos.slice(0, 4).map((v) => (
              <TouchableOpacity
                key={v.id}
                style={[
                  styles.ytGridItem,
                  {
                    backgroundColor: t.surf,
                    borderColor: t.line,
                  },
                ]}
                onPress={() => onSelectYouTubeVideo && onSelectYouTubeVideo(v)}
                activeOpacity={0.88}
              >
                <View style={styles.ytThumbWrap}>
                  <Image
                    source={{ uri: v.thumbnailUrl }}
                    style={styles.ytThumb}
                    resizeMode="cover"
                  />
                  {v.durationFormatted ? (
                    <View style={styles.ytDurationBadge}>
                      <Text style={styles.ytDurationText}>{v.durationFormatted}</Text>
                    </View>
                  ) : null}
                  <View style={styles.ytPlayCircle}>
                    <Text style={styles.ytPlayTriangle}>▶</Text>
                  </View>
                </View>
                <View style={styles.ytMetaWrap}>
                  <Text style={[styles.ytTitle, { color: t.ink }]} numberOfLines={2}>
                    {v.title}
                  </Text>
                  <Text style={[styles.ytDate, { color: t.mute }]}>
                    {new Date(v.publishedAt).toLocaleDateString()}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Catch Up Original Films */}
      <H2 theme={theme} style={{ marginTop: 24 }}>Catch up</H2>
      <View style={styles.grid}>
        {videos.map((v, i) => (
          <VideoCard
            key={`${v.t}-${i}`}
            video={v}
            index={i}
            onPress={() => onPlayVideo(i)}
            theme={theme}
            layout="grid"
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 10,
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 20,
  },
  promoSub: {
    marginTop: 4,
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 12,
  },
  sectionBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  shortsTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FF0050',
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: 6,
  },
  shortsTagIcon: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  shortsTagText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  shortsSubHint: {
    fontSize: 12,
  },
  sectionLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 20,
  },
  loadingHint: {
    fontSize: 12,
  },
  shortsCarousel: {
    paddingRight: 10,
    gap: 12,
  },
  shortCard: {
    width: 140,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
  },
  shortThumbWrapper: {
    width: '100%',
    height: 220, // Portrait rectangle 9:16 aspect ratio
    position: 'relative',
    backgroundColor: '#000',
  },
  shortThumb: {
    width: '100%',
    height: '100%',
  },
  shortOverlayGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 60,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  shortPlayBadge: {
    position: 'absolute',
    top: '40%',
    left: '38%',
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shortPlayTriangle: {
    color: '#FFFFFF',
    fontSize: 14,
    marginLeft: 2,
  },
  shortDurationPill: {
    position: 'absolute',
    left: 6,
    bottom: 6,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  shortDurationText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  shortMeta: {
    padding: 8,
  },
  shortTitle: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
    marginBottom: 4,
  },
  shortDate: {
    fontSize: 10.5,
  },
  emptyBox: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  ytVideosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  ytGridItem: {
    width: '48%',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    marginBottom: 6,
  },
  ytThumbWrap: {
    width: '100%',
    aspectRatio: 16 / 9,
    position: 'relative',
    backgroundColor: '#000',
  },
  ytThumb: {
    width: '100%',
    height: '100%',
  },
  ytDurationBadge: {
    position: 'absolute',
    right: 6,
    bottom: 6,
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  ytDurationText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  ytPlayCircle: {
    position: 'absolute',
    top: '35%',
    left: '40%',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ytPlayTriangle: {
    color: '#FFFFFF',
    fontSize: 13,
    marginLeft: 2,
  },
  ytMetaWrap: {
    padding: 9,
  },
  ytTitle: {
    fontSize: 12.5,
    fontWeight: '600',
    lineHeight: 16,
    marginBottom: 4,
  },
  ytDate: {
    fontSize: 11,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
