import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { SceneBackground } from '../components/PrototypeArtwork';
import {
  H1,
  H2,
  MuteText,
  ProtoButton,
} from '../components/PrototypePrimitives';
import {
  LIVE_SCHEDULE,
  PROTOTYPE_THEMES,
  ThemeMode,
} from '../constants/prototypeTheme';

interface LiveTvScreenProps {
  theme: ThemeMode;
  onPushToast: (title: string, msg: string) => void;
}

export const LiveTvScreen: React.FC<LiveTvScreenProps> = ({
  theme,
  onPushToast,
}) => {
  const t = PROTOTYPE_THEMES[theme];
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <View>
      <H1 theme={theme}>Live TV</H1>
      <MuteText theme={theme} style={styles.subtitle}>
        Real-time events stream inside the app through YouTube Live.
      </MuteText>

      <TouchableOpacity
        style={[
          styles.liveWrap,
          Platform.OS === 'web' &&
            ({ boxShadow: '0 20px 40px rgba(0,0,0,0.4)' } as any),
        ]}
        onPress={() => setIsPlaying(!isPlaying)}
        activeOpacity={0.9}
      >
        <SceneBackground index={3} style={styles.liveBox}>
          <View style={styles.liveBadge}>
            <Text style={styles.liveBadgeText}>LIVE</Text>
          </View>
          <View style={styles.liveCenter}>
            <View
              style={[
                styles.playCircle,
                Platform.OS === 'web' &&
                  ({ backdropFilter: 'blur(8px)' } as any),
              ]}
            >
              <Text style={styles.playText}>{isPlaying ? '❚❚' : '▶'}</Text>
            </View>
          </View>
        </SceneBackground>
      </TouchableOpacity>

      <H2 theme={theme}>Coming up</H2>
      {LIVE_SCHEDULE.map(([time, title], idx) => (
        <View
          key={idx}
          style={[styles.row, { borderBottomColor: t.line }]}
        >
          <View style={styles.rowInfo}>
            <Text style={[styles.rowTitle, { color: t.ink }]}>{title}</Text>
            <MuteText theme={theme}>{time}</MuteText>
          </View>
          <ProtoButton
            theme={theme}
            alt
            label="Remind me"
            onPress={() =>
              onPushToast('Reminder set', 'We’ll notify you before it starts.')
            }
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  subtitle: {
    marginTop: 4,
    marginBottom: 14,
  },
  liveWrap: {
    borderRadius: 24,
    overflow: 'hidden',
    width: '100%',
    aspectRatio: 16 / 9,
  },
  liveBox: {
    flex: 1,
    borderRadius: 24,
  },
  liveBadge: {
    position: 'absolute',
    left: 10,
    top: 10,
    backgroundColor: '#E1251B',
    paddingVertical: 2,
    paddingHorizontal: 9,
    borderRadius: 6,
    zIndex: 3,
  },
  liveBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  liveCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playText: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  rowInfo: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
});
