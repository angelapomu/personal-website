const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const assert = require('node:assert/strict');
const html = readFileSync(join(__dirname, '../index.html'), 'utf8');
const start = html.indexOf('<section class="view ohmee-case"');
const end = html.indexOf('<footer class="oh-case-footer oh-wrap">', start);
const ohmee = html.slice(start, end);
for (const text of ['0-1产品owner','从网络热点，捕捉底层需求和心理机制','MVP需要验证的核心假设','用户数据','前后端实现技术选型','提示词和测试集产出','Vibe Coding 全栈开发','统计样本、时间窗口与计算口径待补充']) {
  assert.ok(ohmee.includes(text), `preserves approved copy: ${text}`);
}
assert.doesNotMatch(ohmee, /class="oh-reflection"|<h[234][^>]*>测试数据<\/h[234]>|考虑方面|谁对它感兴趣/);
assert.doesNotMatch(ohmee, /Claude Haiku|Sonnet|北极星基线|36 位活跃用户|250\+/);
assert.match(ohmee, /id="oh-delivery-title"[^>]*><span class="oh-chapter-number">05<\/span>MVP实现<\/h2>/);
for (const match of ohmee.matchAll(/<div class="oh-section-heading">([\s\S]*?)<\/div>/g)) {
  assert.match(match[1], /^<h2 id="/, 'chapter titles are actual headings');
  assert.doesNotMatch(match[1], /<h2[^>]*class="oh-subtitle"/, 'chapter summaries do not masquerade as headings');
}
assert.equal((ohmee.match(/data-case-section=/g) || []).length, 7, 'the directory has one link per chapter');
assert.match(ohmee, /<div class="case-detail-document oh-document oh-wrap">[\s\S]*<nav class="case-detail-directory oh-chapter-nav"[\s\S]*<div class="case-detail-content oh-story">/);
assert.match(ohmee, /class="case-detail-intro oh-ai-intro"><div><h3 class="case-detail-subtitle">Vibe Coding 全栈开发<\/h3><\/div><p>/);
console.log('PASS: approved copy, real headings, and document hierarchy are preserved');
