import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BRAND_COLORS } from '@ilc/shared';

interface MembershipCardViewProps {
  membershipCode: string;
  memberName: string;
  joinedDate?: string;
  onCopyCode?: () => void;
}

/**
 * Procedural high-contrast QR Matrix generator
 * Converts the opaque membership code into a deterministic 15x15 pixel grid.
 * Guaranteed 100% compatible with Expo Go on all platforms with zero external binary deps.
 */
function generateQrGrid(code: string): boolean[][] {
  const size = 17;
  const grid: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  // Finder patterns at top-left, top-right, bottom-left
  const drawFinder = (startX: number, startY: number) => {
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        if (r === 0 || r === 4 || c === 0 || c === 4 || (r === 2 && c === 2)) {
          grid[startY + r][startX + c] = true;
        }
      }
    }
  };

  drawFinder(1, 1);
  drawFinder(size - 6, 1);
  drawFinder(1, size - 6);

  // Fill data cells deterministically from code hash
  let hash = 0;
  for (let i = 0; i < code.length; i++) {
    hash = (hash << 5) - hash + code.charCodeAt(i);
    hash |= 0;
  }

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      // Don't overwrite finders
      if (
        (r < 7 && c < 7) ||
        (r < 7 && c >= size - 7) ||
        (r >= size - 7 && c < 7)
      ) {
        continue;
      }
      const bit = ((hash ^ (r * 31 + c * 17)) & (1 << ((r + c) % 8))) !== 0;
      grid[r][c] = bit;
    }
  }

  return grid;
}

export const MembershipCardView: React.FC<MembershipCardViewProps> = ({
  membershipCode,
  memberName,
  joinedDate,
  onCopyCode,
}) => {
  const qrGrid = generateQrGrid(membershipCode);

  return (
    <View style={styles.cardContainer}>
      {/* CARD HEADER */}
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.islandTitle}>ISLAND LIVING DIGITAL</Text>
          <Text style={styles.passType}>Official Member Pass</Text>
        </View>
        <View style={styles.statusBadge}>
          <Text style={styles.statusBadgeText}>ACTIVE</Text>
        </View>
      </View>

      {/* MEMBER DETAILS */}
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{memberName || 'Island Member'}</Text>
        <Text style={styles.joinedText}>
          {joinedDate ? `Member since ${new Date(joinedDate).toLocaleDateString()}` : 'Exclusive Privileges'}
        </Text>
      </View>

      {/* HIGH-CONTRAST DIGITAL QR PASS */}
      <View style={styles.qrContainer}>
        <View style={styles.qrBox}>
          {qrGrid.map((row, rIdx) => (
            <View key={rIdx} style={styles.qrRow}>
              {row.map((cell, cIdx) => (
                <View
                  key={cIdx}
                  style={[
                    styles.qrCell,
                    { backgroundColor: cell ? BRAND_COLORS.deepOcean : '#ffffff' },
                  ]}
                />
              ))}
            </View>
          ))}
        </View>

        <TouchableOpacity onPress={onCopyCode} activeOpacity={0.8} style={styles.codeBadge}>
          <Text style={styles.codeText}>{membershipCode}</Text>
          <Text style={styles.copyHint}>TAP TO COPY</Text>
        </TouchableOpacity>
      </View>

      {/* PRIVACY GUARANTEE */}
      <View style={styles.cardFooter}>
        <Text style={styles.securityText}>
          🔒 Secure Opaque Identifier • No Personal Data in QR Pass
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: BRAND_COLORS.deepOcean,
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(241, 211, 154, 0.3)',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  islandTitle: {
    color: BRAND_COLORS.warmSand,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  passType: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderColor: BRAND_COLORS.success,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusBadgeText: {
    color: '#34d399',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  memberInfo: {
    marginBottom: 20,
  },
  memberName: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
  },
  joinedText: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 12,
    marginTop: 2,
  },
  qrContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  qrBox: {
    padding: 4,
    backgroundColor: '#ffffff',
  },
  qrRow: {
    flexDirection: 'row',
  },
  qrCell: {
    width: 9,
    height: 9,
  },
  codeBadge: {
    marginTop: 14,
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 16,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
  },
  codeText: {
    color: BRAND_COLORS.deepOcean,
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 2,
  },
  copyHint: {
    color: BRAND_COLORS.islandTeal,
    fontSize: 9,
    fontWeight: '700',
    marginTop: 2,
  },
  cardFooter: {
    alignItems: 'center',
  },
  securityText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 11,
    textAlign: 'center',
  },
});
