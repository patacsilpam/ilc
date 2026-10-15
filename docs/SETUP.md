# Setup and Operational Guide — Island Living Digital

Client: **Island Living Channel (ILC)**  
Technical Partner: **martinsoft**

This monorepo contains the integrated digital ecosystem for Island Living Channel:
- **`packages/shared`** — TypeScript models, validation schemas, brand tokens, and security utilities.
- **`apps/cms`** — Next.js responsive editorial dashboard and unified API backend.
- **`apps/mobile`** — Expo React Native mobile application for Android and iOS (Expo Go compatible).
- **`supabase/migrations`** — PostgreSQL database schema, automated onboarding triggers, and Row Level Security (RLS) policies.
- **`tests`** — Shared library tests, backend invariant tests, and full end-to-end integration tests.

---

## 1. System Requirements

- **Node.js**: v18.0.0 or higher (tested on Node v20.19.0)
- **npm**: v9.0.0 or higher
- **Expo Go App**: installed on an Android device or emulator for mobile testing

---

## 2. Quickstart Installation

From the repository root:

```bash
# 1. Build shared package
npm run --prefix packages/shared build

# 2. Build CMS web application and API
npm run --prefix apps/cms build
```

---

## 3. Running the CMS Web Dashboard

The CMS is an authenticated editorial and operations platform. It also serves the live API for the mobile application.

```bash
npm run dev:cms
```

- **URL**: `http://localhost:3000`
- **Initial Staff Account**:
  - **Email**: `admin@islandlivingchannel.tv`
  - **Password**: `admin123`
  - **Role**: `super_admin`
- **Pre-seeded Member Account**:
  - **Email**: `member@islandlivingchannel.tv`
  - **Password**: `member123`
  - **Role**: `member`
  - **Membership Code**: `ILC-7B9A-24E8`

### Key CMS Capabilities
1. **Overview Dashboard**: Live counters for published videos, drafts, active welcome gifts, transit geofences, and member feedback.
2. **VOD Library**: Upload MP4 videos directly to storage, edit titles/slugs/tags, preview in HTML5 player, and toggle publish status. Videos published here appear immediately in the mobile app.
3. **Welcome Gifts**: Configure new member perks with validity periods and redemption instructions. Inspect live redemption status of issued member vouchers.
4. **Island Announcements**: Compose push notifications with confirmation dialog before provider broadcast.
5. **Transit Geofences**: Configure coordinate perimeters for Boracay, El Nido, Siargao, and Cebu transit hubs.
6. **Merchant Feedback**: Review ratings and comments submitted by members; mark as reviewed or resolved with admin notes.
7. **Member Directory**: Privacy-preserving directory displaying member display names and opaque membership codes (emails and passwords strictly omitted).
8. **Settings & Audit Trail**: Configure YouTube live streams, Otamigo booking URLs, and view detailed audit logs.

---

## 4. Running the Mobile App (Expo Go)

```bash
npm run dev:mobile
```

- Press `a` in the terminal to open the Android emulator.
- Or scan the terminal QR code using the **Expo Go** app on your physical Android/iOS device.

### Connecting Mobile to CMS Backend
- **Android Emulator**: Uses `http://10.0.2.2:3000/api` (automatically configured).
- **iOS Simulator / Web**: Uses `http://localhost:3000/api`.
- **Physical Phone on Wi-Fi**: Set `EXPO_PUBLIC_API_URL="http://<YOUR_LAN_IP>:3000/api"` in `.env`.

---

## 5. Running Automated Tests

Run the full automated test suite covering shared invariants, input validations, security boundaries, and live HTTP API flows:

```bash
# Run shared package unit tests
npm run --prefix packages/shared test

# Run backend security invariant and schema tests
node --test tests/backend.test.mjs

# Run live end-to-end integration tests (spawns CMS server, tests upload, publish, member pass, and feedback)
node --test tests/e2e-api.test.mjs
```

---

## 6. Supabase Production Database Deployment

The application runs locally out of the box with zero setup using an atomic JSON database store. To deploy to Supabase:

1. Create a Supabase project at [supabase.com](https://supabase.com).
2. In the Supabase SQL Editor, run `supabase/migrations/20240101000000_initial_schema.sql`.
3. In the SQL Editor, run `supabase/seed.sql` to populate initial categories, videos, gifts, and locations.
4. Set `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in your production environment.
