import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { BrandLogo, PrototypeQrCode } from './PrototypeArtwork';
import { computeMemberId, SERIF_FONT, ThemeMode } from '../constants/prototypeTheme';

interface MembershipCardViewProps {
  name: string;
  email: string;
  theme?: ThemeMode;
}

export const MembershipCardView: React.FC<MembershipCardViewProps> = ({
  name,
  email,
  theme = 'dark',
}) => {
  const memberId = computeMemberId(email);

  return (
    <View
      style={[
        styles.card,
        Platform.OS === 'web' &&
          ({
            backgroundImage: 'linear-gradient(135deg, #0B6A2E, #04521B 50%, #06240F)',
            boxShadow:
              '0 22px 44px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.12)',
          } as any),
      ]}
    >
      {/* Ambient radial glow matching .card::after */}
      {Platform.OS === 'web' ? (
        React.createElement('div', {
          style: {
            position: 'absolute',
            right: -40,
            top: -50,
            width: 150,
            height: 150,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(243,230,0,0.5), transparent 68%)',
            pointerEvents: 'none',
          },
        })
      ) : (
        <View style={styles.glowOrbNative} />
      )}

      <View style={styles.cardInner}>
        <PrototypeQrCode seed={email} />
        <View style={styles.memberDetails}>
          <BrandLogo small theme="dark" />
          <Text style={styles.roleLabel}>Digital Member</Text>
          <Text style={[styles.memberName, { fontFamily: SERIF_FONT }]}>
            {name || 'Juan dela Cruz'}
          </Text>
          <Text style={styles.memberIdText}>{memberId}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 24,
    padding: 22,
    backgroundColor: '#063B1A',
    borderWidth: 1,
    borderColor: 'rgba(201,220,63,0.55)',
    marginTop: 14,
  },
  glowOrbNative: {
    position: 'absolute',
    right: -35,
    top: -45,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(243,230,0,0.22)',
  },
  cardInner: {
    position: 'relative',
    zIndex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  memberDetails: {
    flex: 1,
  },
  roleLabel: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
  },
  memberName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
    marginVertical: 2,
  },
  memberIdText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
  },
});
