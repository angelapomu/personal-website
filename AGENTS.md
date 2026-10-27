# Personal website collaboration

## Required workflow

- The owner requires a pull request for every website revision after the initial import.
- Start each revision on a separate branch based on the latest `main`. Use the `codex/` prefix for agent-created branches.
- Commit and push the revision branch, then open a PR targeting `main`. Include a concise explanation of the visible changes and the checks actually performed.
- Do not push revisions directly to `main`, force-push shared branches, or merge a PR unless the owner explicitly requests it.
- Preserve unrelated local changes and review the staged files before committing.

## Portfolio context

- Latest review: hero has two lines, 做让用户 / 自己想回来的AI产品. Preserve the dark divider between hero/work, remove only the thin SELECTED WORK heading border. Card descriptions and subtitles use 16px; all tags use 14px, superseding old MORI tag sizing.

- Latest owner direction (2026-10-22) supersedes the older palette and hero directions below: use `Angela 徐晓萌.html` for the homepage's grey/black/pink palette, and `首屏 想回来2 推开会自己弹回来.html` for the replacement spring typography hero. Preserve the existing project-card geometry and content. Apply the palette to OhMee's existing case-study layout only; keep other detail views independent. The downloaded references are read-only design sources.
- Current palette: grey #E9E9E6, ink #15171A, pink #FF2E93, surface #F6F6F3; orange #EF5A26 is reserved for Why Bother's project image. Home/OhMee use a grey 36px navigation. Retain reduced-motion support, native scrolling, accessible headline text, and pause the spring loop offscreen.
- Latest annotated refinement: use a single SELECTED WORK heading with PLAYGROUND's layout; capabilities uses softer charcoal #2B2D31 with off-white text (owner superseded the light-grey experiment); the shared 关于我 navigation targets #capabilities.

- Keep 我吗 (OhMee) and Why Bother as the two primary project images and case studies unless the owner changes that direction.
- Treat shelter as an early exploration focused on hand-drawn visuals.
- The supplied `figma-website-main.zip` is the authority for the homepage's layout. Keep its card structure, hero introduction, capabilities and about sections, typography and blue `#1616C5` / orange `#F05A24` palette. The owner now requests real project names, introductions and tags alongside the four project previews, linked to their existing case studies. Size every project-card tag like the source MORI tags: 10px type and 8px 12px padding. Keep shelter's preview dark.
- Preserve the homepage → project detail → return to projects flow, image previews, keyboard access, and responsive layout.
- The owner explicitly requests one shared 36px orange navigation (#F05A24) on the homepage and project views: Angela. 徐晓萌 / 作品 / 关于我 / 简历. Use the existing studio-header instead of the source Figma topbar, with dark text and blue active indicators. Keep sticky chapter offsets aligned at 36px. Preserve the blue homepage hero; this is an approved exception to the source Figma navigation.
- The OhMee detail view uses isolated `.ohmee-case` styles. The homepage is blue-led; this case is orange-led (#F05A24 hero/closing), with paper reading surfaces and blue (#1616C5) confined to actions, selection and focus. Avoid alternating large saturated blue/orange content panels. Its rewrite interaction uses a real existing screenshot example; do not replace it with invented user testimony. Keep the other project views independent when editing this case.
- At 960px and below, use the compact current-chapter disclosure rather than a horizontally overflowing chapter strip. Preserve scroll-linked current labels, selection/escape/outside-click dismissal, keyboard focus and desktop breakpoint behavior.
- Use the supplied project evidence. Do not invent metrics, testimonials, contact details, or resume links.
- Keep the provided resume section and its placeholder preview; the real PDF remains unavailable, so keep its download disabled.
- Preserve the supplied homepage's long-page section flow; it supersedes the earlier full-screen snapping design. Respect reduced-motion preferences. Keep source identity and contact copy as review placeholders outside explicit owner-approved edits; the owner has now provided approved Chinese hero positioning and introduction copy.

## Verification

- Check local image references, project routes, HTML structure, and JavaScript/CSS syntax after editing.
- When browser access is available, inspect the layout and navigation at desktop and mobile widths.
- Report browser validation separately from file and HTTP checks. Do not describe unperformed browser checks as passed.

## Implementation

The site is a dependency-free static document in `index.html`, with images in `images/`. Keep it directly previewable unless a different architecture is explicitly requested.
