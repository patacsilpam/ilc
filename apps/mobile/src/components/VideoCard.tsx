import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
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
        <SceneBackground
          index={sceneIdx}
          overlayGradient="hero"
          style={styles.heroScene}
        >
          <View style={styles.heroInner}>
            <View style={styles.heroBadgeRow}>
              <View
                style={[
                  styles.heroTag,
                  Platform.OS === 'web' &&
                    ({ backdropFilter: 'blur(8px)' } as any),
                ]}
              >
                <Text style={styles.heroTagText}>Featured</Text>
              </View>
              <View
                style={[
                  styles.heroCatTag,
                  Platform.OS === 'web' &&
                    ({ backdropFilter: 'blur(8px)' } as any),
                ]}
              >
                <Text style={styles.heroCatText}>{video.category}</Text>
              </View>
            </View>
            <Text style={[styles.heroTitle, { fontFamily: SERIF_FONT }]}>
              {video.t}
            </Text>
            <Text style={styles.heroSub}>{video.m} · tap to watch</Text>
          </View>
        </SceneBackground>
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
        <SceneBackground
          index={sceneIdx}
          overlayGradient="thumb"
          style={styles.continueThumb}
        >
          <View style={styles.continuePlayCircle}>
            <Text style={styles.continuePlayIcon}>▶</Text>
          </View>
          <View
            style={[
              styles.durationPill,
              Platform.OS === 'web' &&
                ({ backdropFilter: 'blur(6px)' } as any),
            ]}
          >
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
        </SceneBackground>
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
      <SceneBackground
        index={sceneIdx}
        overlayGradient="thumb"
        style={styles.thumb}
      >
        <View
          style={[
            styles.categoryMicroPill,
            Platform.OS === 'web' &&
              ({ backdropFilter: 'blur(6px)' } as any),
          ]}
        >
          <Text style={styles.categoryMicroText}>{video.category}</Text>
        </View>
        <View
          style={[
            styles.durationPill,
            Platform.OS === 'web' &&
              ({ backdropFilter: 'blur(6px)' } as any),
          ]}
        >
          <Text style={styles.durationText}>{video.m}</Text>
        </View>
      </SceneBackground>
      <Text style={[styles.vidTitle, { color: t.ink }]}>{video.t}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  heroTouch: {
    borderRadius: 28,
    overflow: 'hidden',
    minHeight: 280,
  },
  heroScene: {
    minHeight: 280,
    borderRadius: 28,
    padding: 22,
  },
  heroInner: {
    flex: 1,
    justifyContent: 'flex-end',
    gap: 6,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  heroTag: {
    backgroundColor: 'rgba(0,0,0,0.45)',
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
    backgroundColor: 'rgba(255,255,255,0.16)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 99,
  },
  heroCatText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 27,
    lineHeight: 30,
    fontWeight: '500',
    margin: 0,
  },
  heroSub: {
    color: 'rgba(255,255,255,0.92)',
    fontSize: 13,
    margin: 0,
  },
  vidButton: {
    width: '48%',
    marginBottom: 14,
  },
  thumb: {
    width: '100%',
    aspectRatio: 16 / 10,
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
  },
  categoryMicroPill: {
    position: 'absolute',
    left: 6,
    top: 6,
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: 6,
  },
  categoryMicroText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  durationPill: {
    position: 'absolute',
    right: 6,
    bottom: 8,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingVertical: 1,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  durationText: {
    color: '#FFFFFF',
    fontSize: 11,
  },
  vidTitle: {
    fontSize: 13.5,
    fontWeight: '600',
    lineHeight: 17,
    marginTop: 8,
  },
  continueCard: {
    width: 168,
    marginRight: 12,
  },
  continueThumb: {
    width: '100%',
    aspectRatio: 16 / 10,
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
  },
  continuePlayCircle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -15,
    marginLeft: -15,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  continuePlayIcon: {
    color: '#FFFFFF',
    fontSize: 11,
    marginLeft: 2,
  },
  continueBarTrack: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  continueBarFill: {
    height: '100%',
  },
});
