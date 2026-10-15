import { SanitizedMemberProfile, UserProfile, WelcomeGift } from '../types';

/**
 * Generates an opaque, non-sensitive public membership code.
 * Format: ILC-XXXX-XXXX (e.g. ILC-8F4A-91K2)
 * Strictly contains NO personally identifiable information (no email, phone, name, or raw DB IDs).
 */
export function generateMembershipCode(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // Exclude ambiguous chars like 0, O, 1, I
  const part1 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  const part2 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `ILC-${part1}-${part2}`;
}

/**
 * Generates an opaque gift redemption voucher code.
 */
export function generateRedemptionCode(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  const part = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `GIFT-${part}`;
}

/**
 * Evaluates whether a member is eligible for a welcome gift.
 */
export function isGiftEligible(gift: WelcomeGift, memberCreatedAt: string, now = new Date()): boolean {
  if (!gift.is_active) return false;

  const nowTime = now.getTime();
  const startTime = new Date(gift.starts_at).getTime();
  if (nowTime < startTime) return false;

  if (gift.ends_at) {
    const endTime = new Date(gift.ends_at).getTime();
    if (nowTime > endTime) return false;
  }

  // If new_member_only is true, member must have registered after the campaign started
  if (gift.new_member_only) {
    const memberTime = new Date(memberCreatedAt).getTime();
    if (memberTime < startTime) return false;
  }

  return true;
}

/**
 * Calculates ISO expiration timestamp for a gift based on validity days.
 */
export function calculateGiftExpiry(validityDays: number, fromDate = new Date()): string {
  const expiry = new Date(fromDate);
  expiry.setDate(expiry.getDate() + validityDays);
  return expiry.toISOString();
}

/**
 * Builds Otamigo booking URL with partner attribution parameters.
 * Does not fabricate API response or claim booking completion.
 */
export function buildOtamigoBookingUrl(
  baseUrl = 'https://otamigo.com',
  affiliateId = 'ilc_official',
  destination?: string
): string {
  try {
    const url = new URL(baseUrl);
    if (affiliateId) {
      url.searchParams.set('aff', affiliateId);
      url.searchParams.set('utm_source', 'island_living');
      url.searchParams.set('utm_medium', 'app');
    }
    if (destination) {
      url.searchParams.set('dest', destination);
    }
    return url.toString();
  } catch {
    return `${baseUrl}?aff=${encodeURIComponent(affiliateId)}`;
  }
}

/**
 * Sanitizes member information for the CMS member directory.
 * Explicitly excludes email, phone numbers, and private credentials.
 */
export function sanitizeMemberForDirectory(user: UserProfile, membershipCode: string): SanitizedMemberProfile {
  return {
    id: user.id,
    display_name: user.display_name || 'Island Member',
    membership_code: membershipCode || 'UNASSIGNED',
    status: user.account_status,
    created_at: user.created_at,
  };
}
