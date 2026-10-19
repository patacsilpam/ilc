# Integration Notes and External Dependencies

## Expo Go and native capabilities
Use Expo-compatible dependencies and verify their current SDK compatibility. The app should run in Expo Go for core UI, navigation, standard API calls, and supported playback/auth flows.

Some capabilities may require a custom development build:
- Certain background location/geofencing APIs
- Some push notification setups and native notification extensions
- Custom native modules or configuration plugins
- Production-specific OAuth redirect behavior

Document exact limitations after inspecting the actual installed Expo SDK. Do not guess package compatibility. Keep native-dependent behavior behind service interfaces and display an honest fallback state.

## Authentication
- Email/password: configure Supabase Auth or existing provider.
- Google sign-in: requires provider configuration, OAuth client IDs, redirect URLs, and testing on intended devices.
- Do not claim Google sign-in works until credentials and redirect configuration have been tested.
- Store tokens using platform-appropriate secure storage.

## Push notifications
- Define a provider adapter.
- Separate campaign creation from provider submission and delivery confirmation.
- Ask permission in context.
- Record provider responses and failures.
- Do not equate queued/submitted with delivered.
- Verify push delivery on a physical device and with real provider configuration.

## Geofencing
- Store campaign locations and radii in the backend.
- Explain why location is requested.
- Handle denied permissions and disabled location services.
- Document background execution constraints by platform and Expo runtime.
- Do not promise reliable geofencing while running only in Expo Go.
- Avoid excessive location collection and do not retain location history unless necessary and approved.

## YouTube Channel & Live Integration
- **Official Channel**: https://www.youtube.com/@islandlivingchannel1087
- **Verified Channel ID**: `UCXATr97RfU6NQna9WPOgWlA`
- **Architecture**:
  - CMS route `/api/youtube` handles both Google YouTube Data API v3 and official public Atom/RSS feed fallback.
  - Server-side secrets: `YOUTUBE_API_KEY` is maintained strictly in backend environment variables (`.env`), never bundled into client apps.
  - Live Stream detection: Queries YouTube Data API `eventType=live` / `eventType=upcoming` or canonical channel `/live` probe to prevent false live status labeling.
  - Shorts identification: Filtered via exact duration analysis (<= 60s / <= 180s with #shorts) and hashtag parsing.
  - Playback: Uses official YouTube iframe player (`https://www.youtube.com/embed/{id}`) with `modestbranding=1`, `rel=0`, and `playsinline=1` complying with YouTube's Terms of Service and brand requirements.

## Otamigo booking
Before claiming full integration, obtain:
- Official API or white-label integration documentation
- Approved booking URL or endpoint
- Affiliate identifier
- Credentials and allowed redirect domains
- Confirmation/callback specification
- Attribution and commission reporting rules

Until then:
- Implement a typed booking adapter.
- Support a configurable booking URL.
- Preserve an affiliate identifier/query parameter only according to partner documentation.
- Track booking initiation separately from confirmed bookings.
- Never fabricate endpoints, booking success, commission amounts, or payouts.

## Media storage
- Use authenticated direct-to-storage uploads or signed upload authorization.
- Validate content type and size.
- Store metadata separately from binary media.
- Use CDN-compatible delivery and suitable cache headers.
- Provide progress and retry UI.
- Never expose storage service secrets in mobile or browser bundles.

## App stores
- Google Play Console and Apple Developer accounts must be owned by ILC.
- Store listing, content rights, privacy disclosures, age ratings, and review compliance require client input.
- Store review and third-party account verification are external dependencies.
- An Expo Go test is not equivalent to a store-ready production build.
