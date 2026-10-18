import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { SceneBackground } from './PrototypeArtwork';
import {
  FieldLabel,
  H1,
  H2,
  MuteText,
  ProtoButton,
  ProtoChip,
  ProtoInput,
} from './PrototypePrimitives';
import {
  PROTOTYPE_THEMES,
  PrototypeVideo,
  ThemeMode,
} from '../constants/prototypeTheme';

interface PlayerSheetProps {
  theme: ThemeMode;
  video: PrototypeVideo;
  index: number;
  onClose: () => void;
}

export const PlayerSheet: React.FC<PlayerSheetProps> = ({
  theme,
  video,
  index,
  onClose,
}) => {
  const t = PROTOTYPE_THEMES[theme];
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPlaying((currPlaying) => {
        if (currPlaying) {
          setProgress((prev) => Math.min(100, prev + 2));
        }
        return currPlaying;
      });
    }, 300);
    return () => clearInterval(timer);
  }, []);

  return (
    <View
      style={[
        styles.sheet,
        {
          backgroundColor: t.sheetBg,
        },
      ]}
    >
      <View
        style={[
          styles.liveBox,
          Platform.OS === 'web' &&
            ({ boxShadow: '0 20px 40px rgba(0,0,0,0.4)' } as any),
        ]}
      >
        <SceneBackground index={index} style={{ flex: 1 }}>
          <View style={styles.liveCenter}>
            <TouchableOpacity
              style={[
                styles.playCircle,
                Platform.OS === 'web' &&
                  ({ backdropFilter: 'blur(8px)' } as any),
              ]}
              onPress={() => setPlaying(!playing)}
              activeOpacity={0.8}
            >
              <Text style={styles.playText}>{playing ? '❚❚' : '▶'}</Text>
            </TouchableOpacity>
          </View>
        </SceneBackground>
      </View>

      <View style={[styles.bar, { backgroundColor: t.line }]}>
        <View
          style={[
            styles.barFill,
            { backgroundColor: t.hib, width: `${progress}%` },
          ]}
        />
      </View>

      <H2 theme={theme} style={{ marginTop: 0, marginBottom: 0 }}>
        {video.t}
      </H2>
      <MuteText theme={theme} style={{ marginBottom: 8 }}>
        {video.m} · Island Living Original
      </MuteText>

      <ProtoButton theme={theme} label="Close" full onPress={onClose} />
    </View>
  );
};

interface RegisterSheetProps {
  theme: ThemeMode;
  onRegister: (name: string, email: string, isGoogle: boolean) => void;
  onCancel: () => void;
}

export const RegisterSheet: React.FC<RegisterSheetProps> = ({
  theme,
  onRegister,
  onCancel,
}) => {
  const t = PROTOTYPE_THEMES[theme];
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  return (
    <View
      style={[
        styles.sheet,
        {
          backgroundColor: t.sheetBg,
        },
      ]}
    >
      <H1 theme={theme}>Create your free account</H1>
      <MuteText theme={theme} style={{ marginBottom: 6 }}>
        You’ll get a digital membership card and a welcome gift right away.
      </MuteText>

      <FieldLabel theme={theme}>Full name</FieldLabel>
      <ProtoInput
        theme={theme}
        value={name}
        onChangeText={setName}
        placeholder="Juan dela Cruz"
      />

      <FieldLabel theme={theme}>Email</FieldLabel>
      <ProtoInput
        theme={theme}
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
        keyboardType="email-address"
      />

      <ProtoButton
        theme={theme}
        label="Create account"
        full
        onPress={() => onRegister(name, email, false)}
        style={{ marginBottom: 6 }}
      />

      <ProtoButton
        theme={theme}
        alt
        full
        label="Continue with Google"
        onPress={() => onRegister(name, email, true)}
      />

      <ProtoChip
        theme={theme}
        label="Not now"
        onPress={onCancel}
        style={{ alignSelf: 'center', marginTop: 8 }}
      />
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
    zIndex: 4,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 6,
  },
  liveBox: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 24,
    overflow: 'hidden',
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
  bar: {
    height: 6,
    borderRadius: 6,
    overflow: 'hidden',
    marginVertical: 12,
  },
  barFill: {
    height: '100%',
  },
});
