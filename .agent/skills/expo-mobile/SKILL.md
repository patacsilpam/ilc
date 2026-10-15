---
name: expo-mobile
description: Implement Expo React Native features with Expo Go compatibility where possible and honest handling of native limitations.
---

# Expo Mobile Skill

## Procedure
1. Inspect installed Expo SDK and current package versions.
2. Check compatibility before installing libraries.
3. Prefer Expo-supported APIs and Expo Go-compatible dependencies for initial development.
4. Isolate native-sensitive behavior behind typed service interfaces.
5. Add permission explanations and denied-permission states.
6. Test app startup and navigation after changes.
7. Document which capabilities require a custom development build or EAS Build.

## Special constraints
- Expo Go is not a guarantee that all native capabilities are available.
- Do not promise reliable background geofencing in Expo Go.
- Do not claim push works without provider setup and device verification.
- Do not treat a development session as production distribution readiness.
- Handle external URLs, OAuth redirects, and media playback failures.
