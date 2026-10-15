# Implementation Tasks and Definition of Done

## Stage 0 — Inspect
- [ ] Inspect repository structure, package manager, current dependencies, existing app behavior, and Git status.
- [ ] Identify whether mobile/CMS/backend already exist.
- [ ] Preserve working code and summarize architecture decisions in project docs.
- [ ] Confirm current Expo SDK and compatible packages before adding dependencies.

## Stage 1 — Foundation
- [ ] Set up or adapt mobile and CMS applications.
- [ ] Establish shared types and validation.
- [ ] Configure environment validation.
- [ ] Create design tokens and reusable components.
- [ ] Add local logo asset or configurable fallback.

## Stage 2 — Backend and security
- [ ] Create migrations for all required tables.
- [ ] Add constraints, indexes, and RLS.
- [ ] Add secure first-admin provisioning instructions.
- [ ] Implement typed data-access and server-side privileged operations.
- [ ] Add seed data without production personal information.

## Stage 3 — CMS
- [ ] Authentication and protected navigation.
- [ ] Dashboard metrics and honest empty states.
- [ ] VOD upload and editorial workflow.
- [ ] Welcome-gift management.
- [ ] Notification campaign management.
- [ ] Location campaign management.
- [ ] Feedback management.
- [ ] Member directory.
- [ ] Safe integration configuration and audit trail.

## Stage 4 — Mobile
- [ ] Navigation, onboarding, authentication, profile.
- [ ] Home/editorial feed.
- [ ] Membership card and QR.
- [ ] Welcome gifts.
- [ ] VOD library, search, detail, playback.
- [ ] Live TV.
- [ ] Booking adapter.
- [ ] Notifications and preferences.
- [ ] Location permission/campaign handling.
- [ ] Feedback.

## Stage 5 — Integration
- [ ] Connect CMS and mobile to the same backend.
- [ ] Verify admin-published video appears in the app.
- [ ] Verify member gift assignment and visibility.
- [ ] Verify feedback reaches the CMS.
- [ ] Implement notification provider adapter.
- [ ] Implement YouTube and Otamigo adapters without invented API behavior.
- [ ] Instrument meaningful analytics events.

## Stage 6 — Quality
- [ ] Run type checks, lint, tests, and applicable builds.
- [ ] Fix errors introduced by implementation.
- [ ] Execute `QA_CHECKLIST.md`.
- [ ] Check mobile visual layout and CMS responsive layout.
- [ ] Document features that need real credentials or native builds.

## Definition of done
- [ ] Core member, editorial, gift, and feedback flows work end to end with configured backend.
- [ ] CMS is protected by backend authorization.
- [ ] Mobile and CMS share the same data.
- [ ] No known fake-success states or fabricated provider behavior.
- [ ] Setup instructions work from a clean environment.
- [ ] Completion report separates tested features from unverified external integrations.
