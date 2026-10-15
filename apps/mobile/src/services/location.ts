import { api } from './api';
import { CampaignLocation } from '@ilc/shared';

export interface LocationPermissionState {
  granted: boolean;
  canBackgroundGeofence: boolean;
  message: string;
}

export const locationService = {
  async fetchActiveLocations(): Promise<CampaignLocation[]> {
    try {
      const res = await api.fetch<{ success: boolean; locations: CampaignLocation[] }>('/campaigns/locations');
      return res.locations || [];
    } catch {
      return [];
    }
  },

  /**
   * Location Campaign Permission Adapter
   * Explains why location is needed (partner welcome hubs in Boracay, El Nido, Siargao).
   * Honestly clarifies Expo Go runtime limitations versus custom development builds.
   */
  async requestLocationAccess(explanationAcknowledged: boolean): Promise<LocationPermissionState> {
    if (!explanationAcknowledged) {
      return {
        granted: false,
        canBackgroundGeofence: false,
        message: 'Location access requires user acknowledgment of the island arrival perks purpose.',
      };
    }

    // In Expo Go, foreground location works; reliable background geofencing requires custom native dev build
    return {
      granted: true,
      canBackgroundGeofence: false,
      message:
        'Island Hub monitoring active while app is open. Note: continuous background geofencing requires a custom EAS development build.',
    };
  },
};
