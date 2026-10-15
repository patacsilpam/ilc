-- ====================================================================
-- Island Living Digital — Seed & Initial Content Data
-- Client: Island Living Channel (ILC) | Technical Partner: martinsoft
-- ====================================================================

-- 1. SEED VIDEO CATEGORIES
INSERT INTO public.video_categories (id, name, slug, description)
VALUES
  ('c1111111-1111-1111-1111-111111111111', 'Islands & Beaches', 'islands-beaches', 'Explore the world-famous coastlines and secret shores of the 7,641 Philippine islands.'),
  ('c2222222-2222-2222-2222-222222222222', 'Food & Dining', 'food-dining', 'Coastal culinary journeys, fresh seafood, and authentic regional delicacies.'),
  ('c3333333-3333-3333-3333-333333333333', 'Resorts & Stays', 'resorts-stays', 'Eco-luxury retreats, beachfront villas, and hidden boutique accommodations.'),
  ('c4444444-4444-4444-4444-444444444444', 'Culture & Festivals', 'culture-festivals', 'Vibrant local fiestas, maritime heritage, and indigenous island traditions.'),
  ('c5555555-5555-5555-5555-555555555555', 'Adventure & Diving', 'adventure-diving', 'World-class surfing, wreck diving, coral reef exploration, and mountain treks.'),
  ('c6666666-6666-6666-6666-666666666666', 'Wellness & Nature', 'wellness-nature', 'Restorative coastal wellness retreats, mangrove sanctuaries, and tidal pools.')
ON CONFLICT (name) DO NOTHING;

-- 2. SEED TAGS
INSERT INTO public.video_tags (id, name, slug)
VALUES
  ('t1111111-1111-1111-1111-111111111111', 'Palawan', 'palawan'),
  ('t2222222-2222-2222-2222-222222222222', 'Siargao', 'siargao'),
  ('t3333333-3333-3333-3333-333333333333', 'Boracay', 'boracay'),
  ('t4444444-4444-4444-4444-444444444444', 'Cebu', 'cebu'),
  ('t5555555-5555-5555-5555-555555555555', 'Batanes', 'batanes'),
  ('t6666666-6666-6666-6666-666666666666', 'Culinary', 'culinary'),
  ('t7777777-7777-7777-7777-777777777777', 'Surfing', 'surfing')
ON CONFLICT (name) DO NOTHING;

-- 3. SEED INITIAL FEATURED & PUBLISHED VIDEOS
INSERT INTO public.videos (
  id, title, slug, description, media_path, thumbnail_path, duration_seconds, status, is_featured, published_at, created_at, updated_at
) VALUES
(
  'v1111111-1111-1111-1111-111111111111',
  'El Nido: Secrets of the Bacuit Archipelago',
  'el-nido-secrets-bacuit-archipelago',
  'Glide through limestone karst cliffs, hidden lagoons, and turquoise waters in Palawan’s premier marine reserve. Experience the tranquil Big Lagoon and Secret Beach in cinematic high definition.',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?q=80&w=1200&auto=format&fit=crop',
  596,
  'published',
  true,
  timezone('utc', now() - interval '2 days'),
  timezone('utc', now() - interval '3 days'),
  timezone('utc', now() - interval '2 days')
),
(
  'v2222222-2222-2222-2222-222222222222',
  'Siargao Sunrise: Cloud 9 & Beyond',
  'siargao-sunrise-cloud-9-and-beyond',
  'Catch the world-renowned swell at Cloud 9, explore the serene coconut palm road at sunrise, and discover the tidal rock pools of Magpupungko.',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
  653,
  'published',
  true,
  timezone('utc', now() - interval '1 day'),
  timezone('utc', now() - interval '2 days'),
  timezone('utc', now() - interval '1 day')
),
(
  'v3333333-3333-3333-3333-333333333333',
  'Cebu Seafood & Heritage Trail',
  'cebu-seafood-and-heritage-trail',
  'From historic Fort San Pedro to the freshest catch in Bantayan Island, taste the authentic coastal flavors and rich culinary heritage of Cebu.',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200&auto=format&fit=crop',
  480,
  'published',
  false,
  timezone('utc', now() - interval '5 days'),
  timezone('utc', now() - interval '6 days'),
  timezone('utc', now() - interval '5 days')
),
(
  'v4444444-4444-4444-4444-444444444444',
  'Batanes: Winds of the Northern Isles',
  'batanes-winds-northern-isles',
  'Journey across the breathtaking rolling hills of Marlboro, traditional Ivatan stone houses, and the towering lighthouses of Basco.',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop',
  542,
  'published',
  false,
  timezone('utc', now() - interval '7 days'),
  timezone('utc', now() - interval '8 days'),
  timezone('utc', now() - interval '7 days')
),
(
  'v5555555-5555-5555-5555-555555555555',
  'Bohol: Beyond the Chocolate Hills (Draft)',
  'bohol-beyond-chocolate-hills-draft',
  'Editorial preview covering Panglao dive spots, the Loboc river cruise, and tarsier sanctuary conservation.',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&auto=format&fit=crop',
  360,
  'draft',
  false,
  NULL,
  timezone('utc', now() - interval '1 hour'),
  timezone('utc', now() - interval '1 hour')
)
ON CONFLICT (id) DO NOTHING;

-- Map video categories
INSERT INTO public.video_category_mappings (video_id, category_id)
VALUES
  ('v1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111'),
  ('v2222222-2222-2222-2222-222222222222', 'c5555555-5555-5555-5555-555555555555'),
  ('v3333333-3333-3333-3333-333333333333', 'c2222222-2222-2222-2222-222222222222'),
  ('v4444444-4444-4444-4444-444444444444', 'c4444444-4444-4444-4444-444444444444'),
  ('v5555555-5555-5555-5555-555555555555', 'c6666666-6666-6666-6666-666666666666')
ON CONFLICT DO NOTHING;

-- 4. SEED WELCOME GIFTS
INSERT INTO public.welcome_gifts (
  id, title, description, image_path, is_active, new_member_only, starts_at, ends_at, validity_days, redemption_instructions
) VALUES
(
  'g1111111-1111-1111-1111-111111111111',
  'Chilled Island Coconut Welcome Drink',
  'Enjoy a fresh, chilled whole young coconut upon check-in or arrival at any participating ILC partner hub across Boracay, El Nido, or Siargao.',
  'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?q=80&w=800&auto=format&fit=crop',
  true,
  true,
  timezone('utc', now() - interval '30 days'),
  timezone('utc', now() + interval '335 days'),
  30,
  'Present this digital pass and voucher QR code to the service counter at any verified ILC partner beach club or ferry lounge.'
),
(
  'g2222222-2222-2222-2222-222222222222',
  'PHP 500 Sunset Cruise Voucher',
  'Exclusive member privilege: PHP 500 discount on your sunset catamaran or bangka cruise booking through our island partner network.',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop',
  true,
  true,
  timezone('utc', now() - interval '10 days'),
  timezone('utc', now() + interval '90 days'),
  45,
  'Quote your voucher code when booking via the Otamigo concierge or present in person at the tour desk.'
)
ON CONFLICT (id) DO NOTHING;

-- 5. SEED CAMPAIGN LOCATIONS (TRANSIT HUBS & ISLAND GEOFENCES)
INSERT INTO public.campaign_locations (
  id, name, latitude, longitude, radius_meters, is_active, created_at, updated_at
) VALUES
(
  'l1111111-1111-1111-1111-111111111111',
  'Boracay Station 2 Coastal Hub',
  11.9592,
  121.9272,
  800,
  true,
  timezone('utc', now()),
  timezone('utc', now())
),
(
  'l2222222-2222-2222-2222-222222222222',
  'El Nido Town Marine Terminal',
  11.1818,
  119.3917,
  1000,
  true,
  timezone('utc', now()),
  timezone('utc', now())
),
(
  'l3333333-3333-3333-3333-333333333333',
  'Siargao General Luna Tourism Hub',
  9.7877,
  126.1558,
  1200,
  true,
  timezone('utc', now()),
  timezone('utc', now())
),
(
  'l4444444-4444-4444-4444-444444444444',
  'Mactan Cebu International Airport Lounge',
  10.3075,
  123.9794,
  500,
  true,
  timezone('utc', now()),
  timezone('utc', now())
)
ON CONFLICT (id) DO NOTHING;

-- 6. SEED APP SETTINGS
INSERT INTO public.app_settings (id, key, value, is_public, updated_at)
VALUES
  (
    's1111111-1111-1111-1111-111111111111',
    'general',
    '{"brand_name": "Island Living Channel", "logo_url": "https://www.islandlivingchannel.tv/wp-content/uploads/2022/02/ff.png", "support_email": "concierge@islandlivingchannel.tv"}'::jsonb,
    true,
    timezone('utc', now())
  ),
  (
    's2222222-2222-2222-2222-222222222222',
    'integrations',
    '{"youtube_live_stream_id": "live_stream_ilc", "youtube_channel_url": "https://www.youtube.com/@islandlivingchannel", "otamigo_booking_base_url": "https://otamigo.com", "otamigo_affiliate_id": "ilc_official", "push_provider": "expo"}'::jsonb,
    true,
    timezone('utc', now())
  )
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
