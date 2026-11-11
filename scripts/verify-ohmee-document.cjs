// Optional: supply Playwright Core through PLAYWRIGHT_CORE_PATH.
const { chromium } = require(process.env.PLAYWRIGHT_CORE_PATH || 'playwright-core');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const output = path.resolve(process.env.OHMEE_SCREENSHOT_DIR || 'work/ohmee-document-review');
const chapters = ['case-background','case-research','case-experience','case-architecture','case-results','case-next'];

async function geometry(page, root = '') {
  return page.evaluate(root => {
    const at = selector => document.querySelector(root + selector);
    const value = (selector, property) => getComputedStyle(at(selector))[property];
    const columns = selector => value(selector, 'gridTemplateColumns').split(' ').length;
    return {
      header: at('.top').getBoundingClientRect().height,
      title: value('h1','fontSize'),
      overviewColumns: columns('.q'),
      galleryColumns: columns('.gal'),
      documentColumns: columns('.w'),
      directory: value('.toc','display'),
      chapter: value('.doc h2','fontSize'),
      body: value('.doc p','fontSize')
    };
  }, root);
}

(async () => {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const errors = [];
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(process.env.OHMEE_URL || 'http://127.0.0.1:4394/?motion=off&v=reference-layout#project/woma', { waitUntil: 'domcontentloaded' });
    await page.locator('#project-woma.on').waitFor();
    await page.evaluate(() => Promise.race([document.fonts.ready, new Promise(resolve => setTimeout(resolve, 6000))]));
    assert.deepEqual(await page.locator('.doc > section').evaluateAll(nodes => nodes.map(node => node.id)), chapters);
    assert.equal(await page.locator('.q > div').count(), 4);
    assert.equal(await page.locator('.gal > figure img').count(), 4);
    const images = await page.locator('#project-woma img').evaluateAll(async nodes => Promise.all(nodes.map(async image => {
      image.loading = 'eager';
      try { await image.decode(); return null; } catch { return image.getAttribute('src'); }
    })));
    assert.deepEqual(images.filter(Boolean), [], 'real screenshots and icon decode');
    assert.equal(await page.locator('.studio-header').isVisible(), false, 'one project header');
    assert.equal(await page.locator('html').evaluate(node => getComputedStyle(node).scrollBehavior), 'auto', 'reduced motion');
    assert.equal(await page.locator('.evidence img').count(), 6, 'research, workflow, architecture, design workspace, and test evidence are present');
    assert.equal(await page.locator('.document-table').count(), 2, 'decision and implementation tables are present');
    assert.equal(await page.locator('.mets').count(), 3, 'research, user testing, and prompt evaluation are separate');

    async function select(id) {
      const nav = page.viewportSize().width <= 900 ? '.tabs' : '.toc';
      await page.locator(`${nav} [data-case-section="${id}"]`).click();
      await page.waitForFunction(id => {
        const section = document.getElementById(id);
        return section === document.activeElement && document.querySelector('.toc [aria-current="location"]').dataset.caseSection === id;
      }, id);
      const heading = await page.locator(`#${id} h2`).boundingBox();
      const chrome = page.viewportSize().width <= 900 ? (await page.locator('.tabs').boundingBox()).y + (await page.locator('.tabs').boundingBox()).height : 64;
      assert.ok(heading.y >= chrome - 1, `chapter ${id} visible below navigation`);
    }

    // Optional direct comparison against the owner's local, read-only reference.
    const referencePath = process.env.OHMEE_REFERENCE_HTML;
    const reference = referencePath ? await browser.newPage({ reducedMotion: 'reduce' }) : null;
    if (reference) await reference.goto(pathToFileURL(referencePath).href, { waitUntil: 'domcontentloaded' });
    for (const width of [1440, 1100, 1024, 849, 600, 375, 320]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      await page.waitForFunction(() => document.querySelector('.toc [aria-current="location"]').dataset.caseSection === 'case-background');
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, `no page overflow at ${width}px`);
      const logo = await page.locator('.oh-app-logo').boundingBox();
      assert.ok(Math.abs(logo.width - logo.height) < 1, `square icon at ${width}px`);
      assert.equal(await page.locator('.tabs').isVisible(), width <= 900);
      assert.equal(await page.locator('.toc').isVisible(), width > 900);
      if (reference) {
        await reference.setViewportSize({ width, height: 1000 });
        const expected = await geometry(reference);
        const actual = await geometry(page, '#project-woma ');
        // Compare the reference's main responsive structure and type scale.
        assert.deepEqual(actual, expected, `reference geometry at ${width}px`);
      }
      if ([1440,849,375].includes(width)) {
        await page.screenshot({ path: path.join(output, `reference-${width}-top.png`) });
        await page.locator('.gal').scrollIntoViewIfNeeded();
        await page.screenshot({ path: path.join(output, `reference-${width}-gallery.png`) });
        await select('case-architecture');
        await page.screenshot({ path: path.join(output, `reference-${width}-document.png`) });
        await select('case-research');
        await page.screenshot({ path: path.join(output, `evidence-${width}-research.png`) });
        await page.locator('.evidence-pair').screenshot({ path: path.join(output, `evidence-${width}-screenshots.png`) });
        await select('case-results');
        await page.screenshot({ path: path.join(output, `evidence-${width}-data.png`) });
        await page.locator('#case-results .diagram').screenshot({ path: path.join(output, `evidence-${width}-prompt.png`) });
      } else await select('case-architecture');
      const tables = await page.locator('.table-wrap').evaluateAll(nodes => nodes.map(node => ({
        outer: node.clientWidth, inner: node.scrollWidth, overflow: getComputedStyle(node).overflowX,
        headers: [...node.querySelectorAll('thead th')].map(header => header.textContent),
        rowDisplay: getComputedStyle(node.querySelector('tbody tr')).display,
        rowWidth: node.querySelector('tbody tr').getBoundingClientRect().width,
        cellWidths: [...node.querySelectorAll('tbody tr:first-child > *')].map(cell => cell.getBoundingClientRect().width),
        cellBorders: [...node.querySelectorAll('tbody tr:first-child > *')].map(cell => getComputedStyle(cell).borderLeftWidth),
        labelled: [...node.querySelectorAll('tbody :is(td,th)')].every(cell => cell.hasAttribute('data-label'))
      })));
      tables.forEach(table => {
        assert.equal(table.headers.length, 3);
        assert.ok(table.labelled, 'responsive cells retain their column labels');
        assert.ok(table.inner <= table.outer + 1, 'tables fit without horizontal scrolling');
        if (width <= 700) {
          assert.equal(table.rowDisplay, 'grid', 'phone rows become vertical entries');
          assert.ok(table.cellWidths.every(cellWidth => Math.abs(cellWidth - table.rowWidth) < 1), 'phone entries use the full available width');
        }
        else assert.ok(table.cellBorders.every(border => border === '1px'), 'desktop cells have vertical grid lines');
      });
      const frames = await page.locator('.p,.research-shot > button').evaluateAll(nodes => nodes.map(node => {
        const frame = node.getBoundingClientRect(), image = node.querySelector('img').getBoundingClientRect();
        return image.left >= frame.left - 1 && image.right <= frame.right + 1 && image.top >= frame.top - 1 && image.bottom <= frame.bottom + 1;
      }));
      assert.ok(frames.every(Boolean), 'screenshots fit inside their frames');
      if (width > 900) assert.ok(Math.abs((await page.locator('.toc').boundingBox()).y - 96) < 1, 'sticky directory');
      await select('case-results');
      await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
      await page.waitForFunction(() => document.querySelector('.toc [aria-current="location"]').dataset.caseSection === 'case-next');
      assert.ok(await page.locator('#ohmee-progress').evaluate(node => parseFloat(node.style.width) > 99), 'reading progress reaches the end');
      console.log(`PASS: reference layout and chapter navigation at ${width}px`);
    }
    if (reference) await reference.close();
    await page.locator('.gal button').first().click();
    assert.equal(await page.locator('#image-dialog').evaluate(node => node.open), true);
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#image-dialog').evaluate(node => node.open), false);
    assert.equal(await page.locator('.gal button').first().evaluate(node => node === document.activeElement), true);
    await page.locator('.top .cvb').click();
    await page.locator('#home.on').waitFor();
    assert.equal(await page.locator('.studio-header').isVisible(), true, 'homepage header restored');
    await page.goto('http://127.0.0.1:4394/?motion=off#project/woma');
    await page.locator('.top > a').first().click();
    await page.locator('#home.on').waitFor();
    for (const slug of ['contextual','whybother','shelter']) {
      await page.goto(`http://127.0.0.1:4394/?motion=off#project/${slug}`);
      await page.locator(`#project-${slug}.on`).waitFor();
      assert.equal(await page.locator('.studio-header').isVisible(), true);
    }
    assert.deepEqual(errors, [], 'no JavaScript page errors');
    console.log('PASS: real images, image viewer/Escape/focus, reduced motion, resume/return routes, other project routes, and no JavaScript errors');
    console.log(`Screenshots: ${output}`);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
