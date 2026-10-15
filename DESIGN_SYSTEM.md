# Design System — Island Living Digital

## 1. Creative direction
Build an original ILC visual identity for a premium Philippine travel, lifestyle, and broadcast brand. The supplied VMX reference suggests strong editorial headlines, vivid color panels, rounded media framing, and concise benefit-led storytelling. It is inspiration only; do not reproduce VMX logos, copy, exact screen compositions, or proprietary artwork.

## 2. Brand asset
Primary logo source:
https://www.islandlivingchannel.tv/wp-content/uploads/2022/02/ff.png

If available, download and store a local optimized copy in the project's asset directory. Preserve aspect ratio and provide a sensible fallback if retrieval fails. Do not make app startup depend on a remote logo URL.

## 3. Suggested palette
Treat these as provisional until ILC's official brand guide is available:
- Deep ocean: `#123B52`
- Island teal: `#1F7A78`
- Sky blue: `#6DB7E8`
- Warm sand: `#F1D39A`
- Coral accent: `#E47E63`
- Warm ivory: `#FAF7F0`
- Ink: `#20272B`
- Muted text: `#66747A`
- Surface: `#FFFFFF`
- Border: `#E5E8E7`

Use a restrained palette. Do not use every color in every view. Ensure WCAG-appropriate text contrast, particularly over photography.

## 4. Typography
Use a highly readable sans-serif such as Inter or a platform-native equivalent. Create a consistent type scale:
- Editorial display title
- Screen title
- Section heading
- Card title
- Body
- Caption/metadata

Use strong editorial hierarchy without excessively large text or all-caps everywhere.

## 5. Mobile experience
- A warm, image-led home screen with featured stories and VOD.
- Rounded cards with restrained radius and spacing.
- Clear bottom navigation: Home, Discover/VOD, Live, Travel, Profile; adapt if usability testing indicates a better structure.
- Featured content should use real media assets or deliberate local placeholders.
- Video thumbnails should have a consistent aspect ratio and readable overlays.
- Membership card should feel like a polished digital pass.
- Gifts should communicate expiry and eligibility clearly.
- Use subtle motion only when it improves understanding.
- Never use emoji as a substitute for interface icons.

## 6. CMS experience
- Professional editorial workspace, not a generic analytics template.
- Compact, persistent sidebar on desktop; responsive navigation on small screens.
- Clear page titles and primary action placement.
- Data tables with search, filters, pagination, loading skeletons, empty states, and error recovery.
- Forms grouped into logical sections with validation beside fields.
- Media upload with progress, preview, file constraints, and retry.
- Distinguish drafts, published, inactive, queued, sent, failed, and expired states.
- Use charts only when actual data is available and a chart improves comprehension.

## 7. Components
Create reusable components and tokens for:
- Buttons and icon buttons
- Text inputs and validation messages
- Chips/tags
- Video cards and media thumbnails
- Section headers
- Bottom navigation
- Membership card/QR view
- Gift cards
- Empty/loading/error states
- Confirmation dialogs
- Tables, pagination, filter controls
- Status indicators
- Upload dropzone/progress
- Toasts/alerts

## 8. Accessibility and polish
- Adequate touch targets and keyboard navigation.
- Visible focus styles on web.
- Labels for inputs and screen-reader descriptions for icons.
- Do not rely on color alone for statuses.
- Respect safe areas on mobile.
- Test narrow mobile layouts and desktop CMS widths.
- Avoid broken image placeholders, layout shifts, clipped text, and fake functionality.
