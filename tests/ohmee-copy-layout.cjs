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
const architectureStart = html.indexOf('<section class="oh-section" id="case-architecture"', experienceStart);
const experience = html.slice(experienceStart, architectureStart);
assert.match(experience, /03 \/ 核心假设/);
assert.ok(html.includes('<h2 id="oh-background-title">从网络热点，<br>捕捉深层需求</h2>'), 'the opening headline uses the approved shorter copy');

const iterationStart = html.indexOf('<section class="oh-section" id="case-iteration"', architectureStart);
const architecture = html.slice(architectureStart, iterationStart);
assert.doesNotMatch(architecture, /oh-considerations-heading|考虑方面/);
assert.match(architecture, /<div class="oh-section-heading[\s\S]*?<\/div>\s*<div class="oh-decision-table-wrap">/);
assert.doesNotMatch(architecture, /从首次体验、等待感和长期记忆出发，把抽象的产品假设拆成可以实现、测试和调整的机制。/);
assert.match(architecture, /<h3>AI 工作流设计<\/h3><\/div><p>围绕 MVP 拆分意图识别/);
assert.match(architecture, /<h3>Vibe Coding 全栈开发<\/h3><\/div><p>用 Figma、Figma Make/);
assert.doesNotMatch(architecture, /前端使用 Next\.js、React 与 TypeScript，本地数据由 IndexedDB 持久化，后端使用 Supabase \/ PostgreSQL。/);
assert.doesNotMatch(architecture, /对齐 PRD 完成全栈 MVP，把提示词测试做成可重复运行的工作流程。/);

const deliveryStart = architecture.indexOf('<section class="oh-delivery-module" id="case-delivery"');
const vibeStart = architecture.indexOf('<div class="oh-stack-module oh-vibe-module"', deliveryStart);
const delivery = architecture.slice(deliveryStart, vibeStart);
const labLayoutStart = delivery.indexOf('<div class="oh-lab-layout">');
const labLayout = delivery.slice(labLayoutStart);
const promptColumnStart = labLayout.indexOf('<div class="oh-copy"><h3>Prompt 测试集创建</h3>');
const dataColumnStart = labLayout.indexOf('<div class="oh-copy oh-lab-data">');
const imagePosition = labLayout.indexOf('images/woma-prompt-lab.png');
const dataHeadingPosition = labLayout.indexOf('<h3>测试数据</h3>');
const metricsPosition = labLayout.indexOf('class="oh-lab-numbers"');
assert.equal((labLayout.match(/<div class="oh-copy/g) || []).length, 3, 'delivery content is split into three columns');
assert.ok(labLayout.indexOf('<h3>Vibe Coding 搭建测试框架</h3>') < promptColumnStart && promptColumnStart < dataColumnStart,
  'Vibe Coding, Prompt testing, and data appear as separate columns');
assert.ok(imagePosition > dataColumnStart && imagePosition < dataHeadingPosition && dataHeadingPosition < metricsPosition,
  'the Prompt Lab screenshot sits above the data metrics in its own column');
const promptColumn = labLayout.slice(promptColumnStart, dataColumnStart);
assert.equal(promptColumn.includes('woma-prompt-lab.png'), false, 'the Prompt Lab screenshot is kept out of the Prompt testing column');
assert.equal(promptColumn.includes('oh-lab-numbers'), false, 'the data metrics are kept out of the Prompt testing column');

assert.match(html, /\.ohmee-case \.oh-ai-intro \{[^}]*grid-template-columns: 1fr 1fr;[^}]*align-items: center;/);
assert.match(html, /\.ohmee-case \.oh-ai-intro h3 \{ font-size: 25px;/);
assert.match(html, /\.ohmee-case \.oh-ai-intro h3 \{ font-size: 23px;/);
assert.match(html, /\.ohmee-case \.oh-lab-layout \{ display: grid; grid-template-columns: \.85fr \.95fr 1\.2fr;/);
assert.match(html, /@media \(max-width: 960px\) \{\s*\.ohmee-case \.oh-lab-layout \{ grid-template-columns: 1fr; gap: 30px; \}/);
assert.match(html, /\.ohmee-case \.oh-diagram-heading h3 \{ font-size: 25px;/);
assert.match(html, /\.ohmee-case \.oh-diagram-heading h3 \{ font-size: 23px;/);
assert.equal(html.includes('.ohmee-case .oh-insight-grid,.ohmee-case .oh-ai-intro { gap: 35px; }'), false,
  'AI subtitle and description spacing remains consistent at tablet widths');

console.log('PASS: approved OhMee copy, subtitle hierarchy, and supporting text placement');
