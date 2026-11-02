# Detail-page module layout

Use this layout system for new project detail pages so each page reads like a visualized PRD: the reader can follow the question, decision, evidence, and outcome without learning a new layout in every section.

## Shared classes

- `.case-detail-module` gives each sibling module the same vertical separation.
- `.case-detail-intro` places a subtitle on the left and its explanation or action on the right. Use `.case-detail-intro-single` when the module has no supporting copy.
- `.case-detail-subtitle` sets the common detail heading size and weight. Apply it to every module-level `h3`.
- `.case-detail-grid` creates a two-column content row. Add `.case-detail-full` to a direct child that should span the whole row.
- At 560px and below, the intro and content grids become one column.

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
