import { api } from './api';
import { WelcomeGift, MemberGift } from '@ilc/shared';

export const giftService = {
  async fetchWelcomeGifts(): Promise<WelcomeGift[]> {
    try {
      const res = await api.fetch<{ success: boolean; gifts: WelcomeGift[] }>('/gifts');
      return res.gifts || [];
    } catch {
      return [];
    }
  },

  async fetchMyMemberGifts(): Promise<Array<MemberGift & { gift?: WelcomeGift }>> {
    try {
      const res = await api.fetch<{ success: boolean; member_gifts: Array<MemberGift & { gift?: WelcomeGift }> }>(
        '/member-gifts'
      );
      return res.member_gifts || [];
    } catch {
      return [];
    }
  },

  async redeemGift(memberGiftId: string): Promise<MemberGift> {
    const res = await api.fetch<{ success: boolean; member_gift: MemberGift }>('/member-gifts', {
      method: 'POST',
      body: JSON.stringify({ member_gift_id: memberGiftId }),
    });
    return res.member_gift;
  },
};
