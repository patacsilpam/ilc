import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { Video, BRAND_COLORS, WelcomeGift } from '@ilc/shared';
import { VideoCard } from '../components/VideoCard';

interface HomeScreenProps {
  featuredVideo?: Video;
  recentVideos: Video[];
  welcomeGifts: WelcomeGift[];
  onSelectVideo: (video: Video) => void;
  onNavigateTab: (tab: 'vod' | 'live' | 'travel' | 'profile') => void;
  isRefreshing?: boolean;
  onRefresh?: () => void;
  isMember?: boolean;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  featuredVideo,
  recentVideos,
  welcomeGifts,
  onSelectVideo,
  onNavigateTab,
  isRefreshing = false,
  onRefresh,
  isMember,
}) => {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
    >
      {/* EDITORIAL HERO BANNER */}
      {featuredVideo && (
        <View style={styles.heroSection}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => onSelectVideo(featuredVideo)}
            style={styles.heroCard}
          >
            <Image
              source={{ uri: featuredVideo.thumbnail_path }}
              style={styles.heroImage}
              resizeMode="cover"
            />
            <View style={styles.heroGradient}>
              <View style={styles.heroBadge}>
                <Text style={styles.heroBadgeText}>FEATURED STORY</Text>
              </View>
              <Text style={styles.heroTitle} numberOfLines={2}>
                {featuredVideo.title}
              </Text>
              <Text style={styles.heroSubtitle} numberOfLines={2}>
                {featuredVideo.description}
              </Text>
              <View style={styles.watchButton}>
                <Text style={styles.watchIcon}>▶</Text>
                <Text style={styles.watchText}>Watch Feature</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      )}

      {/* WELCOME PERKS BANNER */}
      <View style={styles.perksBanner}>
        <View style={{ flex: 1 }}>
          <Text style={styles.perksTitle}>
            {isMember ? 'Your Island Privileges' : 'Unlock Welcome Gifts'}
          </Text>
          <Text style={styles.perksSubtitle}>
            {isMember
              ? 'Enjoy fresh welcome drinks and cruise vouchers at partner hubs.'
              : 'Join free today for member passes and exclusive arrival perks.'}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => onNavigateTab('profile')}
          style={styles.perksButton}
          activeOpacity={0.8}
        >
          <Text style={styles.perksButtonText}>{isMember ? 'View Pass' : 'Claim Gift'}</Text>
        </TouchableOpacity>
      </View>

      {/* QUICK DESTINATIONS ROW */}
      <View style={styles.destinationsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Explore The Islands</Text>
          <TouchableOpacity onPress={() => onNavigateTab('travel')}>
            <Text style={styles.seeAllText}>Bookings →</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.destRow}>
          {[
            { name: 'Boracay', tag: 'White Sand', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=400' },
            { name: 'El Nido', tag: 'Karst Lagoons', img: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?q=80&w=400' },
            { name: 'Siargao', tag: 'Cloud 9 Swell', img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=400' },
            { name: 'Cebu', tag: 'Heritage & Dive', img: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=400' },
          ].map((dest, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => onNavigateTab('travel')}
              style={styles.destCard}
              activeOpacity={0.8}
            >
              <Image source={{ uri: dest.img }} style={styles.destImage} />
              <View style={styles.destOverlay}>
                <Text style={styles.destName}>{dest.name}</Text>
                <Text style={styles.destTag}>{dest.tag}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* RECENT ISLAND STORIES FEED */}
      <View style={styles.feedSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Latest Video Releases</Text>
          <TouchableOpacity onPress={() => onNavigateTab('vod')}>
            <Text style={styles.seeAllText}>View All ({recentVideos.length}) →</Text>
          </TouchableOpacity>
        </View>

        {recentVideos.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={{ fontSize: 24, marginBottom: 8 }}>🌊</Text>
            <Text style={styles.emptyText}>Loading latest island features...</Text>
          </View>
        ) : (
          recentVideos.slice(0, 4).map((video) => (
            <VideoCard key={video.id} video={video} onPress={onSelectVideo} />
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BRAND_COLORS.warmIvory,
  },
  heroSection: {
    padding: 16,
  },
  heroCard: {
    borderRadius: 20,
    overflow: 'hidden',
    height: 360,
    position: 'relative',
    backgroundColor: BRAND_COLORS.deepOcean,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(18, 59, 82, 0.65)',
    padding: 20,
    justifyContent: 'flex-end',
  },
  heroBadge: {
    backgroundColor: BRAND_COLORS.coralAccent,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 10,
  },
  heroBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  heroTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
    marginBottom: 6,
  },
  heroSubtitle: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  watchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BRAND_COLORS.islandTeal,
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
  },
  watchIcon: {
    color: '#ffffff',
    fontSize: 14,
  },
  watchText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  perksBanner: {
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 18,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BRAND_COLORS.warmSand,
    elevation: 3,
    shadowColor: BRAND_COLORS.deepOcean,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  perksTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: BRAND_COLORS.deepOcean,
    marginBottom: 3,
  },
  perksSubtitle: {
    fontSize: 12,
    color: BRAND_COLORS.mutedText,
    lineHeight: 16,
    paddingRight: 8,
  },
  perksButton: {
    backgroundColor: BRAND_COLORS.coralAccent,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  perksButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  destinationsSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: BRAND_COLORS.deepOcean,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: BRAND_COLORS.islandTeal,
  },
  destRow: {
    paddingLeft: 16,
  },
  destCard: {
    width: 130,
    height: 160,
    borderRadius: 14,
    overflow: 'hidden',
    marginRight: 12,
    position: 'relative',
    backgroundColor: '#e2e8f0',
  },
  destImage: {
    width: '100%',
    height: '100%',
  },
  destOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(18, 59, 82, 0.45)',
    padding: 10,
    justifyContent: 'flex-end',
  },
  destName: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
  destTag: {
    color: BRAND_COLORS.warmSand,
    fontSize: 11,
    fontWeight: '600',
  },
  feedSection: {
    paddingHorizontal: 16,
  },
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: BRAND_COLORS.mutedText,
    fontSize: 13,
  },
});
