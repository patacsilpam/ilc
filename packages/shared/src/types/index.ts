export type UserRole = 'member' | 'editor' | 'admin' | 'super_admin';

export type AccountStatus = 'active' | 'suspended' | 'deleted';

export interface UserProfile {
  id: string;
  email: string;
  display_name: string;
  avatar_url?: string | null;
  account_status: AccountStatus;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface SanitizedMemberProfile {
  id: string;
  display_name: string;
  membership_code: string;
  status: AccountStatus;
  created_at: string;
}

export type MembershipCardStatus = 'active' | 'inactive' | 'revoked';

export interface MembershipCard {
  id: string;
  user_id: string;
  public_membership_code: string; // Opaque code (e.g., "ILC-9B8A-7C2D") - NEVER contains PII
  status: MembershipCardStatus;
  created_at: string;
}

export type VideoStatus = 'draft' | 'published' | 'unpublished' | 'archived';

export interface Video {
  id: string;
  title: string;
  slug: string;
  description: string;
  media_path: string; // URL or storage path
  thumbnail_path: string; // URL or storage path
  duration_seconds: number | null;
  status: VideoStatus;
  is_featured: boolean;
  published_at: string | null;
  created_by: string;
  categories: string[];
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface VideoCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface VideoTag {
  id: string;
  name: string;
  slug: string;
}

export interface WelcomeGift {
  id: string;
  title: string;
  description: string;
  image_path: string;
  is_active: boolean;
  new_member_only: boolean;
  starts_at: string;
  ends_at: string | null;
  validity_days: number;
  redemption_instructions: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export type MemberGiftStatus = 'active' | 'expired' | 'redeemed' | 'cancelled';

export interface MemberGift {
  id: string;
  user_id: string;
  gift_id: string;
  gift?: WelcomeGift;
  issued_at: string;
  expires_at: string;
  status: MemberGiftStatus;
  redeemed_at: string | null;
  redemption_code: string;
}

export type NotificationCampaignStatus =
  | 'draft'
  | 'scheduled'
  | 'queued'
  | 'submitted'
  | 'failed'
  | 'cancelled';

export interface NotificationCampaign {
  id: string;
  title: string;
  message: string;
  deep_link?: string | null;
  status: NotificationCampaignStatus;
  scheduled_at?: string | null;
  target_audience?: 'all' | 'new_members' | 'location_based';
  provider_message_id?: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CampaignLocation {
  id: string;
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  radius_meters: number;
  is_active: boolean;
  associated_campaign_id?: string | null;
  created_at: string;
  updated_at: string;
}

export type FeedbackStatus = 'new' | 'reviewed' | 'resolved';

export interface Feedback {
  id: string;
  user_id: string;
  user_display_name?: string;
  merchant_name: string;
  rating: number; // 1 to 5
  comment: string;
  status: FeedbackStatus;
  admin_notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface AppSetting {
  id: string;
  key: string;
  value: any;
  is_public: boolean;
  updated_at: string;
}

export interface AdminRoleRecord {
  id: string;
  user_id: string;
  role: 'editor' | 'admin' | 'super_admin';
  granted_by: string;
  granted_at: string;
}

export interface AuditEvent {
  id: string;
  actor_id: string;
  actor_email?: string;
  action: string;
  entity_type: string;
  entity_id: string;
  metadata: Record<string, any>;
  created_at: string;
}

export interface AnalyticsEvent {
  id: string;
  user_id?: string | null;
  event_name: string;
  event_properties: Record<string, any>;
  occurred_at: string;
}

export interface AuthSession {
  user: UserProfile;
  token: string;
  membership?: MembershipCard | null;
}
