# Suggested Google Antigravity Workflows

Use these as repeatable task instructions. Antigravity UI and workflow conventions may vary by installed version; if a workflow format is unsupported, use the same steps as an Agent Manager prompt.

## Workflow 1 — Build Phase 1 end to end
Read `GEMINI.md`, `PRODUCT_SPEC.md`, `ARCHITECTURE.md`, `DATA_MODEL.md`, and `TASKS.md`. Inspect the repository. Implement all Phase 1 functionality in execution order. Do not stop at a plan. Run tests and report external blockers honestly.

## Workflow 2 — Secure backend review
Review all tables, storage policies, server functions, admin routes, and mutations. Verify explicit RLS and role checks. Attempt to identify cross-user data access, privilege escalation, public storage exposure, and secrets in client code. Fix confirmed issues and add regression tests.

## Workflow 3 — Visual polish
Review the mobile app and CMS at representative small and large viewports. Compare against `DESIGN_SYSTEM.md`. Improve hierarchy, spacing, image quality, responsiveness, loading states, and accessibility without copying the VMX reference literally. Do not change business behavior without need.

## Workflow 4 — Integration verification
Inspect configured credentials and integration adapters without printing secret values. Verify YouTube embedding, OAuth redirect setup, notification delivery, storage uploads, and Otamigo behavior where access is available. Distinguish configured, tested, and blocked states. Never fabricate a successful test.

## Workflow 5 — Release readiness
Run all checks from `QA_CHECKLIST.md`. Inspect environment variables, migrations, logging, storage access, auth policies, app metadata, and build configuration. Produce a release-readiness report with blockers and exact commands.

## Workflow 6 — Bug fix
Reproduce the reported bug, identify its root cause, implement the smallest robust fix, add a regression test, run relevant checks, and summarize the files changed and test evidence. Avoid unrelated refactors.
