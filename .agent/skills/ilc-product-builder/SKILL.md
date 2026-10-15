---
name: ilc-product-builder
description: Build and maintain Island Living Digital across Expo mobile, web CMS, and shared backend while following the ILC Phase 1 scope.
---

# ILC Product Builder Skill

Use when implementing a feature or making product-level decisions for Island Living Digital.

## Procedure
1. Read `GEMINI.md` and relevant specification documents.
2. Confirm the task is within Phase 1.
3. Inspect existing code and preserve working patterns.
4. Trace the full flow: UI → typed service → backend authorization → database/storage → UI result.
5. Add validation, loading, empty, error, and success states.
6. Add tests for business rules and security-sensitive behavior.
7. Update documentation when configuration or behavior changes.
8. Report what was actually tested.

## Rules
- Do not implement Phase 2/3 unless explicitly requested.
- Never fake provider success.
- Keep mobile and CMS data consistent.
- Use ILC branding and original design, not copied VMX assets.
- Do not embed personal data in membership QR codes.
