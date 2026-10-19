import React from 'react';
import { View, Image, StyleSheet, Platform, ViewStyle, StyleProp } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ILC_DARK_LOGO, ILC_LIGHT_LOGO } from '../constants/logoData';
import {
  SC,
  IC,
  PrototypeTab,
  ThemeMode,
  generateQrMatrix,
} from '../constants/prototypeTheme';

const NATIVE_SCENE_PALETTES = [
  { skyTop: '#183d63', skyBottom: '#f6a04d', water: '#1e9da0', sun: '#ffe3a1', land: '#f1d9a8' },
  { skyTop: '#3a2467', skyBottom: '#ff9a62', water: '#150b24', sun: '#ffe9b8', land: '#241438' },
  { skyTop: '#4fb8ea', skyBottom: '#dff4ff', water: '#1b8fc0', sun: '#fff3b0', land: '#2f8f5b' },
  { skyTop: '#7b2d8b', skyBottom: '#ff8a5c', water: '#3a1850', sun: '#ffd36e', land: '#1c0b2b' },
  { skyTop: '#79d0f0', skyBottom: '#eaf9ff', water: '#25c9c4', sun: '#fff1a8', land: '#f5e3b5' },
  { skyTop: '#0f7ea0', skyBottom: '#031c29', water: '#031c29', sun: '#ffb347', land: '#e8575d' },
];

interface SceneBackgroundProps {
  index: number;
  style?: StyleProp<ViewStyle>;
  overlayGradient?: 'hero' | 'thumb' | 'live' | 'none';
  children?: React.ReactNode;
}

export const SceneBackground: React.FC<SceneBackgroundProps> = ({
  index,
  style,
  overlayGradient = 'none',
  children,
}) => {
  const idx = ((index % 6) + 6) % 6;

  if (Platform.OS === 'web') {
    const svgHtml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 100" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block">${SC[idx]()}</svg>`;
    const gradientBg =
      overlayGradient === 'hero'
        ? 'linear-gradient(180deg, rgba(0,0,0,0.05) 25%, rgba(4,14,18,0.88) 100%)'
        : overlayGradient === 'thumb'
        ? 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.45) 100%)'
        : 'none';

    return (
      <View style={[styles.sceneContainer, style]}>
        {React.createElement('div', {
          style: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: 'hidden',
          },
          dangerouslySetInnerHTML: { __html: svgHtml },
        })}
        {gradientBg !== 'none' &&
          React.createElement('div', {
            style: {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: gradientBg,
              pointerEvents: 'none',
            },
          })}
        <View style={styles.sceneContent}>{children}</View>
      </View>
    );
  }

  // Native iOS / Android vector scene fallback matching SC[idx]
  const p = NATIVE_SCENE_PALETTES[idx];
  return (
    <View style={[styles.sceneContainer, { backgroundColor: p.skyTop }, style]}>
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '30%',
          height: '35%',
          backgroundColor: p.skyBottom,
          opacity: 0.85,
        }}
      />
      <View
        style={{
          position: 'absolute',
          right: idx % 2 === 0 ? '22%' : '58%',
          top: '22%',
          width: 34,
          height: 34,
          borderRadius: 17,
          backgroundColor: p.sun,
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: '42%',
          backgroundColor: p.water,
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: '16%',
          backgroundColor: p.land,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 40,
        }}
      />
      {overlayGradient === 'hero' && (
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(4,14,18,0.48)',
          }}
        />
      )}
      {overlayGradient === 'thumb' && (
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: '50%',
            backgroundColor: 'rgba(0,0,0,0.35)',
          }}
        />
      )}
      <View style={styles.sceneContent}>{children}</View>
    </View>
  );
};

interface PrototypeTabIconProps {
  tab: PrototypeTab;
  color: string;
}

export const PrototypeTabIcon: React.FC<PrototypeTabIconProps> = ({ tab, color }) => {
  if (Platform.OS === 'web') {
    const svgHtml = `<svg viewBox="0 0 24 24" aria-hidden="true" style="width:22px;height:22px;fill:none;stroke:${color};stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;display:block">${IC[tab]}</svg>`;
    return React.createElement('div', {
      style: { width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' },
      dangerouslySetInnerHTML: { __html: svgHtml },
    });
  }

  const iconMap: Record<PrototypeTab, React.ComponentProps<typeof Feather>['name']> = {
    home: 'play-circle',
    live: 'radio',
    rewards: 'gift',
    travel: 'send',
    more: 'menu',
  };

  return <Feather name={iconMap[tab]} size={20} color={color} />;
};

interface PrototypeQrCodeProps {
  seed: string;
  size?: number;
}

export const PrototypeQrCode: React.FC<PrototypeQrCodeProps> = ({
  seed,
  size = 96,
}) => {
  const matrix = React.useMemo(() => generateQrMatrix(seed), [seed]);
  const boxStyle = {
    width: size,
    height: size,
    borderRadius: size > 120 ? 22 : 14,
    backgroundColor: '#FFFFFF',
    padding: size > 120 ? 14 : 6,
    flexShrink: 0,
  };

  if (Platform.OS === 'web') {
    let rects = '';
    for (let y = 0; y < 21; y++) {
      for (let x = 0; x < 21; x++) {
        if (matrix[y][x]) {
          rects += `<rect x="${x}" y="${y}" width="1" height="1"/>`;
        }
      }
    }
    const svgHtml = `<svg viewBox="-1 -1 23 23" fill="#10252B" aria-label="Member QR code" style="width:100%;height:100%;display:block">${rects}</svg>`;
    return (
      <View style={boxStyle}>
        {React.createElement('div', {
          style: { width: '100%', height: '100%' },
          dangerouslySetInnerHTML: { __html: svgHtml },
        })}
      </View>
    );
  }

  return (
    <View style={boxStyle}>
      <View style={styles.qrInner}>
        {matrix.map((row, y) => (
          <View key={y} style={styles.qrRow}>
            {row.map((on, x) => (
              <View
                key={x}
                style={[styles.qrCell, on && styles.qrCellOn]}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

interface BrandLogoProps {
  small?: boolean;
  theme?: ThemeMode;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ small = false, theme = 'dark' }) => {
  // ilc-dark.png has white lettering (for dark backgrounds)
  // ilc-light.png has dark-green lettering (for light backgrounds)
  const logoSrc = theme === 'light' ? ILC_LIGHT_LOGO : ILC_DARK_LOGO;

  if (Platform.OS === 'web') {
    return React.createElement('img', {
      src: logoSrc,
      alt: 'Island Living Channel',
      style: {
        display: 'block',
        height: small ? 28 : 40,
        width: 'auto',
        maxWidth: '100%',
        marginBottom: small ? 6 : 0,
        alignSelf: 'flex-start',
        objectFit: 'contain',
      },
    });
  }

  return (
    <View style={[styles.logoWrap, small && styles.logoWrapSmall]}>
      <Image
        source={{ uri: logoSrc }}
        style={small ? styles.logoImageSmall : styles.logoImage}
        resizeMode="contain"
      />
    </View>
  );
};

export const BrandStripe: React.FC = () => {
  if (Platform.OS === 'web') {
    return React.createElement('div', {
      style: {
        height: 4,
        borderRadius: 4,
        background: 'linear-gradient(90deg, #09651F, #79AA34 55%, #DDE747)',
        margin: '14px 0 20px',
        width: '100%',
      },
    });
  }

  return (
    <View style={styles.stripeNative}>
      <View style={{ flex: 2, backgroundColor: '#09651F' }} />
      <View style={{ flex: 2, backgroundColor: '#79AA34' }} />
      <View style={{ flex: 1.5, backgroundColor: '#DDE747' }} />
    </View>
  );
};

const styles = StyleSheet.create({
  sceneContainer: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#0B5563',
  },
  sceneContent: {
    position: 'relative',
    zIndex: 2,
    flex: 1,
  },
  qrBox: {
    width: 96,
    height: 96,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    padding: 6,
    flexShrink: 0,
  },
  qrInner: {
    flex: 1,
    padding: 2,
    justifyContent: 'space-between',
  },
  qrRow: {
    flex: 1,
    flexDirection: 'row',
  },
  qrCell: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  qrCellOn: {
    backgroundColor: '#10252B',
  },
  logoWrap: {
    alignSelf: 'flex-start',
  },
  logoWrapSmall: {
    marginBottom: 6,
  },
  logoImage: {
    width: 120,
    height: 40,
  },
  logoImageSmall: {
    width: 84,
    height: 28,
  },
  stripeNative: {
    height: 4,
    borderRadius: 4,
    overflow: 'hidden',
    flexDirection: 'row',
    marginTop: 14,
    marginBottom: 20,
  },
});

