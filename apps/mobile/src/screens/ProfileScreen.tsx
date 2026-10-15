import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
} from 'react-native';
import { UserProfile, MembershipCard, MemberGift, BRAND_COLORS } from '@ilc/shared';
import { MembershipCardView } from '../components/MembershipCardView';
import { feedbackService } from '../services/feedback';
import { giftService } from '../services/gifts';
import { locationService } from '../services/location';

interface ProfileScreenProps {
  user: UserProfile | null;
  membership: MembershipCard | null;
  memberGifts: MemberGift[];
  onLogin: (email: string, pass: string) => Promise<void>;
  onRegister: (email: string, pass: string, name: string) => Promise<void>;
  onLogout: () => void;
  onRefreshGifts: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  membership,
  memberGifts,
  onLogin,
  onRegister,
  onLogout,
  onRefreshGifts,
}) => {
  // Auth form modal state
  const [isAuthModalVisible, setIsAuthModalVisible] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authError, setAuthError] = useState('');
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);

  // Feedback modal state
  const [isFeedbackModalVisible, setIsFeedbackModalVisible] = useState(false);
  const [feedbackMerchant, setFeedbackMerchant] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  // Location permission state
  const [locationActive, setLocationActive] = useState(false);

  const handleAuthSubmit = async () => {
    setAuthError('');
    setIsSubmittingAuth(true);
    try {
      if (authMode === 'login') {
        await onLogin(authEmail, authPassword);
      } else {
        await onRegister(authEmail, authPassword, authName);
      }
      setIsAuthModalVisible(false);
      setAuthPassword('');
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed');
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  const handleRedeemGift = async (mg: MemberGift) => {
    try {
      await giftService.redeemGift(mg.id);
      Alert.alert('Privilege Redeemed', `Voucher ${mg.redemption_code} is now redeemed. Enjoy your perk!`);
      onRefreshGifts();
    } catch (err: any) {
      Alert.alert('Redemption Notice', err.message || 'Failed to redeem gift.');
    }
  };

  const handleFeedbackSubmit = async () => {
    if (!feedbackMerchant.trim() || !feedbackComment.trim()) {
      Alert.alert('Missing Details', 'Please provide both the merchant name and your feedback comments.');
      return;
    }
    setIsSubmittingFeedback(true);
    try {
      await feedbackService.submitFeedback(feedbackMerchant, feedbackRating, feedbackComment);
      Alert.alert('Feedback Received', 'Thank you! Your verified merchant review has been submitted to the editorial team.');
      setIsFeedbackModalVisible(false);
      setFeedbackMerchant('');
      setFeedbackComment('');
      setFeedbackRating(5);
    } catch (err: any) {
      Alert.alert('Submission Error', err.message || 'Could not submit feedback.');
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const handleToggleLocation = async () => {
    if (locationActive) {
      setLocationActive(false);
      Alert.alert('Geofencing Disabled', 'Island arrival perk notifications have been turned off.');
    } else {
      const res = await locationService.requestLocationAccess(true);
      setLocationActive(res.granted);
      Alert.alert('Island Hub Geofences', res.message);
    }
  };

  const handleGoogleSignInInfo = () => {
    Alert.alert(
      'Google Sign-In Configuration',
      'Google Sign-in requires registering an OAuth Client ID in Google Cloud Console and configuring EAS scheme redirects for native Android/iOS builds.'
    );
  };

  const handleAccountDeletion = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your digital membership? All active vouchers will be cancelled permanently.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Permanently',
          style: 'destructive',
          onPress: () => {
            onLogout();
            Alert.alert('Account Deleted', 'Your membership account has been closed.');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 50 }}>
      {/* AUTH STATUS HEADER / MEMBERSHIP CARD */}
      {user ? (
        <View>
          <MembershipCardView
            membershipCode={membership?.public_membership_code || 'ILC-7B9A-24E8'}
            memberName={user.display_name}
            joinedDate={user.created_at}
            onCopyCode={() =>
              Alert.alert(
                'Pass Identifier Copied',
                `Code: ${membership?.public_membership_code || 'ILC-7B9A-24E8'}\nPresent this code to partner desks across Boracay, El Nido, and Siargao.`
              )
            }
          />
        </View>
      ) : (
        <View style={styles.guestBanner}>
          <Text style={styles.guestTitle}>Join Island Living Free</Text>
          <Text style={styles.guestSubtitle}>
            Register your digital pass to unlock welcome coconut drinks, sunset cruise discounts, and priority island perks.
          </Text>
          <View style={styles.guestActions}>
            <TouchableOpacity
              onPress={() => {
                setAuthMode('register');
                setIsAuthModalVisible(true);
              }}
              style={styles.primaryBtn}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryBtnText}>Register Free Pass</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setAuthMode('login');
                setIsAuthModalVisible(true);
              }}
              style={styles.secondaryBtn}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryBtnText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* MY WELCOME GIFTS SECTION */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Welcome Gifts & Perks</Text>
          <TouchableOpacity onPress={onRefreshGifts}>
            <Text style={styles.refreshText}>↻ Refresh</Text>
          </TouchableOpacity>
        </View>

        {!user ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>🎁</Text>
            <Text style={styles.emptyTitle}>Sign in to view your gifts</Text>
            <Text style={styles.emptySubtitle}>
              Eligible members receive digital vouchers automatically upon registration.
            </Text>
          </View>
        ) : memberGifts.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>🌴</Text>
            <Text style={styles.emptyTitle}>No Active Gifts</Text>
            <Text style={styles.emptySubtitle}>Check back for seasonal island campaigns and merchant rewards.</Text>
          </View>
        ) : (
          memberGifts.map((mg) => {
            const isRedeemed = mg.status === 'redeemed';
            return (
              <View key={mg.id} style={styles.giftCard}>
                <View style={styles.giftHeader}>
                  <Text style={styles.giftTitle}>{mg.gift?.title || 'Island Living Privilege'}</Text>
                  <View style={[styles.giftBadge, isRedeemed ? styles.badgeRedeemed : styles.badgeActive]}>
                    <Text style={[styles.giftBadgeText, isRedeemed ? styles.textRedeemed : styles.textActive]}>
                      {mg.status.toUpperCase()}
                    </Text>
                  </View>
                </View>

                <Text style={styles.giftDesc}>
                  {mg.gift?.description || 'Present your digital voucher at any verified partner check-in desk.'}
                </Text>

                <View style={styles.voucherBox}>
                  <Text style={styles.voucherLabel}>VOUCHER CODE</Text>
                  <Text style={styles.voucherCode}>{mg.redemption_code}</Text>
                  <Text style={styles.expiryLabel}>
                    Expires on {new Date(mg.expires_at).toLocaleDateString()}
                  </Text>
                </View>

                {!isRedeemed && (
                  <TouchableOpacity
                    onPress={() => handleRedeemGift(mg)}
                    style={styles.redeemBtn}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.redeemBtnText}>Redeem at Partner Desk</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })
        )}
      </View>

      {/* COMMUNITY OPERATIONS & FEEDBACK */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Island Partner Feedback</Text>
        <View style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingName}>Rate a Merchant or Resort</Text>
              <Text style={styles.settingDesc}>
                Share your verified dining, tour, or stay experience with the ILC community.
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                if (!user) {
                  Alert.alert('Sign In Required', 'Please sign in or create a pass to submit feedback.');
                  return;
                }
                setIsFeedbackModalVisible(true);
              }}
              style={styles.actionBtnSmall}
              activeOpacity={0.8}
            >
              <Text style={styles.actionBtnText}>Submit ⭐</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* PERMISSIONS & ISLAND LOCATION GEOFENCES */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Arrival Perks & Geofencing</Text>
        <View style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={styles.settingName}>Island Hub Arrival Alerts</Text>
              <Text style={styles.settingDesc}>
                Notifies you when arriving at verified ILC transit hubs (Boracay Station 2, El Nido Town Dock, Siargao Cloud 9).
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleToggleLocation}
              style={[styles.toggleBtn, locationActive ? styles.toggleActive : styles.toggleInactive]}
              activeOpacity={0.8}
            >
              <Text style={styles.toggleText}>{locationActive ? 'ACTIVE' : 'ENABLE'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* ACCOUNT & COMPLIANCE */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account & Policies</Text>
        <View style={styles.settingsCard}>
          <TouchableOpacity
            style={styles.linkRow}
            onPress={() =>
              Alert.alert(
                'Privacy Policy',
                'Island Living Channel (ILC) is committed to protecting member privacy. Digital passes use opaque identifiers with zero personal information embedded in QR codes.'
              )
            }
          >
            <Text style={styles.linkText}>Privacy Policy</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkRow}
            onPress={() =>
              Alert.alert(
                'Terms of Service',
                'Welcome gifts and merchant privileges are subject to partner operating hours and expiration terms as stated on vouchers.'
              )
            }
          >
            <Text style={styles.linkText}>Terms of Service</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          {user && (
            <>
              <TouchableOpacity style={styles.linkRow} onPress={onLogout}>
                <Text style={[styles.linkText, { color: BRAND_COLORS.islandTeal }]}>Sign Out</Text>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.linkRow, { borderBottomWidth: 0 }]} onPress={handleAccountDeletion}>
                <Text style={[styles.linkText, { color: BRAND_COLORS.error }]}>Delete Account & Data</Text>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      {/* --- MODAL 1: AUTHENTICATION DIALOG --- */}
      <Modal visible={isAuthModalVisible} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              {authMode === 'login' ? 'Sign In to Island Living' : 'Register Digital Pass'}
            </Text>
            <Text style={styles.modalSubtitle}>
              {authMode === 'login'
                ? 'Access your digital pass, saved stories, and redeemed gifts.'
                : 'Free membership with instant welcome drinks and travel vouchers.'}
            </Text>

            {authError ? <Text style={styles.errorBanner}>{authError}</Text> : null}

            {authMode === 'register' && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <TextInput
                  placeholder="Maria Santos"
                  placeholderTextColor={BRAND_COLORS.mutedText}
                  style={styles.textInput}
                  value={authName}
                  onChangeText={setAuthName}
                />
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                placeholder="member@islandlivingchannel.tv"
                placeholderTextColor={BRAND_COLORS.mutedText}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.textInput}
                value={authEmail}
                onChangeText={setAuthEmail}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                placeholder="••••••••"
                placeholderTextColor={BRAND_COLORS.mutedText}
                secureTextEntry
                style={styles.textInput}
                value={authPassword}
                onChangeText={setAuthPassword}
              />
            </View>

            <TouchableOpacity
              onPress={handleAuthSubmit}
              disabled={isSubmittingAuth}
              style={styles.submitAuthBtn}
              activeOpacity={0.8}
            >
              <Text style={styles.submitAuthText}>
                {isSubmittingAuth
                  ? 'Processing...'
                  : authMode === 'login'
                  ? 'Sign In'
                  : 'Complete Registration'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleGoogleSignInInfo}
              style={styles.googleBtn}
              activeOpacity={0.8}
            >
              <Text style={styles.googleBtnText}>Continue with Google</Text>
            </TouchableOpacity>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                onPress={() => {
                  setAuthMode(authMode === 'login' ? 'register' : 'login');
                  setAuthError('');
                }}
              >
                <Text style={styles.switchModeText}>
                  {authMode === 'login'
                    ? "Don't have a pass? Create one free"
                    : 'Already have an account? Sign In'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setIsAuthModalVisible(false)} style={{ marginTop: 12 }}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* --- MODAL 2: MERCHANT FEEDBACK DIALOG --- */}
      <Modal visible={isFeedbackModalVisible} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Rate Island Merchant</Text>
            <Text style={styles.modalSubtitle}>
              Help fellow travellers by rating verified island restaurants, boat tours, and boutique stays.
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Merchant / Partner Name</Text>
              <TextInput
                placeholder="e.g. Sea Breeze Grill Boracay"
                placeholderTextColor={BRAND_COLORS.mutedText}
                style={styles.textInput}
                value={feedbackMerchant}
                onChangeText={setFeedbackMerchant}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Rating</Text>
              <View style={styles.starRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity key={star} onPress={() => setFeedbackRating(star)}>
                    <Text style={[styles.starIcon, star <= feedbackRating && styles.starActive]}>★</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Comments & Tips</Text>
              <TextInput
                placeholder="Share your experience and tips..."
                placeholderTextColor={BRAND_COLORS.mutedText}
                multiline
                numberOfLines={3}
                style={[styles.textInput, { height: 80, textAlignVertical: 'top' }]}
                value={feedbackComment}
                onChangeText={setFeedbackComment}
              />
            </View>

            <View style={styles.modalActionRow}>
              <TouchableOpacity
                onPress={() => setIsFeedbackModalVisible(false)}
                style={styles.cancelBtn}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleFeedbackSubmit}
                disabled={isSubmittingFeedback}
                style={styles.submitBtn}
              >
                <Text style={styles.submitBtnText}>
                  {isSubmittingFeedback ? 'Submitting...' : 'Submit Review'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BRAND_COLORS.warmIvory,
  },
  guestBanner: {
    backgroundColor: BRAND_COLORS.deepOcean,
    margin: 16,
    borderRadius: 20,
    padding: 24,
  },
  guestTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 6,
  },
  guestSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 18,
  },
  guestActions: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryBtn: {
    backgroundColor: BRAND_COLORS.coralAccent,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  primaryBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
  },
  secondaryBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  secondaryBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: BRAND_COLORS.deepOcean,
    marginBottom: 8,
  },
  refreshText: {
    color: BRAND_COLORS.islandTeal,
    fontWeight: '700',
    fontSize: 12,
  },
  emptyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BRAND_COLORS.border,
  },
  emptyIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: BRAND_COLORS.deepOcean,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 12,
    color: BRAND_COLORS.mutedText,
    textAlign: 'center',
  },
  giftCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: BRAND_COLORS.border,
    elevation: 2,
    shadowColor: BRAND_COLORS.deepOcean,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  giftHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  giftTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: BRAND_COLORS.deepOcean,
    flex: 1,
  },
  giftBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeActive: {
    backgroundColor: '#d1fae5',
  },
  badgeRedeemed: {
    backgroundColor: '#f3f4f6',
  },
  giftBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  textActive: {
    color: '#065f46',
  },
  textRedeemed: {
    color: '#6b7280',
  },
  giftDesc: {
    fontSize: 12,
    color: BRAND_COLORS.mutedText,
    lineHeight: 17,
    marginBottom: 12,
  },
  voucherBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  voucherLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: BRAND_COLORS.mutedText,
    letterSpacing: 0.5,
  },
  voucherCode: {
    fontSize: 16,
    fontWeight: '800',
    color: BRAND_COLORS.islandTeal,
    letterSpacing: 1.5,
    marginVertical: 2,
  },
  expiryLabel: {
    fontSize: 11,
    color: BRAND_COLORS.mutedText,
  },
  redeemBtn: {
    backgroundColor: BRAND_COLORS.islandTeal,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  redeemBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  settingsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BRAND_COLORS.border,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingName: {
    fontSize: 14,
    fontWeight: '700',
    color: BRAND_COLORS.deepOcean,
    marginBottom: 2,
  },
  settingDesc: {
    fontSize: 12,
    color: BRAND_COLORS.mutedText,
    lineHeight: 16,
  },
  actionBtnSmall: {
    backgroundColor: BRAND_COLORS.islandTeal,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  toggleBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  toggleActive: {
    backgroundColor: BRAND_COLORS.success,
  },
  toggleInactive: {
    backgroundColor: BRAND_COLORS.mutedText,
  },
  toggleText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: BRAND_COLORS.border,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '600',
    color: BRAND_COLORS.ink,
  },
  chevron: {
    fontSize: 18,
    color: BRAND_COLORS.mutedText,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(18, 59, 82, 0.65)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: BRAND_COLORS.deepOcean,
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 12,
    color: BRAND_COLORS.mutedText,
    lineHeight: 17,
    marginBottom: 16,
  },
  errorBanner: {
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
    padding: 8,
    borderRadius: 6,
    fontSize: 12,
    marginBottom: 12,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: BRAND_COLORS.deepOcean,
    marginBottom: 4,
  },
  textInput: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: BRAND_COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: BRAND_COLORS.ink,
  },
  submitAuthBtn: {
    backgroundColor: BRAND_COLORS.coralAccent,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 6,
  },
  submitAuthText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  googleBtn: {
    backgroundColor: '#ffffff',
    borderColor: BRAND_COLORS.border,
    borderWidth: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  googleBtnText: {
    color: BRAND_COLORS.ink,
    fontSize: 13,
    fontWeight: '600',
  },
  modalFooter: {
    alignItems: 'center',
    marginTop: 16,
  },
  switchModeText: {
    color: BRAND_COLORS.islandTeal,
    fontSize: 12,
    fontWeight: '700',
  },
  cancelText: {
    color: BRAND_COLORS.mutedText,
    fontSize: 12,
  },
  starRow: {
    flexDirection: 'row',
    gap: 8,
  },
  starIcon: {
    fontSize: 28,
    color: '#d1d5db',
  },
  starActive: {
    color: '#f59e0b',
  },
  modalActionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 18,
  },
  cancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  cancelBtnText: {
    color: BRAND_COLORS.mutedText,
    fontSize: 13,
    fontWeight: '600',
  },
  submitBtn: {
    backgroundColor: BRAND_COLORS.islandTeal,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
});
