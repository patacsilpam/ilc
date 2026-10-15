-- ====================================================================
-- Island Living Digital — Initial Database Schema & Security Migration
-- Client: Island Living Channel (ILC) | Technical Partner: martinsoft
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. HELPER FUNCTIONS FOR AUTHORIZATION
CREATE OR REPLACE FUNCTION public.is_admin_or_editor(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_roles
    WHERE user_id = user_uuid
      AND role IN ('editor', 'admin', 'super_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_super_admin(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_roles
    WHERE user_id = user_uuid
      AND role = 'super_admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL DEFAULT 'Island Living Member',
  avatar_url TEXT,
  account_status TEXT NOT NULL DEFAULT 'active' CHECK (account_status IN ('active', 'suspended', 'deleted')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 4. MEMBERSHIP CARDS TABLE
CREATE TABLE IF NOT EXISTS public.membership_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  public_membership_code TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'revoked')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

ALTER TABLE public.membership_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view own membership card"
  ON public.membership_cards FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR public.is_admin_or_editor(auth.uid()));

-- 5. VIDEOS TABLE
CREATE TABLE IF NOT EXISTS public.videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  media_path TEXT NOT NULL,
  thumbnail_path TEXT NOT NULL,
  duration_seconds INTEGER,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'unpublished', 'archived')),
  is_featured BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published videos"
  ON public.videos FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "Admins can view all videos"
  ON public.videos FOR SELECT
  TO authenticated
  USING (public.is_admin_or_editor(auth.uid()));

CREATE POLICY "Admins can insert videos"
  ON public.videos FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin_or_editor(auth.uid()));

CREATE POLICY "Admins can update videos"
  ON public.videos FOR UPDATE
  TO authenticated
  USING (public.is_admin_or_editor(auth.uid()))
  WITH CHECK (public.is_admin_or_editor(auth.uid()));

CREATE POLICY "Admins can delete videos"
  ON public.videos FOR DELETE
  TO authenticated
  USING (public.is_admin_or_editor(auth.uid()));

-- 6. VIDEO CATEGORIES AND TAGS
CREATE TABLE IF NOT EXISTS public.video_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT
);

ALTER TABLE public.video_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view video categories"
  ON public.video_categories FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can manage video categories"
  ON public.video_categories FOR ALL
  TO authenticated
  USING (public.is_admin_or_editor(auth.uid()));

CREATE TABLE IF NOT EXISTS public.video_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE
);

ALTER TABLE public.video_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view video tags"
  ON public.video_tags FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can manage video tags"
  ON public.video_tags FOR ALL
  TO authenticated
  USING (public.is_admin_or_editor(auth.uid()));

CREATE TABLE IF NOT EXISTS public.video_category_mappings (
  video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.video_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (video_id, category_id)
);

ALTER TABLE public.video_category_mappings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view category mappings"
  ON public.video_category_mappings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can manage category mappings"
  ON public.video_category_mappings FOR ALL
  TO authenticated
  USING (public.is_admin_or_editor(auth.uid()));

-- 7. WELCOME GIFTS TABLE
CREATE TABLE IF NOT EXISTS public.welcome_gifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_path TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  new_member_only BOOLEAN NOT NULL DEFAULT true,
  starts_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  ends_at TIMESTAMPTZ,
  validity_days INTEGER NOT NULL DEFAULT 30 CHECK (validity_days > 0),
  redemption_instructions TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

ALTER TABLE public.welcome_gifts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active welcome gifts"
  ON public.welcome_gifts FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage welcome gifts"
  ON public.welcome_gifts FOR ALL
  TO authenticated
  USING (public.is_admin_or_editor(auth.uid()));

-- 8. MEMBER GIFTS TABLE (ISSUED GIFTS)
CREATE TABLE IF NOT EXISTS public.member_gifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  gift_id UUID NOT NULL REFERENCES public.welcome_gifts(id) ON DELETE RESTRICT,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  expires_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'redeemed', 'cancelled')),
  redeemed_at TIMESTAMPTZ,
  redemption_code TEXT NOT NULL UNIQUE,
  CONSTRAINT unique_user_gift UNIQUE (user_id, gift_id)
);

ALTER TABLE public.member_gifts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view own gifts"
  ON public.member_gifts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR public.is_admin_or_editor(auth.uid()));

CREATE POLICY "Admins can update member gift status"
  ON public.member_gifts FOR UPDATE
  TO authenticated
  USING (public.is_admin_or_editor(auth.uid()));

-- 9. NOTIFICATION CAMPAIGNS
CREATE TABLE IF NOT EXISTS public.notification_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  deep_link TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'queued', 'submitted', 'failed', 'cancelled')),
  scheduled_at TIMESTAMPTZ,
  provider_message_id TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

ALTER TABLE public.notification_campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view and manage notification campaigns"
  ON public.notification_campaigns FOR ALL
  TO authenticated
  USING (public.is_admin_or_editor(auth.uid()));

CREATE TABLE IF NOT EXISTS public.notification_delivery_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.notification_campaigns(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  provider_status TEXT NOT NULL,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

ALTER TABLE public.notification_delivery_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view delivery events"
  ON public.notification_delivery_events FOR SELECT
  TO authenticated
  USING (public.is_admin_or_editor(auth.uid()));

-- 10. CAMPAIGN LOCATIONS (GEOFENCES)
CREATE TABLE IF NOT EXISTS public.campaign_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL CHECK (latitude BETWEEN -90 AND 90),
  longitude DOUBLE PRECISION NOT NULL CHECK (longitude BETWEEN -180 AND 180),
  radius_meters DOUBLE PRECISION NOT NULL CHECK (radius_meters > 0),
  is_active BOOLEAN NOT NULL DEFAULT true,
  associated_campaign_id UUID REFERENCES public.notification_campaigns(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

ALTER TABLE public.campaign_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active campaign locations"
  ON public.campaign_locations FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage campaign locations"
  ON public.campaign_locations FOR ALL
  TO authenticated
  USING (public.is_admin_or_editor(auth.uid()));

-- 11. FEEDBACK TABLE
CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  merchant_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'resolved')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view own feedback"
  ON public.feedback FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR public.is_admin_or_editor(auth.uid()));

CREATE POLICY "Members can insert own feedback"
  ON public.feedback FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id AND status = 'new');

CREATE POLICY "Admins can manage feedback"
  ON public.feedback FOR UPDATE
  TO authenticated
  USING (public.is_admin_or_editor(auth.uid()));

-- 12. APP SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.app_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_public BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view public app settings"
  ON public.app_settings FOR SELECT
  TO anon, authenticated
  USING (is_public = true);

CREATE POLICY "Admins can manage app settings"
  ON public.app_settings FOR ALL
  TO authenticated
  USING (public.is_admin_or_editor(auth.uid()));

-- 13. ADMIN ROLES TABLE
CREATE TABLE IF NOT EXISTS public.admin_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('editor', 'admin', 'super_admin')),
  granted_by UUID REFERENCES auth.users(id),
  granted_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  CONSTRAINT unique_user_role UNIQUE (user_id, role)
);

ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read their own roles"
  ON public.admin_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR public.is_admin_or_editor(auth.uid()));

CREATE POLICY "Super admins can manage admin roles"
  ON public.admin_roles FOR ALL
  TO authenticated
  USING (public.is_super_admin(auth.uid()));

-- 14. AUDIT AND ANALYTICS EVENTS
CREATE TABLE IF NOT EXISTS public.audit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID NOT NULL REFERENCES auth.users(id),
  actor_email TEXT,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit events"
  ON public.audit_events FOR SELECT
  TO authenticated
  USING (public.is_admin_or_editor(auth.uid()));

CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_name TEXT NOT NULL,
  event_properties JSONB NOT NULL DEFAULT '{}'::jsonb,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert analytics events"
  ON public.analytics_events FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view analytics events"
  ON public.analytics_events FOR SELECT
  TO authenticated
  USING (public.is_admin_or_editor(auth.uid()));

-- 15. AUTOMATION TRIGGERS FOR NEW MEMBER ONBOARDING
CREATE OR REPLACE FUNCTION public.handle_new_user_onboarding()
RETURNS TRIGGER AS $$
DECLARE
  v_membership_code TEXT;
  v_gift RECORD;
  v_redemption_code TEXT;
  v_expiry TIMESTAMPTZ;
BEGIN
  -- 1. Insert Profile
  INSERT INTO public.profiles (id, display_name, account_status)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1), 'Island Member'),
    'active'
  );

  -- 2. Generate opaque membership code (e.g. ILC-XXXX-XXXX)
  v_membership_code := 'ILC-' ||
    upper(substr(md5(random()::text || clock_timestamp()::text), 1, 4)) || '-' ||
    upper(substr(md5(random()::text || clock_timestamp()::text), 5, 4));

  INSERT INTO public.membership_cards (user_id, public_membership_code, status)
  VALUES (NEW.id, v_membership_code, 'active');

  -- 3. Check for active welcome gifts configured for new members and issue them
  FOR v_gift IN
    SELECT * FROM public.welcome_gifts
    WHERE is_active = true
      AND new_member_only = true
      AND starts_at <= now()
      AND (ends_at IS NULL OR ends_at >= now())
  LOOP
    v_redemption_code := 'GIFT-' || upper(substr(md5(random()::text || clock_timestamp()::text), 1, 6));
    v_expiry := now() + (v_gift.validity_days || ' days')::INTERVAL;

    INSERT INTO public.member_gifts (user_id, gift_id, issued_at, expires_at, status, redemption_code)
    VALUES (NEW.id, v_gift.id, now(), v_expiry, 'active', v_redemption_code)
    ON CONFLICT (user_id, gift_id) DO NOTHING;
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger execution upon Supabase Auth user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_onboarding();
