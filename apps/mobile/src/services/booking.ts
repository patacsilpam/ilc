import { Linking } from 'react-native';
import { buildOtamigoBookingUrl } from '@ilc/shared';
import { api } from './api';

export interface BookingPartnerConfig {
  baseUrl: string;
  affiliateId: string;
}

export const bookingService = {
  async getPartnerConfig(): Promise<BookingPartnerConfig> {
    try {
      const res = await api.fetch<{ success: boolean; settings: Record<string, any> }>('/settings');
      return {
        baseUrl: res.settings?.otamigo_booking_base_url || 'https://otamigo.com',
        affiliateId: res.settings?.otamigo_affiliate_id || 'ilc_official',
      };
    } catch {
      return {
        baseUrl: 'https://otamigo.com',
        affiliateId: 'ilc_official',
      };
    }
  },

  async openBookingGateway(destination?: string): Promise<{ success: boolean; url: string }> {
    const config = await this.getPartnerConfig();
    const url = buildOtamigoBookingUrl(config.baseUrl, config.affiliateId, destination);

    // Track analytics event for booking initiation
    try {
      await api.fetch('/analytics', {
        method: 'POST',
        body: JSON.stringify({
          event_name: 'booking_initiated',
          event_properties: {
            destination: destination || 'all',
            partner: 'otamigo',
            affiliate_id: config.affiliateId,
          },
        }),
      });
    } catch {
      // Non-blocking
    }

    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
      return { success: true, url };
    } else {
      throw new Error(`Unable to launch booking URL: ${url}`);
    }
  },
};
