# One-shot implementation prompt — Island Living Digital

Read `GEMINI.md` and all project specification files first. Then inspect the repository and implement the complete Phase 1 Island Living Digital product directly in the current workspace.

Build two integrated applications:
1. **Mobile app:** React Native + Expo + TypeScript, Android-first, runnable in Expo Go wherever supported.
2. **Web CMS:** responsive, authenticated editorial/admin dashboard for VOD, welcome gifts, notifications, feedback, members, and configuration.

Use Supabase for Postgres, Auth, Storage, and Row Level Security unless a suitable backend already exists. Prefer a monorepo with clear app boundaries and shared types/validation. Preserve existing code where practical.

Implement all requirements in `PRODUCT_SPEC.md`, using the design system in `DESIGN_SYSTEM.md`, architecture in `ARCHITECTURE.md`, model in `DATA_MODEL.md`, integration rules in `INTEGRATIONS.md`, and acceptance checks in `QA_CHECKLIST.md`.

Required mobile areas:
- onboarding, email authentication, Google sign-in configuration
- home/editorial feed
- digital membership card with QR code
- welcome gifts
- VOD library, detail, playback, search, categories
- YouTube Live
- Otamigo booking entry and attribution adapter
- notification inbox/preferences
- location-campaign permission and configuration handling
- merchant feedback
- profile, privacy/terms links, account deletion flow

Required CMS areas:
- protected admin login and role enforcement
- dashboard with real metrics or honest empty states
- video upload to cloud storage, metadata, thumbnail, tags, draft/publish state
- welcome gift CRUD and member-gift status
- announcement campaigns with confirmation before broadcast
- location campaign configuration
- feedback review
- searchable member directory with minimal personal data exposure
- safe integration settings and audit events

Build the database migrations, RLS policies, server-side functions, typed data access, environment examples, seed/demo data, automated tests, and documentation. Never put privileged secrets in client code.

Do not fake integrations. Where credentials or partner docs are missing, create a well-defined adapter, configuration instructions, clear UI status, and tests around the available behavior. In particular, do not invent Otamigo endpoints or claim commissions are confirmed. Treat background geofencing and production push as native/provider-dependent capabilities; support Expo Go where possible and document development-build requirements.

Use the ILC logo URL from `GEMINI.md` where assets can be retrieved. If network access is unavailable, keep the logo configurable and document how to add the asset locally. Treat the attached VMX reference as inspiration only: original ILC visual design, not a clone.

Execution order:
1. Inspect repository and report a concise plan internally, then continue.
2. Create/verify app structure and dependencies.
3. Implement database schema, migrations, and security.
4. Implement CMS workflows.
5. Implement mobile workflows.
6. Connect both apps to the same backend.
7. Add integration adapters, seed data, tests, and docs.
8. Run checks and fix issues.
9. Return a concise, evidence-based completion report.

Do not stop after a plan or scaffold. Continue until the implementation is functional or a concrete external dependency blocks further work.
