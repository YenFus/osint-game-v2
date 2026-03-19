// Deep targeted test: prologue rendering, apartment page, investigation flow,
// convergence, endings, notifications, modal bugs
const { chromium } = require('/opt/homebrew/lib/node_modules/@playwright/test/node_modules/playwright');
const path = require('path');
const fs = require('fs');

const DIR = path.join(__dirname, 'playwright-screenshots');
if (!fs.existsSync(DIR)) fs.mkdirSync(DIR, { recursive: true });

const errors = [];
const warnings = [];
const shots = [];
let idx = 0;

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function ss(page, name) {
  idx++;
  const filename = `t4-${String(idx).padStart(3,'0')}-${name.replace(/[^a-zA-Z0-9_-]/g,'_')}.png`;
  await page.screenshot({ path: path.join(DIR, filename), fullPage: false });
  shots.push(filename);
  console.log(`  [SS] ${filename}`);
}

async function getBodyText(page) {
  return page.evaluate(() => document.body.innerText?.substring(0, 300) || '');
}

async function injectState(page, state) {
  return page.evaluate((s) => {
    return import('/src/store/gameStore.js').then(m => {
      m.useGameStore.setState(s);
      return true;
    }).catch(e => e.message);
  }, state);
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
    else if (msg.type() === 'warning') warnings.push(msg.text());
  });
  page.on('pageerror', e => errors.push(`PAGE_ERR: ${e.message}`));

  // ================================================================
  // 1. MAIN MENU — full visual check
  // ================================================================
  console.log('\n=== 1. MAIN MENU ===');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await sleep(1500); // let fade-in animations finish
  await ss(page, 'menu-full');

  // Check title visible
  const titleText = await page.locator('h1').first().innerText().catch(() => '');
  console.log(`  Title: "${titleText}"`);

  // Check all 3 menu items
  const menuBtns = await page.locator('button').allInnerTexts();
  console.log(`  Menu buttons: ${menuBtns.map(t => t.replace(/\n/g,' ').trim()).join(' | ')}`);

  // ================================================================
  // 2. ABOUT MODAL — bug check
  // ================================================================
  console.log('\n=== 2. ABOUT MODAL ===');
  // Click ABOUT using JS to avoid overlay interception
  await page.evaluate(() => {
    Array.from(document.querySelectorAll('button'))
      .find(b => b.textContent.includes('About'))?.click();
  });
  await sleep(500);
  const aboutVisible = await page.locator('text=Content warnings').isVisible().catch(() => false);
  console.log(`  About modal opened: ${aboutVisible}`);
  await ss(page, 'about-modal');

  // Close About
  await page.evaluate(() => {
    Array.from(document.querySelectorAll('button'))
      .find(b => b.textContent.trim() === '✕')?.click();
  });
  await sleep(300);
  const aboutGone = !(await page.locator('text=Content warnings').isVisible().catch(() => true));
  console.log(`  About modal closed: ${aboutGone}`);
  await ss(page, 'about-modal-closed');

  // ================================================================
  // 3. HOW TO PLAY — check "I'M READY" button
  // ================================================================
  console.log('\n=== 3. HOW TO PLAY MODAL ===');
  await page.evaluate(() => {
    Array.from(document.querySelectorAll('button'))
      .find(b => b.textContent.includes('How to Play'))?.click();
  });
  await sleep(500);
  await ss(page, 'how-to-play-modal');
  const htpText = await getBodyText(page);
  console.log(`  HOW TO PLAY content preview: ${htpText.substring(0, 150)}`);

  // Check for I'M READY button
  const readyBtn = page.locator('button', { hasText: /READY|Ready/i });
  const readyVisible = await readyBtn.isVisible().catch(() => false);
  console.log(`  "I'M READY" button visible: ${readyVisible}`);

  // Click I'M READY
  if (readyVisible) {
    await readyBtn.click();
    await sleep(500);
    await ss(page, 'after-im-ready');
    const phase = await page.evaluate(() => {
      return import('/src/store/gameStore.js').then(m => m.useGameStore.getState().phase);
    });
    console.log(`  Phase after I'M READY: ${phase}`);
  }

  // ================================================================
  // 4. STORY PROLOGUE — wait long enough to see scene panels
  // ================================================================
  console.log('\n=== 4. STORY PROLOGUE ===');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await sleep(1000);

  // Click NEW GAME
  await page.evaluate(() => {
    Array.from(document.querySelectorAll('button'))
      .find(b => b.textContent.includes('New Game'))?.click();
  });
  await sleep(2000); // Wait for title card + auto-advance

  // Take screenshot of first panel (title "What Maya Knew")
  await ss(page, 'prologue-panel-01-title');
  let bodyT = await getBodyText(page);
  console.log(`  Panel 1 text: ${bodyT.substring(0,80)}`);

  // Wait for auto-advance to chapter card
  await sleep(2500);
  await ss(page, 'prologue-panel-02-chapter-one');
  bodyT = await getBodyText(page);
  console.log(`  Panel 2 text: ${bodyT.substring(0,80)}`);

  // After chapter auto-advances, first SCENE panel appears (restaurant_exterior)
  await sleep(2500);
  await ss(page, 'prologue-panel-03-first-scene');
  bodyT = await getBodyText(page);
  console.log(`  Panel 3 text: ${bodyT.substring(0,80)}`);

  // Wait for typewriter to finish then click to advance
  await sleep(3000);
  await page.locator('body').click({ position: { x: 640, y: 450 } });
  await sleep(1000);
  await ss(page, 'prologue-panel-04-after-click');

  // Keep clicking through — capture every 3rd panel
  for (let i = 0; i < 50; i++) {
    const isApt = await page.evaluate(() =>
      document.body.innerText.includes("Maya's Apartment") ||
      document.body.innerText.includes('Points of Interest')
    );
    if (isApt) {
      console.log(`  Reached apartment after ${i} advance clicks`);
      break;
    }
    await page.locator('body').click({ position: { x: 640, y: 450 } });
    await sleep(400);
    if (i === 4 || i === 9 || i === 14 || i === 19 || i === 24) {
      await ss(page, `prologue-scene-at-click-${i}`);
    }
  }

  await ss(page, 'prologue-end-or-apartment');
  bodyT = await getBodyText(page);
  console.log(`  After prologue: ${bodyT.substring(0,100)}`);

  // ================================================================
  // 5. APARTMENT PAGE
  // ================================================================
  console.log('\n=== 5. APARTMENT PAGE ===');
  // Force to apartment via store
  await injectState(page, { phase: 'apartment' });
  await sleep(600);
  await ss(page, 'apartment-full');

  bodyT = await getBodyText(page);
  console.log(`  Apartment text: ${bodyT.substring(0,200)}`);

  // Check all 3 items visible
  for (const label of ["Maya's Laptop", "Burned Notebook", "Investigation Board"]) {
    const found = await page.locator(`text=${label}`).isVisible().catch(() => false);
    console.log(`  Item "${label}": ${found ? 'VISIBLE' : 'MISSING'}`);
  }

  // Check thread tracker A/B/C
  const threadTracker = await page.locator('text=Investigation Threads').isVisible().catch(() => false);
  console.log(`  Thread tracker visible: ${threadTracker}`);

  // Hover over laptop to test hover state
  const laptopItem = page.locator('button', { hasText: "Maya's Laptop" }).first();
  if (await laptopItem.isVisible()) {
    await laptopItem.hover();
    await sleep(300);
    await ss(page, 'apartment-laptop-hover');
  }

  // ================================================================
  // 6. INVESTIGATION PATH A — full flow
  // ================================================================
  console.log('\n=== 6. INVESTIGATION PATH A ===');
  await injectState(page, { phase: 'apartment' });
  await sleep(400);

  // Click laptop
  await page.locator('button', { hasText: "Maya's Laptop" }).first().click();
  await sleep(600);
  await ss(page, 'inv-path-a-node1-read');
  bodyT = await getBodyText(page);
  console.log(`  Path A node 1 text: ${bodyT.substring(0,150)}`);

  // Check node title visible
  const nodeTitle = await page.locator('h3').first().innerText().catch(() => '');
  console.log(`  Node title: "${nodeTitle}"`);

  // Tag the clue (c_marsh_crossref.txt)
  const clue = page.locator('.clue-text').first();
  const clueVisible = await clue.isVisible().catch(() => false);
  console.log(`  Clue element visible: ${clueVisible}`);
  if (clueVisible) {
    const clueText = await clue.innerText().catch(() => '');
    console.log(`  Clue text: "${clueText}"`);
    await clue.click();
    await sleep(400);
    await ss(page, 'inv-path-a-node1-clue-tagged');
    bodyT = await getBodyText(page);
    console.log(`  After clue tag: ${bodyT.substring(0,100)}`);
  }

  // Click "Open Username Scanner"
  const openBtn = page.locator('button', { hasText: /Open.*Scanner|Username Scanner/i });
  if (await openBtn.isVisible().catch(() => false)) {
    await openBtn.click();
    await sleep(400);
    await ss(page, 'inv-path-a-node2-input');
  }

  // Fill input
  const inp = page.locator('input[type="text"]');
  if (await inp.isVisible().catch(() => false)) {
    const ph = await inp.getAttribute('placeholder') || '';
    const val = ph.replace('e.g. ', '').trim() || 'c_marsh_pdx';
    console.log(`  Filling input: "${val}"`);
    await inp.fill(val);
    await sleep(200);

    // Test wrong input first
    await inp.fill('wrong_user');
    await page.locator('button', { hasText: /Run/i }).click();
    await sleep(400);
    const errMsg = await page.locator('text=/doesn\'t match|doesn\'t match/').isVisible().catch(() => false);
    console.log(`  Wrong input error shown: ${errMsg}`);
    await ss(page, 'inv-path-a-wrong-input');

    // Now correct input
    await inp.fill(val);
    await page.locator('button', { hasText: /Run/i }).click();
    await sleep(200);
    await ss(page, 'inv-path-a-tool-running');
    await sleep(1600); // wait for tool animation
    await ss(page, 'inv-path-a-tool-output');
    bodyT = await getBodyText(page);
    console.log(`  Tool output text: ${bodyT.substring(0,150)}`);
  }

  // Find clue in results
  const clueResult = page.locator('.clue-text').first();
  if (await clueResult.isVisible().catch(() => false)) {
    const clueResultText = await clueResult.innerText().catch(() => '');
    console.log(`  Clue in results: "${clueResultText}"`);
    await clueResult.click();
    await sleep(400);
    await ss(page, 'inv-path-a-clue-in-results-tagged');
  }

  // Collect finding
  const collectBtn = page.locator('button', { hasText: /Record/i }).first();
  if (await collectBtn.isVisible().catch(() => false)) {
    await collectBtn.click();
    await sleep(400);
    await ss(page, 'inv-path-a-node1-collected');
  }

  // Check notification appeared
  const notif = await page.locator('[class*="notif"], .notification').isVisible().catch(() => false);
  console.log(`  Notification after collect: ${notif}`);

  // ================================================================
  // 7. PATH A — next nodes (continue through)
  // ================================================================
  console.log('\n=== 7. PATH A — continue ===');
  for (let n = 0; n < 10; n++) {
    const done = await page.locator('text=Thread Complete').isVisible().catch(() => false);
    const returnBtn = await page.locator('text=Return to Apartment').isVisible().catch(() => false);
    if (done || returnBtn) {
      console.log(`  Path A complete at node iteration ${n}`);
      await ss(page, 'inv-path-a-complete');
      break;
    }

    const hdr = await page.locator('.ml-auto').innerText().catch(() => '');
    console.log(`  Node progress: ${hdr}`);

    // Tag any clue
    const c = page.locator('.clue-text').first();
    if (await c.isVisible().catch(() => false)) {
      await c.click(); await sleep(300); continue;
    }

    // Open tool if button present
    const openT = page.locator('button', { hasText: /→ Open/i }).first();
    if (await openT.isVisible().catch(() => false)) {
      await openT.click(); await sleep(300); continue;
    }

    // Fill input using placeholder
    const input = page.locator('input[type="text"]').first();
    if (await input.isVisible().catch(() => false)) {
      const ph2 = (await input.getAttribute('placeholder') || '').replace('e.g. ', '').trim();
      if (ph2) {
        await input.fill(ph2);
        const run = page.locator('button', { hasText: /Run/i }).first();
        if (await run.isVisible().catch(() => false)) {
          await run.click(); await sleep(1800);
        }
      }
      continue;
    }

    // Record/collect
    const rec = page.locator('button', { hasText: /Record/i }).first();
    if (await rec.isVisible().catch(() => false)) {
      await rec.click(); await sleep(400); continue;
    }

    console.log(`  Stuck at node ${n}, taking screenshot`);
    await ss(page, `inv-path-a-stuck-node-${n}`);
    break;
  }

  // ================================================================
  // 8. RETURN TO APARTMENT — check path A shows started/completed
  // ================================================================
  console.log('\n=== 8. APARTMENT — after path A ===');
  const retBtn = page.locator('button', { hasText: /Return to Apartment|← Apartment/i }).first();
  if (await retBtn.isVisible().catch(() => false)) {
    await retBtn.click();
    await sleep(500);
  } else {
    await injectState(page, { phase: 'apartment' });
    await sleep(400);
  }
  await ss(page, 'apartment-after-path-a');
  bodyT = await getBodyText(page);
  console.log(`  After path A — A thread status check`);

  // Check if A shows "in progress" or "examined"
  const aStatus = await page.evaluate(() => {
    const text = document.body.innerText;
    if (text.includes('examined')) return 'examined';
    if (text.includes('in progress')) return 'in progress';
    return 'unknown';
  });
  console.log(`  Path A status: ${aStatus}`);

  // ================================================================
  // 9. PATH B AND C — quick visits
  // ================================================================
  console.log('\n=== 9. PATH B — Burned Notebook ===');
  await injectState(page, { phase: 'apartment' });
  await sleep(400);
  const nbBtn = page.locator('button', { hasText: /Burned Notebook/i }).first();
  if (await nbBtn.isVisible().catch(() => false)) {
    await nbBtn.click();
    await sleep(600);
    await ss(page, 'inv-path-b-start');
    bodyT = await getBodyText(page);
    console.log(`  Path B start: ${bodyT.substring(0,150)}`);

    const bClue = page.locator('.clue-text').first();
    if (await bClue.isVisible().catch(() => false)) {
      console.log(`  Path B clue text: "${await bClue.innerText().catch(()=>'')}"`)
      await bClue.click(); await sleep(300);
    }
    await ss(page, 'inv-path-b-clue-tagged');
  }

  console.log('\n=== 9b. PATH C — Investigation Board ===');
  await injectState(page, { phase: 'apartment' });
  await sleep(400);
  const boardBtn = page.locator('button', { hasText: /Investigation Board/i }).first();
  if (await boardBtn.isVisible().catch(() => false)) {
    await boardBtn.click();
    await sleep(600);
    await ss(page, 'inv-path-c-start');
    bodyT = await getBodyText(page);
    console.log(`  Path C start: ${bodyT.substring(0,150)}`);

    const cClue = page.locator('.clue-text').first();
    if (await cClue.isVisible().catch(() => false)) {
      console.log(`  Path C clue text: "${await cClue.innerText().catch(()=>'')}"`)
    }
    await ss(page, 'inv-path-c-node1-check');
  }

  // ================================================================
  // 10. CONVERGENCE — all paths complete
  // ================================================================
  console.log('\n=== 10. CONVERGENCE PAGE ===');
  await injectState(page, {
    phase: 'convergence',
    paths: {
      A: { started: true, completed: true, nodesFound: ['a1','a2','a3','a4'], taggedClues: [] },
      B: { started: true, completed: true, nodesFound: ['b1','b2','b3','b4'], taggedClues: [] },
      C: { started: true, completed: true, nodesFound: ['c1','c2','c3','c4'], taggedClues: [] },
    }
  });
  await sleep(600);
  await ss(page, 'convergence-top');
  await page.evaluate(() => window.scrollTo(0, 500));
  await sleep(200);
  await ss(page, 'convergence-mid');
  await page.evaluate(() => window.scrollTo(0, 1200));
  await sleep(200);
  await ss(page, 'convergence-bottom-decision');

  bodyT = await getBodyText(page);
  console.log(`  Convergence text: ${bodyT.substring(0,200)}`);

  // Check evidence cards visible vs dimmed
  const allThreadCards = await page.locator('[class*="border"][class*="opacity"]').count();
  console.log(`  Thread cards with opacity class: ${allThreadCards}`);

  // Check decision buttons
  const policeBtn = page.locator('button', { hasText: /police/i });
  const rayBtn = page.locator('button', { hasText: /Call Ray/i });
  console.log(`  "Take to police" visible: ${await policeBtn.isVisible()}`);
  console.log(`  "Call Ray" visible: ${await rayBtn.isVisible()}`);

  // Click police
  await page.evaluate(() => window.scrollTo(0, 9999));
  await sleep(200);
  await ss(page, 'convergence-decision-area');
  await policeBtn.click();
  await sleep(400);
  // Check confirmation text appeared
  const confirmText = await page.locator('text=Your hands are steady').isVisible().catch(() => false);
  console.log(`  Police confirmation text: ${confirmText}`);
  await ss(page, 'convergence-after-police-click');
  await sleep(800); // wait for phase transition

  // ================================================================
  // 11. ENDING — POLICE
  // ================================================================
  console.log('\n=== 11. ENDING (POLICE) ===');
  const endPhase = await page.evaluate(() =>
    import('/src/store/gameStore.js').then(m => m.useGameStore.getState().phase)
  );
  console.log(`  Phase after police click: ${endPhase}`);
  await ss(page, 'ending-police-top');
  await page.evaluate(() => window.scrollTo(0, 500));
  await ss(page, 'ending-police-mid');
  await page.evaluate(() => window.scrollTo(0, 9999));
  await ss(page, 'ending-police-bottom');
  bodyT = await getBodyText(page);
  console.log(`  Ending text: ${bodyT.substring(0,200)}`);

  // ================================================================
  // 12. ENDING — RAY
  // ================================================================
  console.log('\n=== 12. ENDING (CALL RAY) ===');
  await injectState(page, {
    phase: 'convergence',
    endingChoice: null,
    paths: {
      A: { started: true, completed: true, nodesFound: ['a1'], taggedClues: [] },
      B: { started: true, completed: true, nodesFound: ['b1'], taggedClues: [] },
      C: { started: true, completed: true, nodesFound: ['c1'], taggedClues: [] },
    }
  });
  await sleep(400);
  await page.evaluate(() => window.scrollTo(0, 9999));
  await sleep(200);
  const rayBtnFresh = page.locator('button', { hasText: /Call Ray/i });
  if (await rayBtnFresh.isVisible().catch(() => false)) {
    await rayBtnFresh.click();
    await sleep(800);
    await ss(page, 'ending-ray-top');
    bodyT = await getBodyText(page);
    console.log(`  Ray ending text: ${bodyT.substring(0,200)}`);
  }

  // ================================================================
  // 13. PLAY AGAIN
  // ================================================================
  console.log('\n=== 13. PLAY AGAIN ===');
  const playAgain = page.locator('button', { hasText: /Play again/i });
  if (await playAgain.isVisible().catch(() => false)) {
    await playAgain.click();
    await sleep(600);
    await ss(page, 'play-again-back-to-menu');
    const backPhase = await page.evaluate(() =>
      import('/src/store/gameStore.js').then(m => m.useGameStore.getState().phase)
    );
    console.log(`  Phase after play again: ${backPhase}`);
  }

  // ================================================================
  // 14. NOTIFICATIONS SYSTEM
  // ================================================================
  console.log('\n=== 14. NOTIFICATIONS ===');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await sleep(500);
  await page.evaluate(() =>
    import('/src/store/gameStore.js').then(m => {
      m.useGameStore.getState().addNotification('Thread A complete — return to the apartment.', 'complete');
    })
  );
  await sleep(600);
  await ss(page, 'notification-complete-type');
  const notifText = await page.locator('body').innerText();
  console.log(`  Notification visible: ${notifText.includes('Thread A complete')}`);

  await page.evaluate(() =>
    import('/src/store/gameStore.js').then(m => {
      m.useGameStore.getState().addNotification('★ Ray Callahan is the suspect.', 'reveal');
    })
  );
  await sleep(400);
  await ss(page, 'notification-reveal-type');

  // Wait for auto-dismiss
  await sleep(5500);
  await ss(page, 'notification-after-dismiss');
  const notifGone = !(await page.locator('text=Thread A complete').isVisible().catch(() => false));
  console.log(`  Notification auto-dismissed: ${notifGone}`);

  // ================================================================
  // 15. APARTMENT → convergence button appears (2+ paths complete)
  // ================================================================
  console.log('\n=== 15. APARTMENT — convergence unlock test ===');
  await injectState(page, {
    phase: 'apartment',
    paths: {
      A: { started: true, completed: true, nodesFound: ['a1'], taggedClues: [] },
      B: { started: true, completed: true, nodesFound: ['b1'], taggedClues: [] },
      C: { started: false, completed: false, nodesFound: [], taggedClues: [] },
    }
  });
  await sleep(500);
  await ss(page, 'apartment-convergence-button-visible');
  const convBtn = await page.locator('button', { hasText: /Convergence/i }).isVisible().catch(() => false);
  console.log(`  Convergence button appears with 2 paths complete: ${convBtn}`);

  // Test with only 1 path complete
  await injectState(page, {
    phase: 'apartment',
    paths: {
      A: { started: true, completed: true, nodesFound: ['a1'], taggedClues: [] },
      B: { started: false, completed: false, nodesFound: [], taggedClues: [] },
      C: { started: false, completed: false, nodesFound: [], taggedClues: [] },
    }
  });
  await sleep(400);
  const convBtn1 = await page.locator('button', { hasText: /Convergence/i }).isVisible().catch(() => false);
  console.log(`  Convergence button hidden with 1 path complete: ${!convBtn1}`);

  // ================================================================
  // 16. BACK BUTTON — ← Menu from apartment
  // ================================================================
  console.log('\n=== 16. NAVIGATION — back to menu ===');
  await injectState(page, { phase: 'apartment' });
  await sleep(400);
  const menuBackBtn = page.locator('button', { hasText: /← Menu/i });
  if (await menuBackBtn.isVisible().catch(() => false)) {
    await menuBackBtn.click();
    await sleep(400);
    const menuPhase = await page.evaluate(() =>
      import('/src/store/gameStore.js').then(m => m.useGameStore.getState().phase)
    );
    console.log(`  Phase after ← Menu: ${menuPhase}`);
    await ss(page, 'back-to-menu-from-apartment');
  }

  // ================================================================
  // 17. Check the OSINTGuide component close behavior on "I'M READY"
  // ================================================================
  console.log('\n=== 17. I\'M READY BUTTON IN HOW TO PLAY ===');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await sleep(800);
  await page.evaluate(() => {
    Array.from(document.querySelectorAll('button'))
      .find(b => b.textContent.includes('How to Play'))?.click();
  });
  await sleep(500);
  const imReadyBtn = page.locator('button', { hasText: /READY/i });
  if (await imReadyBtn.isVisible().catch(() => false)) {
    await imReadyBtn.click();
    await sleep(600);
    const phaseAfterReady = await page.evaluate(() =>
      import('/src/store/gameStore.js').then(m => m.useGameStore.getState().phase)
    );
    console.log(`  Phase after I'M READY: ${phaseAfterReady}`);
    await ss(page, 'after-im-ready-phase-check');
  }

  // ================================================================
  // 18. CSS/Animations check — CRT scanlines, flicker, fade-in
  // ================================================================
  console.log('\n=== 18. VISUAL CHECKS ===');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await sleep(1500);
  const crtPresent = await page.evaluate(() => !!document.querySelector('.crt'));
  const flickerPresent = await page.evaluate(() => !!document.querySelector('.flicker'));
  const fadeInPresent = await page.evaluate(() => !!document.querySelector('.fade-in'));
  console.log(`  .crt class present: ${crtPresent}`);
  console.log(`  .flicker class present: ${flickerPresent}`);
  console.log(`  .fade-in class present: ${fadeInPresent}`);
  await ss(page, 'visual-css-check');

  // Check fonts loaded
  const fontsLoaded = await page.evaluate(() => {
    const bodyFont = getComputedStyle(document.body).fontFamily;
    return bodyFont;
  });
  console.log(`  Body font family: ${fontsLoaded}`);

  // ================================================================
  // 19. INVESTIGATION — review completed node
  // ================================================================
  console.log('\n=== 19. INVESTIGATION — review mode ===');
  await injectState(page, {
    phase: 'investigation',
    activePath: 'A',
    paths: {
      A: { started: true, completed: false, nodesFound: ['a1'], taggedClues: [] },
      B: { started: false, completed: false, nodesFound: [], taggedClues: [] },
      C: { started: false, completed: false, nodesFound: [], taggedClues: [] },
    }
  });
  await sleep(500);
  await ss(page, 'inv-review-mode-check');
  // The first node (a1) should show as "done" in the sidebar
  const reviewNode = await page.locator('text=click to review').isVisible().catch(() => false);
  console.log(`  "click to review" visible for completed node: ${reviewNode}`);

  // Click a completed node to review it
  const doneNode = page.locator('text=click to review').first();
  if (await doneNode.isVisible().catch(() => false)) {
    await doneNode.click();
    await sleep(400);
    await ss(page, 'inv-review-node-open');
    const closeReview = page.locator('button', { hasText: /✕ close/i });
    if (await closeReview.isVisible().catch(() => false)) {
      await closeReview.click();
      await sleep(300);
      await ss(page, 'inv-review-node-closed');
    }
  }

  // ================================================================
  // FINAL
  // ================================================================
  console.log('\n\n========================================');
  console.log('BUGS & FINDINGS SUMMARY');
  console.log('========================================');
  console.log(`\nConsole errors (${errors.length}):`);
  errors.forEach((e, i) => console.log(`  BUG ${i+1}: ${e}`));
  console.log(`\nConsole warnings (${warnings.length}):`);
  warnings.slice(0, 10).forEach((w, i) => console.log(`  WARN ${i+1}: ${w}`));
  console.log(`\nScreenshots taken: ${shots.length}`);
  shots.forEach((s, i) => console.log(`  ${i+1}. ${s}`));

  await browser.close();
}

main().catch(e => { console.error('[FATAL]', e.stack || e); process.exit(1); });
