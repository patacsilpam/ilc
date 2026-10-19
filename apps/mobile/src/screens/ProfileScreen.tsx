import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform,
} from 'react-native';
import { MembershipCardView } from '../components/MembershipCardView';
import { PrototypeQrCode } from '../components/PrototypeArtwork';
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
  computeMemberId,
  SERIF_FONT,
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
  const [selectedMerchant, setSelectedMerchant] = useState<{
    name: string;
    type: string;
    city: string;
  } | null>(null);
  const [showFullCardModal, setShowFullCardModal] = useState<boolean>(false);

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

      {/* Primary Membership Card section */}
      {!isRegistered ? (
        <PromoBox theme={theme} style={{ marginTop: 14 }}>
          <H3 theme={theme}>Your digital membership card lives here</H3>
          <MuteText theme={theme} style={styles.promoSub}>
            Register free to claim your digital green card, welcome gifts, and 5% discount across partner hubs.
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
            <Text style={[styles.sectionTitle, { color: t.ink }]}>My Digital Card</Text>
            <TouchableOpacity onPress={() => setShowFullCardModal(true)}>
              <Text style={[styles.expandText, { color: t.tabOnColor }]}>View QR</Text>
            </TouchableOpacity>
          </View>

          {/* Interactive green card inspired by the Grab payment card */}
          <MembershipCardView
            name={memberName}
            email={memberEmail}
            theme={theme}
            interactive
            onPress={() => setShowFullCardModal(true)}
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

      {/* Partner Merchants Section */}
      <H2 theme={theme} style={{ marginTop: 24, marginBottom: 4 }}>
        Partner merchants · 5% off with your card
      </H2>
      <MuteText theme={theme} style={{ marginBottom: 12 }}>
        Tap any merchant to present your digital membership pass.
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

      {filteredMerchants.map((m) => {
        const isSelected = selectedMerchant?.name === m.n;

        return (
          <View
            key={m.n}
            style={[
              styles.merchantRowContainer,
              { borderBottomColor: t.line },
            ]}
          >
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.merchantName, { color: t.ink }]}>{m.n}</Text>
                <MuteText theme={theme}>
                  {m.t} · {m.c}
                </MuteText>
              </View>

              <ProtoButton
                theme={theme}
                alt={!isSelected}
                label={
                  !isRegistered
                    ? 'Join'
                    : isSelected
                    ? 'Hide card'
                    : 'Show card'
                }
                onPress={() => {
                  if (!isRegistered) {
                    onOpenRegister();
                  } else {
                    if (isSelected) {
                      setSelectedMerchant(null);
                    } else {
                      setSelectedMerchant({ name: m.n, type: m.t, city: m.c });
                      onPushToast('Pass Presented', `Show your green card at ${m.n} for 5% off.`);
                    }
                  }
                }}
              />
            </View>

            {/* In-line reveal of the digital card right underneath the merchant */}
            {isRegistered && isSelected && (
              <View
                style={[
                  styles.inlineCardWrap,
                  {
                    backgroundColor: t.surf,
                    borderColor: '#00B14F',
                  },
                ]}
              >
                <View style={styles.inlineHeaderRow}>
                  <Text style={[styles.inlineMerchantTitle, { color: t.ink }]}>
                    Presenting Pass at {m.n}
                  </Text>
                  <Text style={styles.inlineDiscountBadge}>5% DISCOUNT APPLIED</Text>
                </View>

                {/* The actual vibrant green card */}
                <MembershipCardView
                  name={memberName}
                  email={memberEmail}
                  theme={theme}
                  interactive
                  onPress={() => setShowFullCardModal(true)}
                />

                <Text style={[styles.inlineInstruction, { color: t.mute }]}>
                  Present this QR code or Member ID <Text style={{ fontWeight: '700', color: t.ink }}>{memberId}</Text> to the cashier before payment.
                </Text>
              </View>
            )}
          </View>
        );
      })}

      {/* Full-screen QR / Pass Modal */}
      {showFullCardModal && (
        <Modal
          visible={showFullCardModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowFullCardModal(false)}
        >
          <View style={styles.modalBackdrop}>
            <View
              style={[
                styles.modalContent,
                { backgroundColor: t.phoneBg, borderColor: t.line },
                Platform.OS === 'web' &&
                  ({ boxShadow: '0 24px 48px rgba(0,0,0,0.6)' } as any),
              ]}
            >
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: t.ink, fontFamily: SERIF_FONT }]}>
                  Digital Membership Pass
                </Text>
                <TouchableOpacity
                  onPress={() => setShowFullCardModal(false)}
                  style={styles.modalCloseBtn}
                >
                  <Text style={[styles.modalCloseText, { color: t.ink }]}>✕</Text>
                </TouchableOpacity>
              </View>

              <MembershipCardView
                name={memberName}
                email={memberEmail}
                theme={theme}
              />

              <View style={styles.qrEnlargedCard}>
                <Text style={[styles.qrEnlargedTitle, { color: t.ink }]}>Scan at Counter</Text>
                <View style={styles.qrLargeBox}>
                  <PrototypeQrCode seed={memberEmail} />
                </View>
                <Text style={styles.qrIdText}>{memberId}</Text>
                <MuteText theme={theme} style={styles.qrInstruction}>
                  Eligible for 5% discount at all Island Living partner establishments.
                </MuteText>
              </View>

              <ProtoButton
                theme={theme}
                label="Done"
                full
                onPress={() => setShowFullCardModal(false)}
                style={{ marginTop: 16 }}
              />
            </View>
          </View>
        </Modal>
      )}
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
  merchantRowContainer: {
    borderBottomWidth: 1,
    paddingVertical: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  merchantName: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  inlineCardWrap: {
    marginTop: 14,
    borderRadius: 20,
    borderWidth: 1.5,
    padding: 14,
  },
  inlineHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  inlineMerchantTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  inlineDiscountBadge: {
    backgroundColor: '#00B14F',
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 99,
  },
  inlineInstruction: {
    fontSize: 12,
    lineHeight: 17,
    marginTop: 10,
    textAlign: 'center',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 26,
    borderWidth: 1,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  modalCloseBtn: {
    padding: 6,
  },
  modalCloseText: {
    fontSize: 18,
    fontWeight: '700',
  },
  qrEnlargedCard: {
    marginTop: 16,
    padding: 16,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  qrEnlargedTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
  },
  qrLargeBox: {
    padding: 10,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  qrIdText: {
    color: '#064E3B',
    fontSize: 16,
    fontWeight: '800',
    marginTop: 10,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  qrInstruction: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 6,
  },
});
