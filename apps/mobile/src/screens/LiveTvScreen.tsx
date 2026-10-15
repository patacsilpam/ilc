import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Dimensions,
} from 'react-native';
import { BRAND_COLORS } from '@ilc/shared';

interface LiveTvScreenProps {
  streamId?: string;
  channelUrl?: string;
}

export const LiveTvScreen: React.FC<LiveTvScreenProps> = ({
  channelUrl = 'https://www.youtube.com/@islandlivingchannel',
}) => {
  const handleOpenYouTube = async () => {
    const canOpen = await Linking.canOpenURL(channelUrl);
    if (canOpen) {
      Linking.openURL(channelUrl);
    }
  };

  const schedule = [
    { time: '06:00 - 08:00', title: 'Island Sunrise & Coastal Yoga', location: 'El Nido', status: 'completed' },
    { time: '08:00 - 11:00', title: 'Flavors of the Archipelago: Seafood Trails', location: 'Cebu & Bantayan', status: 'completed' },
    { time: '11:00 - 14:00', title: 'Secret Shores of the 7,641 Islands', location: 'Batanes to Tawi-Tawi', status: 'completed' },
    { time: '14:00 - 17:00', title: 'Coral Giants: Tubbataha & Apo Reef', location: 'Sulu Sea', status: 'completed' },
    { time: '17:00 - 19:30', title: 'Live Sunset Acoustic Sessions', location: 'Boracay Station 2', status: 'live' },
    { time: '19:30 - 22:00', title: 'Island Nightlife & Coastal Stays', location: 'Siargao Island', status: 'upcoming' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* LIVE BROADCAST PLAYER VIEWPORT */}
      <View style={styles.playerContainer}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200' }}
          style={styles.playerBackground}
          resizeMode="cover"
        />
        <View style={styles.overlay}>
          <View style={styles.livePill}>
            <View style={styles.livePillDot} />
            <Text style={styles.livePillText}>ON AIR • 1080p</Text>
          </View>

          <View style={styles.centerAction}>
            <TouchableOpacity onPress={handleOpenYouTube} style={styles.playButton} activeOpacity={0.85}>
              <Text style={styles.playButtonIcon}>▶</Text>
            </TouchableOpacity>
            <Text style={styles.streamTitle}>Live Sunset Acoustic Sessions</Text>
            <Text style={styles.streamSubtitle}>Broadcasting from Boracay Station 2</Text>
          </View>

          <TouchableOpacity onPress={handleOpenYouTube} style={styles.ytButton} activeOpacity={0.8}>
            <Text style={styles.ytButtonText}>Watch in YouTube App ↗</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* BROADCAST INFO BAR */}
      <View style={styles.infoBar}>
        <View style={{ flex: 1 }}>
          <Text style={styles.channelName}>Island Living Channel (ILC)</Text>
          <Text style={styles.channelDesc}>Official 24/7 Travel & Lifestyle Media Network</Text>
        </View>
        <View style={styles.hdBadge}>
          <Text style={styles.hdText}>SIMULCAST</Text>
        </View>
      </View>

      {/* TODAY'S BROADCAST SCHEDULE */}
      <View style={styles.scheduleSection}>
        <Text style={styles.scheduleHeading}>Today&apos;s Broadcast Program</Text>

        <View style={styles.scheduleList}>
          {schedule.map((item, idx) => {
            const isLive = item.status === 'live';
            return (
              <View key={idx} style={[styles.scheduleItem, isLive && styles.scheduleItemLive]}>
                <View style={styles.timeCol}>
                  <Text style={[styles.timeText, isLive && styles.timeTextLive]}>{item.time}</Text>
                  {isLive && (
                    <View style={styles.nowBadge}>
                      <Text style={styles.nowText}>NOW</Text>
                    </View>
                  )}
                </View>
                <View style={styles.detailsCol}>
                  <Text style={[styles.itemTitle, isLive && styles.itemTitleLive]}>{item.title}</Text>
                  <Text style={styles.itemLoc}>📍 {item.location}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BRAND_COLORS.warmIvory,
  },
  playerContainer: {
    width: '100%',
    height: (width * 9) / 16,
    backgroundColor: '#000000',
    position: 'relative',
  },
  playerBackground: {
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(18, 59, 82, 0.5)',
    padding: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  livePill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BRAND_COLORS.coralAccent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 6,
  },
  livePillDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ffffff',
  },
  livePillText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  centerAction: {
    alignItems: 'center',
  },
  playButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: BRAND_COLORS.islandTeal,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  playButtonIcon: {
    color: '#ffffff',
    fontSize: 20,
    marginLeft: 3,
  },
  streamTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  streamSubtitle: {
    color: BRAND_COLORS.warmSand,
    fontSize: 12,
    marginTop: 2,
  },
  ytButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  ytButtonText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
  },
  infoBar: {
    backgroundColor: '#ffffff',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: BRAND_COLORS.border,
  },
  channelName: {
    fontSize: 16,
    fontWeight: '800',
    color: BRAND_COLORS.deepOcean,
  },
  channelDesc: {
    fontSize: 12,
    color: BRAND_COLORS.mutedText,
    marginTop: 2,
  },
  hdBadge: {
    backgroundColor: '#e6f4f3',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  hdText: {
    color: BRAND_COLORS.islandTeal,
    fontSize: 10,
    fontWeight: '800',
  },
  scheduleSection: {
    padding: 16,
  },
  scheduleHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: BRAND_COLORS.deepOcean,
    marginBottom: 14,
  },
  scheduleList: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BRAND_COLORS.border,
    overflow: 'hidden',
  },
  scheduleItem: {
    flexDirection: 'row',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: BRAND_COLORS.border,
    alignItems: 'center',
  },
  scheduleItemLive: {
    backgroundColor: '#f0f9f8',
    borderLeftWidth: 4,
    borderLeftColor: BRAND_COLORS.islandTeal,
  },
  timeCol: {
    width: 110,
  },
  timeText: {
    fontSize: 11,
    fontWeight: '600',
    color: BRAND_COLORS.mutedText,
  },
  timeTextLive: {
    color: BRAND_COLORS.islandTeal,
    fontWeight: '800',
  },
  nowBadge: {
    backgroundColor: BRAND_COLORS.coralAccent,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  nowText: {
    color: '#ffffff',
    fontSize: 8,
    fontWeight: '800',
  },
  detailsCol: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: BRAND_COLORS.ink,
    marginBottom: 2,
  },
  itemTitleLive: {
    fontWeight: '800',
    color: BRAND_COLORS.deepOcean,
  },
  itemLoc: {
    fontSize: 11,
    color: BRAND_COLORS.mutedText,
  },
});
