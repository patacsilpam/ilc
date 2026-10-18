import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  FieldLabel,
  H1,
  H2,
  H3,
  MuteText,
  PromoBox,
  ProtoButton,
  ProtoInput,
  ProtoSelect,
} from '../components/PrototypePrimitives';
import {
  HUBS,
  MERCHANTS,
  PROTOTYPE_THEMES,
  PrototypeFeedback,
  ThemeMode,
  computeMemberId,
} from '../constants/prototypeTheme';

interface MoreScreenProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  isRegistered: boolean;
  memberName: string;
  memberEmail: string;
  onOpenRegister: () => void;
  onSignOut: () => void;
  rating: number;
  onChangeRating: (rating: number) => void;
  hub: string;
  onChangeHub: (hub: string) => void;
  feedbackList: PrototypeFeedback[];
  onSubmitFeedback: (target: string, rating: number, comment: string) => void;
  onSimulateGeo: () => void;
  onPushToast: (title: string, msg: string) => void;
}

const RATING_OPTIONS = [
  { label: 'The ILC app', value: 'The ILC app' },
  ...MERCHANTS.map((m) => ({ label: m.n, value: m.n })),
];

const HUB_OPTIONS = Object.keys(HUBS).map((h) => ({ label: h, value: h }));

export const VodScreen: React.FC<MoreScreenProps> = ({
  theme,
  onToggleTheme,
  isRegistered,
  memberName,
  memberEmail,
  onOpenRegister,
  onSignOut,
  rating,
  onChangeRating,
  hub,
  onChangeHub,
  feedbackList,
  onSubmitFeedback,
  onSimulateGeo,
  onPushToast,
}) => {
  const t = PROTOTYPE_THEMES[theme];
  const [target, setTarget] = useState('The ILC app');
  const [comment, setComment] = useState('');

  const handleSendFeedback = () => {
    if (!rating) {
      onPushToast('Pick a rating', 'Tap a star before sending.');
      return;
    }
    onSubmitFeedback(target, rating, comment.trim() || '(no comment)');
    setComment('');
  };

  return (
    <View>
      <H1 theme={theme}>More</H1>

      {/* Member Account Section */}
      <PromoBox theme={theme} style={{ marginTop: 14, marginBottom: 4 }}>
        {isRegistered ? (
          <View style={styles.accountRow}>
            <View style={{ flex: 1 }}>
              <H3 theme={theme}>{memberName}</H3>
              <MuteText theme={theme}>
                {memberEmail} · {computeMemberId(memberEmail)}
              </MuteText>
            </View>
            <ProtoButton
              theme={theme}
              alt
              label="Sign out"
              onPress={onSignOut}
            />
          </View>
        ) : (
          <View>
            <H3 theme={theme}>Island Living Member Pass</H3>
            <MuteText theme={theme} style={{ marginTop: 4, marginBottom: 10 }}>
              Sign in or create a free account to unlock your QR card and
              welcome gift.
            </MuteText>
            <ProtoButton
              theme={theme}
              label="Create free account"
              full
              onPress={onOpenRegister}
            />
          </View>
        )}
      </PromoBox>

      {/* Rate Your Experience Section */}
      <H2 theme={theme}>Rate your experience</H2>
      <FieldLabel theme={theme}>What are you rating?</FieldLabel>
      <ProtoSelect
        theme={theme}
        options={RATING_OPTIONS}
        value={target}
        onChange={setTarget}
      />

      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map((n) => {
          const isOn = rating >= n;
          return (
            <TouchableOpacity
              key={n}
              style={styles.starBtn}
              onPress={() => onChangeRating(n)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.starText,
                  { color: isOn ? '#F2A65A' : t.line },
                ]}
              >
                ★
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ProtoInput
        theme={theme}
        value={comment}
        onChangeText={setComment}
        placeholder="Tell us what worked and what didn’t"
        multiline
        numberOfLines={3}
      />

      <ProtoButton
        theme={theme}
        label="Send feedback"
        full
        onPress={handleSendFeedback}
      />

      {feedbackList.length > 0 && (
        <View style={{ marginTop: 14 }}>
          {feedbackList.slice(0, 3).map((f, idx) => (
            <View
              key={idx}
              style={[styles.fbRow, { borderBottomColor: t.line }]}
            >
              <View style={{ flex: 1 }}>
                <Text style={[styles.fbTarget, { color: t.ink }]}>{f.w}</Text>
                <MuteText theme={theme}>{f.t}</MuteText>
              </View>
              <Text style={[styles.fbStars, { color: t.hib }]}>
                {'★'.repeat(f.r)}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Arrival Hub Perks & App Preferences */}
      <H2 theme={theme}>Arrival hub alerts</H2>
      <FieldLabel theme={theme}>Current travel gateway</FieldLabel>
      <ProtoSelect
        theme={theme}
        options={HUB_OPTIONS}
        value={hub}
        onChange={onChangeHub}
      />

      <ProtoButton
        theme={theme}
        alt
        full
        label="Check nearby partner perks"
        onPress={onSimulateGeo}
      />

      <View style={[styles.themeRow, { borderTopColor: t.line }]}>
        <View>
          <Text style={[styles.fbTarget, { color: t.ink }]}>Appearance</Text>
          <MuteText theme={theme}>
            {theme === 'dark' ? 'Dark forest theme' : 'Light island theme'}
          </MuteText>
        </View>
        <ProtoButton
          theme={theme}
          alt
          label={theme === 'dark' ? '☀ Light mode' : '☾ Dark mode'}
          onPress={onToggleTheme}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  starBtn: {
    paddingHorizontal: 2,
  },
  starText: {
    fontSize: 28,
  },
  fbRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  fbTarget: {
    fontSize: 15,
    fontWeight: '700',
  },
  fbStars: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  themeRow: {
    marginTop: 22,
    paddingTop: 16,
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
});
