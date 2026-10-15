import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  generateMembershipCode,
  generateRedemptionCode,
  isGiftEligible,
  calculateGiftExpiry,
  buildOtamigoBookingUrl,
  sanitizeMemberForDirectory,
} from './index';
import { validateAuthInput, validateFeedbackInput, validateVideoInput } from '../validation';
import { WelcomeGift, UserProfile } from '../types';

describe('Shared Utility & Security Functions', () => {
  it('generateMembershipCode generates an opaque format without PII', () => {
    const code = generateMembershipCode();
    assert.match(code, /^ILC-[2-9A-Z]{4}-[2-9A-Z]{4}$/);
    assert.doesNotMatch(code, /[@.]/); // Strictly no email characters or PII
    const randomSuffix = code.slice(4); // e.g. "8UXA-FEGK"
    assert.doesNotMatch(randomSuffix, /[01IO]/); // Excludes ambiguous digits/letters in random segments
  });

  it('generateRedemptionCode generates a valid format', () => {
    const code = generateRedemptionCode();
    assert.match(code, /^GIFT-[2-9A-Z]{6}$/);
  });

  it('isGiftEligible honors active flag and date windows', () => {
    const gift: WelcomeGift = {
      id: 'g-1',
      title: 'Welcome Drink',
      description: 'Free fresh coconut water',
      image_path: '/gifts/drink.jpg',
      is_active: true,
      new_member_only: true,
      starts_at: '2025-01-01T00:00:00Z',
      ends_at: '2027-12-31T23:59:59Z',
      validity_days: 14,
      redemption_instructions: 'Show to bartender',
      created_by: 'admin-1',
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
    };

    // User created after campaign started
    assert.strictEqual(isGiftEligible(gift, '2025-02-01T00:00:00Z', new Date('2025-03-01T00:00:00Z')), true);

    // Inactive gift
    assert.strictEqual(isGiftEligible({ ...gift, is_active: false }, '2025-02-01T00:00:00Z'), false);

    // Old member when new_member_only is true
    assert.strictEqual(isGiftEligible(gift, '2024-12-01T00:00:00Z', new Date('2025-03-01T00:00:00Z')), false);
  });

  it('calculateGiftExpiry adds validity days correctly', () => {
    const baseDate = new Date('2026-01-10T12:00:00Z');
    const expiry = calculateGiftExpiry(7, baseDate);
    assert.strictEqual(expiry, '2026-01-17T12:00:00.000Z');
  });

  it('buildOtamigoBookingUrl constructs safe URLs with attribution', () => {
    const url = buildOtamigoBookingUrl('https://otamigo.com', 'ilc_official', 'Boracay');
    assert.ok(url.includes('aff=ilc_official'));
    assert.ok(url.includes('dest=Boracay'));
    assert.ok(url.includes('utm_source=island_living'));
  });

  it('sanitizeMemberForDirectory strips email and private fields', () => {
    const user: UserProfile = {
      id: 'u-123',
      email: 'secret_member@example.com',
      display_name: 'Maria Santos',
      avatar_url: null,
      account_status: 'active',
      role: 'member',
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z',
    };

    const sanitized = sanitizeMemberForDirectory(user, 'ILC-ABCD-1234');
    assert.strictEqual(sanitized.id, 'u-123');
    assert.strictEqual(sanitized.display_name, 'Maria Santos');
    assert.strictEqual(sanitized.membership_code, 'ILC-ABCD-1234');
    assert.strictEqual((sanitized as any).email, undefined);
  });
});

describe('Input Validation', () => {
  it('validates auth inputs', () => {
    assert.strictEqual(validateAuthInput({ email: 'invalid', password: '123' }).valid, false);
    assert.strictEqual(validateAuthInput({ email: 'user@islandliving.ph', password: 'password123' }).valid, true);
  });

  it('validates feedback inputs and rejects out-of-bounds ratings', () => {
    assert.strictEqual(validateFeedbackInput({ merchant_name: 'Bar', rating: 6, comment: 'Nice place!' }).valid, false);
    assert.strictEqual(validateFeedbackInput({ merchant_name: 'Bar', rating: 0, comment: 'Nice place!' }).valid, false);
    assert.strictEqual(validateFeedbackInput({ merchant_name: 'Bar', rating: 4, comment: 'Nice place!' }).valid, true);
  });

  it('validates video inputs', () => {
    assert.strictEqual(validateVideoInput({ title: '', description: '', media_path: '' }).valid, false);
    assert.strictEqual(
      validateVideoInput({ title: 'Siargao Surf', description: 'Surfing Cloud 9', media_path: '/videos/surf.mp4' }).valid,
      true
    );
  });
});
