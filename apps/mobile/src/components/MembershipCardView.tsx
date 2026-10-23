import React from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { BrandLogo, PrototypeQrCode } from './PrototypeArtwork';
import { computeMemberId, SERIF_FONT, ThemeMode, PROTOTYPE_THEMES } from '../constants/prototypeTheme';

interface MembershipCardViewProps {
  name: string;
  email: string;
  theme?: ThemeMode;
  onPress?: () => void;
  interactive?: boolean;
}

/**
 * Premium Digital Member Card matching the Grab-inspired vibrant green card style.
 * Features:
 * - Crisp vibrant emerald green gradient (#00B14F / #05964B to #024724)
 * - Official ILC branding logo at top
 * - VIP Digital Membership QR code
 * - Member details with member ID & card expiration / status
 * - Tap to flip / view full QR code functionality
 */
export const MembershipCardView: React.FC<MembershipCardViewProps> = ({
  name,
  email,
  theme = 'dark',
  onPress,
  interactive = false,
}) => {
  const t = PROTOTYPE_THEMES[theme];
  const memberId = computeMemberId(email);

  const cardContent = (
    <View
      style={[
        styles.card,
        Platform.OS === 'web' &&
          ({
            backgroundImage:
              'linear-gradient(135deg, #00B14F 0%, #038038 45%, #024724 100%)',
            boxShadow:
              '0 18px 36px rgba(0, 177, 79, 0.35), 0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.3)',
          } as any),
      ]}
    >
      {/* Soft glassy decorative circles reminiscent of the reference card */}
      {Platform.OS === 'web' ? (
        <>
          {React.createElement('div', {
            style: {
              position: 'absolute',
              right: -30,
              top: -30,
              width: 160,
              height: 160,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 70%)',
              pointerEvents: 'none',
            },
          })}
          {React.createElement('div', {
            style: {
              position: 'absolute',
              left: -40,
              bottom: -40,
              width: 140,
              height: 140,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 70%)',
              pointerEvents: 'none',
            },
          })}
        </>
      ) : (
        <View style={styles.nativeOrb} />
      )}

      {/* Top Card Row: ILC Logo & Card Label */}
      <View style={styles.cardHeader}>
        <View style={styles.logoContainer}>
          <BrandLogo small theme="dark" />
        </View>
        <View style={styles.cardBadge}>
          <View style={styles.activeDot} />
          <Text style={styles.cardBadgeText}>ILC MEMBER</Text>
        </View>
      </View>

      {/* Middle Content Row: QR Code and Member Details */}
      <View style={styles.cardBody}>
        <View style={styles.qrWrapper}>
          <PrototypeQrCode seed={email || 'member@islandlivingchannel.tv'} />
          <Text style={styles.scanHint}>Scan for 5% off</Text>
        </View>

        <View style={styles.memberInfo}>
          <Text style={styles.memberLabel}>MEMBER NAME</Text>
          <Text style={[styles.memberName, { fontFamily: SERIF_FONT }]} numberOfLines={1}>
            {name || 'Juan dela Cruz'}
          </Text>

          <View style={styles.idRow}>
            <View>
              <Text style={styles.idLabel}>MEMBER ID</Text>
              <Text style={styles.idValue}>{memberId}</Text>
            </View>
            <View style={{ marginLeft: 16 }}>
              <Text style={styles.idLabel}>STATUS</Text>
              <Text style={styles.statusValue}>ACTIVE</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Card Footer: Decorative chip & subtle expiration date */}
      <View style={styles.cardFooter}>
        <View style={styles.chipRow}>
          <View style={styles.goldChip}>
            <View style={styles.goldChipInner} />
          </View>
          <Text style={styles.footerNote}>Island Living Digital Pass</Text>
        </View>
        <Text style={styles.cardExpiry}>05/28</Text>
      </View>
    </View>
  );

  if (interactive && onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.92}>
        {cardContent}
      </TouchableOpacity>
    );
  }

  return cardContent;
};

const styles = StyleSheet.create({
  card: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 22,
    padding: 20,
    backgroundColor: '#00B14F',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.28)',
    marginTop: 14,
    minHeight: 185,
    justifyContent: 'space-between',
  },
  nativeOrb: {
    position: 'absolute',
    right: -30,
    top: -30,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    zIndex: 2,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    paddingVertical: 3,
    paddingHorizontal: 9,
    borderRadius: 99,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#6EE7B7',
  },
  cardBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  cardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    zIndex: 2,
  },
  qrWrapper: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 6,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  scanHint: {
    fontSize: 9,
    fontWeight: '700',
    color: '#064E3B',
    marginTop: 4,
  },
  memberInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  memberLabel: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  memberName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 1,
    marginBottom: 8,
  },
  idRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  idLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  idValue: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginTop: 1,
  },
  statusValue: {
    color: '#A7F3D0',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.18)',
    zIndex: 2,
  },
  chipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  goldChip: {
    width: 28,
    height: 20,
    borderRadius: 4,
    backgroundColor: '#FBBF24',
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goldChipInner: {
    width: '100%',
    height: '100%',
    borderWidth: 1,
    borderColor: '#D97706',
    borderRadius: 2,
  },
  footerNote: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 11,
    fontWeight: '500',
  },
  cardExpiry: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
});
