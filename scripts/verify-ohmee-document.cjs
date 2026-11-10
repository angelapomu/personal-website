// Optional browser check: provide Playwright Core through PLAYWRIGHT_CORE_PATH.
const { chromium } = require(process.env.PLAYWRIGHT_CORE_PATH || 'playwright-core');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const output = path.resolve(process.env.OHMEE_SCREENSHOT_DIR || 'work/ohmee-document-review');
const chapters = ['case-background','case-research','case-experience','case-architecture','case-delivery','case-iteration','case-results'];

(async () => {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const errors = [];
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(process.env.OHMEE_URL || 'http://127.0.0.1:4394/?motion=off#project/woma', { waitUntil: 'domcontentloaded' });
    await page.locator('#project-woma.on').waitFor();
    await page.evaluate(() => Promise.race([document.fonts.ready, new Promise(resolve => setTimeout(resolve, 6000))]));
    assert.deepEqual(await page.locator('.oh-story > section').evaluateAll(nodes => nodes.map(node => node.id)), chapters);
    assert.equal(await page.locator('.oh-story section[id]').count(), 7, 'chapters are siblings, with no nested directory destinations');
    const images = await page.locator('#project-woma img').evaluateAll(async nodes => {
      return Promise.all(nodes.map(async image => {
        image.loading = 'eager';
        try { await image.decode(); return null; } catch { return image.getAttribute('src'); }
      }));
    });
    assert.deepEqual(images.filter(Boolean), [], 'all real case images decode successfully');
    const metricStyles = await page.locator('.oh-data-facts').evaluateAll(nodes => nodes.map(node => {
      const style = getComputedStyle(node);
      return { top: style.borderTopWidth, bottom: style.borderBottomWidth, number: getComputedStyle(node.querySelector('dd')).fontSize };
    }));
    assert.equal(new Set(metricStyles.map(style => style.number)).size, 1, 'all five metric groups share the number size');
    assert.deepEqual([metricStyles[0].top, metricStyles[0].bottom], ['0px','0px']);
    metricStyles.slice(1).forEach(style => assert.deepEqual([style.top, style.bottom], ['1px','1px']));
    const logo = await page.locator('.oh-app-logo').boundingBox();
    assert.ok(Math.abs(logo.width - logo.height) < 1, 'logo is square');
    await page.screenshot({ path: path.join(output, 'after-desktop-top.png') });

    async function select(id) {
      console.log(`Checking chapter ${id} at ${page.viewportSize().width}px`);
      if (await page.locator('.oh-chapter-toggle').isVisible()) await page.locator('.oh-chapter-toggle').click();
      await page.locator(`.oh-chapter-links [data-case-section="${id}"]`).click();
      await page.waitForFunction(id => {
        const rect = document.getElementById(id).getBoundingClientRect();
        return rect.top >= 34 && rect.top <= 120;
      }, id);
      assert.equal(await page.locator('.oh-chapter-links [aria-current="location"]').getAttribute('data-case-section'), id);
      assert.equal(await page.locator(`#${id}`).evaluate(node => node === document.activeElement), true);
    }
    for (const [id, name] of [['case-research','research'],['case-architecture','flow'],['case-delivery','delivery']]) {
      await select(id);
      await page.screenshot({ path: path.join(output, `after-desktop-${name}.png`) });
      assert.ok(Math.abs((await page.locator('.oh-chapter-nav').boundingBox()).y - 76) < 2, 'desktop directory remains sticky');
    }
    await select('case-experience');
    await page.locator('[data-ohmee-mode="rewrite"]').click();
    assert.equal(await page.locator('#ohmee-rewrite-demo').getAttribute('data-mode'), 'rewrite');
    await page.locator('[data-ohmee-mode="original"]').click();
    assert.equal(await page.locator('#ohmee-rewrite-demo').getAttribute('data-mode'), 'original');
    await page.locator('#case-research [data-preview-src]').first().click();
    assert.equal(await page.locator('#image-dialog').evaluate(node => node.open), true);
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#image-dialog').evaluate(node => node.open), false);

    for (const width of [1024, 849, 600, 375, 320]) {
      await page.setViewportSize({ width, height: 892 });
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      await page.waitForFunction(() => document.querySelector('.oh-chapter-links [aria-current="location"]').dataset.caseSection === 'case-background');
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
      assert.equal(overflow, false, `no horizontal page overflow at ${width}px`);
      const box = await page.locator('.oh-app-logo').boundingBox();
      assert.ok(Math.abs(box.width - box.height) < 1, `square logo at ${width}px`);
      if (width <= 960) {
        assert.equal(await page.locator('.oh-chapter-toggle').isVisible(), true);
        assert.equal(await page.locator('.oh-chapter-links').isVisible(), false);
        await page.locator('.oh-chapter-toggle').click();
        await page.keyboard.press('Escape');
        assert.equal(await page.locator('.oh-chapter-toggle').getAttribute('aria-expanded'), 'false');
        assert.equal(await page.locator('.oh-chapter-toggle').evaluate(node => node === document.activeElement), true);
        await select('case-delivery');
        assert.equal(await page.locator('.oh-chapter-links').isVisible(), false);
      }
      if (width === 849 || width === 375) {
        await page.screenshot({ path: path.join(output, `after-${width}-delivery.png`) });
        await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
        await page.waitForFunction(() => document.querySelector('.oh-chapter-links [aria-current="location"]').dataset.caseSection === 'case-background');
        await page.screenshot({ path: path.join(output, `after-${width}-top.png`) });
        await select('case-background');
        await page.screenshot({ path: path.join(output, `after-${width}-document.png`) });
      }
    }
    await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
    await page.waitForFunction(() => document.querySelector('.oh-chapter-links [aria-current="location"]').dataset.caseSection === 'case-results');
    await page.locator('.oh-case-footer > a').first().click();
    await page.locator('#home.on').waitFor();
    assert.equal(await page.locator('#project-woma').isVisible(), false, 'return to portfolio works');
    assert.deepEqual(errors, [], 'no page JavaScript errors');
    console.log('PASS: seven sibling chapters, real images, metrics, square icon, sticky directory, compact menu, focus, rewrite, image viewer, 6 viewport widths, reduced motion, and portfolio return');
    console.log(`Screenshots: ${output}`);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
