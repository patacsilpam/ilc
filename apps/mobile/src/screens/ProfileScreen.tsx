import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
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
  ThemeMode,
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
  onPushToast,
}) => {
  const t = PROTOTYPE_THEMES[theme];
  const filteredMerchants = MERCHANTS.filter(
    (m) => city === 'All' || m.c === city
  );

  return (
    <View>
      <H1 theme={theme}>Rewards</H1>

      {!isRegistered ? (
        <PromoBox theme={theme} style={{ marginTop: 16 }}>
          <H3 theme={theme}>Your digital membership card lives here</H3>
          <MuteText theme={theme} style={styles.promoSub}>
            Register free to get your card, a welcome gift, and 5% off at partner
            merchants.
          </MuteText>
          <ProtoButton
            theme={theme}
            label="Create free account"
            full
            onPress={onOpenRegister}
          />
        </PromoBox>
      ) : (
        <>
          <MembershipCardView
            name={memberName}
            email={memberEmail}
            theme={theme}
          />
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
              <Text style={[styles.tag, { color: t.hib }]}>Welcome gift</Text>
              <H3 theme={theme} style={{ marginVertical: 2 }}>
                {gift.text}
              </H3>
              <MuteText theme={theme}>Expires in {gift.days} days</MuteText>
            </View>
            <ProtoButton
              theme={theme}
              label="Use"
              onPress={() =>
                onPushToast(
                  'Gift ready',
                  `Show this at the counter: ${gift.text}.`
                )
              }
            />
          </View>
        </>
      )}

      <H2 theme={theme}>Partner merchants · 5% off with your card</H2>
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
        <View
          key={m.n}
          style={[styles.row, { borderBottomColor: t.line }]}
        >
          <View style={{ flex: 1 }}>
            <Text style={[styles.merchantName, { color: t.ink }]}>{m.n}</Text>
            <MuteText theme={theme}>
              {m.t} · {m.c}
            </MuteText>
          </View>
          <ProtoButton
            theme={theme}
            alt
            label={isRegistered ? 'Show card' : 'Join'}
            onPress={() => {
              if (isRegistered) {
                onPushToast('Show your card', `5% off at ${m.n}.`);
              } else {
                onOpenRegister();
              }
            }}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  promoSub: {
    marginTop: 4,
    marginBottom: 10,
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
  merchantName: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
});
