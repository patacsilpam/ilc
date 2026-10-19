import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Image,
} from 'react-native';
import { SceneBackground } from './PrototypeArtwork';
import {
  PROTOTYPE_THEMES,
  PrototypeVideo,
  SERIF_FONT,
  ThemeMode,
} from '../constants/prototypeTheme';

interface VideoCardProps {
  video: PrototypeVideo;
  index: number;
  onPress: () => void;
  theme?: ThemeMode;
  layout?: 'hero' | 'grid' | 'continue';
  progress?: number;
  resumeLabel?: string;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  video,
  index,
  onPress,
  theme = 'dark',
  layout = 'grid',
  progress = 0,
  resumeLabel,
}) => {
  const t = PROTOTYPE_THEMES[theme];
  const sceneIdx = video.sceneIndex !== undefined ? video.sceneIndex : index;
  const hasImage = !!video.thumbnailUrl;

  if (layout === 'hero') {
    return (
      <TouchableOpacity
        style={[
          styles.heroTouch,
          Platform.OS === 'web' &&
            ({ boxShadow: '0 20px 40px rgba(0,0,0,0.4)' } as any),
        ]}
        onPress={onPress}
        activeOpacity={0.9}
      >
        {hasImage ? (
          <View style={styles.heroScene}>
            <Image
              source={{ uri: video.thumbnailUrl }}
              style={StyleSheet.absoluteFillObject}
              resizeMode="cover"
            />
            <View style={styles.heroOverlay} />
            <View style={styles.heroInner}>
              <View style={styles.heroBadgeRow}>
                <View style={styles.heroTag}>
                  <Text style={styles.heroTagText}>Featured</Text>
                </View>
                <View style={styles.heroCatTag}>
                  <Text style={styles.heroCatText}>{video.category}</Text>
                </View>
              </View>
              <Text style={[styles.heroTitle, { fontFamily: SERIF_FONT }]}>
                {video.t}
              </Text>
              <Text style={styles.heroSub}>{video.m} · Tap to watch</Text>
            </View>
          </View>
        ) : (
          <SceneBackground
            index={sceneIdx}
            overlayGradient="hero"
            style={styles.heroScene}
          >
            <View style={styles.heroInner}>
              <View style={styles.heroBadgeRow}>
                <View style={styles.heroTag}>
                  <Text style={styles.heroTagText}>Featured</Text>
                </View>
                <View style={styles.heroCatTag}>
                  <Text style={styles.heroCatText}>{video.category}</Text>
                </View>
              </View>
              <Text style={[styles.heroTitle, { fontFamily: SERIF_FONT }]}>
                {video.t}
              </Text>
              <Text style={styles.heroSub}>{video.m} · Tap to watch</Text>
            </View>
          </SceneBackground>
        )}
      </TouchableOpacity>
    );
  }

  if (layout === 'continue') {
    return (
      <TouchableOpacity
        style={styles.continueCard}
        onPress={onPress}
        activeOpacity={0.85}
      >
        <View style={styles.continueThumb}>
          {hasImage ? (
            <Image
              source={{ uri: video.thumbnailUrl }}
              style={StyleSheet.absoluteFillObject}
              resizeMode="cover"
            />
          ) : (
            <SceneBackground
              index={sceneIdx}
              overlayGradient="thumb"
              style={StyleSheet.absoluteFillObject}
            />
          )}
          <View style={styles.continuePlayCircle}>
            <Text style={styles.continuePlayIcon}>▶</Text>
          </View>
          <View style={styles.durationPill}>
            <Text style={styles.durationText}>
              {resumeLabel || video.m}
            </Text>
          </View>
          <View style={styles.continueBarTrack}>
            <View
              style={[
                styles.continueBarFill,
                { backgroundColor: t.hib, width: `${progress}%` },
              ]}
            />
          </View>
        </View>
        <Text
          style={[styles.vidTitle, { color: t.ink }]}
          numberOfLines={2}
        >
          {video.t}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={styles.vidButton}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.thumb}>
        {hasImage ? (
          <Image
            source={{ uri: video.thumbnailUrl }}
            style={StyleSheet.absoluteFillObject}
            resizeMode="cover"
          />
        ) : (
          <SceneBackground
            index={sceneIdx}
            overlayGradient="thumb"
            style={StyleSheet.absoluteFillObject}
          />
        )}
        <View style={styles.categoryMicroPill}>
          <Text style={styles.categoryMicroText}>{video.category}</Text>
        </View>
        <View style={styles.durationPill}>
          <Text style={styles.durationText}>{video.m}</Text>
        </View>
      </View>
      <Text style={[styles.vidTitle, { color: t.ink }]} numberOfLines={2}>
        {video.t}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  heroTouch: {
    borderRadius: 24,
    overflow: 'hidden',
    minHeight: 260,
  },
  heroScene: {
    minHeight: 260,
    borderRadius: 24,
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 15, 29, 0.45)',
  },
  heroInner: {
    flex: 1,
    justifyContent: 'flex-end',
    gap: 6,
    zIndex: 2,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  heroTag: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 4,
    paddingHorizontal: 11,
    borderRadius: 99,
  },
  heroTagText: {
    color: '#F3E600',
    fontSize: 11.5,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  heroCatTag: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    paddingVertical: 4,
    paddingHorizontal: 11,
    borderRadius: 99,
  },
  heroCatText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '600',
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28,
  },
  heroSub: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    fontWeight: '500',
  },
  continueCard: {
    width: 175,
    marginRight: 14,
  },
  continueThumb: {
    width: '100%',
    aspectRatio: 16 / 9, // Standard YouTube 16:9 ratio
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#0a0f1d',
  },
  continuePlayCircle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -16 }, { translateY: -16 }],
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  continuePlayIcon: {
    color: '#FFFFFF',
    fontSize: 11,
    marginLeft: 2,
  },
  continueBarTrack: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  continueBarFill: {
    height: '100%',
  },
  vidButton: {
    width: '48%',
    marginBottom: 16,
  },
  thumb: {
    width: '100%',
    aspectRatio: 16 / 9, // Standard YouTube 16:9 ratio
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#0a0f1d',
  },
  categoryMicroPill: {
    position: 'absolute',
    left: 6,
    top: 6,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: 6,
    zIndex: 2,
  },
  categoryMicroText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  durationPill: {
    position: 'absolute',
    right: 6,
    bottom: 6,
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingVertical: 1,
    paddingHorizontal: 6,
    borderRadius: 4,
    zIndex: 2,
  },
  durationText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '600',
  },
  vidTitle: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 17,
    marginTop: 8,
  },
});
