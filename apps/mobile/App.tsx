import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, Alert } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import {
  UserProfile,
  MembershipCard,
  Video,
  VideoCategory,
  WelcomeGift,
  MemberGift,
  BRAND_COLORS,
} from '@ilc/shared';

import { Header } from './src/components/Header';
import { BottomNav, TabId } from './src/components/BottomNav';
import { VideoPlayerModal } from './src/components/VideoPlayerModal';

import { HomeScreen } from './src/screens/HomeScreen';
import { VodScreen } from './src/screens/VodScreen';
import { LiveTvScreen } from './src/screens/LiveTvScreen';
import { TravelScreen } from './src/screens/TravelScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';

import { authService } from './src/services/auth';
import { vodService } from './src/services/vod';
import { giftService } from './src/services/gifts';
import { notificationService } from './src/services/notifications';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabId>('home');

  // Auth & Profile state
  const [user, setUser] = useState<UserProfile | null>(null);
  const [membership, setMembership] = useState<MembershipCard | null>(null);

  // Content state
  const [videos, setVideos] = useState<Video[]>([]);
  const [categories, setCategories] = useState<VideoCategory[]>([]);
  const [welcomeGifts, setWelcomeGifts] = useState<WelcomeGift[]>([]);
  const [memberGifts, setMemberGifts] = useState<Array<MemberGift & { gift?: WelcomeGift }>>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // On startup: check active session and load live data
  useEffect(() => {
    initApp();
  }, []);

  const initApp = async () => {
    await checkAuth();
    await loadData();
  };

  const checkAuth = async () => {
    try {
      const session = await authService.getSession();
      if (session.authenticated && session.user) {
        setUser(session.user);
        setMembership(session.membership);
        loadMemberGifts();
      }
    } catch (e) {
      console.warn('Session check skipped / offline');
    }
  };

  const loadData = async () => {
    try {
      const { videos: vList, categories: cList } = await vodService.fetchVideos();
      setVideos(vList);
      setCategories(cList);

      const gifts = await giftService.fetchWelcomeGifts();
      setWelcomeGifts(gifts);
    } catch (e) {
      console.warn('Initial data load error:', e);
    }
  };

  const loadMemberGifts = async () => {
    try {
      const mg = await giftService.fetchMyMemberGifts();
      setMemberGifts(mg);
    } catch (e) {
      console.warn('Member gifts load error:', e);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    if (user) await loadMemberGifts();
    setIsRefreshing(false);
  };

  // Auth actions
  const handleLogin = async (email: string, pass: string) => {
    const res = await authService.login(email, pass);
    setUser(res.user);
    setMembership(res.membership || null);
    await loadMemberGifts();
    Alert.alert('Welcome Back', `Aloha ${res.user.display_name}! Your pass is ready.`);
  };

  const handleRegister = async (email: string, pass: string, name: string) => {
    const res = await authService.register(email, pass, name);
    setUser(res.user);
    setMembership(res.membership || null);
    await loadMemberGifts();
    Alert.alert('Membership Created', `Welcome to Island Living! Your digital pass and gifts are ready.`);
  };

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
    setMembership(null);
    setMemberGifts([]);
  };

  const handleNotificationsPress = async () => {
    const status = await notificationService.requestPushPermission();
    Alert.alert('Island Announcements', status.message);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ExpoStatusBar style="light" />
      <StatusBar barStyle="light-content" backgroundColor={BRAND_COLORS.deepOcean} />

      {/* TOP HEADER */}
      <Header
        onPressLive={() => setCurrentTab('live')}
        onPressProfile={() => setCurrentTab('profile')}
        onPressNotifications={handleNotificationsPress}
        memberCode={membership?.public_membership_code}
        hasUnreadNotifications={true}
      />

      {/* MAIN SCREEN ROUTER */}
      <View style={styles.content}>
        {currentTab === 'home' && (
          <HomeScreen
            featuredVideo={videos.find((v) => v.is_featured) || videos[0]}
            recentVideos={videos}
            welcomeGifts={welcomeGifts}
            onSelectVideo={(v) => setSelectedVideo(v)}
            onNavigateTab={(tab) => setCurrentTab(tab)}
            isRefreshing={isRefreshing}
            onRefresh={handleRefresh}
            isMember={!!user}
          />
        )}

        {currentTab === 'vod' && (
          <VodScreen
            videos={videos}
            categories={categories}
            onSelectVideo={(v) => setSelectedVideo(v)}
            isRefreshing={isRefreshing}
            onRefresh={handleRefresh}
          />
        )}

        {currentTab === 'live' && <LiveTvScreen />}

        {currentTab === 'travel' && <TravelScreen />}

        {currentTab === 'profile' && (
          <ProfileScreen
            user={user}
            membership={membership}
            memberGifts={memberGifts}
            onLogin={handleLogin}
            onRegister={handleRegister}
            onLogout={handleLogout}
            onRefreshGifts={loadMemberGifts}
          />
        )}
      </View>

      {/* VIDEO DETAIL & PLAYBACK MODAL */}
      <VideoPlayerModal
        video={selectedVideo}
        onClose={() => setSelectedVideo(null)}
        relatedVideos={videos.filter((v) => v.id !== selectedVideo?.id)}
        onSelectRelated={(v) => setSelectedVideo(v)}
      />

      {/* BOTTOM TAB NAVIGATION */}
      <BottomNav currentTab={currentTab} onSelectTab={(tab) => setCurrentTab(tab)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BRAND_COLORS.deepOcean,
  },
  content: {
    flex: 1,
    backgroundColor: BRAND_COLORS.warmIvory,
  },
});
