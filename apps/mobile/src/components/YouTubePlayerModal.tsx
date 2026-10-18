import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Linking,
  ScrollView,
} from 'react-native';
import { YouTubeEmbed } from './YouTubeEmbed';
import {
  H2,
  MuteText,
  ProtoButton,
} from './PrototypePrimitives';
import {
  PROTOTYPE_THEMES,
  SERIF_FONT,
  ThemeMode,
} from '../constants/prototypeTheme';
import { YouTubeVideoItem } from '@ilc/shared';

interface YouTubePlayerModalProps {
  theme: ThemeMode;
  video: YouTubeVideoItem | null;
  onClose: () => void;
}

export const YouTubePlayerModal: React.FC<YouTubePlayerModalProps> = ({
  theme,
  video,
  onClose,
}) => {
  const t = PROTOTYPE_THEMES[theme];

  if (!video) return null;

  const isShort = !!video.isShort;

  const handleOpenExternal = () => {
    if (video.videoUrl) {
      Linking.openURL(video.videoUrl).catch((err) =>
        console.warn('Failed to open YouTube URL:', err)
      );
    }
  };

  return (
    <View
      style={[
        styles.sheet,
        {
          backgroundColor: t.sheetBg,
        },
      ]}
    >
      <View style={styles.headerRow}>
        <View style={styles.badgeRow}>
          <View
            style={[
              styles.pillBadge,
              { backgroundColor: isShort ? '#FF0050' : t.tabOnColor },
            ]}
          >
            <Text style={styles.pillBadgeText}>
              {isShort ? 'YouTube Short' : 'Island Living Channel'}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={onClose}
          style={[styles.closeCircle, { backgroundColor: t.modeBg }]}
          activeOpacity={0.7}
        >
          <Text style={[styles.closeText, { color: t.ink }]}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Embedded Official YouTube Player */}
        <View
          style={[
            styles.playerContainer,
            isShort ? styles.shortsPlayerAspect : styles.videoPlayerAspect,
            Platform.OS === 'web' &&
              ({
                boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
              } as any),
          ]}
        >
          <YouTubeEmbed
            embedUrl={video.embedUrl}
            title={video.title}
            aspectRatio={isShort ? 9 / 16 : 16 / 9}
            autoPlay
          />
        </View>

        <H2 theme={theme} style={styles.title}>
          {video.title}
        </H2>

        <MuteText theme={theme} style={styles.metaText}>
          {video.durationFormatted ? `${video.durationFormatted} · ` : ''}
          Published {new Date(video.publishedAt).toLocaleDateString()}
        </MuteText>

        {video.description ? (
          <Text style={[styles.description, { color: t.ink }]}>
            {video.description}
          </Text>
        ) : null}

        <View style={styles.actionRow}>
          <ProtoButton
            theme={theme}
            alt
            label="Open in YouTube"
            onPress={handleOpenExternal}
            style={{ flex: 1 }}
          />
          <ProtoButton
            theme={theme}
            label="Close"
            onPress={onClose}
            style={{ flex: 1 }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pillBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 99,
  },
  pillBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  closeCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 14,
    fontWeight: '700',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  playerContainer: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#000000',
    marginBottom: 16,
    alignSelf: 'center',
  },
  videoPlayerAspect: {
    aspectRatio: 16 / 9,
  },
  shortsPlayerAspect: {
    maxWidth: 320,
    aspectRatio: 9 / 16,
  },
  title: {
    marginTop: 0,
    marginBottom: 6,
    fontFamily: SERIF_FONT,
    fontSize: 20,
    lineHeight: 26,
  },
  metaText: {
    fontSize: 13,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 21,
    opacity: 0.85,
    marginBottom: 20,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
});
