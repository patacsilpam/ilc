import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import {
  H1,
  MuteText,
  ProtoButton,
  FieldLabel,
  ProtoInput,
  ProtoSelect,
} from '../components/PrototypePrimitives';
import {
  PROTOTYPE_THEMES,
  PrototypeFeedback,
  SERIF_FONT,
  ThemeMode,
  computeMemberId,
  HUBS,
} from '../constants/prototypeTheme';

interface ProfileTabScreenProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  isRegistered: boolean;
  memberName: string;
  memberEmail: string;
  geoAlertsEnabled: boolean;
  onToggleGeoAlerts: () => void;
  announcementsEnabled: boolean;
  onToggleAnnouncements: () => void;
  onOpenRegister: () => void;
  onOpenInbox: () => void;
  onOpenOnboarding: () => void;
  onOpenFullscreenQr: () => void;
  onSignOut: () => void;
  rating?: number;
  onChangeRating?: (rating: number) => void;
  hub?: string;
  onChangeHub?: (hub: string) => void;
  onUpdateProfile?: (name: string, email: string, hub?: string) => void;
  feedbackList?: PrototypeFeedback[];
  onSubmitFeedback?: (target: string, rating: number, comment: string) => void;
  onSimulateGeo?: () => void;
  onPushToast?: (title: string, msg: string) => void;
}

type FeatherName = React.ComponentProps<typeof Feather>['name'];

/* ---------- Small building blocks ---------- */

const SectionLabel: React.FC<{ theme: ThemeMode; children: string }> = ({
  theme,
  children,
}) => (
  <Text style={[styles.sectionLabel, { color: PROTOTYPE_THEMES[theme].mute }]}>
    {children}
  </Text>
);

const Card: React.FC<{ theme: ThemeMode; children: React.ReactNode }> = ({
  theme,
  children,
}) => {
  const t = PROTOTYPE_THEMES[theme];
  return (
    <View
      style={[styles.card, { backgroundColor: t.inputBg, borderColor: t.line }]}
    >
      {children}
    </View>
  );
};

interface RowProps {
  theme: ThemeMode;
  icon: FeatherName;
  title: string;
  subtitle?: string;
  last?: boolean;
  onPress?: () => void;
  right?: React.ReactNode;
}

const Row: React.FC<RowProps> = ({
  theme,
  icon,
  title,
  subtitle,
  last,
  onPress,
  right,
}) => {
  const t = PROTOTYPE_THEMES[theme];
  const content = (
    <View
      style={[
        styles.row,
        !last && { borderBottomWidth: 1, borderBottomColor: t.line },
      ]}
    >
      <Feather name={icon} size={18} color={t.mute} style={styles.rowIcon} />
      <View style={styles.rowText}>
        <Text style={[styles.rowTitle, { color: t.ink }]}>{title}</Text>
        {subtitle ? (
          <Text style={[styles.rowSub, { color: t.mute }]}>{subtitle}</Text>
        ) : null}
      </View>
      <View style={styles.rowRight}>{right}</View>
    </View>
  );

  if (!onPress) return content;
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      {content}
    </TouchableOpacity>
  );
};

const Switch: React.FC<{ theme: ThemeMode; on: boolean }> = ({ theme, on }) => {
  const t = PROTOTYPE_THEMES[theme];
  return (
    <View
      style={[
        styles.switchTrack,
        {
          backgroundColor: on ? '#0B6A2E' : 'rgba(255,255,255,0.08)',
          borderColor: on ? '#0B6A2E' : t.line,
          alignItems: on ? 'flex-end' : 'flex-start',
        },
      ]}
    >
      <View
        style={[
          styles.switchThumb,
          { backgroundColor: on ? '#FFFFFF' : t.mute },
        ]}
      />
    </View>
  );
};

/* ---------- Screen ---------- */

export const VodScreen: React.FC<ProfileTabScreenProps> = ({
  theme,
  onToggleTheme,
  isRegistered,
  memberName,
  memberEmail,
  geoAlertsEnabled,
  onToggleGeoAlerts,
  announcementsEnabled,
  onToggleAnnouncements,
  onOpenRegister,
  onOpenInbox,
  onOpenOnboarding,
  onOpenFullscreenQr,
  onSignOut,
  hub,
  onChangeHub,
  onUpdateProfile,
}) => {
  const t = PROTOTYPE_THEMES[theme];
  const [legalDoc, setLegalDoc] = useState<'privacy' | 'terms' | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(memberName);
  const [editEmail, setEditEmail] = useState(memberEmail);
  const [editHub, setEditHub] = useState(hub || 'Bacolod-Silay Airport');

  const memberId = computeMemberId(memberEmail);
  const initials = (memberName || 'Guest')
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleOpenEditModal = () => {
    setEditName(memberName);
    setEditEmail(memberEmail);
    setEditHub(hub || 'Bacolod-Silay Airport');
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = () => {
    const trimmedName = editName.trim() || memberName;
    const trimmedEmail = editEmail.trim() || memberEmail;
    if (onUpdateProfile) {
      onUpdateProfile(trimmedName, trimmedEmail, editHub);
    } else if (onChangeHub) {
      onChangeHub(editHub);
    }
    setIsEditModalOpen(false);
  };

  return (
    <View>

      {/* 1. Identity header */}
      <View style={styles.identity}>
        <View
          style={[
            styles.avatar,
            isRegistered
              ? { backgroundColor: t.btnBg }
              : { backgroundColor: t.inputBg, borderWidth: 1, borderColor: t.line },
          ]}
        >
          {isRegistered ? (
            <Text style={[styles.avatarText, { color: '#FFFFFF' }]}>{initials}</Text>
          ) : (
            <Feather name="user" size={22} color={t.mute} />
          )}
        </View>
        <View style={styles.identityText}>
          <Text
            style={[styles.name, { color: t.ink, fontFamily: SERIF_FONT }]}
            numberOfLines={1}
          >
            {isRegistered ? memberName : 'Guest traveler'}
          </Text>
          <Text style={[styles.email, { color: t.mute }]} numberOfLines={1}>
            {isRegistered ? memberEmail : 'Not signed in'}
          </Text>
        </View>
        {isRegistered && (
          <View style={styles.idChipGroup}>
            <View style={[styles.idChip, { borderColor: t.line }]}>
              <Text style={[styles.idChipText, { color: t.mute }]}>{memberId}</Text>
            </View>
            <TouchableOpacity
              style={[
                styles.editPillBtn,
                { borderColor: t.line, backgroundColor: t.inputBg },
              ]}
              onPress={handleOpenEditModal}
              activeOpacity={0.7}
            >
              <Feather name="edit-2" size={11} color={t.ink} />
              <Text style={[styles.editPillText, { color: t.ink }]}>Edit</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {isRegistered ? (
        <ProtoButton
          theme={theme}
          label="Show member QR card"
          full
          onPress={onOpenFullscreenQr}
        />
      ) : (
        <View>
          <MuteText theme={theme} style={styles.guestCopy}>
            Sign up free to get your member QR card, a welcome gift and 5% off at
            partner cafés, restaurants and stays.
          </MuteText>
          <ProtoButton
            theme={theme}
            label="Create free account"
            full
            onPress={onOpenRegister}
          />
        </View>
      )}

      {/* 2. Account Details */}
      {isRegistered && (
        <>
          <SectionLabel theme={theme}>ACCOUNT DETAILS</SectionLabel>
          <Card theme={theme}>
            <Row
              theme={theme}
              icon="user"
              title="Full name"
              subtitle={memberName}
              onPress={handleOpenEditModal}
              right={<Feather name="edit-2" size={14} color={t.mute} />}
            />
            <Row
              theme={theme}
              icon="mail"
              title="Email address"
              subtitle={memberEmail}
              onPress={handleOpenEditModal}
              right={<Feather name="edit-2" size={14} color={t.mute} />}
            />
            <Row
              theme={theme}
              icon="map-pin"
              title="Primary arrival hub"
              subtitle={`${hub || 'Bacolod-Silay Airport'} · ${
                HUBS[hub || 'Bacolod-Silay Airport'] || 'Visayas'
              }`}
              onPress={handleOpenEditModal}
              right={<Feather name="edit-2" size={14} color={t.mute} />}
            />
            <Row
              theme={theme}
              icon="hash"
              title="Member ID"
              subtitle={`Digital Pass · ${memberId}`}
              right={
                <View
                  style={[
                    styles.badgePill,
                    { backgroundColor: 'rgba(11,106,46,0.18)', borderColor: 'rgba(11,106,46,0.4)' },
                  ]}
                >
                  <Text style={[styles.badgeText, { color: theme === 'dark' ? '#86EFAC' : '#0B6A2E' }]}>Active</Text>
                </View>
              }
            />
            <Row
              theme={theme}
              icon="award"
              title="Member benefit"
              subtitle="5% Partner Pass + Welcome Gift"
              last
              right={<Text style={[styles.value, { color: theme === 'dark' ? '#86EFAC' : '#0B6A2E' }]}>Phase 1</Text>}
            />
          </Card>
        </>
      )}

      {/* 3. Membership Perks */}
      {isRegistered && (
        <>
          <SectionLabel theme={theme}>MEMBERSHIP</SectionLabel>
          <Card theme={theme}>
            <Row
              theme={theme}
              icon="percent"
              title="Partner discount"
              subtitle="5% off at participating merchants"
              right={<Text style={[styles.value, { color: theme === 'dark' ? '#86EFAC' : '#0B6A2E' }]}>Active</Text>}
            />
            <Row
              theme={theme}
              icon="gift"
              title="Welcome gift"
              subtitle="Free coffee at a partner café"
              last
              right={<Text style={[styles.value, { color: theme === 'dark' ? '#86EFAC' : '#0B6A2E' }]}>Unlocked</Text>}
            />
          </Card>
        </>
      )}

      {/* 4. Notifications */}
      <SectionLabel theme={theme}>NOTIFICATIONS</SectionLabel>
      <Card theme={theme}>
        <Row
          theme={theme}
          icon="navigation"
          title="Geo arrival alerts"
          subtitle="Partner offers when you land"
          onPress={onToggleGeoAlerts}
          right={<Switch theme={theme} on={geoAlertsEnabled} />}
        />
        <Row
          theme={theme}
          icon="radio"
          title="Announcements"
          subtitle="New episodes and live broadcasts"
          onPress={onToggleAnnouncements}
          right={<Switch theme={theme} on={announcementsEnabled} />}
        />
        <Row
          theme={theme}
          icon="bell"
          title="Notification inbox"
          subtitle="Past alerts and announcements"
          last
          onPress={onOpenInbox}
          right={<Feather name="chevron-right" size={18} color={t.mute} />}
        />
      </Card>

      {/* 5. Preferences & Legal */}
      <SectionLabel theme={theme}>LEGAL & INFO</SectionLabel>
      <Card theme={theme}>
        <Row
          theme={theme}
          icon="compass"
          title="Welcome Tour (Airport Journey)"
          subtitle="Replay the 3-step onboarding guide"
          onPress={onOpenOnboarding}
          right={<Feather name="chevron-right" size={18} color={t.mute} />}
        />
        <Row
          theme={theme}
          icon={theme === 'dark' ? 'moon' : 'sun'}
          title="Preferences"
          subtitle={theme === 'dark' ? 'Dark forest theme' : 'Light island theme'}
          onPress={onToggleTheme}
          right={<Switch theme={theme} on={theme === 'dark'} />}
        />
        <Row
          theme={theme}
          icon="shield"
          title="Privacy Policy"
          subtitle="How we handle your account & data"
          onPress={() => setLegalDoc('privacy')}
          right={<Feather name="chevron-right" size={18} color={t.mute} />}
        />
        <Row
          theme={theme}
          icon="file-text"
          title="Terms & Conditions"
          subtitle="Member terms and partner offers"
          last
          onPress={() => setLegalDoc('terms')}
          right={<Feather name="chevron-right" size={18} color={t.mute} />}
        />
      </Card>

      {/* 6. Log out */}
      {isRegistered && (
        <TouchableOpacity
          style={[styles.logout, { borderColor: t.line }]}
          onPress={onSignOut}
          activeOpacity={0.7}
        >
          <Feather name="log-out" size={16} color={t.ink} />
          <Text style={[styles.logoutText, { color: t.ink }]}>Log out</Text>
        </TouchableOpacity>
      )}

      {/* Edit Profile Modal Sheet */}
      <Modal
        visible={isEditModalOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setIsEditModalOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: t.sheetBg, borderColor: t.line },
            ]}
          >
            <View style={styles.modalHeader}>
              <View>
                <Text
                  style={[
                    styles.modalTitle,
                    { color: t.ink, fontFamily: SERIF_FONT },
                  ]}
                >
                  Edit Profile
                </Text>
                <Text style={[styles.modalSubtitle, { color: t.mute }]}>
                  Update your member details and arrival hub
                </Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.modalCloseBtn,
                  { backgroundColor: t.inputBg, borderColor: t.line },
                ]}
                onPress={() => setIsEditModalOpen(false)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Feather name="x" size={18} color={t.ink} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalScroll}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={{ marginBottom: 14 }}>
                <FieldLabel theme={theme}>FULL NAME</FieldLabel>
                <ProtoInput
                  theme={theme}
                  value={editName}
                  onChangeText={setEditName}
                  placeholder="Juan dela Cruz"
                />
              </View>

              <View style={{ marginBottom: 14 }}>
                <FieldLabel theme={theme}>EMAIL ADDRESS</FieldLabel>
                <ProtoInput
                  theme={theme}
                  value={editEmail}
                  onChangeText={setEditEmail}
                  placeholder="juan@example.com"
                  keyboardType="email-address"
                />
              </View>

              <View style={{ marginBottom: 18 }}>
                <FieldLabel theme={theme}>PRIMARY ARRIVAL HUB</FieldLabel>
                <ProtoSelect
                  theme={theme}
                  value={editHub}
                  onChange={setEditHub}
                  options={Object.keys(HUBS).map((h) => ({
                    label: `${h} (${HUBS[h]})`,
                    value: h,
                  }))}
                />
              </View>

              <View style={styles.editBtnRow}>
                <ProtoButton
                  theme={theme}
                  label="Cancel"
                  alt
                  onPress={() => setIsEditModalOpen(false)}
                  style={{ flex: 1 }}
                />
                <ProtoButton
                  theme={theme}
                  label="Save changes"
                  onPress={handleSaveProfile}
                  style={{ flex: 1.4 }}
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Legal Document Sheet Modal */}
      <Modal
        visible={!!legalDoc}
        animationType="slide"
        transparent
        onRequestClose={() => setLegalDoc(null)}
      >
        <View style={styles.modalBackdrop}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: t.sheetBg, borderColor: t.line },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text
                style={[
                  styles.modalTitle,
                  { color: t.ink, fontFamily: SERIF_FONT },
                ]}
              >
                {legalDoc === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions'}
              </Text>
              <TouchableOpacity
                style={[
                  styles.modalCloseBtn,
                  { backgroundColor: t.inputBg, borderColor: t.line },
                ]}
                onPress={() => setLegalDoc(null)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Feather name="x" size={18} color={t.ink} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalScroll}
              showsVerticalScrollIndicator={false}
            >
              <MuteText theme={theme} style={styles.modalBody}>
                {legalDoc === 'privacy'
                  ? 'Island Living Channel (ILC) respects your privacy. We collect only your name and email address to issue your digital membership card, deliver welcome gifts, and provide optional airport/seaport arrival notifications. Your QR code encodes only your non-PII member ID (ILC-XXXXX). You may disable geo alerts or delete your account at any time in Profile & Settings.'
                  : 'By using the Island Living Channel mobile app, you agree to our Phase 1 Member Terms. Digital membership is free and entitles registered members to a welcome gift (valid within the stated expiry window) and 5% off at participating partner merchants in Bacolod, Iloilo, and Cebu upon presenting your QR card. Travel bookings are fulfilled through our partner Otamigo under their carrier and accommodation terms.'}
              </MuteText>
            </ScrollView>

            <ProtoButton
              theme={theme}
              label="Close"
              full
              onPress={() => setLegalDoc(null)}
              style={{ marginTop: 14 }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  headerSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
    marginBottom: 8,
  },
  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 14,
    marginBottom: 18,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 19,
    fontWeight: '700',
  },
  identityText: {
    flex: 1,
  },
  name: {
    fontSize: 21,
    fontWeight: '500',
  },
  email: {
    fontSize: 13.5,
    marginTop: 2,
  },
  idChipGroup: {
    alignItems: 'flex-end',
    gap: 6,
  },
  idChip: {
    borderWidth: 1,
    borderRadius: 99,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  idChipText: {
    fontSize: 11.5,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  editPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderRadius: 99,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  editPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  badgePill: {
    borderWidth: 1,
    borderRadius: 99,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  guestCopy: {
    marginBottom: 14,
    fontSize: 14,
    lineHeight: 20,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 24,
    marginBottom: 8,
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 16,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 12,
  },
  rowIcon: {
    width: 22,
  },
  rowText: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  rowSub: {
    fontSize: 12.5,
    marginTop: 2,
    lineHeight: 17,
  },
  rowRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  value: {
    fontSize: 13,
    fontWeight: '700',
  },
  switchTrack: {
    width: 44,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    padding: 2,
    justifyContent: 'center',
  },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 99,
    borderWidth: 1,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '600',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderBottomWidth: 0,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '500',
  },
  modalSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  modalCloseBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalScroll: {
    marginBottom: 10,
  },
  modalBody: {
    fontSize: 14.5,
    lineHeight: 22,
  },
  editBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
    marginBottom: 8,
  },
});
