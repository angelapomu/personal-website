const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const assert = require('node:assert/strict');

const html = readFileSync(join(__dirname, '../index.html'), 'utf8');
const overviewStart = html.indexOf('<div class="oh-overview oh-wrap">');
const backgroundStart = html.indexOf('<section class="oh-section" id="case-background"', overviewStart);
const overview = html.slice(overviewStart, backgroundStart);
assert.match(overview, /<p>0-1产品owner<\/p>/);

const researchStart = html.indexOf('<section class="oh-section" id="case-research"');
const experienceStart = html.indexOf('<section class="oh-section" id="case-experience"', researchStart);
const research = html.slice(researchStart, experienceStart);
assert.match(research, /02 \/ 需求初步验证/);
assert.doesNotMatch(research, /从竞品、概念测试到一对一访谈，为一个足够具体的产品入口找依据。/);
const architectureStart = html.indexOf('<section class="oh-section" id="case-architecture"', experienceStart);
const experience = html.slice(experienceStart, architectureStart);
assert.match(experience, /03 \/ 核心假设/);
assert.doesNotMatch(experience, /用第一人称重新表达，让鼓励听起来像来自自己。下面这段对话取自现有产品截图。/);
assert.ok(html.includes('<h2 id="oh-background-title">从网络热点，<br>捕捉深层需求</h2>'), 'the opening headline uses the approved shorter copy');

const iterationStart = html.indexOf('<section class="oh-section" id="case-iteration"', architectureStart);
const architecture = html.slice(architectureStart, iterationStart);
assert.doesNotMatch(architecture, /oh-considerations-heading|考虑方面/);
assert.match(architecture, /<div class="oh-section-heading[\s\S]*?<\/div>\s*<div class="oh-decision-table-wrap">/);
assert.doesNotMatch(architecture, /从首次体验、等待感和长期记忆出发，把抽象的产品假设拆成可以实现、测试和调整的机制。/);
assert.match(architecture, /class="case-detail-module oh-flow-module"[\s\S]*?class="case-detail-intro oh-diagram-heading"[\s\S]*?<h3 class="case-detail-subtitle">体验流程设计<\/h3>/);
assert.match(architecture, /class="case-detail-module oh-workflow-module"[\s\S]*?class="case-detail-intro oh-ai-intro"[\s\S]*?<h3 class="case-detail-subtitle">AI 工作流设计<\/h3><\/div><p>围绕 MVP 拆分意图识别/);
assert.match(architecture, /class="case-detail-module oh-implementation-module"[\s\S]*?class="case-detail-intro oh-ai-intro"[\s\S]*?<h3 class="case-detail-subtitle">前后端实现技术选型<\/h3>/);
assert.doesNotMatch(architecture, /前端使用 Next\.js、React 与 TypeScript，本地数据由 IndexedDB 持久化，后端使用 Supabase \/ PostgreSQL。/);
assert.doesNotMatch(architecture, /对齐 PRD 完成全栈 MVP，把提示词测试做成可重复运行的工作流程。/);
assert.match(architecture, /class="case-detail-module oh-vibe-module"[\s\S]*?class="case-detail-intro oh-ai-intro"[\s\S]*?<h3 class="case-detail-subtitle">Vibe Coding 全栈开发<\/h3><\/div><p>用 Figma、Figma Make/);
assert.match(html, /\.case-detail-module\s*\{\s*margin-top:\s*56px;\s*\}/);
assert.doesNotMatch(html, /\.ohmee-case \.oh-stack-module\s*\{/);
assert.match(html, /\.case-detail-grid \{ display: grid; grid-template-columns: repeat\(2,minmax\(0,1fr\)\); column-gap: 8%; row-gap: 32px;/);
assert.match(html, /\.case-detail-grid > \.case-detail-full \{ grid-column: 1 \/ -1; \}/);
assert.match(html, /\.case-detail-subtitle \{ margin: 0; font: 500 25px\/1\.6 var\(--display\); letter-spacing: -\.03em; \}/);
assert.match(html, /\.case-detail-subtitle \{ font-size: 23px; \}/);

const deliveryStart = architecture.indexOf('<section class="oh-delivery-module" id="case-delivery"');
const vibeStart = architecture.indexOf('<div class="case-detail-module oh-vibe-module"', deliveryStart);
const delivery = architecture.slice(deliveryStart, vibeStart);
const labLayoutStart = delivery.indexOf('<div class="case-detail-grid oh-lab-layout">');
const labLayout = delivery.slice(labLayoutStart);
const promptColumnStart = labLayout.indexOf('<div class="oh-copy"><h3 class="case-detail-subtitle">Prompt 测试集创建</h3>');
const imageColumnStart = labLayout.indexOf('<figure class="oh-evidence oh-lab-image case-detail-full">');
const dataColumnStart = labLayout.indexOf('<div class="oh-lab-data case-detail-full">');
const imagePosition = labLayout.indexOf('images/woma-prompt-lab.png');
const dataHeadingPosition = labLayout.indexOf('<h3 class="case-detail-subtitle">测试数据</h3>');
const metricsPosition = labLayout.indexOf('class="oh-lab-numbers"');
assert.equal((labLayout.match(/<div class="oh-copy/g) || []).length, 2, 'delivery starts with two content columns');
assert.ok(labLayout.indexOf('<h3 class="case-detail-subtitle">Vibe Coding 搭建测试框架</h3>') < promptColumnStart && promptColumnStart < imageColumnStart,
  'Vibe Coding and Prompt testing occupy the first two columns');
assert.ok(imageColumnStart > promptColumnStart && imageColumnStart < dataColumnStart && imagePosition < dataColumnStart && dataColumnStart < dataHeadingPosition && dataHeadingPosition < metricsPosition,
  'the full-width screenshot and data follow the two content columns, with the image first');
const promptColumn = labLayout.slice(promptColumnStart, imageColumnStart);
assert.equal(promptColumn.includes('woma-prompt-lab.png'), false, 'the Prompt Lab screenshot is kept out of the Prompt testing column');
assert.equal(promptColumn.includes('oh-lab-numbers'), false, 'the data metrics are kept out of the Prompt testing column');

assert.match(html, /\.case-detail-intro \{ display: grid; grid-template-columns: 1fr; gap: 14px; align-items: start; margin-bottom: 28px; \}/);
assert.match(html, /\.case-detail-intro > p \{ max-width: 800px; \}/);
assert.doesNotMatch(html, /\.case-detail-intro\s*\{[^}]*grid-template-columns:\s*1fr 1fr/);
assert.doesNotMatch(html, /case-detail-intro-single/);
assert.match(html, /\.ohmee-case \.oh-diagram-heading > span \{ justify-self: start;/);
assert.match(html, /\.case-detail-grid > \.case-detail-full \{ grid-column: 1 \/ -1; \}/);
assert.match(html, /\.ohmee-case \.oh-lab-image img \{ height: auto; min-height: 250px; max-height: 460px;/);
assert.match(html, /@media \(max-width: 560px\) \{[\s\S]*?\.case-detail-grid \{ grid-template-columns: 1fr; \}/);

const ohmeeStoryEnd = html.indexOf('<section class="oh-reflection" aria-labelledby="oh-reflection-title">', architectureStart);
const ohmeeStory = html.slice(overviewStart, ohmeeStoryEnd);
const unstandardizedSubtitles = [...ohmeeStory.matchAll(/<h3(?![^>]*class="case-detail-subtitle")[^>]*>/g)];
assert.deepEqual(unstandardizedSubtitles, [], 'every OhMee detail-page subtitle shares the common heading class');

console.log('PASS: approved OhMee copy, subtitle hierarchy, and supporting text placement');
