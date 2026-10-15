import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native';
import { BRAND_COLORS } from '@ilc/shared';

interface HeaderProps {
  onPressLive: () => void;
  onPressProfile: () => void;
  onPressNotifications: () => void;
  hasUnreadNotifications?: boolean;
  memberCode?: string | null;
}

export const Header: React.FC<HeaderProps> = ({
  onPressLive,
  onPressProfile,
  onPressNotifications,
  hasUnreadNotifications,
  memberCode,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* ILC BRAND LOGO */}
        <TouchableOpacity onPress={onPressProfile} activeOpacity={0.8} style={styles.logoContainer}>
          <Image
            source={require('../../assets/brand/ilc-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* RIGHT ACTIONS: LIVE PILL & NOTIF & MEMBER BADGE */}
        <View style={styles.rightActions}>
          <TouchableOpacity onPress={onPressLive} style={styles.liveBadge} activeOpacity={0.8}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE TV</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onPressNotifications} style={styles.iconButton} activeOpacity={0.7}>
            <Text style={{ fontSize: 16 }}>🔔</Text>
            {hasUnreadNotifications && <View style={styles.notifBadge} />}
          </TouchableOpacity>

          <TouchableOpacity onPress={onPressProfile} style={styles.memberPill} activeOpacity={0.8}>
            <Text style={styles.memberPillText}>
              {memberCode ? 'MEMBER' : 'JOIN'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: BRAND_COLORS.deepOcean,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 48,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 36,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(228, 126, 99, 0.2)',
    borderColor: BRAND_COLORS.coralAccent,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 5,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: BRAND_COLORS.coralAccent,
  },
  liveText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notifBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: BRAND_COLORS.coralAccent,
  },
  memberPill: {
    backgroundColor: BRAND_COLORS.islandTeal,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  memberPillText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
