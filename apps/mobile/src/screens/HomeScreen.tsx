import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  H1,
  H2,
  H3,
  MuteText,
  PromoBox,
  ProtoButton,
} from '../components/PrototypePrimitives';
import { VideoCard } from '../components/VideoCard';
import { PrototypeVideo, ThemeMode } from '../constants/prototypeTheme';

interface HomeScreenProps {
  theme: ThemeMode;
  videos: PrototypeVideo[];
  isRegistered: boolean;
  memberName: string;
  gift: { text: string; days: number };
  onPlayVideo: (index: number) => void;
  onOpenRegister: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  theme,
  videos,
  isRegistered,
  memberName,
  gift,
  onPlayVideo,
  onOpenRegister,
}) => {
  const firstName = (memberName || 'Juan').split(' ')[0];
  const featured = videos[0] || {
    t: 'Siquijor: island of slow days',
    m: '6:20',
  };

  return (
    <View>
      <H1 theme={theme}>
        {isRegistered ? `Welcome back, ${firstName}` : 'Stories from the islands'}
      </H1>
      <MuteText theme={theme} style={styles.subtitle}>
        Travel and lifestyle films, live events and member rewards.
      </MuteText>

      <VideoCard
        video={featured}
        index={0}
        onPress={() => onPlayVideo(0)}
        theme={theme}
        layout="hero"
      />

      {!isRegistered && (
        <PromoBox theme={theme}>
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

      <H2 theme={theme}>Catch up</H2>
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
  subtitle: {
    marginTop: 8,
    marginBottom: 20,
  },
  promoSub: {
    marginTop: 4,
    marginBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
