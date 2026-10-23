import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { MembershipCardView } from '../components/MembershipCardView';
import {
  H1,
  MuteText,
  ProtoButton,
  ProtoChip,
} from '../components/PrototypePrimitives';
import {
  MERCHANTS,
  PROTOTYPE_THEMES,
  PrototypeMerchant,
  SERIF_FONT,
  ThemeMode,
  computeMemberId,
} from '../constants/prototypeTheme';

interface ProfileScreenProps {
  theme: ThemeMode;
  isRegistered: boolean;
  memberName: string;
  memberEmail: string;
  gift: { text: string; days: number };
  city: string;
  onSelectCity: (city: string) => void;
  onOpenRegister: () => void;
  onSelectMerchant: (merchant: PrototypeMerchant) => void;
  onOpenFullscreenQr: (merchantName?: string) => void;
  onPushToast: (title: string, msg: string) => void;
}

const CITIES = ['All', 'Bacolod', 'Iloilo', 'Cebu'];

type FeatherName = React.ComponentProps<typeof Feather>['name'];

const getCategoryIcon = (category: string): FeatherName => {
  switch (category.toLowerCase()) {
    case 'coffee':
      return 'coffee';
    case 'dining':
      return 'disc';
    case 'stay':
      return 'home';
    case 'shopping':
      return 'shopping-bag';
    case 'tours':
      return 'compass';
    case 'activities':
      return 'anchor';
    default:
      return 'tag';
  }
};

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  theme,
  isRegistered,
  memberName,
  memberEmail,
  gift,
  city,
  onSelectCity,
  onOpenRegister,
  onSelectMerchant,
  onOpenFullscreenQr,
  onPushToast,
}) => {
  const t = PROTOTYPE_THEMES[theme];
  const filteredMerchants = MERCHANTS.filter(
    (m) => city === 'All' || m.c === city
  );
  const memberId = computeMemberId(memberEmail);

  return (
    <View style={styles.container}>
      {/* 2. Member Pass Card Section */}
      {!isRegistered ? (
        <View
          style={[
            styles.guestCard,
            { backgroundColor: t.inputBg, borderColor: t.line },
          ]}
        >
          <View style={styles.guestCardHeader}>
            <View
              style={[
                styles.badge,
                { backgroundColor: 'rgba(255,255,255,0.06)', borderColor: t.line },
              ]}
            >
              <Feather name="gift" size={13} color={t.brand} />
              <Text style={[styles.badgeText, { color: t.ink }]}>
                FREE MEMBER PASS
              </Text>
            </View>
          </View>
          <Text
            style={[styles.guestTitle, { color: t.ink, fontFamily: SERIF_FONT }]}
          >
            Unlock 5% off across the islands
          </Text>
          <MuteText theme={theme} style={styles.guestDesc}>
            Join free to claim your digital QR card, welcome coffee, and partner
            privileges in Bacolod, Iloilo, and Cebu.
          </MuteText>
          <ProtoButton
            theme={theme}
            label="Create free account"
            full
            onPress={onOpenRegister}
            style={{ marginTop: 14 }}
          />
        </View>
      ) : (
        <View style={styles.cardSection}>
          <MembershipCardView
            name={memberName}
            email={memberEmail}
            theme={theme}
            interactive
            onPress={() => onOpenFullscreenQr()}
          />

          <TouchableOpacity
            style={[
              styles.qrActionBtn,
              { borderColor: t.line, backgroundColor: t.inputBg },
            ]}
            onPress={() => onOpenFullscreenQr()}
            activeOpacity={0.75}
          >
            <Feather name="maximize-2" size={15} color={t.brand} />
            <Text style={[styles.qrActionBtnText, { color: t.ink }]}>
              Show Cashier QR Code
            </Text>
          </TouchableOpacity>

          {/* Welcome Gift Card */}
          <View
            style={[
              styles.giftCard,
              { borderColor: t.line, backgroundColor: t.inputBg },
            ]}
          >
            <View
              style={[styles.giftIconCircle, { backgroundColor: t.tabOnBg }]}
            >
              <Feather name="gift" size={18} color={t.brand} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.giftHeaderRow}>
                <Text style={[styles.giftTag, { color: t.brand }]}>
                  WELCOME GIFT
                </Text>
                <Text style={[styles.giftExpiry, { color: t.mute }]}>
                  {gift.days}d left
                </Text>
              </View>
              <Text style={[styles.giftTitle, { color: t.ink }]}>
                {gift.text}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.claimBtn, { backgroundColor: t.btnBg }]}
              onPress={() =>
                onPushToast(
                  'Gift Ready',
                  `Show code to cashier: ${memberId}`
                )
              }
              activeOpacity={0.8}
            >
              <Text style={[styles.claimBtnText, { color: t.btnText }]}>Claim</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* 3. Partner Directory Section */}
      <View style={styles.directoryHeader}>
        <Text style={[styles.sectionLabel, { color: t.mute }]}>
          PARTNER DIRECTORY
        </Text>
        <Text
          style={[styles.sectionTitle, { color: t.ink, fontFamily: SERIF_FONT }]}
        >
          Curated island perks
        </Text>
        <MuteText theme={theme} style={styles.directorySub}>
          Present your digital pass before payment for 5% off.
        </MuteText>
      </View>

      {/* City Filter Chips */}
      <View style={styles.chipsRow}>
        {CITIES.map((c) => (
          <ProtoChip
            key={c}
            theme={theme}
            label={c}
            active={city === c}
            onPress={() => onSelectCity(c)}
          />
        ))}
      </View>

      {/* Merchants List */}
      <View
        style={[
          styles.merchantsCard,
          { backgroundColor: t.inputBg, borderColor: t.line },
        ]}
      >
        {filteredMerchants.map((m, index) => {
          const isLast = index === filteredMerchants.length - 1;
          const iconName = getCategoryIcon(m.t);

          return (
            <TouchableOpacity
              key={m.id}
              style={[
                styles.merchantRow,
                !isLast && { borderBottomWidth: 1, borderBottomColor: t.line },
              ]}
              onPress={() => onSelectMerchant(m)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.categoryIconWrap,
                  {
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    borderColor: t.line,
                  },
                ]}
              >
                <Feather name={iconName} size={15} color={t.mute} />
              </View>

              <View style={styles.merchantInfo}>
                <Text style={[styles.merchantName, { color: t.ink }]}>
                  {m.n}
                </Text>
                <Text style={[styles.merchantMeta, { color: t.mute }]}>
                  {m.t} · {m.c} · {m.hours.split('·')[1]?.trim() || m.hours}
                </Text>
              </View>

              <View style={styles.merchantRight}>
                <Feather name="chevron-right" size={17} color={t.mute} />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  subtitle: {
    marginTop: 4,
    marginBottom: 8,
  },
  guestCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    marginTop: 12,
  },
  guestCardHeader: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 99,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  guestTitle: {
    fontSize: 22,
    fontWeight: '500',
    lineHeight: 27,
    marginBottom: 6,
  },
  guestDesc: {
    fontSize: 14,
    lineHeight: 20,
  },
  cardSection: {
    marginTop: 12,
  },
  qrActionBtn: {
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  qrActionBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  giftCard: {
    marginTop: 12,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  giftIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  giftHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  giftTag: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  giftExpiry: {
    fontSize: 11,
  },
  giftTitle: {
    fontSize: 13.5,
    fontWeight: '600',
    marginTop: 2,
  },
  claimBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 99,
  },
  claimBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  directoryHeader: {
    marginTop: 28,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 23,
    fontWeight: '500',
    lineHeight: 28,
  },
  directorySub: {
    marginTop: 4,
    marginBottom: 14,
    fontSize: 13.5,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  merchantsCard: {
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 16,
    overflow: 'hidden',
  },
  merchantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 12,
  },
  categoryIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  merchantInfo: {
    flex: 1,
  },
  merchantName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 3,
  },
  merchantMeta: {
    fontSize: 12.5,
    lineHeight: 16,
  },
  merchantRight: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 4,
  },
});
