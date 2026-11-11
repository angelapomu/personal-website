const fs = require('node:fs');
const assert = require('node:assert/strict');
const html = fs.readFileSync(require('node:path').join(__dirname, '../index.html'), 'utf8');
const ohmee = html.slice(html.indexOf('<section class="view ohmee-case"'), html.indexOf('<section class="view" id="project-contextual"'));
for (const copy of ['背景','初步验证','关键决策','产品设计','指标与验证','风险与下一步']) assert.ok(ohmee.includes(copy));
assert.doesNotMatch(ohmee, /Claude Haiku|Sonnet|北极星基线|36 位活跃用户|250\+|待放入|点击.*试试看|放大查看|查看完整截图|oh-footnote|oh-reflection|oh-rewrite-demo/);
console.log('PASS: document copy omits sample claims, placeholders, and scattered annotations');
