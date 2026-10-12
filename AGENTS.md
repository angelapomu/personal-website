# Personal website collaboration

## Required workflow

- The owner requires a pull request for every website revision after the initial import.
- Start each revision on a separate branch based on the latest `main`. Use the `codex/` prefix for agent-created branches.
- Commit and push the revision branch, then open a PR targeting `main`. Include a concise explanation of the visible changes and the checks actually performed.
- Do not push revisions directly to `main`, force-push shared branches, or merge a PR unless the owner explicitly requests it.
- Preserve unrelated local changes and review the staged files before committing.

## Portfolio context

- Keep 我吗 (OhMee) and Why Bother as the two primary projects unless the owner changes that direction.
- Treat shelter as an early exploration focused on hand-drawn visuals.
- Use the owner's chosen theme blue, `#2548F5`, with dusty orange and light supporting surfaces. Keep shelter's card dark and avoid decorative layers around its black-backed illustration.
- Make project types prominent. Keep homepage project descriptions, evidence labels, responsibilities and links at least 14px across responsive breakpoints; do not shrink these to fit a narrow card.
- Preserve the homepage → project detail → return to projects flow, image previews, keyboard access, and responsive layout.
- Use the supplied project evidence. Do not invent metrics, testimonials, contact details, or resume links.
- Keep the personal interest statement in the hero and the resume preview/download area at the end. The owner approved a labelled resume placeholder until the real PDF is supplied; never enable a broken download.
- The homepage uses full-viewport screens with a solid blue hero, native scroll snapping and entrance motion. Keep content readable on short/mobile screens, respect reduced-motion preferences, and disable homepage snapping on case-study routes.

## Verification

- Check local image references, project routes, HTML structure, and JavaScript/CSS syntax after editing.
- When browser access is available, inspect the layout and navigation at desktop and mobile widths.
- Report browser validation separately from file and HTTP checks. Do not describe unperformed browser checks as passed.

## Implementation

The site is a dependency-free static document in `index.html`, with images in `images/`. Keep it directly previewable unless a different architecture is explicitly requested.
