# Compact Project Gallery Implementation Plan

**Goal:** Implement the approved option A: a compact two-column gallery with once-only upward fade entrances.

**Architecture:** Keep the existing static card markup and image interactions. Scope geometry changes to the homepage in angela-palette.css. A separate project-cards.js controls entrance animations through IntersectionObserver and the Web Animations API; visible HTML remains the default when scripting or animation is unavailable.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, Node's test runner.

- [x] Set the work section to a full-width divider with an inner content width capped at 1280px. Use a 40px desktop column gap and 1.4 preview ratio (about 443px tall at full width); keep a single-column tablet layout capped at 640px. Use 32–40px project titles, 16px descriptions/types, 14px tags.
- [x] Recompose OhMee's two screens within the shorter preview using bounded widths/heights and object-fit:contain. Reduce the Why Bother display type and illustration scale to suit the shorter poster. Preserve image enlargement and screen switching.
- [x] Add a once-only entrance for each card: translateY(28px) to zero, opacity 0 to 1, 600ms with cubic-bezier(.22,1,.36,1). A same-row right card gets a 100ms delay; single-column cards have none.
- [x] Use a 56px lower viewport inset and a low intersection threshold. Cancel/reveal immediately on keyboard focus, reduced-motion changes, or detail-route navigation so navigation never leaves an invisible focus target. The existing explicit ?motion=on design preview opts into these entrances too.
- [x] Check the observer lifecycle and animation completion using simulated card events, run existing spring-motion regression checks and syntax checks, and confirm HTTP resources. Inspect desktop/mobile through the connected browser if available, reporting unavailable visual inspection honestly.
- [x] Update README/AGENTS with the approved sizing and motion and review the changed files.

Delivery follows the repository workflow: commit, push the separate codex branch and open a PR to main; do not merge or deploy.

The owner selected option A in chat. This is the implementation of that approved design, retaining the grey/pink palette and existing content.

Verification evidence: project-cards and spring-motion checks pass, JavaScript syntax is valid, 21 local image references exist, four project links are retained, and page/CSS/new script return HTTP 200. Browser inventory exposes no connected page, so actual desktop/mobile rendering remains unverified.
