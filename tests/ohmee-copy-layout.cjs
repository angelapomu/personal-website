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
assert.match(delivery, /<div class="oh-lab-layout">\s*<div class="oh-copy"><h3>Vibe Coding 搭建测试框架<\/h3><p>为多节点 Workflow 搭建批量测试框架。<\/p><\/div>\s*<div class="oh-copy"><h3>Prompt 测试集创建<\/h3><p>创建测试集，横向对比模型输出。真实用户进入后，把 bad case、good case 和边缘 case 加入测试集，继续迭代。<\/p><dl class="oh-lab-numbers">[\s\S]*?<\/dl><figure class="oh-evidence oh-lab-image">[\s\S]*?images\/woma-prompt-lab\.png[\s\S]*?<\/figure><\/div><\/div>/);

assert.match(html, /\.ohmee-case \.oh-ai-intro \{[^}]*grid-template-columns: 1fr 1fr;[^}]*align-items: center;/);
assert.match(html, /\.ohmee-case \.oh-ai-intro h3 \{ font-size: 25px;/);
assert.match(html, /\.ohmee-case \.oh-ai-intro h3 \{ font-size: 23px;/);
assert.match(html, /\.ohmee-case \.oh-lab-layout \{ display: grid; grid-template-columns: \.85fr 1\.15fr;/);
assert.match(html, /\.ohmee-case \.oh-lab-layout \{ grid-template-columns: 1fr;/);
assert.match(html, /\.ohmee-case \.oh-diagram-heading h3 \{ font-size: 25px;/);
assert.match(html, /\.ohmee-case \.oh-diagram-heading h3 \{ font-size: 23px;/);
assert.equal(html.includes('.ohmee-case .oh-insight-grid,.ohmee-case .oh-ai-intro { gap: 35px; }'), false,
  'AI subtitle and description spacing remains consistent at tablet widths');

console.log('PASS: approved OhMee copy, subtitle hierarchy, and supporting text placement');
