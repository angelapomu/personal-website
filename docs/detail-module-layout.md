# OhMee document layout

The owner-supplied 项目详情 · 左侧目录文档型.html is the layout authority. The owner's 2026-11-10 correction supersedes the earlier hybrid layout and module system. ohmee-case.css scopes the reference to OhMee; the homepage and other projects remain independent.

## Reading order

1. A 64px sticky header: return to projects, owner name, and resume navigation.
2. Three tags, square rounded app icon with project name, lead, and metadata.
3. Four overview columns: 问题、方案、结果、我的角色.
4. One rose-backed gallery with four real product screenshots and short captions.
5. A 220px left directory beside six sibling chapters: 背景与目标、用户与洞察、方案概览、关键决策、指标与验证、风险与下一步.

No repeated screenshot journeys, demonstration panels, annotation chips, enlargement hints, collapsible footnotes, or closing reflection panel. Screenshot enlargement remains available through the images themselves and accessible button labels. Keep meaningful h3 headings and concrete project evidence; visual restraint must not turn the case into generic summaries.

## Reference dimensions

- Container: maximum 1280px, horizontal padding clamp(22px,4vw,64px).
- Title: 900 weight, clamp(40px,6vw,92px); lead: clamp(20px,2vw,28px).
- Overview: four equal columns, 36px gaps, one dark top rule and light bottom rules. Two columns at 1100px and below; one at 560px and below.
- Gallery: four columns, clamp(24px,3vw,40px) padding, clamp(14px,2vw,28px) gaps. Two columns at 900px and below. Images fit 9:19 portrait frames without distortion.
- Document: 220px directory, clamp(32px,6vw,96px) gap, maximum 820px reading column. Directory sticks at 96px.
- Chapter headings: separate small pink number above a 900-weight clamp(28px,2.8vw,40px) title. Body: clamp(17.5px,1.4vw,19px), line-height 2.
- Decisions: a title followed by 为什么 / 代价 rows. Metrics: one four-column strip, becoming two columns on small screens.
- At 900px and below, hide the side directory and show horizontally scrollable chapter tabs below the header. Keep the page itself free of horizontal overflow.
- Scroll padding: 92px desktop and 124px small screens, respecting reduced motion.

## Evidence and navigation

Reference placeholders are not evidence. The owner explicitly confirmed using existing verified numbers rather than the sample numbers in the supplied HTML. Present the early research (200+, 12.5%, five interviews), MVP test/analysis (50+, 553 messages, five higher-stickiness users, one recommendation), and prompt evaluation (five models, 10+ initial rounds, 3+ optimization rounds) as separate strips using the reference's number scale, labels, spacing, and top rule.

Restore the two research screenshots, business swimlane, AI pipeline, Figma workspace, and Prompt Lab in the relevant chapters. Give each one a full image frame and short caption; omit enlargement instructions. Use the reference's chapter spacing and typography for meaningful module headings. Real screenshots must use contain fitting within the gallery frames, rather than inheriting placeholder sizing.

The reference has no traditional table; the retained implementation and decision content uses plain semantic tables with the same paper, ink, light rules, and generous spacing. Use 20px headers, 17px cell text, 24px row padding, and horizontal scrolling within the table region below 640px. Do not compress every column to fit a phone or force the page itself to scroll sideways.

Omit empty chart placeholders and unverified model names or north-star definitions. Keep the existing image viewer, chapter focus, scroll-linked current location, reading progress, and return to portfolio flow. Scope every style and special header behavior to OhMee.
