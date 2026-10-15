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

## YouTube Live
- Use supported YouTube embed/player functionality and a configurable channel/stream ID.
- Verify embedding is allowed for the selected stream.
- Provide an offline/unavailable state and a fallback link.
- Do not scrape YouTube pages or use undocumented APIs.
- YouTube API credentials, if needed, must be restricted and managed appropriately.

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
