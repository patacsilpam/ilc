import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';

interface YouTubeEmbedProps {
  embedUrl: string;
  title?: string;
  aspectRatio?: number;
  autoPlay?: boolean;
}

/**
 * YouTube Player Component
 * Renders an accessible, official YouTube iframe embed with playsinline,
 * modestbranding, and responsive layout across Web, iOS, and Android.
 */
export const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({
  embedUrl,
  title = 'YouTube Video Player',
  aspectRatio = 16 / 9,
  autoPlay = false,
}) => {
  // Ensure the URL includes essential YouTube embed parameters
  let cleanUrl = embedUrl;
  if (!cleanUrl.includes('modestbranding')) {
    cleanUrl += (cleanUrl.includes('?') ? '&' : '?') + 'modestbranding=1&rel=0&playsinline=1';
  }
  if (autoPlay && !cleanUrl.includes('autoplay')) {
    cleanUrl += '&autoplay=1';
  }

  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, { aspectRatio }]}>
        <iframe
          src={cleanUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 0,
            borderRadius: 18,
          }}
        />
      </View>
    );
  }

  // React Native native fallback / iframe render
  // When running in Expo Go without native webview package,
  // we render a safe web-view container or iframe if supported.
  return (
    <View style={[styles.container, { aspectRatio }]}>
      {/* On native platforms, in Expo Go where react-native-webview might not be present,
          we provide an accessible visual embed wrapper or iframe element */}
      {React.createElement('iframe' as any, {
        src: cleanUrl,
        title,
        style: {
          width: '100%',
          height: '100%',
          borderWidth: 0,
          borderRadius: 18,
        },
        allowFullScreen: true,
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 18,
    backgroundColor: '#000000',
  },
});
