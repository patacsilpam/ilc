# Data Model — Initial Schema

Implement real migrations and policies, not just this proposal. Adjust names to existing project conventions.

## Core tables

### `profiles`
- `id` UUID primary key referencing auth user
- `display_name`
- `avatar_url` nullable
- `created_at`, `updated_at`
- `account_status`

### `membership_cards`
- `id` UUID primary key
- `user_id` unique FK to profiles
- `public_membership_code` unique, opaque, non-sensitive
- `status`
- `created_at`

QR content must not include email, phone, address, or private database identifiers. Prefer an opaque public code or signed verification token.

### `videos`
- `id`
- `title`
- `slug`
- `description`
- `media_path` / media URL reference
- `thumbnail_path`
- `duration_seconds` nullable until known
- `status` (`draft`, `published`, `unpublished`, `archived`)
- `is_featured`
- `published_at`
- `created_by`
- `created_at`, `updated_at`

### `video_categories`, `video_tags`, and join tables
Support many-to-many tags if useful. Enforce unique names/slugs where appropriate.

### `welcome_gifts`
- `id`
- `title`, `description`, `image_path`
- `is_active`
- `new_member_only`
- `starts_at`, `ends_at`
- `validity_days` or explicit expiry rule
- `redemption_instructions`
- `created_by`
- timestamps

### `member_gifts`
- `id`
- `user_id`
- `gift_id`
- `issued_at`
- `expires_at`
- `status` (`active`, `expired`, `redeemed`, `cancelled`)
- `redeemed_at` nullable
- unique constraint or transactional rule preventing duplicate issuance for a given eligibility rule

### `notification_campaigns`
- `id`
- `title`, `message`
- `deep_link` nullable
- `status` (`draft`, `scheduled`, `queued`, `submitted`, `failed`, `cancelled`)
- `scheduled_at` nullable
- `created_by`
- timestamps

### `notification_delivery_events`
Record provider message IDs and provider-reported statuses only where the provider actually supplies them. Do not invent delivery confirmation.

### `campaign_locations`
- `id`
- `name`
- `latitude`, `longitude`
- `radius_meters`
- `is_active`
- optional campaign association
- timestamps

### `feedback`
- `id`
- `user_id`
- `merchant_name` or approved merchant reference
- `rating` constrained to 1–5
- `comment`
- `status` (`new`, `reviewed`, `resolved`)
- timestamps

### `app_settings`
Store non-secret settings only. Secret integration credentials belong in server environment/secrets storage.

### `admin_roles`
- `user_id`
- `role` (`editor`, `admin`, `super_admin`)
- granted by and timestamp
Protect writes so users cannot grant themselves roles.

### `analytics_events`
- `id`
- optional `user_id`
- `event_name`
- `event_properties` with a strict allowlist
- `occurred_at`
Avoid collecting unnecessary personal data.

### `audit_events`
- actor, action, entity type/id, timestamp, safe metadata
Use for sensitive admin actions, avoiding secrets and full personal payloads.

## Security policies
- Public users may read only published video metadata.
- Authenticated members may read/update only permitted fields on their own profile.
- Members may read their own membership card and gifts only.
- Members may insert their own feedback and cannot arbitrarily alter review status.
- Only authorized admins can create/update/publish videos, gifts, campaigns, and configuration.
- Only super admins can grant admin roles.
- Server-side functions must validate the actor's role before privileged actions.
- Storage policies must restrict uploads to authorized staff and prevent arbitrary overwrite or access.
- Every table should have an explicit access policy; do not leave sensitive tables accidentally public.
