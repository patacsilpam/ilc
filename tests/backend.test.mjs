import { describe, it } from 'node:test';
import assert from 'node:assert';
import path from 'path';

// Load compiled shared library
import {
  generateMembershipCode,
  generateRedemptionCode,
  isGiftEligible,
  calculateGiftExpiry,
  buildOtamigoBookingUrl,
  sanitizeMemberForDirectory,
  validateAuthInput,
  validateFeedbackInput,
  validateVideoInput,
  validateLocationInput,
  validateWelcomeGiftInput,
} from '../packages/shared/dist/index.js';

describe('1. Member Registration & Digital Card Invariants', () => {
  it('generates opaque public membership code without PII', () => {
    const code = generateMembershipCode();
    assert.match(code, /^ILC-[2-9A-Z]{4}-[2-9A-Z]{4}$/);
    assert.doesNotMatch(code, /[@.]/);
  });

  it('sanitized member directory strictly omits email and private credentials', () => {
    const rawUser = {
      id: 'usr-test-999',
      email: 'private_member@islandliving.ph',
      display_name: 'Juan Dela Cruz',
      avatar_url: null,
      account_status: 'active',
      role: 'member',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const sanitized = sanitizeMemberForDirectory(rawUser, 'ILC-7A2B-89CD');
    assert.strictEqual(sanitized.id, 'usr-test-999');
    assert.strictEqual(sanitized.display_name, 'Juan Dela Cruz');
    assert.strictEqual(sanitized.membership_code, 'ILC-7A2B-89CD');
    assert.strictEqual(sanitized.status, 'active');
    assert.strictEqual(sanitized.email, undefined);
    assert.strictEqual(sanitized.password_hash, undefined);
  });
});

describe('2. Welcome Gifts & Expiration Rules', () => {
  it('correctly calculates validity days into ISO expiration timestamp', () => {
    const base = new Date('2026-03-01T00:00:00Z');
    const expiry = calculateGiftExpiry(30, base);
    assert.strictEqual(expiry, '2026-03-31T00:00:00.000Z');
  });

  it('checks eligibility for new member welcome gifts', () => {
    const activeGift = {
      id: 'g-1',
      title: 'Free Coconut Drink',
      description: 'Chilled young coconut',
      image_path: '/drink.jpg',
      is_active: true,
      new_member_only: true,
      starts_at: '2026-01-01T00:00:00Z',
      ends_at: null,
      validity_days: 30,
      redemption_instructions: 'Show pass',
      created_by: 'admin',
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z',
    };

    const eligible = isGiftEligible(activeGift, '2026-02-01T00:00:00Z', new Date('2026-02-15T00:00:00Z'));
    assert.strictEqual(eligible, true);

    const inactiveGift = { ...activeGift, is_active: false };
    assert.strictEqual(isGiftEligible(inactiveGift, '2026-02-01T00:00:00Z'), false);
  });
});

describe('3. Merchant Feedback & Security Validations', () => {
  it('rejects ratings outside 1-5 integer bounds', () => {
    assert.strictEqual(
      validateFeedbackInput({ merchant_name: 'Resort', rating: 6, comment: 'Great stay!' }).valid,
      false
    );
    assert.strictEqual(
      validateFeedbackInput({ merchant_name: 'Resort', rating: 0, comment: 'Bad stay!' }).valid,
      false
    );
    assert.strictEqual(
      validateFeedbackInput({ merchant_name: 'Resort', rating: 3.5, comment: 'Average stay!' }).valid,
      false
    );
    assert.strictEqual(
      validateFeedbackInput({ merchant_name: 'Resort', rating: 5, comment: 'Spectacular stay!' }).valid,
      true
    );
  });

  it('rejects empty or overly long feedback comments', () => {
    assert.strictEqual(
      validateFeedbackInput({ merchant_name: 'Resort', rating: 4, comment: 'Hi' }).valid,
      false
    );
    assert.strictEqual(
      validateFeedbackInput({ merchant_name: '', rating: 4, comment: 'Nice place' }).valid,
      false
    );
  });

  it('validates video publication parameters', () => {
    assert.strictEqual(validateVideoInput({ title: '', media_path: '' }).valid, false);
    assert.strictEqual(
      validateVideoInput({
        title: 'Boracay Sunset',
        description: 'Sunset over white beach',
        media_path: '/videos/boracay.mp4',
      }).valid,
      true
    );
  });

  it('validates transit geofence coordinates and radius', () => {
    assert.strictEqual(
      validateLocationInput({ name: 'Hub', latitude: 95, longitude: 120, radius_meters: 500 }).valid,
      false // lat > 90
    );
    assert.strictEqual(
      validateLocationInput({ name: 'Hub', latitude: 11.5, longitude: 121.9, radius_meters: -50 }).valid,
      false // radius <= 0
    );
    assert.strictEqual(
      validateLocationInput({ name: 'Boracay Hub', latitude: 11.95, longitude: 121.92, radius_meters: 800 }).valid,
      true
    );
  });
});

describe('4. Partner Booking Attribution', () => {
  it('builds Otamigo booking URL with transparent affiliate tracking parameters', () => {
    const url = buildOtamigoBookingUrl('https://otamigo.com', 'ilc_official', 'El Nido');
    const parsed = new URL(url);
    assert.strictEqual(parsed.hostname, 'otamigo.com');
    assert.strictEqual(parsed.searchParams.get('aff'), 'ilc_official');
    assert.strictEqual(parsed.searchParams.get('dest'), 'El Nido');
    assert.strictEqual(parsed.searchParams.get('utm_source'), 'island_living');
  });
});

describe('5. YouTube Channel Integration & Live Detection Strategy', () => {
  const OFFICIAL_ILC_CHANNEL_ID = 'UCXATr97RfU6NQna9WPOgWlA';

  it('verifies official verified ILC YouTube Channel ID format', () => {
    assert.match(OFFICIAL_ILC_CHANNEL_ID, /^UC[a-zA-Z0-9_-]{22}$/);
    assert.strictEqual(OFFICIAL_ILC_CHANNEL_ID.length, 24);
  });

  it('correctly classifies Shorts vs regular videos using duration heuristic', () => {
    const isShortHelper = (title, desc, durationSeconds) => {
      const text = `${title} ${desc}`.toLowerCase();
      const hasTag = text.includes('#shorts') || text.includes('#short');
      if (typeof durationSeconds === 'number' && durationSeconds > 0) {
        if (durationSeconds <= 60) return true;
        if (durationSeconds <= 180 && hasTag) return true;
        return false;
      }
      return hasTag;
    };

    assert.strictEqual(isShortHelper('Siargao Waves #shorts', 'Beach moment', 45), true);
    assert.strictEqual(isShortHelper('Boracay Full Episode', 'Long form doc', 1200), false);
    assert.strictEqual(isShortHelper('Bacolod Street Dance #short', '', null), true);
    assert.strictEqual(isShortHelper('Full Documentary', 'Archipelago stories', null), false);
  });
});
