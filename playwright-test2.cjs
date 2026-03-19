const { chromium } = require('/opt/homebrew/lib/node_modules/@playwright/test/node_modules/playwright');
const path = require('path');
const fs = require('fs');

const SCREENSHOTS_DIR = path.join(__dirname, 'playwright-screenshots');
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

const consoleErrors = [];
const consoleWarnings = [];
const log = [];
let idx = 0;

async function ss(page, name) {
  idx++;
  const filename = `${String(idx).padStart(3, '0')}-${name.replace(/[^a-zA-Z0-9_-]/g, '_')}.png`;
  const filepath = path.join(SCREENSHOTS_DIR, filename);
  await page.screenshot({ path: filepath, fullPage: true });
  log.push(filename);
  console.log(`  [SS ${idx}] ${filename}`);
}

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function getPageInfo(page) {
  return await page.evaluate(() => {
    const body = document.body;
    const text = body.innerText?.substring(0, 400) || '';
    const btns = Array.from(document.querySelectorAll('button')).map(b => b.innerText?.trim().replace(/\n/g, ' ').substring(0, 50));
    const inputs = Array.from(document.querySelectorAll('input, textarea')).map(i => `${i.type}:${i.placeholder}`);
    const headings = Array.from(document.querySelectorAll('h1,h2,h3,h4')).map(h => h.innerText?.trim().substring(0, 60));
    return { text, btns, inputs, headings };
  });
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    if (type === 'error') { consoleErrors.push(text); console.log(`[ERR] ${text}`); }
    else if (type === 'warning' || type === 'warn') { consoleWarnings.push(text); }
  });
  page.on('pageerror', err => { consoleErrors.push(`PAGE ERR: ${err.message}`); console.log(`[PAGE ERR] ${err.message}`); });

  // ===== SCREEN 1: Intro / Title Screen =====
  console.log('\n=== SCREEN 1: Title Screen ===');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await sleep(800);
  let info = await getPageInfo(page);
  console.log('Headings:', info.headings);
  console.log('Buttons:', info.btns);
  console.log('Text:', info.text.substring(0, 200));
  await ss(page, 'S1-title-screen');

  // ===== Test HOW TO PLAY =====
  console.log('\n=== TEST: HOW TO PLAY button ===');
  const howToPlayBtn = page.locator('button', { hasText: 'HOW TO PLAY' });
  if (await howToPlayBtn.isVisible()) {
    await howToPlayBtn.click();
    await sleep(600);
    info = await getPageInfo(page);
    console.log('After HOW TO PLAY click:', info.text.substring(0, 300));
    await ss(page, 'S1b-how-to-play-modal');
    // Close it - press Escape or find close button
    await page.keyboard.press('Escape');
    await sleep(400);
    await ss(page, 'S1b-how-to-play-closed');
  }

  // ===== Test ABOUT =====
  console.log('\n=== TEST: ABOUT button ===');
  const aboutBtn = page.locator('button', { hasText: 'ABOUT' });
  if (await aboutBtn.isVisible()) {
    await aboutBtn.click();
    await sleep(600);
    info = await getPageInfo(page);
    console.log('After ABOUT click:', info.text.substring(0, 300));
    await ss(page, 'S1c-about-modal');
    await page.keyboard.press('Escape');
    await sleep(400);
    await ss(page, 'S1c-about-closed');
  }

  // ===== SCREEN 2: Start New Game =====
  console.log('\n=== SCREEN 2: Click NEW GAME ===');
  const newGameBtn = page.locator('button', { hasText: 'NEW GAME' });
  await newGameBtn.click();
  await sleep(1000);
  info = await getPageInfo(page);
  console.log('After NEW GAME click:');
  console.log('  Headings:', info.headings);
  console.log('  Buttons:', info.btns);
  console.log('  Text:', info.text.substring(0, 300));
  await ss(page, 'S2-after-new-game');

  // ===== SCREEN 3: "SPACE TO CONTINUE" - press Space =====
  console.log('\n=== SCREEN 3: Press Space to continue ===');
  await page.keyboard.press('Space');
  await sleep(800);
  info = await getPageInfo(page);
  console.log('After Space press:');
  console.log('  Headings:', info.headings);
  console.log('  Buttons:', info.btns);
  console.log('  Text:', info.text.substring(0, 300));
  await ss(page, 'S3-after-space');

  // Also try clicking on the screen itself
  await page.locator('body').click({ position: { x: 640, y: 450 } });
  await sleep(600);
  info = await getPageInfo(page);
  await ss(page, 'S3b-after-body-click');
  console.log('After body click:', info.text.substring(0, 200));

  // ===== Try clicking any visible elements =====
  console.log('\n=== Trying all interactive elements ===');
  for (let attempt = 0; attempt < 30; attempt++) {
    info = await getPageInfo(page);
    const prevText = info.text.substring(0, 100);

    // Try buttons first
    const btns = await page.locator('button:visible').all();
    if (btns.length > 0) {
      const txt = await btns[0].innerText().catch(() => '');
      console.log(`  [Attempt ${attempt}] Clicking button: "${txt.replace(/\n/g,' ')}"`);
      await btns[0].click().catch(() => {});
      await sleep(500);
    } else {
      // No buttons — try pressing various keys
      const keys = ['Space', 'Enter', 'ArrowRight', 'ArrowDown'];
      const key = keys[attempt % keys.length];
      console.log(`  [Attempt ${attempt}] Pressing key: ${key}`);
      await page.keyboard.press(key);
      await sleep(400);
    }

    const newInfo = await getPageInfo(page);
    const newText = newInfo.text.substring(0, 100);
    if (newText !== prevText) {
      console.log(`  State changed! New text: "${newText.substring(0, 80)}"`);
      await ss(page, `attempt-${attempt}-state-change`);
    }
  }

  // ===== Final capture =====
  console.log('\n=== Final state ===');
  info = await getPageInfo(page);
  console.log('Final headings:', info.headings);
  console.log('Final buttons:', info.btns);
  console.log('Final text:', info.text.substring(0, 400));
  await ss(page, 'final-state');

  // ===== Reload and test apartment/investigation phases using store =====
  console.log('\n=== Trying to inject state via Zustand ===');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await sleep(800);

  // Inspect the window object for the store
  const storeInfo = await page.evaluate(() => {
    // Look for zustand store
    const keys = Object.keys(window);
    return {
      keys: keys.filter(k => !['performance', 'location', 'history', 'document', 'window', 'self', 'top', 'parent', 'frames', 'navigator', 'screen', 'innerWidth', 'innerHeight', 'scrollX', 'scrollY', 'pageXOffset', 'pageYOffset', 'screenX', 'screenY', 'outerWidth', 'outerHeight', 'devicePixelRatio'].includes(k)).slice(0, 30)
    };
  });
  console.log('Window keys:', storeInfo.keys);

  // ===== Try navigating phases directly =====
  // Phase: intro -> apartment -> investigation -> convergence -> ending
  const phases = ['intro', 'apartment', 'investigation', 'convergence', 'ending'];

  for (const phase of phases) {
    console.log(`\n=== Testing phase: ${phase} ===`);
    await page.evaluate((p) => {
      // Try to find and call zustand store
      const globalKeys = Object.keys(window);
      for (const key of globalKeys) {
        try {
          const val = window[key];
          if (val && typeof val === 'object' && val.getState) {
            const state = val.getState();
            if (state && state.phase !== undefined) {
              val.setState({ phase: p });
              console.log(`Set phase to ${p} via store key: ${key}`);
              return true;
            }
          }
        } catch(e) {}
      }
      return false;
    }, phase);
    await sleep(600);
    info = await getPageInfo(page);
    console.log(`  Phase ${phase} - headings: ${info.headings}`);
    console.log(`  Phase ${phase} - buttons: ${info.btns.join(' | ')}`);
    console.log(`  Phase ${phase} - text: ${info.text.substring(0, 200)}`);
    await ss(page, `phase-${phase}`);
  }

  // ===== Look for the game store module via React internals =====
  console.log('\n=== Inspecting React component tree ===');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await sleep(800);

  const reactInfo = await page.evaluate(() => {
    // Find React fiber root
    const root = document.getElementById('root') || document.querySelector('[data-reactroot]');
    if (!root) return { error: 'No root found' };

    const fiberKey = Object.keys(root).find(k => k.startsWith('__reactFiber'));
    if (!fiberKey) return { error: 'No fiber key found' };

    // Walk the fiber tree to find components
    const components = [];
    function walk(fiber, depth = 0) {
      if (!fiber || depth > 10) return;
      if (fiber.type && fiber.type.name) {
        const memoized = fiber.memoizedState;
        let stateInfo = '';
        if (memoized && memoized.memoizedState) {
          try { stateInfo = JSON.stringify(memoized.memoizedState).substring(0, 100); } catch(e) {}
        }
        components.push({ name: fiber.type.name, depth, stateInfo });
      }
      walk(fiber.child, depth + 1);
      walk(fiber.sibling, depth);
    }
    walk(root[fiberKey]);
    return { components: components.slice(0, 30) };
  });
  console.log('React tree:', JSON.stringify(reactInfo, null, 2));

  // ===== Try direct store manipulation via React devtools hook =====
  console.log('\n=== Trying React DevTools hook ===');
  const zustandState = await page.evaluate(() => {
    try {
      const hook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
      if (hook) {
        const renderers = hook.renderers;
        if (renderers) {
          for (const [id, renderer] of renderers) {
            try {
              const roots = renderer.getFiberRoots ? renderer.getFiberRoots(id) : null;
              return { hasDevtools: true, rendererCount: renderers.size };
            } catch(e) { return { error: e.message }; }
          }
        }
      }
      return { hasDevtools: false };
    } catch(e) { return { error: e.message }; }
  });
  console.log('Zustand/React devtools:', zustandState);

  // ===== COMPREHENSIVE FLOW: Do the full game manually =====
  console.log('\n=== COMPREHENSIVE FULL GAME FLOW ===');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await sleep(800);

  const flowSteps = [];

  async function captureFlowStep(stepName) {
    const info = await getPageInfo(page);
    flowSteps.push({ step: stepName, headings: info.headings, buttons: info.btns, text: info.text.substring(0, 200) });
    await ss(page, `flow-${stepName}`);
    console.log(`[FLOW: ${stepName}]`);
    console.log(`  Headings: ${info.headings.join(', ')}`);
    console.log(`  Buttons: ${info.btns.join(' | ')}`);
    console.log(`  Text: ${info.text.substring(0, 150)}`);
  }

  await captureFlowStep('01-title');

  // Click NEW GAME
  await page.locator('button', { hasText: 'NEW GAME' }).click();
  await sleep(800);
  await captureFlowStep('02-after-new-game');

  // Press Space / Enter / click to advance
  for (let i = 0; i < 15; i++) {
    const btnCount = await page.locator('button:visible').count();
    if (btnCount > 0) {
      // There are buttons — don't spam keys
      break;
    }
    await page.keyboard.press('Space');
    await sleep(400);
    const info2 = await getPageInfo(page);
    if (info2.btns.length > 0) {
      await captureFlowStep(`0${3+i}-after-space-${i}`);
      break;
    }
    if (i % 3 === 2) {
      await captureFlowStep(`0${3+i}-pressing-space-${i}`);
    }
  }

  // Click through any available buttons
  const discovered = new Set();
  for (let round = 0; round < 40; round++) {
    const info3 = await getPageInfo(page);
    const stateKey = info3.text.substring(0, 80);

    if (!discovered.has(stateKey)) {
      discovered.add(stateKey);
      await captureFlowStep(`round-${round}-new-state`);
    }

    const btns = await page.locator('button:visible').all();
    if (btns.length === 0) {
      // Try keyboard
      await page.keyboard.press('Space');
      await sleep(300);
      await page.keyboard.press('Enter');
      await sleep(300);
      continue;
    }

    // Prefer advancing buttons
    let clicked = false;
    const priorityTerms = ['continue', 'next', 'begin', 'start', 'proceed', 'enter apartment', 'investigate', 'path', 'open', 'examine', 'read', 'check', 'access', 'run', 'search', 'analyze'];

    for (const term of priorityTerms) {
      const termBtn = page.locator(`button:visible`, { hasText: new RegExp(term, 'i') });
      if (await termBtn.count() > 0) {
        const txt = await termBtn.first().innerText().catch(() => '');
        console.log(`  [Round ${round}] Clicking priority btn: "${txt.replace(/\n/g,' ').substring(0,40)}"`);
        await termBtn.first().click().catch(() => {});
        await sleep(600);
        clicked = true;
        break;
      }
    }

    if (!clicked) {
      // Click first button
      const txt = await btns[0].innerText().catch(() => '');
      console.log(`  [Round ${round}] Clicking first btn: "${txt.replace(/\n/g,' ').substring(0,40)}"`);
      await btns[0].click().catch(() => {});
      await sleep(500);
    }
  }

  await captureFlowStep('final');

  // ===== REPORT =====
  console.log('\n================================================');
  console.log('FULL FLOW REPORT');
  console.log('================================================');
  flowSteps.forEach(s => {
    console.log(`\nStep: ${s.step}`);
    console.log(`  Headings: ${s.headings.join(' | ')}`);
    console.log(`  Buttons: ${s.buttons.slice(0,5).join(' | ')}`);
    console.log(`  Text: ${s.text.replace(/\n/g,' ').substring(0,120)}`);
  });

  console.log('\n================================================');
  console.log('ERRORS');
  console.log('================================================');
  console.log(`Console errors (${consoleErrors.length}):`);
  consoleErrors.forEach((e,i) => console.log(`  ${i+1}. ${e}`));
  console.log(`Console warnings (${consoleWarnings.length}):`);
  consoleWarnings.slice(0,5).forEach((w,i) => console.log(`  ${i+1}. ${w}`));

  console.log('\n================================================');
  console.log('SCREENSHOTS');
  console.log('================================================');
  log.forEach((f, i) => console.log(`  ${i+1}. ${f}`));

  await browser.close();
}

main().catch(err => { console.error('[FATAL]', err); process.exit(1); });
