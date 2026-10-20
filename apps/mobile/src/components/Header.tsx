import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { BrandLogo, BrandStripe } from './PrototypeArtwork';
import { PROTOTYPE_THEMES, ThemeMode } from '../constants/prototypeTheme';

interface HeaderProps {
  theme: ThemeMode;
  onToggleTheme?: () => void;
  isRegistered?: boolean;
  memberEmail?: string;
  unreadNotificationsCount: number;
  onPressMember?: () => void;
  onOpenDrawer: () => void;
  onOpenInbox: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  unreadNotificationsCount,
  onOpenDrawer,
  onOpenInbox,
  onOpenSettings,
}) => {
  const t = PROTOTYPE_THEMES[theme];

  return (
    <View style={styles.headerContainer}>
      <View style={styles.topRow}>
        <View style={styles.leftRow}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={onOpenDrawer}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityLabel="Open navigation menu"
          >
            <Feather name="menu" size={20} color={t.ink} />
          </TouchableOpacity>

          <BrandLogo theme={theme} />
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={onOpenInbox}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityLabel="Open notification inbox"
          >
            <Feather name="bell" size={19} color={t.ink} />
            {unreadNotificationsCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>
                  {unreadNotificationsCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconBtn}
            onPress={onOpenSettings}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityLabel="Open settings"
          >
            <Feather name="settings" size={19} color={t.ink} />
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
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconBtn: {
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  unreadBadge: {
    position: 'absolute',
    top: -1,
    right: -2,
    minWidth: 15,
    height: 15,
    borderRadius: 8,
    backgroundColor: '#E1251B',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  unreadBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
});
