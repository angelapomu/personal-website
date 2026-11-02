const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const assert = require('node:assert/strict');

const html = readFileSync(join(__dirname, '../index.html'), 'utf8');
const experienceStart = html.indexOf('<section class="oh-section" id="case-experience"');
const architectureStart = html.indexOf('<section class="oh-section" id="case-architecture"');
const iterationStart = html.indexOf('<section class="oh-section" id="case-iteration"', architectureStart);
assert.notEqual(experienceStart, -1, 'OhMee experience chapter exists');
assert.notEqual(architectureStart, -1, 'OhMee workflow chapter exists');
assert.notEqual(iterationStart, -1, 'OhMee iteration chapter follows workflow');
const experience = html.slice(experienceStart, architectureStart);
const architecture = html.slice(architectureStart, iterationStart);

const decisionTableIndex = architecture.indexOf('<div class="oh-decision-table-wrap">');
const journeyIndex = architecture.indexOf('<div class="oh-journey">');
const flowIndex = architecture.indexOf('<div class="case-detail-module oh-flow-module">');
assert.equal(experience.includes('<div class="oh-journey">'), false, 'the experience cards move out of the core-experience chapter');
assert.equal((architecture.match(/<div class="oh-journey">/g) || []).length, 1, 'the experience cards appear once in the workflow chapter');
assert.ok(decisionTableIndex < journeyIndex && journeyIndex < flowIndex, 'the experience cards follow the decision table and precede the workflow diagram');

const workflowIndex = architecture.indexOf('AI 工作流设计');
const implementationIndex = architecture.indexOf('前后端实现技术选型');
const promptIndex = architecture.indexOf('提示词和测试集产出');
const vibeIndex = architecture.indexOf('Vibe Coding 全栈开发');
assert.ok(workflowIndex < implementationIndex, 'front/back-end module follows AI workflow');
assert.ok(implementationIndex < promptIndex, 'Prompt Lab follows the front/back-end module');
assert.ok(promptIndex < vibeIndex, 'Vibe Coding follows the prompt module');

const implementation = architecture.slice(implementationIndex, promptIndex);
assert.match(implementation, /Next\.js · React · TypeScript · PWA/);
assert.match(implementation, /IndexedDB/);
assert.match(implementation, /后端与数据库[\s\S]*Supabase \/ PostgreSQL/);
assert.doesNotMatch(implementation, /Figma Make|Google Stitch|Claude|Codex/);

const vibe = architecture.slice(vibeIndex);
assert.match(vibe, /Figma、Figma Make、Google Stitch、Claude 和 Codex/);
assert.match(vibe, /woma-figma-workspace\.png/);
assert.match(html, /04 \/ 流程设计/);
assert.match(html, /data-case-section="case-architecture"[^>]*>\s*<span>04<\/span> 流程设计/);

console.log('PASS: workflow, implementation, prompt, and Vibe Coding sections are separated and ordered');
