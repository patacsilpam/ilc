import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { BRAND_COLORS } from '@ilc/shared';
import { bookingService } from '../services/booking';

export const TravelScreen: React.FC = () => {
  const handleBookDestination = async (destinationName: string) => {
    try {
      await bookingService.openBookingGateway(destinationName);
    } catch (err: any) {
      Alert.alert('Booking Gateway', err.message || 'Unable to open booking link.');
    }
  };

  const destinations = [
    {
      id: 'dest-boracay',
      name: 'Boracay Island',
      province: 'Aklan, Western Visayas',
      headline: 'Powder-White Sands & Vibrant Sunset Sessions',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800',
      highlights: ['Station 1 & 2 Beachfront Stays', 'Sunset Paraw Sailing', 'Water Sports & Scuba'],
    },
    {
      id: 'dest-elnido',
      name: 'El Nido & Bacuit Bay',
      province: 'Northern Palawan',
      headline: 'Towering Karst Cliffs & Hidden Turquoise Lagoons',
      image: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?q=80&w=800',
      highlights: ['Big Lagoon & Secret Beach Tours', 'Eco-Luxury Island Resorts', 'Snorkeling Marine Sanctuary'],
    },
    {
      id: 'dest-siargao',
      name: 'Siargao Island',
      province: 'Surigao del Norte, Mindanao',
      headline: 'The Philippines Surfing Capital & Palm Lagoons',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800',
      highlights: ['Cloud 9 Surf Boardwalk', 'Magpupungko Tidal Pools', 'Sugba Lagoon Paddle-boarding'],
    },
    {
      id: 'dest-cebu',
      name: 'Cebu & Mactan Peninsula',
      province: 'Central Visayas',
      headline: 'Maritime Heritage, Whale Sharks & Lechon Trails',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800',
      highlights: ['Mactan Dive Sanctuaries', 'Moalboal Sardine Run', 'Historic Island Forts & Dining'],
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* HEADER HERO */}
      <View style={styles.header}>
        <View style={styles.partnerBadge}>
          <Text style={styles.partnerBadgeText}>POWERED BY OTAMIGO TRAVEL</Text>
        </View>
        <Text style={styles.headerTitle}>Philippine Island Escapes</Text>
        <Text style={styles.headerSubtitle}>
          Book verified beachfront stays, catamaran cruises, and inter-island transfers through our booking partner.
        </Text>
      </View>

      {/* TRANSPARENT PARTNER ATTRIBUTION NOTICE */}
      <View style={styles.noticeCard}>
        <Text style={styles.noticeIcon}>ℹ️</Text>
        <Text style={styles.noticeText}>
          Booking transactions are securely managed by Otamigo. ILC members receive partner perks and welcome privileges at verified island check-in desks.
        </Text>
      </View>

      {/* DESTINATIONS LIST */}
      <View style={styles.listContainer}>
        {destinations.map((dest) => (
          <View key={dest.id} style={styles.destCard}>
            <Image source={{ uri: dest.image }} style={styles.destImage} />
            <View style={styles.destContent}>
              <View style={styles.destHeader}>
                <Text style={styles.destName}>{dest.name}</Text>
                <Text style={styles.destProvince}>{dest.province}</Text>
              </View>
              <Text style={styles.destHeadline}>{dest.headline}</Text>

              <View style={styles.highlightsBox}>
                {dest.highlights.map((h, i) => (
                  <Text key={i} style={styles.highlightItem}>
                    • {h}
                  </Text>
                ))}
              </View>

              <TouchableOpacity
                onPress={() => handleBookDestination(dest.name)}
                style={styles.bookBtn}
                activeOpacity={0.8}
              >
                <Text style={styles.bookBtnText}>Explore Stays in {dest.name} →</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BRAND_COLORS.warmIvory,
  },
  header: {
    backgroundColor: BRAND_COLORS.deepOcean,
    padding: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  partnerBadge: {
    backgroundColor: BRAND_COLORS.warmSand,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 10,
  },
  partnerBadgeText: {
    color: BRAND_COLORS.deepOcean,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 30,
    marginBottom: 6,
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 13,
    lineHeight: 18,
  },
  noticeCard: {
    margin: 16,
    padding: 14,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: BRAND_COLORS.border,
  },
  noticeIcon: {
    fontSize: 16,
  },
  noticeText: {
    flex: 1,
    fontSize: 12,
    color: BRAND_COLORS.mutedText,
    lineHeight: 17,
  },
  listContainer: {
    paddingHorizontal: 16,
    gap: 20,
  },
  destCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: BRAND_COLORS.border,
    elevation: 3,
    shadowColor: BRAND_COLORS.deepOcean,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  destImage: {
    width: '100%',
    height: 180,
  },
  destContent: {
    padding: 18,
  },
  destHeader: {
    marginBottom: 4,
  },
  destName: {
    fontSize: 19,
    fontWeight: '800',
    color: BRAND_COLORS.deepOcean,
  },
  destProvince: {
    fontSize: 12,
    color: BRAND_COLORS.islandTeal,
    fontWeight: '600',
  },
  destHeadline: {
    fontSize: 13,
    color: BRAND_COLORS.ink,
    marginTop: 4,
    marginBottom: 12,
    fontWeight: '500',
  },
  highlightsBox: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 4,
  },
  highlightItem: {
    fontSize: 12,
    color: BRAND_COLORS.mutedText,
  },
  bookBtn: {
    backgroundColor: BRAND_COLORS.islandTeal,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  bookBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
});
