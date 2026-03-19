const { chromium } = require('/opt/homebrew/lib/node_modules/@playwright/test/node_modules/playwright');
const path = require('path');
const fs = require('fs');

const SCREENSHOTS_DIR = path.join(__dirname, 'playwright-screenshots');

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

const consoleErrors = [];
const consoleWarnings = [];
const screenshotLog = [];

let screenshotIndex = 0;

async function screenshot(page, name) {
  screenshotIndex++;
  const filename = `${String(screenshotIndex).padStart(3, '0')}-${name}.png`;
  const filepath = path.join(SCREENSHOTS_DIR, filename);
  await page.screenshot({ path: filepath, fullPage: true });
  screenshotLog.push({ index: screenshotIndex, name, filename });
  console.log(`[SCREENSHOT ${screenshotIndex}] ${name} -> ${filename}`);
  return filepath;
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 }
  });
  const page = await context.newPage();

  // Capture console output
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    if (type === 'error') {
      consoleErrors.push(text);
      console.log(`[CONSOLE ERROR] ${text}`);
    } else if (type === 'warning' || type === 'warn') {
      consoleWarnings.push(text);
      console.log(`[CONSOLE WARN] ${text}`);
    }
  });

  page.on('pageerror', err => {
    consoleErrors.push(`PAGE ERROR: ${err.message}`);
    console.log(`[PAGE ERROR] ${err.message}`);
  });

  // ============================================================
  // STEP 1: Load the page
  // ============================================================
  console.log('\n=== STEP 1: Loading localhost:5173 ===');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await sleep(1000);
  await screenshot(page, 'initial-load');

  // Get page title and main content
  const title = await page.title();
  const bodyText = await page.locator('body').innerText().catch(() => '(could not get text)');
  console.log(`[PAGE TITLE] ${title}`);
  console.log(`[BODY TEXT PREVIEW] ${bodyText.substring(0, 500)}`);

  // ============================================================
  // STEP 2: Intro Page — look for buttons / start elements
  // ============================================================
  console.log('\n=== STEP 2: Intro Page Exploration ===');

  // Find all buttons on page
  const buttons = await page.locator('button').all();
  console.log(`[BUTTONS FOUND] ${buttons.length}`);
  for (let i = 0; i < buttons.length; i++) {
    const text = await buttons[i].innerText().catch(() => '(no text)');
    const visible = await buttons[i].isVisible().catch(() => false);
    console.log(`  Button ${i}: "${text}" visible=${visible}`);
  }

  // Find clickable elements with role
  const links = await page.locator('a, [role="button"], [onclick]').all();
  console.log(`[LINKS/CLICKABLES FOUND] ${links.length}`);

  // Try clicking the first visible button
  const visibleButtons = await page.locator('button:visible').all();
  if (visibleButtons.length > 0) {
    const firstBtnText = await visibleButtons[0].innerText().catch(() => '');
    console.log(`[CLICKING] First visible button: "${firstBtnText}"`);
    await visibleButtons[0].click();
    await sleep(800);
    await screenshot(page, 'after-first-button-click');
  }

  // ============================================================
  // STEP 3: Continue clicking through — detect phase changes
  // ============================================================
  console.log('\n=== STEP 3: Clicking through screens ===');

  // Try to get current phase from page
  async function getCurrentPhase() {
    return await page.evaluate(() => {
      // Try zustand store
      const storeKeys = Object.keys(window).filter(k => k.includes('store') || k.includes('game'));
      return storeKeys.join(', ') || 'unknown';
    }).catch(() => 'unknown');
  }

  // Click through multiple screens
  for (let round = 0; round < 20; round++) {
    const visBtn = await page.locator('button:visible').all();
    if (visBtn.length === 0) {
      console.log(`[Round ${round}] No visible buttons found`);
      await sleep(500);
      continue;
    }

    const btnTexts = [];
    for (const btn of visBtn) {
      const t = await btn.innerText().catch(() => '');
      btnTexts.push(t.trim());
    }
    console.log(`[Round ${round}] Visible buttons: ${btnTexts.join(' | ')}`);

    // Pick a strategic button — prefer "continue", "next", "start", "begin", "proceed"
    const priority = ['begin', 'start', 'continue', 'next', 'proceed', 'enter', 'investigate', 'open', 'click'];
    let clickTarget = null;
    for (const keyword of priority) {
      for (let i = 0; i < visBtn.length; i++) {
        if (btnTexts[i].toLowerCase().includes(keyword)) {
          clickTarget = visBtn[i];
          console.log(`[Round ${round}] Choosing button with keyword "${keyword}": "${btnTexts[i]}"`);
          break;
        }
      }
      if (clickTarget) break;
    }

    // If no priority match, click first button
    if (!clickTarget) {
      clickTarget = visBtn[0];
      console.log(`[Round ${round}] Clicking first button: "${btnTexts[0]}"`);
    }

    const prevUrl = page.url();
    await clickTarget.click().catch(e => console.log(`[CLICK ERROR] ${e.message}`));
    await sleep(600);

    // Screenshot if page changed
    const currentBtns = await page.locator('button:visible').all();
    const currentTexts = [];
    for (const b of currentBtns) {
      const t = await b.innerText().catch(() => '');
      currentTexts.push(t.trim());
    }

    if (currentTexts.join('|') !== btnTexts.join('|')) {
      await screenshot(page, `round-${round}-after-click`);
    }
  }

  // ============================================================
  // STEP 4: Deeper exploration - look for specific game elements
  // ============================================================
  console.log('\n=== STEP 4: Deep exploration of current state ===');
  await screenshot(page, 'deep-exploration-start');

  // Look for specific elements mentioned in CLAUDE.md
  const elements = {
    'notifications': '.notification, [class*="notif"]',
    'document-reader': '[class*="document"], [class*="Document"]',
    'osint-tool': '[class*="osint"], [class*="OSINT"]',
    'suspect-board': '[class*="suspect"], [class*="Suspect"]',
    'crt-overlay': '.crt',
    'intro-page': '[class*="intro"], [class*="Intro"]',
    'apartment-page': '[class*="apartment"], [class*="Apartment"]',
    'investigation-page': '[class*="investigation"], [class*="Investigation"]',
  };

  for (const [name, selector] of Object.entries(elements)) {
    const count = await page.locator(selector).count();
    console.log(`[ELEMENT] ${name}: ${count} found`);
  }

  // ============================================================
  // STEP 5: Try navigating through ALL phases manually
  // ============================================================
  console.log('\n=== STEP 5: Reload and click through carefully ===');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await sleep(1000);
  await screenshot(page, 'fresh-reload');

  // Collect page HTML structure
  const htmlPreview = await page.evaluate(() => {
    const els = document.body.querySelectorAll('h1, h2, h3, h4, button, a, p, [class*="phase"], [class*="page"]');
    return Array.from(els).slice(0, 40).map(el => ({
      tag: el.tagName,
      class: el.className,
      text: el.innerText?.substring(0, 80)
    }));
  });
  console.log('[HTML STRUCTURE]');
  htmlPreview.forEach(el => console.log(`  <${el.tag} class="${el.class}"> ${el.text}`));

  // Systematic click-through with screenshots at every step
  let stepCount = 0;
  const maxSteps = 50;
  const visitedStates = new Set();

  async function getPageState() {
    const text = await page.locator('body').innerText().catch(() => '');
    return text.substring(0, 200);
  }

  async function clickAndCapture(label) {
    stepCount++;
    const state = await getPageState();
    const stateKey = state.substring(0, 100);

    if (!visitedStates.has(stateKey)) {
      visitedStates.add(stateKey);
      await screenshot(page, `step-${stepCount}-${label}`);
    }
  }

  await clickAndCapture('initial');

  // ============================================================
  // Try all buttons systematically
  // ============================================================
  for (let pass = 0; pass < maxSteps; pass++) {
    const allBtns = await page.locator('button:visible').all();
    if (allBtns.length === 0) break;

    // Click through all buttons one by one on each pass
    for (let bi = 0; bi < allBtns.length && bi < 5; bi++) {
      const btn = await page.locator('button:visible').nth(bi);
      const text = await btn.innerText().catch(() => '');
      console.log(`[Pass ${pass}, btn ${bi}] Clicking: "${text}"`);
      await btn.click().catch(e => console.log(`  Error: ${e.message}`));
      await sleep(500);
      await clickAndCapture(`pass${pass}-btn${bi}-${text.substring(0, 20).replace(/\s+/g, '_')}`);

      // Check for modals or overlays that appeared
      const modalCount = await page.locator('[role="dialog"], [class*="modal"], [class*="overlay"]').count();
      if (modalCount > 0) {
        console.log(`  [MODAL/OVERLAY] ${modalCount} found`);
        await screenshot(page, `modal-pass${pass}-btn${bi}`);
      }
    }
  }

  // ============================================================
  // STEP 6: Final state capture
  // ============================================================
  console.log('\n=== STEP 6: Final state ===');
  await screenshot(page, 'final-state');

  const finalText = await page.locator('body').innerText().catch(() => '');
  console.log(`[FINAL PAGE TEXT] ${finalText.substring(0, 1000)}`);

  // ============================================================
  // STEP 7: Try path navigation (A, B, C)
  // ============================================================
  console.log('\n=== STEP 7: Trying path selection (A/B/C) ===');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await sleep(800);

  // Check if there are path selection buttons
  const pathButtons = await page.locator('button').all();
  for (const btn of pathButtons) {
    const text = await btn.innerText().catch(() => '');
    if (text.match(/path|A|B|C|route|choice/i)) {
      console.log(`[PATH BUTTON] "${text}"`);
    }
  }

  // ============================================================
  // SUMMARY REPORT
  // ============================================================
  console.log('\n==============================================');
  console.log('SUMMARY REPORT');
  console.log('==============================================');
  console.log(`\nCONSOLE ERRORS (${consoleErrors.length}):`);
  consoleErrors.forEach((e, i) => console.log(`  ${i + 1}. ${e}`));

  console.log(`\nCONSOLE WARNINGS (${consoleWarnings.length}):`);
  consoleWarnings.forEach((w, i) => console.log(`  ${i + 1}. ${w}`));

  console.log(`\nSCREENSHOTS TAKEN (${screenshotLog.length}):`);
  screenshotLog.forEach(s => console.log(`  ${s.index}. ${s.filename}`));

  await browser.close();
}

main().catch(err => {
  console.error('[FATAL ERROR]', err);
  process.exit(1);
});
