import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Video, VideoCategory, BRAND_COLORS } from '@ilc/shared';
import { VideoCard } from '../components/VideoCard';

interface VodScreenProps {
  videos: Video[];
  categories: VideoCategory[];
  onSelectVideo: (video: Video) => void;
  isRefreshing?: boolean;
  onRefresh?: () => void;
}

export const VodScreen: React.FC<VodScreenProps> = ({
  videos,
  categories,
  onSelectVideo,
  isRefreshing = false,
  onRefresh,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredVideos = videos.filter((v) => {
    if (selectedCategory !== 'All' && !v.categories.includes(selectedCategory)) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = v.title.toLowerCase().includes(q);
      const matchDesc = v.description.toLowerCase().includes(q);
      const matchTag = v.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchTag) return false;
    }
    return true;
  });

  return (
    <View style={styles.container}>
      {/* SEARCH BAR */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            placeholder="Search islands, beaches, surfing, food..."
            placeholderTextColor={BRAND_COLORS.mutedText}
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* CATEGORY CHIPS */}
      <View style={styles.categoryContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          <TouchableOpacity
            onPress={() => setSelectedCategory('All')}
            style={[styles.chip, selectedCategory === 'All' && styles.chipActive]}
            activeOpacity={0.7}
          >
            <Text style={[styles.chipText, selectedCategory === 'All' && styles.chipTextActive]}>
              All Stories
            </Text>
          </TouchableOpacity>

          {categories.map((cat) => {
            const isActive = selectedCategory === cat.name;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setSelectedCategory(cat.name)}
                style={[styles.chip, isActive && styles.chipActive]}
                activeOpacity={0.7}
              >
                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* COUNT BAR */}
      <View style={styles.countBar}>
        <Text style={styles.countText}>
          {filteredVideos.length} {filteredVideos.length === 1 ? 'Feature' : 'Features'} Found
        </Text>
        {selectedCategory !== 'All' && (
          <TouchableOpacity onPress={() => setSelectedCategory('All')}>
            <Text style={styles.resetText}>Reset filter</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* VIDEOS LIST */}
      <ScrollView
        style={styles.feedList}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
      >
        {filteredVideos.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={{ fontSize: 32, marginBottom: 8 }}>🏝️</Text>
            <Text style={styles.emptyTitle}>No Stories Found</Text>
            <Text style={styles.emptySubtitle}>
              Try searching for different keywords or explore other island categories.
            </Text>
            <TouchableOpacity
              onPress={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              style={styles.resetButton}
            >
              <Text style={styles.resetButtonText}>View All Videos</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredVideos.map((video) => (
            <VideoCard key={video.id} video={video} onPress={onSelectVideo} />
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BRAND_COLORS.warmIvory,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: '#ffffff',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
    fontSize: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: BRAND_COLORS.ink,
    height: '100%',
  },
  clearIcon: {
    fontSize: 14,
    color: BRAND_COLORS.mutedText,
    padding: 4,
  },
  categoryContainer: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: BRAND_COLORS.border,
    paddingVertical: 10,
  },
  categoryScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: BRAND_COLORS.border,
  },
  chipActive: {
    backgroundColor: BRAND_COLORS.islandTeal,
    borderColor: BRAND_COLORS.islandTeal,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: BRAND_COLORS.mutedText,
  },
  chipTextActive: {
    color: '#ffffff',
  },
  countBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  countText: {
    fontSize: 12,
    fontWeight: '600',
    color: BRAND_COLORS.mutedText,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  resetText: {
    fontSize: 12,
    fontWeight: '600',
    color: BRAND_COLORS.coralAccent,
  },
  feedList: {
    flex: 1,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: BRAND_COLORS.deepOcean,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 13,
    color: BRAND_COLORS.mutedText,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  resetButton: {
    backgroundColor: BRAND_COLORS.islandTeal,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  resetButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
});
