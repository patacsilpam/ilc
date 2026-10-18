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
  layout?: 'hero' | 'grid';
}

export const VideoCard: React.FC<VideoCardProps> = ({
  video,
  index,
  onPress,
  theme = 'dark',
  layout = 'grid',
}) => {
  const t = PROTOTYPE_THEMES[theme];

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
          index={index}
          overlayGradient="hero"
          style={styles.heroScene}
        >
          <View style={styles.heroInner}>
            <View
              style={[
                styles.heroTag,
                Platform.OS === 'web' &&
                  ({ backdropFilter: 'blur(8px)' } as any),
              ]}
            >
              <Text style={styles.heroTagText}>Featured</Text>
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

  return (
    <TouchableOpacity
      style={styles.vidButton}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <SceneBackground
        index={index}
        overlayGradient="thumb"
        style={styles.thumb}
      >
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
    minHeight: 290,
  },
  heroScene: {
    minHeight: 290,
    borderRadius: 28,
    padding: 22,
  },
  heroInner: {
    flex: 1,
    justifyContent: 'flex-end',
    gap: 6,
  },
  heroTag: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.35)',
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
    marginBottom: 12,
  },
  thumb: {
    width: '100%',
    aspectRatio: 16 / 10,
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
  },
  durationPill: {
    position: 'absolute',
    right: 6,
    bottom: 6,
    backgroundColor: 'rgba(0,0,0,0.5)',
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
    marginTop: 9,
  },
});
