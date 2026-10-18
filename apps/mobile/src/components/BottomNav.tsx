import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import {
  TABS,
  PrototypeTab,
  ThemeMode,
  PROTOTYPE_THEMES,
} from '../constants/prototypeTheme';
import { PrototypeTabIcon } from './PrototypeArtwork';

export type TabType = PrototypeTab;

interface BottomNavProps {
  currentTab: PrototypeTab;
  onSelectTab: (tab: PrototypeTab) => void;
  theme?: ThemeMode;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  theme = 'dark',
}) => {
  const t = PROTOTYPE_THEMES[theme];

  return (
    <View
      style={[
        styles.tabs,
        {
          backgroundColor:
            Platform.OS === 'web'
              ? t.tabsBg
              : theme === 'dark'
              ? 'rgba(8,36,20,0.96)'
              : 'rgba(255,255,255,0.96)',
          borderColor: t.tabsBorder,
        },
        Platform.OS === 'web' &&
          ({
            backdropFilter: 'blur(18px) saturate(1.4)',
            WebkitBackdropFilter: 'blur(18px) saturate(1.4)',
            boxShadow:
              theme === 'light'
                ? '0 10px 30px rgba(6,60,25,0.15)'
                : '0 12px 32px rgba(0,0,0,0.4)',
          } as any),
      ]}
    >
      {TABS.map(([key, label]) => {
        const isActive = currentTab === key;
        const itemColor = isActive ? t.tabOnColor : t.mute;

        return (
          <TouchableOpacity
            key={key}
            style={[
              styles.tabButton,
              isActive && { backgroundColor: t.tabOnBg },
            ]}
            onPress={() => onSelectTab(key)}
            activeOpacity={0.8}
          >
            <PrototypeTabIcon tab={key} color={itemColor} />
            <Text
              style={[
                styles.tabLabel,
                {
                  color: itemColor,
                  fontWeight: isActive ? '700' : '400',
                },
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabs: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: 14,
    zIndex: 3,
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 26,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingTop: 9,
    paddingBottom: 10,
    borderRadius: 22,
  },
  tabLabel: {
    fontSize: 11,
    letterSpacing: 0.2,
  },
});
