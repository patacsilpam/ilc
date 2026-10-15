# Integrations & Native Capabilities Status — Island Living Digital

Client: **Island Living Channel (ILC)**  
Technical Partner: **martinsoft**

This document establishes the exact operational status of all third-party integrations and native capabilities in Island Living Digital, distinguishing verified functional implementations from external dependencies.

---

## 1. Verified & Operational End-to-End

| Capability | Implementation Mechanism | Verification Status |
| :--- | :--- | :--- |
| **VOD Upload & Streaming** | Scoped direct upload API (`/api/upload`) with MIME & size validation | **TESTED & WORKING**: Admin uploads MP4/thumbnail, publishes, immediately streams in mobile player. |
| **Digital Membership Card** | Procedural 17x17 QR matrix rendering opaque public code (`ILC-XXXX-XXXX`) | **TESTED & WORKING**: High contrast, zero PII, works 100% in Expo Go and web. |
| **Welcome Gifts Issuance** | Idempotent transactional rule issuing vouchers upon new member registration | **TESTED & WORKING**: Validates date windows, computes expiry dates, prevents duplicate issuance. |
| **Merchant Feedback** | Mobile rating (1–5 stars) & comments submission to CMS moderation queue | **TESTED & WORKING**: Validated inputs, status transitions (`new` → `reviewed` → `resolved`). |
| **Member Privacy Directory** | Server-side sanitized projection (`SanitizedMemberProfile`) | **TESTED & WORKING**: Excludes emails, passwords, and database IDs from admin view. |
| **YouTube Live Streaming** | Dedicated Live TV screen with broadcast player and program guide | **TESTED & WORKING**: Configurable stream ID, live status pill, YouTube app fallback launcher. |
| **Otamigo Travel Gateway** | Typed booking adapter with safe query parameters (`?aff=...`) | **TESTED & WORKING**: Initiates destination links without fabricating non-existent API endpoints. |
| **Database Migrations** | Full PostgreSQL schema with RLS and automated signup triggers | **TESTED & WORKING**: Comprehensive Supabase migration in `supabase/migrations/`. |

---

## 2. Capabilities Requiring External Credentials or Native EAS Builds

### A. Google OAuth Sign-In
- **Current Behavior**: Email/password registration and persistent JWT sessions work seamlessly. The Google Sign-In button provides a clear diagnostic modal explaining configuration steps.
- **Requirement to Activate**:
  1. Create an OAuth 2.0 Client ID in the Google Cloud Console for Android (SHA-1 fingerprint) and iOS.
  2. Configure `scheme` and `iosClientId` / `androidClientId` in `app.json`.
  3. Test on a physical device or standalone EAS build.

### B. Continuous Background Geofencing
- **Current Behavior**: In Expo Go, location permissions can be requested and verified in the foreground. Arrival perks and transit hubs (Boracay Station 2, El Nido Town Dock, Siargao Cloud 9) are active while the app is running.
- **Requirement to Activate**:
  - Expo Go does not support reliable background location services (`expo-location` background tasks).
  - To enable continuous background geofencing when the app is suspended, an EAS Development Build (`eas build --profile development`) must be generated with background location entitlements.

### C. Production Push Notification Delivery
- **Current Behavior**: Admin drafts announcements in the CMS, sees a simulated phone preview, and confirms the broadcast with a two-step dialog. Delivery status is honestly recorded.
- **Requirement to Activate**:
  1. Link project with an EAS Account (`npx eas project:init`).
  2. Configure Apple Push Notification Service (APNs) keys and Firebase Cloud Messaging (FCM) credentials in Expo dashboard.
  3. Verify push token generation on a physical device (push notifications do not work on Android emulators without Google Play Services).

### D. Otamigo Booking API & Webhooks
- **Current Behavior**: Configurable partner booking URL with affiliate attribution parameters (`aff=ilc_official`) and booking initiation analytics tracking.
- **Requirement to Activate**:
  - Requires official partner API documentation, production webhook specifications, and merchant credentials from Otamigo before automated commission and booking sync can be added.
