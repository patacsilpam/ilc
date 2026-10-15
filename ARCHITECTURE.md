# Technical Architecture — Island Living Digital

## 1. Recommended structure
Prefer a monorepo, adapting to the current repository if one already exists:

- `apps/mobile` — Expo React Native TypeScript app.
- `apps/cms` — Next.js TypeScript web dashboard.
- `packages/shared` — shared types, validation schemas, constants, and business rules where practical.
- `supabase/migrations` — database schema and RLS migrations.
- `supabase/functions` — privileged operations and provider adapters, if appropriate.
- `docs` — setup, integration, and operational documentation.

Avoid forcing a monorepo if the existing repository has a simpler working structure.

## 2. Backend
Default to Supabase:
- PostgreSQL for relational data.
- Supabase Auth for member and admin authentication.
- Supabase Storage for video assets and thumbnails.
- Row Level Security for member data and privileged writes.
- Edge Functions or a trusted server layer for privileged actions and third-party integrations.

Keep service-role credentials server-side only. Browser/mobile clients use publishable/anon credentials with RLS.

## 3. Media delivery
- Store video metadata in Postgres.
- Store MP4s and thumbnails in object storage.
- Upload directly to storage using authenticated, scoped upload authorization.
- Use CDN-compatible URLs and suitable caching.
- Avoid proxying large media files through app server memory.
- Configure maximum file size, MIME/extension validation, and cleanup of orphaned uploads.
- If private media is needed, use signed URLs and expiry.

## 4. Authentication and authorization
- Authentication is not authorization.
- Every privileged CMS mutation must be checked server-side.
- Member queries must be scoped to the authenticated user.
- Admin roles must not be user-editable from client profile forms.
- Provision the first admin through a documented, secure process.
- Use least privilege and audit sensitive operations.

## 5. Mobile service boundaries
Create service modules for:
- Auth
- Member profile and membership
- Gifts
- VOD
- Live TV
- Booking
- Notifications
- Location campaigns
- Feedback
- Analytics

Use typed interfaces and isolate provider-specific implementations. Components should not contain secrets or large amounts of business logic.

## 6. Offline and error behavior
Cache non-sensitive public metadata when useful. Show stale content transparently where appropriate. Never silently treat a failed mutation as success. Make retry behavior safe for operations such as gift issuance and feedback submission.

## 7. Observability
Record useful server-side errors and relevant audit events without logging credentials, tokens, full sensitive payloads, or unnecessary personal information. Expose understandable UI errors and provide diagnostic context in development.

## 8. Environment configuration
Provide `.env.example` with placeholders. Validate required configuration at startup and show a helpful configuration error rather than crashing obscurely. Keep local `.env` files out of version control.

## 9. Deployment
- Mobile development: Expo Go where supported.
- Native capability validation: custom Expo development build when required.
- Android distribution: EAS Build and Play Console configuration.
- CMS: deploy to a supported hosting platform with environment variables configured.
- Backend: ILC-owned Supabase or approved equivalent.
- Keep all production accounts under ILC ownership with martinsoft as authorized technical administrator.
