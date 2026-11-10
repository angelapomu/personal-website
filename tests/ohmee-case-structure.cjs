const fs = require('node:fs');
const assert = require('node:assert/strict');
const html = fs.readFileSync(require('node:path').join(__dirname, '../index.html'), 'utf8');
const ids = ['case-background','case-research','case-experience','case-architecture','case-results','case-next'];
for (const id of ids) {
  assert.equal((html.match(new RegExp('id="' + id + '"', 'g')) || []).length, 1, id + ' is unique');
  assert.equal((html.match(new RegExp('data-case-section="' + id + '"', 'g')) || []).length, 2, id + ' has desktop and mobile navigation');
}
assert.doesNotMatch(html, /setOhmeeChaptersOpen|ohmeeChapterToggle|data-ohmee-mode/, 'obsolete interactions are removed');
console.log('PASS: unique document destinations and both navigation surfaces');
