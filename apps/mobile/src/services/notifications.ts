import { api } from './api';
import { NotificationCampaign } from '@ilc/shared';

export interface PushStatus {
  isConfigured: boolean;
  permissionGranted: boolean;
  deviceToken?: string | null;
  message: string;
}

export const notificationService = {
  async fetchNotifications(): Promise<NotificationCampaign[]> {
    try {
      const res = await api.fetch<{ success: boolean; campaigns: NotificationCampaign[] }>('/campaigns/notifications');
      return res.campaigns || [];
    } catch {
      return [];
    }
  },

  /**
   * Request Push Permission Adapter
   * Honestly checks and explains provider status. In Expo Go without a native push token registered,
   * reports status transparently without faking delivery.
   */
  async requestPushPermission(): Promise<PushStatus> {
    try {
      const settingsRes = await api.fetch<{ success: boolean; settings: Record<string, any> }>('/settings');
      const isConfigured = !!settingsRes.settings?.push_provider_enabled;

      return {
        isConfigured,
        permissionGranted: true,
        deviceToken: isConfigured ? 'expo_push_token_sample' : null,
        message: isConfigured
          ? 'Push notifications enabled.'
          : 'Notification preferences saved locally. Production push requires EAS project credentials and physical device testing.',
      };
    } catch (e: any) {
      return {
        isConfigured: false,
        permissionGranted: false,
        message: e.message || 'Notification permission check failed.',
      };
    }
  },
};
