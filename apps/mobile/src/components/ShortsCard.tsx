import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { PROTOTYPE_THEMES, ThemeMode } from '../constants/prototypeTheme';
import { YouTubeVideoItem } from '@ilc/shared';

interface ShortsCardProps {
  item: YouTubeVideoItem;
  theme: ThemeMode;
  onPress: (item: YouTubeVideoItem) => void;
  width?: number;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DEFAULT_CARD_WIDTH = Math.min(160, Math.floor((SCREEN_WIDTH - 48) / 2.2));
// 9:16 aspect ratio
const DEFAULT_CARD_HEIGHT = Math.round(DEFAULT_CARD_WIDTH * (16 / 9));

export const ShortsCard: React.FC<ShortsCardProps> = ({
  item,
  theme,
  onPress,
  width = DEFAULT_CARD_WIDTH,
}) => {
  const t = PROTOTYPE_THEMES[theme];
  const height = Math.round(width * (16 / 9));

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={() => onPress(item)}
      style={[
        styles.cardContainer,
        {
          width,
          height,
          backgroundColor: t.surf,
          borderColor: t.line,
        },
      ]}
    >
      <Image
        source={{ uri: item.thumbnailUrl }}
        style={styles.thumbnail}
        resizeMode="cover"
      />

      {/* Subtle top badge: YouTube Shorts indicator */}
      <View style={styles.topBadge}>
        <View style={styles.shortsPill}>
          <MaterialCommunityIcons name="youtube" size={14} color="#FFFFFF" />
          <Text style={styles.shortsPillText}>Short</Text>
        </View>
      </View>

      {/* Dark gradient shadow overlay at bottom */}
      <View style={styles.bottomOverlay}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        {item.description ? (
          <Text style={styles.viewCount} numberOfLines={1}>
            {item.description}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    marginRight: 12,
    position: 'relative',
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 5,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  topBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    zIndex: 2,
  },
  shortsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.92)', // YouTube Red
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 3,
  },
  shortsPillText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 10,
    paddingBottom: 10,
    paddingTop: 32,
    backgroundColor: 'rgba(10, 15, 29, 0.82)',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
    marginBottom: 4,
  },
  viewCount: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '500',
  },
});
