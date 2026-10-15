# Product Specification — Island Living Digital

## 1. Product goal
Convert ILC's broadcast and transit-hub audience into an owned digital community through membership, lifestyle video, live events, travel booking, welcome gifts, and feedback.

## 2. Phase 1 scope

### Mobile application
- Free email registration/login and Google sign-in integration.
- Persistent sessions, password reset, sign-out, profile.
- Unique membership identifier and QR membership card.
- Welcome gifts assigned by server-side eligibility and expiry rules.
- VOD feed, category/tag filtering, search, details, and playback.
- Live TV screen using legitimate YouTube embedding/player support.
- Otamigo booking entry point with configurable URL and affiliate identifier.
- Announcement notification inbox/preferences.
- Location-campaign permission and location configuration support.
- Star ratings and written merchant feedback.
- Privacy, terms, and account deletion entry points.

### Web CMS
- Secure admin authentication and authorization.
- Overview dashboard with real data only.
- VOD upload, thumbnail, metadata, categories/tags, drafts, publish/unpublish.
- Welcome gift campaign management and issued-gift status.
- Notification campaign draft, preview, confirm, send/schedule where provider supports it, and status reporting.
- Named location/radius campaign configuration.
- Feedback list, filtering, detail, and review status.
- Member directory with restricted personal information.
- Safe integration settings for public/configurable values.
- Audit trail for sensitive administrative actions where appropriate.

## 3. User roles
- **Member:** manages own profile and preferences, views public/published content, views own membership and gifts, submits feedback.
- **Admin/editor:** manages editorial content and assigned operational functions.
- **Super admin:** provisions admin roles and controls sensitive configuration.
Use least privilege. If the implementation uses a simpler role model initially, document it and enforce all privileged actions on the server.

## 4. Main user journeys
1. New user registers → profile and membership identifier created → eligible welcome gift assigned exactly once → user lands on home.
2. Member opens membership card → QR code displays opaque identifier/token → no private data embedded in QR.
3. Admin uploads MP4 → upload progress → metadata saved → draft preview → publish → video appears in mobile app.
4. Member selects a VOD item → detail screen → playback → analytics events recorded where available.
5. Admin configures a gift → eligibility and expiration rules saved → new eligible member receives gift → gift status is visible in app and CMS.
6. Admin drafts an announcement → preview → confirmation → provider submission → status shown accurately.
7. Member submits rating/comment → confirmation → authorized admin sees feedback.
8. Member taps travel booking → configured Otamigo destination opens → attribution parameters retained where supported.
9. Member opens Live TV → configured stream loads → unavailable/embed-restricted fallback shown if necessary.

## 5. UX requirements
- Mobile-first, clear hierarchy, accessible tap targets, readable typography.
- Consistent empty/loading/error states.
- Do not require location permission before the value is explained.
- Avoid forcing users into login to browse public VOD unless the business explicitly requires it.
- Confirm destructive actions and notification broadcasts.
- Display meaningful errors and allow retry.
- Respect reduced-motion preferences where feasible.

## 6. Excluded from Phase 1
- Full LGU/merchant partner portals.
- Tiered loyalty-points marketplace.
- Sponsor ad network, sponsored placements, and advertiser reporting.
- Custom broadcast simulcasting/encoding infrastructure.
- Guaranteed offline downloads unless separately designed and approved.
- Booking/payment processing owned by ILC.
- Physical gift fulfillment.

## 7. Business and operational boundaries
- ILC is the data controller and must approve privacy policy, terms, and retention practices.
- martinsoft implements the technical product and secure data-processing mechanisms.
- ILC owns its developer accounts, database, storage, and corporate infrastructure.
- ILC handles physical gift fulfillment, merchant disputes, and booking/payment/refund relationships with Otamigo.
- External outages and API changes may require investigation or separately scoped changes.
- One-year bug warranty and retainer terms belong in the commercial agreement, not hardcoded product behavior.

## 8. Acceptance criteria
See `QA_CHECKLIST.md`. Do not mark external integrations complete without configuration and verification.
