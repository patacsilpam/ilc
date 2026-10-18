import React from 'react';
import { View, Text, StyleSheet, Platform, Linking } from 'react-native';
import {
  FieldLabel,
  H1,
  H2,
  MuteText,
  ProtoButton,
  ProtoChip,
  ProtoInput,
} from '../components/PrototypePrimitives';
import {
  PROTOTYPE_THEMES,
  PrototypeTravelQuery,
  SANS_FONT,
  TRAVEL_RESULTS,
  ThemeMode,
} from '../constants/prototypeTheme';

interface TravelScreenProps {
  theme: ThemeMode;
  query: PrototypeTravelQuery;
  searched: boolean;
  onChangeQuery: (next: Partial<PrototypeTravelQuery>, resetSearch?: boolean) => void;
  onSearch: () => void;
  onPushToast: (title: string, msg: string) => void;
}

const TRAVEL_TYPES: ('Flights' | 'Ferries' | 'Stays')[] = [
  'Flights',
  'Ferries',
  'Stays',
];

export const TravelScreen: React.FC<TravelScreenProps> = ({
  theme,
  query,
  searched,
  onChangeQuery,
  onSearch,
  onPushToast,
}) => {
  const t = PROTOTYPE_THEMES[theme];
  const partnerUrl = `https://otamigo.com/search?type=${query.type.toLowerCase()}&from=${encodeURIComponent(
    query.from
  )}&to=${encodeURIComponent(query.to)}&aff=ILC-MEMBER`;

  return (
    <View>
      <H1 theme={theme}>Travel</H1>
      <MuteText theme={theme} style={styles.subtitle}>
        Book flights, ferries and stays through our partner Otamigo, without
        leaving the app.
      </MuteText>

      <View style={styles.chipsRow}>
        {TRAVEL_TYPES.map((type) => (
          <ProtoChip
            key={type}
            theme={theme}
            label={type}
            active={query.type === type}
            onPress={() => onChangeQuery({ type }, true)}
          />
        ))}
      </View>

      <FieldLabel theme={theme}>
        {query.type === 'Stays' ? 'Destination' : 'From'}
      </FieldLabel>
      <ProtoInput
        theme={theme}
        value={query.from}
        onChangeText={(v) => onChangeQuery({ from: v })}
      />

      <FieldLabel theme={theme}>
        {query.type === 'Stays' ? 'Check-in' : 'To'}
      </FieldLabel>
      <ProtoInput
        theme={theme}
        value={query.to}
        onChangeText={(v) => onChangeQuery({ to: v })}
      />

      <FieldLabel theme={theme}>Date</FieldLabel>
      {Platform.OS === 'web' ? (
        React.createElement('input', {
          type: 'date',
          value: query.date,
          onChange: (e: any) => onChangeQuery({ date: e.target.value }),
          style: {
            width: '100%',
            padding: '12px 14px',
            border: `1px solid ${t.inputBorder}`,
            borderRadius: 14,
            backgroundColor: t.inputBg,
            color: t.ink,
            fontSize: 15,
            fontFamily: SANS_FONT,
            marginTop: 4,
            marginBottom: 10,
            outline: 'none',
            boxSizing: 'border-box',
          },
        })
      ) : (
        <ProtoInput
          theme={theme}
          value={query.date}
          placeholder="YYYY-MM-DD"
          onChangeText={(v) => onChangeQuery({ date: v })}
        />
      )}

      <ProtoButton
        theme={theme}
        label="Search on Otamigo"
        full
        onPress={onSearch}
      />

      {searched && (
        <View>
          <H2 theme={theme}>Available {query.type}</H2>

          {TRAVEL_RESULTS.map(([slot, price, hours]) => (
            <View
              key={slot}
              style={[styles.row, { borderBottomColor: t.line }]}
            >
              <View style={{ flex: 1 }}>
                <Text style={[styles.rowBold, { color: t.ink }]}>
                  {query.type === 'Stays' ? 'Option' : 'Departure'} · {slot}
                </Text>
                <MuteText theme={theme}>
                  {query.from} → {query.to} ({hours})
                </MuteText>
              </View>
              <View style={styles.rightCol}>
                <Text style={[styles.rowBold, { color: t.ink }]}>{price}</Text>
                <ProtoButton
                  theme={theme}
                  alt
                  label="Book"
                  onPress={() => {
                    onPushToast(
                      'Otamigo Partner Booking',
                      `${slot} (${price}) selected with ILC member rate.`
                    );
                    Linking.openURL(partnerUrl).catch(() => {});
                  }}
                />
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  subtitle: {
    marginTop: 4,
    marginBottom: 10,
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
  rightCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rowBold: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
});
