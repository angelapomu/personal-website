const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const assert = require('node:assert/strict');
const html = readFileSync(join(__dirname, '../index.html'), 'utf8');
const start = html.indexOf('<section class="view ohmee-case"');
const end = html.indexOf('<footer class="oh-case-footer oh-wrap">', start);
assert.ok(start >= 0 && end > start);
const ohmee = html.slice(start, end);
assert.match(ohmee, /class="oh-project-heading">\s*<img class="oh-app-logo" src="images\/woma\.png"[^>]*>\s*<h1 id="case-project-title">/);
const hypothesis = ohmee.match(/<aside class="oh-hypothesis">([\s\S]*?)<\/aside>/);
assert.ok(hypothesis);
assert.doesNotMatch(hypothesis[1], /<img\b/);
const groups = [...ohmee.matchAll(/<dl class="([^"]*\boh-data-facts\b[^"]*)"/g)].map(match => match[1]);
assert.equal(groups.length, 5);
for (const group of ['oh-numbers','oh-research-numbers','oh-lab-numbers','oh-analysis-number','oh-result-numbers']) {
  assert.ok(groups.some(classes => classes.split(/\s+/).includes(group)), `${group} uses the shared facts component`);
}
assert.match(ohmee, /<dt>三周留存<\/dt><dd><span>&gt;<\/span>30<span>%<\/span><\/dd>/);
assert.match(ohmee, /<dt>用户消息聚类分析<\/dt><dd>553<span>条<\/span><\/dd>/);
console.log('PASS: app identity and the five evidence-backed fact groups are preserved');
