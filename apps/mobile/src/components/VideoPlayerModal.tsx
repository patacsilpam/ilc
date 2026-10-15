import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import { Video, BRAND_COLORS } from '@ilc/shared';

interface VideoPlayerModalProps {
  video: Video | null;
  onClose: () => void;
  relatedVideos?: Video[];
  onSelectRelated?: (video: Video) => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  video,
  onClose,
  relatedVideos = [],
  onSelectRelated,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);

  if (!video) return null;

  return (
    <Modal visible={!!video} animationType="slide" transparent={false} onRequestClose={onClose}>
      <View style={styles.container}>
        {/* TOP BAR WITH CLOSE */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
            <Text style={styles.closeBtnText}>✕ Close</Text>
          </TouchableOpacity>
          <Text style={styles.topBarTitle} numberOfLines={1}>
            {video.title}
          </Text>
          <View style={{ width: 60 }} />
        </View>

        {/* VIDEO DISPLAY / PLAYER AREA */}
        <View style={styles.playerContainer}>
          <Image source={{ uri: video.thumbnail_path }} style={styles.videoPlayerImage} resizeMode="cover" />
          <View style={styles.playerControlsOverlay}>
            <TouchableOpacity
              onPress={() => setIsPlaying(!isPlaying)}
              style={styles.playbackCircle}
              activeOpacity={0.8}
            >
              <Text style={styles.playbackCircleIcon}>{isPlaying ? '❚❚' : '▶'}</Text>
            </TouchableOpacity>
            <View style={styles.streamStatusBadge}>
              <Text style={styles.streamStatusText}>
                {isPlaying ? 'PLAYING • HD 1080p' : 'PAUSED'}
              </Text>
            </View>
          </View>
        </View>

        {/* METADATA & CONTENT SCROLL */}
        <ScrollView style={styles.contentScroll} contentContainerStyle={{ padding: 20 }}>
          {/* CATEGORY & DURATION */}
          <View style={styles.metaRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>
                {video.categories.join(' • ')}
              </Text>
            </View>
            {video.duration_seconds && (
              <Text style={styles.durationLabel}>
                {Math.floor(video.duration_seconds / 60)} min feature
              </Text>
            )}
          </View>

          {/* TITLE & PUBLISHED DATE */}
          <Text style={styles.videoTitle}>{video.title}</Text>
          {video.published_at && (
            <Text style={styles.publishedDate}>
              Published on {new Date(video.published_at).toLocaleDateString()}
            </Text>
          )}

          {/* DESCRIPTION */}
          <Text style={styles.descriptionText}>{video.description}</Text>

          {/* TAGS */}
          {video.tags && video.tags.length > 0 && (
            <View style={styles.tagRow}>
              {video.tags.map((tag, idx) => (
                <View key={idx} style={styles.tagPill}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          )}

          {/* RELATED ISLAND STORIES */}
          {relatedVideos.length > 0 && (
            <View style={styles.relatedSection}>
              <Text style={styles.relatedHeading}>More Island Features</Text>
              {relatedVideos.slice(0, 3).map((item) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => onSelectRelated && onSelectRelated(item)}
                  style={styles.relatedCard}
                  activeOpacity={0.8}
                >
                  <Image source={{ uri: item.thumbnail_path }} style={styles.relatedThumb} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.relatedTitle} numberOfLines={2}>
                      {item.title}
                    </Text>
                    <Text style={styles.relatedCat}>{item.categories[0] || 'VOD'}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  topBar: {
    paddingTop: Platform.OS === 'android' ? 36 : 48,
    paddingBottom: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: BRAND_COLORS.deepOcean,
  },
  closeBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 8,
  },
  closeBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  topBarTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  playerContainer: {
    width: '100%',
    height: (width * 9) / 16,
    backgroundColor: '#000000',
    position: 'relative',
  },
  videoPlayerImage: {
    width: '100%',
    height: '100%',
  },
  playerControlsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playbackCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: BRAND_COLORS.islandTeal,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  playbackCircleIcon: {
    color: '#ffffff',
    fontSize: 22,
    marginLeft: 2,
  },
  streamStatusBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  streamStatusText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  contentScroll: {
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  categoryBadge: {
    backgroundColor: '#e6f4f3',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryBadgeText: {
    color: BRAND_COLORS.islandTeal,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  durationLabel: {
    color: BRAND_COLORS.mutedText,
    fontSize: 12,
  },
  videoTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: BRAND_COLORS.deepOcean,
    lineHeight: 28,
    marginBottom: 6,
  },
  publishedDate: {
    fontSize: 12,
    color: BRAND_COLORS.mutedText,
    marginBottom: 14,
  },
  descriptionText: {
    fontSize: 14,
    color: BRAND_COLORS.ink,
    lineHeight: 22,
    marginBottom: 18,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  tagPill: {
    backgroundColor: BRAND_COLORS.surface,
    borderColor: BRAND_COLORS.border,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },
  tagText: {
    color: BRAND_COLORS.mutedText,
    fontSize: 12,
    fontWeight: '500',
  },
  relatedSection: {
    borderTopWidth: 1,
    borderTopColor: BRAND_COLORS.border,
    paddingTop: 20,
  },
  relatedHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: BRAND_COLORS.deepOcean,
    marginBottom: 12,
  },
  relatedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding: 8,
    borderRadius: 10,
    backgroundColor: '#f8fafc',
  },
  relatedThumb: {
    width: 80,
    height: 50,
    borderRadius: 6,
    backgroundColor: '#e2e8f0',
  },
  relatedTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: BRAND_COLORS.deepOcean,
    marginBottom: 2,
  },
  relatedCat: {
    fontSize: 11,
    color: BRAND_COLORS.islandTeal,
    fontWeight: '500',
  },
});
