import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Video, BRAND_COLORS } from '@ilc/shared';

interface VideoCardProps {
  video: Video;
  onPress: (video: Video) => void;
  layout?: 'grid' | 'featured' | 'list';
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, onPress, layout = 'grid' }) => {
  const isFeatured = layout === 'featured';

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => onPress(video)}
      style={[styles.card, isFeatured && styles.cardFeatured]}
    >
      {/* THUMBNAIL CONTAINER */}
      <View style={[styles.thumbnailContainer, isFeatured ? styles.thumbFeatured : styles.thumbStandard]}>
        <Image source={{ uri: video.thumbnail_path }} style={styles.thumbnail} resizeMode="cover" />

        {/* OVERLAYS: CATEGORY & DURATION */}
        <View style={styles.topBadgeContainer}>
          {video.categories[0] && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{video.categories[0]}</Text>
            </View>
          )}
        </View>

        {video.duration_seconds && (
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>
              {Math.floor(video.duration_seconds / 60)}:
              {(video.duration_seconds % 60).toString().padStart(2, '0')}
            </Text>
          </View>
        )}

        {/* PLAY ICON CIRCLE */}
        <View style={styles.playOverlay}>
          <View style={styles.playButton}>
            <Text style={styles.playIcon}>▶</Text>
          </View>
        </View>
      </View>

      {/* TEXT CONTENT */}
      <View style={styles.infoContainer}>
        <Text style={[styles.title, isFeatured && styles.titleFeatured]} numberOfLines={2}>
          {video.title}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {video.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: BRAND_COLORS.border,
    marginBottom: 16,
    elevation: 2,
    shadowColor: BRAND_COLORS.deepOcean,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardFeatured: {
    borderRadius: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(31, 122, 120, 0.25)',
  },
  thumbnailContainer: {
    width: '100%',
    backgroundColor: '#e2e8f0',
    position: 'relative',
    overflow: 'hidden',
  },
  thumbStandard: {
    height: 180,
  },
  thumbFeatured: {
    height: 220,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  topBadgeContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  categoryBadge: {
    backgroundColor: 'rgba(18, 59, 82, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 5,
  },
  durationText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(31, 122, 120, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#ffffff',
  },
  playIcon: {
    color: '#ffffff',
    fontSize: 16,
    marginLeft: 3,
  },
  infoContainer: {
    padding: 14,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: BRAND_COLORS.deepOcean,
    marginBottom: 4,
  },
  titleFeatured: {
    fontSize: 18,
  },
  description: {
    fontSize: 12,
    color: BRAND_COLORS.mutedText,
    lineHeight: 17,
  },
});
