# Detail-page module layout

Use this layout system for new project detail pages so each page reads like a visualized PRD: the reader can follow the question, decision, evidence, and outcome without learning a new layout in every section.

## Document shell

The 2026-11-10 OhMee revision is the current layout reference. Load `detail-document.css` for the reusable shell and keep the case's visual styling in its own stylesheet, as `ohmee-case.css` does.

```html
<div class="case-detail-document">
  <nav class="case-detail-directory" aria-label="项目目录">章节链接</nav>
  <article class="case-detail-content">
    <section id="project-question" aria-labelledby="project-question-title">
      <header>
        <h2 id="project-question-title">发现需求</h2>
        <p>这一章的简短说明。</p>
      </header>
      <!-- Reuse the module pattern below for evidence and decisions. -->
    </section>
  </article>
</div>
```

- Above 960px, use a sticky left directory and a bounded reading column. The shell supplies 184px / 64px directory width and column gap, becoming 168px / 36px below 1100px.
- At 960px and below, use a single column and the current-chapter disclosure. Keep its expanded state, Escape / outside dismissal, keyboard focus, scroll-linked location, and breakpoint handling.
- Every directory destination must be a sibling chapter. Put related implementation modules inside the MVP implementation chapter; do not nest one navigable chapter inside another.
- Use real `h2` elements for chapter names, `h3` for module names, `h4` for subordinate column labels, and paragraphs for chapter summaries. The large main title is the chapter name, not the summary.
- Use one type scale: 28px desktop / 25px mobile chapter names, 20px module names, 17px / 16px summaries, and 16px reading text. Use utility type only for chapter numbers, metadata, and captions.
- Keep ordinary modules separated with 36px of space. Use one divider between chapters, not between each module heading.
- Display real screenshots at their intrinsic proportions and let readers enlarge dense diagrams. On mobile, stack text and present product-journey thumbnails beside captions rather than forcing a horizontal page scroll.
- Use one shared fact strip with matching number and label styling and rules above and below it. The introductory overview omits the rules. Keep measurement caveats close to the results.
- Respect the shared 36px site header in both sticky positioning and chapter scrolling. Scroll padding and scroll margin add together; do not duplicate the full offset in both.

Keep the project introduction compact: square rounded app icon, project name, value statement, entry action, role, and existing project metrics. Do not import placeholder copy or unverified metrics from a layout reference.

## Shared classes

- `.case-detail-module` gives each sibling module the same vertical separation; the document variant uses 36px in its scoped stylesheet.
- `.case-detail-intro` stacks the subtitle first and its explanation or action directly below it. Keep this vertical reading order on desktop and mobile.
- `.case-detail-subtitle` sets the common detail heading size and weight. Apply it to every module-level `h3`; nested `h4` labels use the same class with the subordinate size.
- `.case-detail-grid` creates a two-column content row. Add `.case-detail-full` to a direct child that should span the whole row.
- At 560px and below, the two-column content grid becomes one column. Intro blocks already use the same vertical order at every width.

## Content order

Keep a module's information in this order:

1. Subtitle and its explanation, when one is needed.
2. Two related text or decision columns.
3. Supporting evidence at full width.
4. Data at full width, after the evidence it measures.

```html
<section class="case-detail-module">
  <div class="case-detail-intro">
    <h3 class="case-detail-subtitle">模块标题</h3>
    <p>说明这个模块解决什么问题，以及为什么采用这条路径。</p>
  </div>
  <div class="case-detail-grid">
    <article>
      <h3 class="case-detail-subtitle">方案一</h3>
      <p>关键决策或实现方式。</p>
    </article>
    <article>
      <h3 class="case-detail-subtitle">方案二</h3>
      <p>与方案一并列、可对照的信息。</p>
    </article>
    <figure class="case-detail-full">证据截图</figure>
    <div class="case-detail-full">对应的数据与口径</div>
  </div>
</section>
```

Use dividers only when they clarify a real chapter or data boundary. Do not insert decorative rules between sibling subtitles. Keep each project's colors and typography in its own scope; the shared classes define layout and hierarchy.
