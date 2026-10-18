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
  onPressMember: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
  isRegistered,
  memberEmail,
  onPressMember,
}) => {
  const t = PROTOTYPE_THEMES[theme];

  return (
    <View style={styles.headerContainer}>
      <View style={styles.topRow}>
        <BrandLogo theme={theme} />

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
              size={13}
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
    gap: 10,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  memberPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 99,
    borderWidth: 1,
  },
  memberPillText: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
