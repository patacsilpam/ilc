import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { BRAND_COLORS } from '@ilc/shared';

export type TabId = 'home' | 'vod' | 'live' | 'travel' | 'profile';

interface BottomNavProps {
  currentTab: TabId;
  onSelectTab: (tab: TabId) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab }) => {
  const tabs: Array<{ id: TabId; label: string; icon: string }> = [
    { id: 'home', label: 'Island', icon: '🏝️' },
    { id: 'vod', label: 'VOD', icon: '🎬' },
    { id: 'live', label: 'Live TV', icon: '📺' },
    { id: 'travel', label: 'Travel', icon: '✈️' },
    { id: 'profile', label: 'Pass', icon: '💳' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = currentTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            onPress={() => onSelectTab(tab.id)}
            style={styles.tabItem}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabIcon, isActive && styles.tabIconActive]}>{tab.icon}</Text>
            <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>{tab.label}</Text>
            {isActive && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: BRAND_COLORS.border,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
    elevation: 8,
    shadowColor: BRAND_COLORS.deepOcean,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
    position: 'relative',
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 3,
    opacity: 0.65,
  },
  tabIconActive: {
    opacity: 1,
    transform: [{ scale: 1.1 }],
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: BRAND_COLORS.mutedText,
  },
  tabLabelActive: {
    color: BRAND_COLORS.islandTeal,
    fontWeight: '700',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -6,
    width: 24,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: BRAND_COLORS.islandTeal,
  },
});
