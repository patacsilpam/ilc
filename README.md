# Island Living Digital — Antigravity Build Kit

This kit contains the Markdown instructions and project specifications for building Island Living Digital in **Google Antigravity**.

## How to use

1. Extract this folder into the root of your project repository.
2. Open the repository in Google Antigravity.
3. Review `GEMINI.md` and `TASKS.md`.
4. Start with the workflow in `WORKFLOWS.md`, or paste the one-shot instruction in `ONE_SHOT_PROMPT.md` into Agent Manager.
5. Allow the agent to inspect the repository, create files, run commands, and test the app.
6. Add real credentials only through local environment files or the appropriate secrets manager. Never commit secrets.

## Included

- `GEMINI.md` — project-wide agent instructions.
- `ONE_SHOT_PROMPT.md` — main implementation prompt.
- `PRODUCT_SPEC.md` — product requirements and acceptance criteria.
- `DESIGN_SYSTEM.md` — visual direction based on the supplied VMX-inspired reference and ILC logo.
- `ARCHITECTURE.md` — recommended application and backend architecture.
- `DATA_MODEL.md` — initial database model and security expectations.
- `INTEGRATIONS.md` — Expo, YouTube, Otamigo, auth, media, and notification constraints.
- `QA_CHECKLIST.md` — functional and security test checklist.
- `TASKS.md` — execution order and definition of done.
- `WORKFLOWS.md` — suggested Antigravity workflows.
- `.agent/skills/ilc-product-builder/SKILL.md` — reusable project skill.
- `.agent/skills/expo-mobile/SKILL.md` — Expo-specific implementation skill.
- `.agent/skills/secure-cms/SKILL.md` — CMS/backend security skill.
- `.agent/skills/visual-qa/SKILL.md` — visual QA skill.

## Important reality checks

- Expo Go is a development runtime. Some background location, push-notification, and native capabilities require a custom development build or EAS Build.
- Otamigo API access and affiliate tracking cannot be verified without official partner documentation, identifiers, and credentials.
- Google sign-in, push delivery, YouTube embedding, and store publication require configuration and real-device/provider testing.
- The supplied image is visual inspiration only. Do not copy VMX branding, wording, or proprietary artwork. Use ILC's logo and create an original layout with similar qualities: bold editorial hierarchy, warm colors, large media imagery, rounded device-like cards, and clear feature storytelling.
