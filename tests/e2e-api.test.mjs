import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { spawn } from 'child_process';
import path from 'path';

const PORT = 3005;
const BASE_URL = `http://127.0.0.1:${PORT}/api`;

describe('End-to-End Mobile & CMS Integrated API Tests', () => {
  let serverProcess = null;
  let adminToken = '';
  let memberToken = '';
  let createdVideoId = '';
  let createdFeedbackId = '';

  before(async () => {
    // Start Next.js server with Node binary
    console.log(`Starting CMS server on port ${PORT}...`);
    const nextBin = path.resolve(process.cwd(), 'apps/cms/node_modules/next/dist/bin/next');
    serverProcess = spawn(process.execPath, [nextBin, 'start', '-p', String(PORT)], {
      cwd: path.resolve(process.cwd(), 'apps/cms'),
      env: { ...process.env, PORT: String(PORT) },
    });

    serverProcess.stdout?.on('data', (d) => {
      // console.log('[Server stdout]', d.toString());
    });
    serverProcess.stderr?.on('data', (d) => {
      // console.error('[Server stderr]', d.toString());
    });

    // Wait for server ready
    let attempts = 0;
    while (attempts < 30) {
      try {
        const res = await fetch(`${BASE_URL}/settings`);
        if (res.ok) {
          console.log('CMS Server ready on port', PORT);
          return;
        }
      } catch {
        // waiting
      }
      await new Promise((r) => setTimeout(r, 1000));
      attempts++;
    }
    throw new Error('CMS Server failed to start within 30 seconds');
  });

  after(() => {
    if (serverProcess) {
      serverProcess.kill();
    }
  });

  it('1. Public settings returns brand and partner links', async () => {
    const res = await fetch(`${BASE_URL}/settings`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.settings.youtube_live_stream_id);
    assert.ok(data.settings.otamigo_booking_base_url);
  });

  it('2. Admin logs in with credentials and receives token', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@islandlivingchannel.tv', password: 'admin123' }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.user.role, 'super_admin');
    assert.ok(data.token);
    adminToken = data.token;
  });

  it('3. New traveller registers, receives opaque membership pass and welcome gift', async () => {
    const email = `tourist_${Date.now()}@islandliving.ph`;
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password: 'password123',
        display_name: 'Isla Explorer',
      }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.user.role, 'member');
    assert.ok(data.token);
    memberToken = data.token;

    // Check membership card
    assert.ok(data.membership);
    assert.match(data.membership.public_membership_code, /^ILC-[2-9A-Z]{4}-[2-9A-Z]{4}$/);
  });

  it('4. Member can view their auto-issued welcome gifts', async () => {
    const res = await fetch(`${BASE_URL}/member-gifts`, {
      headers: { Authorization: `Bearer ${memberToken}` },
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(Array.isArray(data.member_gifts));
    assert.ok(data.member_gifts.length >= 1);
    assert.strictEqual(data.member_gifts[0].status, 'active');
  });

  it('5. Admin uploads and publishes video; video immediately appears in mobile VOD feed', async () => {
    // Admin posts video
    const postRes = await fetch(`${BASE_URL}/videos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        title: 'Coron: Hidden Twin Lagoons 4K',
        description: 'Explore the freshwater and saltwater thermal thermoclines of Coron Island.',
        media_path: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        thumbnail_path: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?q=80&w=1200',
        status: 'published',
        categories: ['Islands & Beaches'],
        tags: ['Coron', 'Palawan', 'Lagoons'],
      }),
    });
    assert.strictEqual(postRes.status, 201);
    const postData = await postRes.json();
    createdVideoId = postData.video.id;
    assert.strictEqual(postData.video.status, 'published');

    // Public/Mobile fetches VOD feed
    const vodRes = await fetch(`${BASE_URL}/videos`);
    assert.strictEqual(vodRes.status, 200);
    const vodData = await vodRes.json();
    const found = vodData.videos.find((v) => v.id === createdVideoId);
    assert.ok(found, 'Newly published video must appear in the public/mobile feed');
    assert.strictEqual(found.title, 'Coron: Hidden Twin Lagoons 4K');
  });

  it('6. Admin unpublishes video; video immediately disappears from public/mobile feed', async () => {
    const putRes = await fetch(`${BASE_URL}/videos/${createdVideoId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ status: 'unpublished' }),
    });
    assert.strictEqual(putRes.status, 200);

    // Public feed should no longer contain it
    const vodRes = await fetch(`${BASE_URL}/videos`);
    const vodData = await vodRes.json();
    const found = vodData.videos.find((v) => v.id === createdVideoId);
    assert.strictEqual(found, undefined, 'Unpublished video must not appear in the mobile feed');
  });

  it('7. Member submits merchant feedback and admin reviews it', async () => {
    // Member submits feedback
    const fbRes = await fetch(`${BASE_URL}/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${memberToken}`,
      },
      body: JSON.stringify({
        merchant_name: 'Apo Reef Island Divers',
        rating: 5,
        comment: 'Pristine corals and exceptional dive guides!',
      }),
    });
    assert.strictEqual(fbRes.status, 201);
    const fbData = await fbRes.json();
    createdFeedbackId = fbData.feedback.id;
    assert.strictEqual(fbData.feedback.status, 'new');

    // Admin reviews feedback
    const reviewRes = await fetch(`${BASE_URL}/feedback/${createdFeedbackId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        status: 'reviewed',
        admin_notes: 'Partner verified with local marine reservation desk.',
      }),
    });
    assert.strictEqual(reviewRes.status, 200);
    const reviewData = await reviewRes.json();
    assert.strictEqual(reviewData.feedback.status, 'reviewed');
    assert.strictEqual(reviewData.feedback.admin_notes, 'Partner verified with local marine reservation desk.');
  });

  it('8. Sanitized member directory strictly protects member email and private fields', async () => {
    const memRes = await fetch(`${BASE_URL}/members`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(memRes.status, 200);
    const memData = await memRes.json();
    assert.ok(Array.isArray(memData.members));
    assert.ok(memData.members.length >= 1);

    for (const member of memData.members) {
      assert.ok(member.id);
      assert.ok(member.display_name);
      assert.ok(member.membership_code);
      assert.strictEqual(member.email, undefined, 'Email must NOT be exposed in member directory');
      assert.strictEqual(member.password_hash, undefined);
    }
  });

  it('9. Unauthorized member cannot access admin endpoints', async () => {
    const badRes = await fetch(`${BASE_URL}/campaigns/notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${memberToken}`,
      },
      body: JSON.stringify({ title: 'Hack', message: 'Fake message' }),
    });
    assert.strictEqual(badRes.status, 403, 'Regular member must receive 403 Forbidden for admin operations');
  });
});
