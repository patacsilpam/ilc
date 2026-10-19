import React, { useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  StatusBar,
  View,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Header } from './src/components/Header';
import { BottomNav } from './src/components/BottomNav';
import { HomeScreen } from './src/screens/HomeScreen';
import { WatchScreen } from './src/screens/WatchScreen';
import { LiveTvScreen } from './src/screens/LiveTvScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { TravelScreen } from './src/screens/TravelScreen';
import { VodScreen } from './src/screens/VodScreen';
import { PlayerSheet, RegisterSheet } from './src/components/VideoPlayerModal';
import { YouTubePlayerModal } from './src/components/YouTubePlayerModal';
import { YouTubeVideoItem } from '@ilc/shared';
import {
  HUBS,
  INITIAL_VIDEOS,
  PROTOTYPE_THEMES,
  PrototypeFeedback,
  PrototypeTab,
  PrototypeTravelQuery,
  PrototypeVideo,
  ThemeMode,
} from './src/constants/prototypeTheme';

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [tab, setTab] = useState<PrototypeTab>('home');

  const [reg, setReg] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [gift] = useState({
    text: 'Free coffee at a partner café',
    days: 7,
  });
  const [fb, setFb] = useState<PrototypeFeedback[]>([]);
  const [city, setCity] = useState('All');
  const [vids] = useState<PrototypeVideo[]>(INITIAL_VIDEOS);
  const [travelQuery, setTravelQuery] = useState<PrototypeTravelQuery>({
    type: 'Flights',
    from: 'Bacolod (BCD)',
    to: 'Cebu (CEB)',
    date: '',
  });
  const [searched, setSearched] = useState(false);
  const [rating, setRating] = useState(0);
  const [playerIndex, setPlayerIndex] = useState<number | null>(null);
  const [selectedYouTubeVideo, setSelectedYouTubeVideo] =
    useState<YouTubeVideoItem | null>(null);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [toast, setToast] = useState<{ title: string; msg: string } | null>(
    null
  );
  const [hub, setHub] = useState('Bacolod-Silay Airport');

  const scrollRef = useRef<ScrollView>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const t = PROTOTYPE_THEMES[theme];

  const pushToast = (title: string, msg: string) => {
    setToast({ title, msg });
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
    }, 6000);
  };

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const handleSelectTab = (nextTab: PrototypeTab) => {
    setTab(nextTab);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  };

  const handleRegister = (
    inputName: string,
    inputEmail: string,
    isGoogle: boolean
  ) => {
    const finalName = inputName.trim() || 'Juan dela Cruz';
    const finalEmail =
      inputEmail.trim() || (isGoogle ? 'juan@gmail.com' : 'juan@example.com');
    setName(finalName);
    setEmail(finalEmail);
    setReg(true);
    setRegisterOpen(false);
    setTab('rewards');
    scrollRef.current?.scrollTo({ y: 0, animated: false });
    pushToast(
      `Welcome, ${finalName.split(' ')[0]}!`,
      `Your gift: ${gift.text}.`
    );
  };

  const handleSimulateGeo = () => {
    const destCity = HUBS[hub] || 'Bacolod';
    pushToast(
      `Welcome to ${destCity}!`,
      reg
        ? 'Show your ILC card for 5% off at partner merchants.'
        : 'Join free and claim your welcome gift.'
    );
  };

  const handleSubmitFeedback = (
    target: string,
    starRating: number,
    comment: string
  ) => {
    setFb((prev) => [{ w: target, r: starRating, t: comment }, ...prev]);
    setRating(0);
    pushToast('Thank you', 'Your feedback went to the ILC team.');
  };

  return (
    <SafeAreaView
      style={[
        styles.outerShell,
        { backgroundColor: t.bg },
        Platform.OS === 'web' &&
          ({ backgroundImage: t.stageGradient } as any),
      ]}
    >
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={t.phoneBg}
      />

      <View
        style={[
          styles.mobileAppContainer,
          {
            backgroundColor: t.phoneBg,
            borderColor: t.line,
          },
        ]}
      >
        {/* Persistent Mobile Brand Header */}
        <Header
          theme={theme}
          onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          isRegistered={reg}
          memberEmail={email}
          onPressMember={() => {
            if (reg) {
              handleSelectTab('rewards');
            } else {
              setRegisterOpen(true);
            }
          }}
        />

        {/* In-App Push Toast Notification Banner */}
        {toast && (
          <TouchableOpacity
            style={[
              styles.banner,
              {
                backgroundColor: t.bannerBg,
                borderColor: t.bannerBorder,
              },
              Platform.OS === 'web' &&
                ({
                  backdropFilter: 'blur(14px)',
                  WebkitBackdropFilter: 'blur(14px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                } as any),
            ]}
            onPress={() => setToast(null)}
            activeOpacity={0.9}
          >
            <Text style={[styles.bannerHeader, { color: t.bannerText }]}>
              Island Living Channel · now
            </Text>
            <Text style={[styles.bannerBody, { color: t.bannerText }]}>
              <Text style={{ fontWeight: '700' }}>{toast.title}</Text>{' '}
              {toast.msg}
            </Text>
          </TouchableOpacity>
        )}

        {/* Main Scrollable Screen Content */}
        <ScrollView
          ref={scrollRef}
          style={styles.scr}
          contentContainerStyle={styles.scrContent}
          showsVerticalScrollIndicator={false}
        >
          {tab === 'home' && (
            <HomeScreen
              theme={theme}
              videos={vids}
              isRegistered={reg}
              memberName={name}
              gift={gift}
              onPlayVideo={(idx) => setPlayerIndex(idx)}
              onOpenRegister={() => setRegisterOpen(true)}
              onSelectYouTubeVideo={(video) => setSelectedYouTubeVideo(video)}
            />
          )}

          {tab === 'live' && (
            <WatchScreen
              theme={theme}
              onSelectVideo={(video) => setSelectedYouTubeVideo(video)}
              onPushToast={pushToast}
            />
          )}

          {tab === 'rewards' && (
            <ProfileScreen
              theme={theme}
              isRegistered={reg}
              memberName={name}
              memberEmail={email}
              gift={gift}
              city={city}
              onSelectCity={setCity}
              onOpenRegister={() => setRegisterOpen(true)}
              onPushToast={pushToast}
            />
          )}

          {tab === 'travel' && (
            <TravelScreen
              theme={theme}
              query={travelQuery}
              searched={searched}
              onChangeQuery={(next, reset) => {
                setTravelQuery((prev) => ({ ...prev, ...next }));
                if (reset) setSearched(false);
              }}
              onSearch={() => setSearched(true)}
              onPushToast={pushToast}
            />
          )}

          {tab === 'more' && (
            <VodScreen
              theme={theme}
              onToggleTheme={() =>
                setTheme(theme === 'light' ? 'dark' : 'light')
              }
              isRegistered={reg}
              memberName={name}
              memberEmail={email}
              onOpenRegister={() => setRegisterOpen(true)}
              onSignOut={() => {
                setReg(false);
                setName('');
                setEmail('');
                pushToast('Signed out', 'You have signed out of your account.');
              }}
              rating={rating}
              onChangeRating={setRating}
              hub={hub}
              onChangeHub={setHub}
              feedbackList={fb}
              onSubmitFeedback={handleSubmitFeedback}
              onSimulateGeo={handleSimulateGeo}
              onPushToast={pushToast}
            />
          )}
        </ScrollView>

        {/* Registration Modal Sheet */}
        {registerOpen && (
          <RegisterSheet
            theme={theme}
            onRegister={handleRegister}
            onCancel={() => setRegisterOpen(false)}
          />
        )}

        {/* Video Player Modal Sheet */}
        {playerIndex !== null && vids[playerIndex] && (
          <PlayerSheet
            theme={theme}
            video={vids[playerIndex]}
            index={playerIndex}
            onClose={() => setPlayerIndex(null)}
          />
        )}

        {/* Official YouTube Video / Shorts Player Modal Sheet */}
        {selectedYouTubeVideo && (
          <YouTubePlayerModal
            theme={theme}
            video={selectedYouTubeVideo}
            onClose={() => setSelectedYouTubeVideo(null)}
          />
        )}

        {/* Floating Glass Bottom Navigation */}
        <BottomNav
          currentTab={tab}
          onSelectTab={handleSelectTab}
          theme={theme}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  outerShell: {
    flex: 1,
    alignItems: 'center',
  },
  mobileAppContainer: {
    flex: 1,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 430 : undefined,
    position: 'relative',
    overflow: 'hidden',
    borderLeftWidth: Platform.OS === 'web' ? 1 : 0,
    borderRightWidth: Platform.OS === 'web' ? 1 : 0,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
  },
  scr: {
    flex: 1,
  },
  scrContent: {
    paddingHorizontal: 20,
    paddingBottom: 110,
  },
  banner: {
    position: 'absolute',
    left: 14,
    right: 14,
    top: 14,
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    zIndex: 5,
  },
  bannerHeader: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  bannerBody: {
    fontSize: 13,
    opacity: 0.92,
  },
});
