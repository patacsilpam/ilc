import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { BrandLogo, BrandStripe } from './PrototypeArtwork';
import {
  PROTOTYPE_THEMES,
  ThemeMode,
  computeMemberId,
} from '../constants/prototypeTheme';

interface HeaderProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  isRegistered: boolean;
  memberEmail: string;
  unreadNotificationsCount: number;
  onPressMember: () => void;
  onOpenDrawer: () => void;
  onOpenInbox: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
  isRegistered,
  memberEmail,
  unreadNotificationsCount,
  onPressMember,
  onOpenDrawer,
  onOpenInbox,
}) => {
  const t = PROTOTYPE_THEMES[theme];

  return (
    <View style={styles.headerContainer}>
      <View style={styles.topRow}>
        <View style={styles.leftRow}>
          <TouchableOpacity
            style={[
              styles.iconBtn,
              {
                borderColor: t.line,
                backgroundColor: t.inputBg,
              },
            ]}
            onPress={onOpenDrawer}
            activeOpacity={0.8}
            accessibilityLabel="Open navigation menu"
          >
            <Feather name="menu" size={18} color={t.ink} />
          </TouchableOpacity>

          <BrandLogo theme={theme} />
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[
              styles.memberPill,
              {
                borderColor: t.btnAltBorder,
                backgroundColor: isRegistered ? t.tabOnBg : 'transparent',
              },
            ]}
            onPress={onPressMember}
            activeOpacity={0.8}
          >
            <Feather
              name={isRegistered ? 'credit-card' : 'user-plus'}
              size={12}
              color={t.btnAltColor}
            />
            <Text style={[styles.memberPillText, { color: t.btnAltColor }]}>
              {isRegistered ? computeMemberId(memberEmail) : 'Join Free'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.iconBtn,
              {
                borderColor: t.line,
                backgroundColor: t.inputBg,
              },
            ]}
            onPress={onOpenInbox}
            activeOpacity={0.8}
            accessibilityLabel="Open notification inbox"
          >
            <Feather name="bell" size={16} color={t.ink} />
            {unreadNotificationsCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>
                  {unreadNotificationsCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.iconBtn,
              {
                borderColor: t.line,
                backgroundColor: t.inputBg,
              },
            ]}
            onPress={onToggleTheme}
            activeOpacity={0.8}
            accessibilityLabel="Switch light or dark mode"
          >
            <Feather
              name={theme === 'light' ? 'moon' : 'sun'}
              size={16}
              color={t.ink}
            />
          </TouchableOpacity>
        </View>
      </View>

      <BrandStripe />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 14,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  memberPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 7,
    paddingHorizontal: 11,
    borderRadius: 99,
    borderWidth: 1,
  },
  memberPillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  unreadBadge: {
    position: 'absolute',
    top: -3,
    right: -3,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#E1251B',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  unreadBadgeText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '700',
  },
});
