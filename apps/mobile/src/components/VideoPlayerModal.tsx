import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import {
  BrandLogo,
  BrandStripe,
  PrototypeQrCode,
  SceneBackground,
} from './PrototypeArtwork';
import {
  FieldLabel,
  H1,
  H2,
  H3,
  MuteText,
  PromoBox,
  ProtoButton,
  ProtoChip,
  ProtoInput,
} from './PrototypePrimitives';
import {
  NotificationItem,
  PROTOTYPE_THEMES,
  PrototypeMerchant,
  PrototypeTab,
  PrototypeVideo,
  SERIF_FONT,
  ThemeMode,
  VideoCategoryFilter,
  computeMemberId,
} from '../constants/prototypeTheme';

/* ============================================================================
 * 1. VIDEO PLAYER SHEET
 * ========================================================================== */
interface PlayerSheetProps {
  theme: ThemeMode;
  video: PrototypeVideo;
  index: number;
  initialProgress?: number;
  onUpdateProgress: (videoId: string, progress: number) => void;
  onClose: () => void;
}

export const PlayerSheet: React.FC<PlayerSheetProps> = ({
  theme,
  video,
  index,
  initialProgress = 0,
  onUpdateProgress,
  onClose,
}) => {
  const t = PROTOTYPE_THEMES[theme];
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(initialProgress || 12);

  useEffect(() => {
    const timer = setInterval(() => {
      setPlaying((currPlaying) => {
        if (currPlaying) {
          setProgress((prev) => Math.min(100, prev + 2));
        }
        return currPlaying;
      });
    }, 350);
    return () => clearInterval(timer);
  }, []);

  const handleClose = () => {
    onUpdateProgress(video.id, progress);
    onClose();
  };

  return (
    <View style={[styles.sheet, { backgroundColor: t.sheetBg }]}>
      <View
        style={[
          styles.liveBox,
          Platform.OS === 'web' &&
            ({ boxShadow: '0 20px 40px rgba(0,0,0,0.4)' } as any),
        ]}
      >
        <SceneBackground index={video.sceneIndex ?? index} style={{ flex: 1 }}>
          <View style={styles.liveCenter}>
            <TouchableOpacity
              style={[
                styles.playCircle,
                Platform.OS === 'web' &&
                  ({ backdropFilter: 'blur(8px)' } as any),
              ]}
              onPress={() => setPlaying(!playing)}
              activeOpacity={0.8}
            >
              <Text style={styles.playText}>{playing ? '❚❚' : '▶'}</Text>
            </TouchableOpacity>
          </View>
        </SceneBackground>
      </View>

      <View style={[styles.bar, { backgroundColor: t.line }]}>
        <View
          style={[
            styles.barFill,
            { backgroundColor: t.hib, width: `${progress}%` },
          ]}
        />
      </View>

      <View style={styles.metaChipRow}>
        <View style={[styles.smallTagPill, { backgroundColor: t.tabOnBg }]}>
          <Text style={[styles.smallTagText, { color: t.brand }]}>
            {video.category}
          </Text>
        </View>
        <View style={[styles.smallTagPill, { backgroundColor: t.inputBg }]}>
          <Text style={[styles.smallTagText, { color: t.mute }]}>
            {video.region}
          </Text>
        </View>
      </View>

      <H2 theme={theme} style={{ marginTop: 4, marginBottom: 0 }}>
        {video.t}
      </H2>
      <MuteText theme={theme} style={{ marginBottom: 12 }}>
        {video.m} · Island Living Original ({progress}% watched)
      </MuteText>

      <ProtoButton theme={theme} label="Close" full onPress={handleClose} />
    </View>
  );
};

/* ============================================================================
 * 2. REGISTRATION SHEET
 * ========================================================================== */
interface RegisterSheetProps {
  theme: ThemeMode;
  onRegister: (name: string, email: string, isGoogle: boolean) => void;
  onCancel: () => void;
}

export const RegisterSheet: React.FC<RegisterSheetProps> = ({
  theme,
  onRegister,
  onCancel,
}) => {
  const t = PROTOTYPE_THEMES[theme];
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  return (
    <View style={[styles.sheet, { backgroundColor: t.sheetBg }]}>
      <H1 theme={theme}>Create your free account</H1>
      <MuteText theme={theme} style={{ marginBottom: 6 }}>
        You’ll get a digital membership card and a welcome gift right away.
      </MuteText>

      <FieldLabel theme={theme}>Full name</FieldLabel>
      <ProtoInput
        theme={theme}
        value={name}
        onChangeText={setName}
        placeholder="Juan dela Cruz"
      />

      <FieldLabel theme={theme}>Email</FieldLabel>
      <ProtoInput
        theme={theme}
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
        keyboardType="email-address"
      />

      <ProtoButton
        theme={theme}
        label="Create account"
        full
        onPress={() => onRegister(name, email, false)}
        style={{ marginBottom: 6 }}
      />

      <ProtoButton
        theme={theme}
        alt
        full
        label="Continue with Google"
        onPress={() => onRegister(name, email, true)}
      />

      <ProtoChip
        theme={theme}
        label="Not now"
        onPress={onCancel}
        style={{ alignSelf: 'center', marginTop: 8 }}
      />
    </View>
  );
};

/* ============================================================================
 * 3. ONBOARDING SCREEN (Editorial Welcome & Free Sign-Up)
 * ========================================================================== */
interface OnboardingSheetProps {
  theme: ThemeMode;
  giftText: string;
  onRegister: (name: string, email: string, isGoogle: boolean) => void;
  onSkip: () => void;
}

const ONBOARDING_STEPS = [
  {
    number: '01',
    label: 'Watch',
    scene: 0,
    caption: 'Bacolod · Iloilo · Cebu · Boracay',
    title: 'Stories from the islands, wherever you land.',
    subtitle:
      'From airport arrival gates to your hotel room—stream original Philippine travel films, food trails, and our 24/7 live channel.',
  },
  {
    number: '02',
    label: 'Rewards',
    scene: 4,
    caption: 'Digital Member Card',
    title: 'One card for island cafés, dining & stays.',
    subtitle:
      'Members receive a complimentary welcome coffee and 5% off at partner restaurants, cafés, and resorts—just show your QR code.',
  },
  {
    number: '03',
    label: 'Book',
    scene: 2,
    caption: 'In partnership with Otamigo',
    title: 'Plan flights, ferries, and coastal stays.',
    subtitle:
      'Search inter-island flights, fastcraft schedules, and curated hotels in one place, with member perks applied.',
  },
];

export const OnboardingSheet: React.FC<OnboardingSheetProps> = ({
  theme,
  giftText,
  onRegister,
  onSkip,
}) => {
  const t = PROTOTYPE_THEMES[theme];
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const isSignUpStep = step >= ONBOARDING_STEPS.length;
  const currentSlide =
    ONBOARDING_STEPS[Math.min(step, ONBOARDING_STEPS.length - 1)];

  return (
    <View style={[styles.onboardScreen, { backgroundColor: t.phoneBg }]}>
      {/* Minimal Header: Logo + Plain Text Skip */}
      <View style={styles.onboardTopBar}>
        <BrandLogo small theme={theme} />
        <TouchableOpacity
          onPress={onSkip}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={[styles.skipText, { color: t.mute }]}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView
        style={styles.onboardBodyScroll}
        contentContainerStyle={styles.onboardBodyContent}
        showsVerticalScrollIndicator={false}
      >
        {!isSignUpStep ? (
          <View style={styles.onboardSlideContainer}>
            {/* Uncluttered Editorial Artwork */}
            <SceneBackground
              index={currentSlide.scene}
              overlayGradient="hero"
              style={styles.onboardHero}
            >
              <Text style={styles.onboardHeroCaption}>
                {currentSlide.number} — {currentSlide.label} ·{' '}
                {currentSlide.caption}
              </Text>
            </SceneBackground>

            {/* Editorial Headline & Calm Body Copy */}
            <View style={styles.onboardTextSection}>
              <Text
                style={[
                  styles.onboardMainTitle,
                  { color: t.ink, fontFamily: SERIF_FONT },
                ]}
              >
                {currentSlide.title}
              </Text>
              <MuteText theme={theme} style={styles.onboardDesc}>
                {currentSlide.subtitle}
              </MuteText>
            </View>
          </View>
        ) : (
          /* Step 4: Clean Editorial Sign-Up */
          <View style={styles.onboardSlideContainer}>
            <Text style={[styles.onboardEyebrow, { color: t.brand }]}>
              Free Membership
            </Text>
            <Text
              style={[
                styles.onboardMainTitle,
                { color: t.ink, fontFamily: SERIF_FONT },
              ]}
            >
              Join Island Living
            </Text>
            <MuteText theme={theme} style={styles.onboardDesc}>
              Create a free account to unlock your digital member QR card, 5%
              partner discount, and welcome gift ({giftText.toLowerCase()}).
            </MuteText>

            <View style={{ marginTop: 22 }}>
              <FieldLabel theme={theme}>Full name</FieldLabel>
              <ProtoInput
                theme={theme}
                value={name}
                onChangeText={setName}
                placeholder="Juan dela Cruz"
              />

              <FieldLabel theme={theme}>Email</FieldLabel>
              <ProtoInput
                theme={theme}
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                keyboardType="email-address"
              />

              <ProtoButton
                theme={theme}
                label="Create free account"
                full
                onPress={() => onRegister(name, email, false)}
                style={{ marginTop: 6, marginBottom: 8 }}
              />

              <ProtoButton
                theme={theme}
                alt
                full
                label="Continue with Google"
                onPress={() => onRegister(name, email, true)}
              />
            </View>
          </View>
        )}
      </ScrollView>

      {/* Minimal Bottom Bar: Subtle Dots + Clean Action */}
      <View style={styles.onboardBottomFooter}>
        <View style={styles.onboardDotsRow}>
          {[0, 1, 2, 3].map((idx) => {
            const active = step === idx;
            return (
              <TouchableOpacity
                key={idx}
                onPress={() => setStep(idx)}
                hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
                style={[
                  styles.onboardDot,
                  {
                    width: active ? 20 : 6,
                    backgroundColor: active ? t.brand : t.line,
                  },
                ]}
              />
            );
          })}
        </View>

        {!isSignUpStep ? (
          <ProtoButton
            theme={theme}
            label={step < ONBOARDING_STEPS.length - 1 ? 'Next' : 'Get started'}
            full
            onPress={() => setStep(step + 1)}
          />
        ) : (
          <TouchableOpacity
            style={styles.onboardGuestLink}
            onPress={() => setStep(0)}
            activeOpacity={0.7}
          >
            <Text style={[styles.onboardGuestLinkText, { color: t.mute }]}>
              Back to overview
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

/* ============================================================================
 * 4. MERCHANT DETAIL PAGE SHEET
 * ========================================================================== */
interface MerchantDetailSheetProps {
  theme: ThemeMode;
  merchant: PrototypeMerchant;
  isRegistered: boolean;
  onClose: () => void;
  onShowCashierQr: (merchantName: string) => void;
  onOpenRegister: () => void;
}

export const MerchantDetailSheet: React.FC<MerchantDetailSheetProps> = ({
  theme,
  merchant,
  isRegistered,
  onClose,
  onShowCashierQr,
  onOpenRegister,
}) => {
  const t = PROTOTYPE_THEMES[theme];

  return (
    <ScrollView
      style={[styles.sheetScroll, { backgroundColor: t.sheetBg }]}
      contentContainerStyle={styles.sheetScrollContent}
      showsVerticalScrollIndicator={false}
    >
      <TouchableOpacity
        style={[styles.backBtn, { borderColor: t.line, backgroundColor: t.inputBg }]}
        onPress={onClose}
        activeOpacity={0.8}
      >
        <Feather name="arrow-left" size={16} color={t.ink} />
        <Text style={[styles.backBtnText, { color: t.ink }]}>
          Back to Rewards
        </Text>
      </TouchableOpacity>

      <SceneBackground
        index={merchant.sceneIndex}
        overlayGradient="hero"
        style={styles.merchantHero}
      >
        <View style={styles.merchantHeroInner}>
          <View style={styles.onboardBadge}>
            <Text style={styles.onboardBadgeText}>
              {merchant.t.toUpperCase()} · {merchant.c.toUpperCase()}
            </Text>
          </View>
          <Text style={[styles.onboardHeroTitle, { fontFamily: SERIF_FONT }]}>
            {merchant.n}
          </Text>
        </View>
      </SceneBackground>

      <MuteText theme={theme} style={{ marginTop: 14, fontSize: 14 }}>
        {merchant.description}
      </MuteText>

      {/* 5% Member Card Offer Box */}
      <PromoBox theme={theme} style={{ marginTop: 16 }}>
        <View style={styles.offerHeaderRow}>
          <Feather name="percent" size={16} color={t.brand} />
          <Text style={[styles.offerBadgeTitle, { color: t.brand }]}>
            ILC MEMBER CARD OFFER · 5% OFF
          </Text>
        </View>
        <H3 theme={theme} style={{ marginTop: 4, marginBottom: 6 }}>
          {merchant.offer}
        </H3>
        <MuteText theme={theme} style={{ marginBottom: 12 }}>
          Present your fullscreen QR code to the cashier before payment.
        </MuteText>
        <ProtoButton
          theme={theme}
          label={
            isRegistered
              ? 'Show card (Fullscreen QR)'
              : 'Create free account to unlock 5% off'
          }
          full
          onPress={() => {
            if (isRegistered) {
              onShowCashierQr(merchant.n);
            } else {
              onOpenRegister();
            }
          }}
        />
      </PromoBox>

      {/* Address & Hours Details */}
      <View
        style={[
          styles.infoCard,
          { backgroundColor: t.inputBg, borderColor: t.line },
        ]}
      >
        <View style={[styles.infoRow, { borderBottomColor: t.line }]}>
          <Feather name="map-pin" size={16} color={t.brand} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.infoLabel, { color: t.mute }]}>Address</Text>
            <Text style={[styles.infoValue, { color: t.ink }]}>
              {merchant.address}
            </Text>
          </View>
        </View>

        <View style={styles.infoRowLast}>
          <Feather name="clock" size={16} color={t.brand} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.infoLabel, { color: t.mute }]}>
              Operating Hours
            </Text>
            <Text style={[styles.infoValue, { color: t.ink }]}>
              {merchant.hours}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

/* ============================================================================
 * 5. FULLSCREEN CASHIER QR MODAL
 * ========================================================================== */
interface FullscreenQrModalProps {
  theme: ThemeMode;
  memberName: string;
  memberEmail: string;
  merchantName?: string;
  onClose: () => void;
}

export const FullscreenQrModal: React.FC<FullscreenQrModalProps> = ({
  theme,
  memberName,
  memberEmail,
  merchantName,
  onClose,
}) => {
  const t = PROTOTYPE_THEMES[theme];
  const memberId = computeMemberId(memberEmail);

  return (
    <View
      style={[
        styles.sheet,
        {
          backgroundColor: '#061A0E',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: 24,
        },
      ]}
    >
      <View style={styles.qrModalTop}>
        <BrandLogo small theme="dark" />
        <TouchableOpacity
          style={styles.qrCloseCircle}
          onPress={onClose}
          activeOpacity={0.8}
        >
          <Feather name="x" size={18} color="#F2F7EC" />
        </TouchableOpacity>
      </View>

      <View style={styles.qrCenterCard}>
        <View style={styles.qrDiscountPill}>
          <Text style={styles.qrDiscountPillText}>
            5% PARTNER DISCOUNT PASS
          </Text>
        </View>

        {merchantName ? (
          <Text style={styles.qrMerchantSub}>
            Redeeming at <Text style={{ fontWeight: '700' }}>{merchantName}</Text>
          </Text>
        ) : (
          <Text style={styles.qrMerchantSub}>
            Present to cashier to scan member code
          </Text>
        )}

        <View style={styles.qrBigWrapper}>
          <PrototypeQrCode seed={memberEmail || 'guest'} size={210} />
        </View>

        <Text style={[styles.qrMemberName, { fontFamily: SERIF_FONT }]}>
          {memberName || 'Juan dela Cruz'}
        </Text>
        <Text style={styles.qrMemberId}>{memberId}</Text>

        <View style={styles.qrVerifiedRow}>
          <View style={styles.qrVerifiedDot} />
          <Text style={styles.qrVerifiedText}>
            Verified Active Digital Member
          </Text>
        </View>
      </View>

      <ProtoButton
        theme="dark"
        label="Done scanning"
        full
        onPress={onClose}
      />
    </View>
  );
};

/* ============================================================================
 * 6. NOTIFICATION INBOX SHEET
 * ========================================================================== */
interface NotificationInboxSheetProps {
  theme: ThemeMode;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  onSelectNotification: (n: NotificationItem) => void;
  onClose: () => void;
}

export const NotificationInboxSheet: React.FC<NotificationInboxSheetProps> = ({
  theme,
  notifications,
  onMarkAllRead,
  onSelectNotification,
  onClose,
}) => {
  const t = PROTOTYPE_THEMES[theme];
  const [filter, setFilter] = useState<'all' | 'geo' | 'announcement'>('all');

  const filtered = notifications.filter(
    (n) => filter === 'all' || n.type === filter
  );

  return (
    <ScrollView
      style={[styles.sheetScroll, { backgroundColor: t.sheetBg }]}
      contentContainerStyle={styles.sheetScrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.inboxTopRow}>
        <TouchableOpacity
          style={[
            styles.backBtn,
            { borderColor: t.line, backgroundColor: t.inputBg, marginBottom: 0 },
          ]}
          onPress={onClose}
          activeOpacity={0.8}
        >
          <Feather name="arrow-left" size={16} color={t.ink} />
          <Text style={[styles.backBtnText, { color: t.ink }]}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onMarkAllRead} activeOpacity={0.7}>
          <Text style={[styles.markReadText, { color: t.brand }]}>
            Mark all read
          </Text>
        </TouchableOpacity>
      </View>

      <H1 theme={theme} style={{ marginTop: 14 }}>
        Notification Inbox
      </H1>
      <MuteText theme={theme} style={{ marginTop: 4, marginBottom: 12 }}>
        Past airport geo arrival alerts and channel announcements.
      </MuteText>

      <View style={styles.inboxChipsRow}>
        <ProtoChip
          theme={theme}
          label="All"
          active={filter === 'all'}
          onPress={() => setFilter('all')}
        />
        <ProtoChip
          theme={theme}
          label="Geo Alerts"
          active={filter === 'geo'}
          onPress={() => setFilter('geo')}
        />
        <ProtoChip
          theme={theme}
          label="Announcements"
          active={filter === 'announcement'}
          onPress={() => setFilter('announcement')}
        />
      </View>

      {filtered.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={[
            styles.notifCard,
            {
              backgroundColor: item.read ? t.inputBg : t.tabOnBg,
              borderColor: item.read ? t.line : t.promoBorder,
            },
          ]}
          onPress={() => onSelectNotification(item)}
          activeOpacity={0.8}
        >
          <View
            style={[
              styles.notifIconCircle,
              {
                backgroundColor:
                  item.type === 'geo' ? 'rgba(201,220,63,0.2)' : 'rgba(121,170,52,0.2)',
              },
            ]}
          >
            <Feather
              name={item.type === 'geo' ? 'map-pin' : 'radio'}
              size={16}
              color={t.brand}
            />
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.notifHeaderRow}>
              <Text style={[styles.notifTypeTag, { color: t.brand }]}>
                {item.type === 'geo' ? 'GEO ARRIVAL' : 'ANNOUNCEMENT'}
              </Text>
              <Text style={[styles.notifTime, { color: t.mute }]}>
                {item.time}
              </Text>
            </View>
            <Text style={[styles.notifTitle, { color: t.ink }]}>
              {item.title}
            </Text>
            <MuteText theme={theme}>{item.msg}</MuteText>
          </View>
          {!item.read && (
            <View style={[styles.unreadDot, { backgroundColor: t.brand }]} />
          )}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

/* ============================================================================
 * 7. SLIDE-OUT MENU DRAWER (with ILC Website Sections + Privacy & Terms)
 * ========================================================================== */
interface SlideOutDrawerProps {
  theme: ThemeMode;
  onClose: () => void;
  onNavigateCategory: (cat: VideoCategoryFilter) => void;
  onNavigateTab: (tab: PrototypeTab) => void;
  onOpenInbox: () => void;
  onOpenOnboarding: () => void;
}

export const SlideOutDrawer: React.FC<SlideOutDrawerProps> = ({
  theme,
  onClose,
  onNavigateCategory,
  onNavigateTab,
  onOpenInbox,
  onOpenOnboarding,
}) => {
  const t = PROTOTYPE_THEMES[theme];
  const [legalDoc, setLegalDoc] = useState<'privacy' | 'terms' | null>(null);

  const MENU_SECTIONS: {
    label: string;
    sub: string;
    icon: React.ComponentProps<typeof Feather>['name'];
    action: () => void;
  }[] = [
    {
      label: 'Philippines',
      sub: 'Archipelago documentaries & island guides',
      icon: 'compass',
      action: () => {
        onNavigateCategory('Philippines');
        onClose();
      },
    },
    {
      label: 'International',
      sub: 'Global coastal & lifestyle stories',
      icon: 'globe',
      action: () => {
        onNavigateCategory('International');
        onClose();
      },
    },
    {
      label: 'Hotels & Resorts',
      sub: 'Boutique stays & beach sanctuaries',
      icon: 'home',
      action: () => {
        onNavigateCategory('Hotels & Resorts');
        onClose();
      },
    },
    {
      label: 'Videos',
      sub: 'Full on-demand film catalog',
      icon: 'play-circle',
      action: () => {
        onNavigateCategory('All');
        onClose();
      },
    },
    {
      label: 'Food & Culinary',
      sub: 'Regional flavors & street food crawls',
      icon: 'coffee',
      action: () => {
        onNavigateCategory('Food');
        onClose();
      },
    },
    {
      label: 'Festivals & Live TV',
      sub: '24/7 stream & cultural celebrations',
      icon: 'radio',
      action: () => {
        onNavigateTab('live');
        onClose();
      },
    },
    {
      label: 'Partner Rewards (5% Off)',
      sub: 'Digital member card & merchant directory',
      icon: 'gift',
      action: () => {
        onNavigateTab('rewards');
        onClose();
      },
    },
    {
      label: 'Otamigo Travel',
      sub: 'Book flights, ferries & island stays',
      icon: 'send',
      action: () => {
        onNavigateTab('travel');
        onClose();
      },
    },
  ];

  return (
    <View style={styles.drawerOverlay}>
      <TouchableOpacity
        style={styles.drawerBackdrop}
        onPress={onClose}
        activeOpacity={1}
      />

      <View
        style={[
          styles.drawerPanel,
          {
            backgroundColor: t.sheetBg,
            borderRightColor: t.line,
          },
        ]}
      >
        <View style={styles.drawerHeader}>
          <BrandLogo small theme={theme} />
          <TouchableOpacity
            style={[
              styles.drawerCloseBtn,
              { borderColor: t.line, backgroundColor: t.inputBg },
            ]}
            onPress={onClose}
          >
            <Feather name="x" size={16} color={t.ink} />
          </TouchableOpacity>
        </View>

        <BrandStripe />

        {legalDoc ? (
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            <TouchableOpacity
              style={[
                styles.backBtn,
                { borderColor: t.line, backgroundColor: t.inputBg },
              ]}
              onPress={() => setLegalDoc(null)}
            >
              <Feather name="arrow-left" size={15} color={t.ink} />
              <Text style={[styles.backBtnText, { color: t.ink }]}>
                Back to menu
              </Text>
            </TouchableOpacity>

            <H2 theme={theme} style={{ marginTop: 6 }}>
              {legalDoc === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
            </H2>
            <MuteText theme={theme} style={{ lineHeight: 20 }}>
              {legalDoc === 'privacy'
                ? 'Island Living Channel (ILC) respects your privacy. We collect only your name and email address to issue your digital membership card, deliver welcome gifts, and provide optional airport/seaport arrival notifications. Your QR code encodes only your non-PII member ID (ILC-XXXXX). You may disable geo alerts or delete your account at any time in Profile & Settings.'
                : 'By using the Island Living Channel mobile app, you agree to our Phase 1 Member Terms. Digital membership is free and entitles registered members to a welcome gift (valid within the stated expiry window) and 5% off at participating partner merchants in Bacolod, Iloilo, and Cebu upon presenting your QR card. Travel bookings are fulfilled through our partner Otamigo under their carrier and accommodation terms.'}
            </MuteText>
          </ScrollView>
        ) : (
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            <Text style={[styles.drawerSectionHeader, { color: t.mute }]}>
              EXPLORE ISLAND LIVING
            </Text>

            {MENU_SECTIONS.map((item) => (
              <TouchableOpacity
                key={item.label}
                style={[styles.drawerItem, { borderBottomColor: t.line }]}
                onPress={item.action}
                activeOpacity={0.75}
              >
                <View
                  style={[
                    styles.drawerIconWrap,
                    { backgroundColor: t.inputBg },
                  ]}
                >
                  <Feather name={item.icon} size={16} color={t.brand} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.drawerItemTitle, { color: t.ink }]}>
                    {item.label}
                  </Text>
                  <Text style={[styles.drawerItemSub, { color: t.mute }]}>
                    {item.sub}
                  </Text>
                </View>
                <Feather name="chevron-right" size={15} color={t.mute} />
              </TouchableOpacity>
            ))}

            <Text
              style={[
                styles.drawerSectionHeader,
                { color: t.mute, marginTop: 18 },
              ]}
            >
              LEGAL & INFO
            </Text>

            <TouchableOpacity
              style={[styles.drawerLegalRow, { borderBottomColor: t.line }]}
              onPress={() => {
                onOpenOnboarding();
                onClose();
              }}
            >
              <Feather name="compass" size={14} color={t.mute} />
              <Text style={[styles.drawerLegalText, { color: t.ink }]}>
                Welcome Tour (Airport Journey)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.drawerLegalRow, { borderBottomColor: t.line }]}
              onPress={() => {
                onOpenInbox();
                onClose();
              }}
            >
              <Feather name="bell" size={14} color={t.mute} />
              <Text style={[styles.drawerLegalText, { color: t.ink }]}>
                Notification Inbox
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.drawerLegalRow, { borderBottomColor: t.line }]}
              onPress={() => setLegalDoc('privacy')}
            >
              <Feather name="shield" size={14} color={t.mute} />
              <Text style={[styles.drawerLegalText, { color: t.ink }]}>
                Privacy Policy
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.drawerLegalRow, { borderBottomWidth: 0 }]}
              onPress={() => setLegalDoc('terms')}
            >
              <Feather name="file-text" size={14} color={t.mute} />
              <Text style={[styles.drawerLegalText, { color: t.ink }]}>
                Terms & Conditions
              </Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 6,
  },
  sheetScroll: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  sheetScrollContent: {
    paddingTop: 18,
    paddingHorizontal: 20,
    paddingBottom: 110,
  },
  liveBox: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 24,
    overflow: 'hidden',
  },
  liveCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playText: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  bar: {
    height: 6,
    borderRadius: 6,
    overflow: 'hidden',
    marginVertical: 12,
  },
  barFill: {
    height: '100%',
  },
  metaChipRow: {
    flexDirection: 'row',
    gap: 8,
  },
  smallTagPill: {
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 99,
  },
  smallTagText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  onboardScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  onboardTopContainer: {
    paddingTop: 14,
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  onboardTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 18,
    paddingHorizontal: 22,
    paddingBottom: 12,
  },
  skipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  onboardBodyScroll: {
    flex: 1,
  },
  onboardBodyContent: {
    paddingHorizontal: 22,
    paddingTop: 8,
    paddingBottom: 24,
  },
  onboardSlideContainer: {
    flexDirection: 'column',
  },
  onboardHero: {
    minHeight: 290,
    borderRadius: 24,
    padding: 20,
    justifyContent: 'flex-end',
  },
  onboardHeroCaption: {
    color: 'rgba(255,255,255,0.86)',
    fontSize: 12.5,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  onboardBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingVertical: 4,
    paddingHorizontal: 11,
    borderRadius: 99,
  },
  onboardBadgeText: {
    color: '#F3E600',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  onboardHeroTitle: {
    color: '#FFFFFF',
    fontSize: 25,
    lineHeight: 28,
    fontWeight: '500',
  },
  onboardTextSection: {
    marginTop: 26,
  },
  onboardEyebrow: {
    fontSize: 12.5,
    fontWeight: '600',
    marginBottom: 6,
  },
  onboardMainTitle: {
    fontSize: 30,
    lineHeight: 34,
    fontWeight: '500',
    letterSpacing: -0.4,
  },
  onboardDesc: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 22,
  },
  onboardGuestLink: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  onboardGuestLinkText: {
    fontSize: 13.5,
    fontWeight: '500',
  },
  onboardBottomFooter: {
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 24,
    gap: 16,
  },
  onboardDotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  onboardDot: {
    height: 6,
    borderRadius: 3,
  },
  backBtn: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 99,
    borderWidth: 1,
    marginBottom: 14,
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
  merchantHero: {
    minHeight: 200,
    borderRadius: 24,
    padding: 20,
  },
  merchantHeroInner: {
    flex: 1,
    justifyContent: 'flex-end',
    gap: 6,
  },
  offerHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  offerBadgeTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  infoCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 14,
    marginTop: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingBottom: 12,
    marginBottom: 12,
    borderBottomWidth: 1,
  },
  infoRowLast: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  infoLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  qrModalTop: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  qrCloseCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrCenterCard: {
    width: '100%',
    borderRadius: 28,
    padding: 24,
    backgroundColor: '#0A2414',
    borderWidth: 1,
    borderColor: 'rgba(201,220,63,0.55)',
    alignItems: 'center',
  },
  qrDiscountPill: {
    backgroundColor: 'rgba(201,220,63,0.18)',
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderRadius: 99,
    marginBottom: 8,
  },
  qrDiscountPillText: {
    color: '#C9DC3F',
    fontSize: 11.5,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  qrMerchantSub: {
    color: '#98B39E',
    fontSize: 13,
    marginBottom: 18,
    textAlign: 'center',
  },
  qrBigWrapper: {
    padding: 10,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
    marginBottom: 18,
  },
  qrMemberName: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '500',
  },
  qrMemberId: {
    color: '#C9DC3F',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 4,
  },
  qrVerifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
  },
  qrVerifiedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#C9DC3F',
  },
  qrVerifiedText: {
    color: '#98B39E',
    fontSize: 12,
  },
  inboxTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  markReadText: {
    fontSize: 13,
    fontWeight: '600',
  },
  inboxChipsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  notifCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 10,
  },
  notifIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  notifTypeTag: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  notifTime: {
    fontSize: 11,
  },
  notifTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    marginBottom: 2,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 4,
  },
  drawerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 12,
    flexDirection: 'row',
  },
  drawerBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  drawerPanel: {
    width: '82%',
    maxWidth: 320,
    height: '100%',
    borderRightWidth: 1,
    paddingTop: 16,
    paddingHorizontal: 18,
    paddingBottom: 24,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  drawerCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerSectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 11,
    borderBottomWidth: 1,
  },
  drawerIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerItemTitle: {
    fontSize: 14.5,
    fontWeight: '700',
  },
  drawerItemSub: {
    fontSize: 11.5,
  },
  drawerLegalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 11,
    borderBottomWidth: 1,
  },
  drawerLegalText: {
    fontSize: 13.5,
    fontWeight: '500',
  },
});
