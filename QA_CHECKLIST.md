# QA and Acceptance Checklist

## Setup and developer experience
- [ ] Fresh install instructions work.
- [ ] `.env.example` contains placeholders only.
- [ ] Missing environment values produce clear configuration guidance.
- [ ] Database migrations apply cleanly.
- [ ] Seed/demo data is clearly identified as non-production.
- [ ] Type checks and lint checks pass.
- [ ] Automated tests pass.

## Mobile
- [ ] App starts without a fatal error.
- [ ] Navigation and safe areas work on small Android screens.
- [ ] Authentication loading/error/success flows work.
- [ ] Registration creates one profile and membership card.
- [ ] Password reset and sign-out are handled.
- [ ] Member can only access their own private data.
- [ ] QR code contains no personal information.
- [ ] Gift assignment is idempotent and expiry is shown correctly.
- [ ] VOD filters/search and detail views work.
- [ ] Playback handles invalid or unavailable media.
- [ ] Live TV handles live, offline, and embed-restricted streams.
- [ ] Booking fallback works when Otamigo configuration is absent.
- [ ] Attribution behavior is tested against partner documentation.
- [ ] Notification permission denial is handled.
- [ ] No false claim of background geofencing in Expo Go.
- [ ] Feedback validates rating and comment and shows submission status.
- [ ] Profile, privacy, terms, and account deletion entry points are present.

## CMS
- [ ] Unauthenticated users cannot access protected CMS data or actions.
- [ ] Role enforcement exists on the server/backend.
- [ ] Unauthorized users cannot grant themselves admin roles.
- [ ] Video upload shows progress, validates files, and handles failures.
- [ ] Admin can save draft, preview, publish, unpublish, and edit metadata.
- [ ] Published videos appear in mobile VOD.
- [ ] Gift create/edit/activate/deactivate flows work.
- [ ] Duplicate gift issuance is prevented.
- [ ] Notification broadcasts require confirmation.
- [ ] Provider failures are visible.
- [ ] Statuses do not overstate delivery.
- [ ] Location coordinates and radii are validated.
- [ ] Feedback can be filtered and reviewed by authorized staff.
- [ ] Member search does not expose unnecessary private data.
- [ ] Sensitive admin actions are logged where appropriate.

## Security
- [ ] Every sensitive table has explicit RLS policies.
- [ ] Service-role key is absent from client bundles and Git.
- [ ] Users cannot read other users' private records.
- [ ] Users cannot edit their role or gift status directly.
- [ ] Upload authorization is scoped.
- [ ] Inputs are validated server-side.
- [ ] Error messages do not leak secrets.
- [ ] Logs omit tokens and unnecessary personal data.

## Visual QA
- [ ] ILC logo loads or graceful local fallback appears.
- [ ] VMX reference is not copied literally.
- [ ] Typography and spacing are consistent.
- [ ] No broken image assets or overflow.
- [ ] Empty/loading/error states are visually intentional.
- [ ] CMS works on desktop and narrow screens.
- [ ] Mobile tap targets and contrast are adequate.

## External verification
- [ ] Google OAuth configured and tested.
- [ ] Push tested on a physical device with provider credentials.
- [ ] Background geofencing tested in a suitable development build.
- [ ] YouTube stream embed tested.
- [ ] Otamigo integration verified using official documentation and credentials.
- [ ] Production build tested independently of Expo Go.
- [ ] Store listing/legal/compliance requirements supplied by ILC.
