---
name: secure-cms
description: Build secure editorial CMS flows, backend authorization, storage upload, and administrative operations for Island Living Digital.
---

# Secure CMS Skill

## Procedure
1. Protect routes and APIs; confirm backend authorization independently of UI.
2. Apply least-privilege admin roles.
3. Validate input on the server.
4. Enforce RLS on every sensitive table.
5. Use scoped storage upload authorization and safe file validation.
6. Confirm broadcast actions before submission.
7. Log sensitive administrative actions without storing secrets.
8. Add tests for unauthorized access and role escalation.

## Never
- Expose a Supabase service-role key in the browser.
- Rely on hidden buttons as authorization.
- Allow users to self-assign admin roles.
- Claim a notification was delivered without provider evidence.
- Display private member data to roles that do not need it.
