import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { MembershipCardView } from '../components/MembershipCardView';
import {
  H1,
  H2,
  H3,
  MuteText,
  PromoBox,
  ProtoButton,
  ProtoChip,
} from '../components/PrototypePrimitives';
import {
  MERCHANTS,
  PROTOTYPE_THEMES,
  PrototypeMerchant,
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
      <H1 theme={theme}>Rewards</H1>
      <MuteText theme={theme} style={styles.subtitle}>
        Exclusive perks, digital pass, and member welcome gifts.
      </MuteText>

      {!isRegistered ? (
        <PromoBox theme={theme} style={{ marginTop: 14 }}>
          <H3 theme={theme}>Your digital membership card lives here</H3>
          <MuteText theme={theme} style={styles.promoSub}>
            Register free to claim your digital green card, welcome gifts, and
            5% discount across partner hubs.
          </MuteText>
          <ProtoButton
            theme={theme}
            label="Create free account"
            full
            onPress={onOpenRegister}
          />
        </PromoBox>
      ) : (
        <View style={styles.cardSection}>
          <View style={styles.cardSectionHeader}>
            <Text style={[styles.sectionTitle, { color: t.ink }]}>
              My Digital Card
            </Text>
            <TouchableOpacity onPress={() => onOpenFullscreenQr()}>
              <Text style={[styles.expandText, { color: t.tabOnColor }]}>
                View Fullscreen QR
              </Text>
            </TouchableOpacity>
          </View>

          <MembershipCardView
            name={memberName}
            email={memberEmail}
            theme={theme}
            interactive
            onPress={() => onOpenFullscreenQr()}
          />

          <TouchableOpacity
            style={[
              styles.fullscreenQrHint,
              { borderColor: t.line, backgroundColor: t.inputBg },
            ]}
            onPress={() => onOpenFullscreenQr()}
            activeOpacity={0.8}
          >
            <Feather name="maximize-2" size={14} color={t.brand} />
            <Text style={[styles.fullscreenQrHintText, { color: t.ink }]}>
              Tap card to open Fullscreen Cashier QR
            </Text>
          </TouchableOpacity>

          <View
            style={[
              styles.giftCard,
              {
                borderColor: t.line,
                backgroundColor: t.giftBg,
              },
            ]}
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.tag, { color: t.hib }]}>Welcome Gift</Text>
              <H3 theme={theme} style={{ marginVertical: 2 }}>
                {gift.text}
              </H3>
              <MuteText theme={theme}>Expires in {gift.days} days</MuteText>
            </View>
            <ProtoButton
              theme={theme}
              label="Claim"
              onPress={() =>
                onPushToast(
                  'Gift Ready',
                  `Show this code to cashier: ${memberId}`
                )
              }
            />
          </View>
        </View>
      )}

      <H2 theme={theme} style={{ marginTop: 24, marginBottom: 4 }}>
        Partner merchants · 5% off with your card
      </H2>
      <MuteText theme={theme} style={{ marginBottom: 12 }}>
        Tap any merchant to view address, hours, and present your membership
        pass.
      </MuteText>

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

      {filteredMerchants.map((m) => (
        <TouchableOpacity
          key={m.id}
          style={[styles.row, { borderBottomColor: t.line }]}
          onPress={() => onSelectMerchant(m)}
          activeOpacity={0.75}
        >
          <View style={{ flex: 1 }}>
            <View style={styles.merchantHeaderRow}>
              <Text style={[styles.merchantName, { color: t.ink }]}>{m.n}</Text>
              <Feather name="chevron-right" size={15} color={t.mute} />
            </View>
            <MuteText theme={theme}>
              {m.t} · {m.c} · {m.hours.split('·')[1]?.trim() || m.hours}
            </MuteText>
          </View>
          <ProtoButton
            theme={theme}
            alt
            label={isRegistered ? 'Show card' : 'View'}
            onPress={() => {
              if (isRegistered) {
                onOpenFullscreenQr(m.n);
              } else {
                onSelectMerchant(m);
              }
            }}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  subtitle: {
    marginTop: 4,
  },
  promoSub: {
    marginTop: 4,
    marginBottom: 10,
  },
  cardSection: {
    marginTop: 10,
  },
  cardSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  expandText: {
    fontSize: 13,
    fontWeight: '600',
  },
  fullscreenQrHint: {
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  fullscreenQrHintText: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  giftCard: {
    marginTop: 12,
    borderRadius: 20,
    borderWidth: 1,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  tag: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  merchantHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  merchantName: {
    fontSize: 15,
    fontWeight: '700',
  },
});
