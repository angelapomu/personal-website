# OhMee document layout implementation plan

**Evidence follow-up:** Keep the reference layout while restoring the actual case depth: early research screenshots/data; business/AI diagrams, implementation table and Figma workspace; original problem/thinking/solution table; MVP data and Prompt Lab/evaluation data. The owner confirmed existing numbers remain authoritative. Use the reference's type scale and spacing, with semantic, internally scrollable tables on phones. Check real screenshot containment as well as layout geometry and navigation at all seven existing viewport widths. Update the existing review PR with the verified revision.

**Owner correction (2026-11-10):** The hybrid below was rejected. Follow the supplied HTML directly: its four-column summary, four real screenshots, six-chapter document, 220px directory, paper/rose theme, type scale, and responsive horizontal tabs. Remove the annotation-heavy modules and unused disclosure/rewrite code. The original work list below records the superseded first pass; the final specification is docs/detail-module-layout.md.

**Goal:** Combine the supplied left-navigation document reference with the existing evidence-rich OhMee case, so the page reads as a visual product document.

**Architecture:** Keep the static page and existing routes, rewrite interaction, image viewer, chapter selection, and return navigation. Give OhMee one scoped stylesheet and one document shell with seven sibling chapters. The supplied reference is a read-only layout source; its placeholders, model choices, and new metrics are not project evidence.

**Design:** Preserve the approved grey `#E9E9E6`, ink `#15171A`, surface `#F6F6F3`, muted `#62625E`, and pink `#FF2E93` palette. Use Noto Sans SC for reading and headings and IBM Plex Mono for small chapter numbers. Use a compact app header, an unruled overview metric row, a 184px sticky left directory, and a bounded reading column. Main headings are 28px, module headings 20px, summaries 17px, and body copy 16px–17px. Pink identifies the current location and interactive state. No reveal effects in the document body.

## Work

- [x] Extract the OhMee styling from `index.html` and `angela-palette.css` into `ohmee-case.css`; keep other projects and homepage styles scoped and untouched.
- [x] Rebuild the document shell in reusable `detail-document.css` around the existing navigation and story. Preserve seven chapter IDs and the compact directory below 960px.
- [x] Make chapter titles real h2 elements and summaries paragraphs. Move technology, Prompt Lab, and Vibe Coding into the sibling MVP implementation chapter. Keep the decision table, product journey, then process diagram order.
- [x] Preserve approved copy, all real screenshots, five metric groups, metric caveats, rewrite controls, and image preview actions. Omit the already removed reflection panel and decorative hypothesis icon.
- [x] Update the layout guide and obsolete structural expectations. Validate browser navigation, sticky positions, image loading, equal logo dimensions, responsive overflow, rewrite interaction, lightbox dismissal, reduced motion, and homepage return.
- [x] Inspect desktop, tablet, and mobile screenshots. Run existing checks, asset checks, JavaScript syntax checks, and `git diff --check`.
- [x] Prepare the verified files for the revision commit and a PR against main. Repository history and the PR record the delivery step.
