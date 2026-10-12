# Personal website collaboration

## Required workflow

- The owner requires a pull request for every website revision after the initial import.
- Start each revision on a separate branch based on the latest `main`. Use the `codex/` prefix for agent-created branches.
- Commit and push the revision branch, then open a PR targeting `main`. Include a concise explanation of the visible changes and the checks actually performed.
- Do not push revisions directly to `main`, force-push shared branches, or merge a PR unless the owner explicitly requests it.
- Preserve unrelated local changes and review the staged files before committing.

## Portfolio context

- Keep 我吗 (OhMee) and Why Bother as the two primary project images and case studies unless the owner changes that direction.
- Treat shelter as an early exploration focused on hand-drawn visuals.
- The supplied `figma-website-main.zip` is the authority for the homepage's layout AND copy. The owner clarified: replace only the four project preview images, keep the source card structure, title/description/tag text, hero introduction, capabilities and about sections unchanged. Use its exact typography and blue `#1616C5` / orange `#F05A24` palette. Connect the existing case studies through the cards. Keep shelter's preview dark.
- Preserve the homepage → project detail → return to projects flow, image previews, keyboard access, and responsive layout.
- Use the supplied project evidence. Do not invent metrics, testimonials, contact details, or resume links.
- Keep the provided resume section and its placeholder preview; the real PDF remains unavailable, so keep its download disabled.
- Preserve the supplied homepage's long-page section flow; it supersedes the earlier full-screen snapping design. Respect reduced-motion preferences. The owner explicitly requested retaining source text for UI review: do not treat its sample identity, project names, experience or contact text as verified facts about the owner or independently rewrite it.

## Verification

- Check local image references, project routes, HTML structure, and JavaScript/CSS syntax after editing.
- When browser access is available, inspect the layout and navigation at desktop and mobile widths.
- Report browser validation separately from file and HTTP checks. Do not describe unperformed browser checks as passed.

## Implementation

The site is a dependency-free static document in `index.html`, with images in `images/`. Keep it directly previewable unless a different architecture is explicitly requested.
