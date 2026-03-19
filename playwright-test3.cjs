const { chromium } = require('/opt/homebrew/lib/node_modules/@playwright/test/node_modules/playwright');
const path = require('path');
const fs = require('fs');

const SCREENSHOTS_DIR = path.join(__dirname, 'playwright-screenshots');
if (!fs.existsSync(SCREENSHOTS_DIR)) fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

const consoleErrors = [];
const consoleWarnings = [];
const allScreenshots = [];
let idx = 0;

async function ss(page, name) {
  idx++;
  const filename = `${String(idx).padStart(3, '0')}-${name.replace(/[^a-zA-Z0-9_-]/g, '_')}.png`;
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, filename), fullPage: false });
  allScreenshots.push(filename);
  console.log(`  [SS ${idx}] ${filename}`);
  return filename;
}
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function getInfo(page) {
  return await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button')).map(b => b.innerText?.trim().replace(/\n/g, ' ').substring(0, 50));
    const headings = Array.from(document.querySelectorAll('h1,h2,h3,h4')).map(h => h.innerText?.trim().substring(0, 60));
    const bodyText = document.body.innerText?.substring(0, 500) || '';
    return { btns, headings, bodyText };
  });
}

// Set game phase via Zustand using React internals
async function setPhase(page, phaseName) {
  return await page.evaluate((phase) => {
    // Walk fiber tree to find zustand store setter
    function findZustandStore(element) {
      const fiberKey = Object.keys(element).find(k => k.startsWith('__reactFiber'));
      if (!fiberKey) return null;
      let fiber = element[fiberKey];
      while (fiber) {
        // Check memoized state for zustand
        let memoState = fiber.memoizedState;
        while (memoState) {
          if (memoState.queue && memoState.memoizedState) {
            const s = memoState.memoizedState;
            if (s && typeof s === 'object' && s.phase !== undefined && typeof s.setPhase === 'function') {
              return s;
            }
          }
          memoState = memoState.next;
        }
        fiber = fiber.child || fiber.sibling || (fiber.return ? fiber.return.sibling : null);
        if (!fiber) break;
      }
      return null;
    }

    const root = document.getElementById('root');
    if (!root) return false;

    // Try to find the store module
    const store = findZustandStore(root);
    if (store && store.setPhase) {
      store.setPhase(phase);
      return true;
    }
    return false;
  }, phaseName);
}

// Alternative: inject via module store using __zustand__ or window globals
async function setPhaseViaEval(page, phaseName, extraState = {}) {
  return await page.evaluate(([phase, extra]) => {
    // Try common patterns for finding zustand store
    // Method 1: Look for zustand's internal store in React's fiber
    const root = document.getElementById('root');
    if (!root) return { success: false, method: 'no root' };

    const fiberKey = Object.keys(root).find(k => k.startsWith('__reactFiber'));
    if (!fiberKey) return { success: false, method: 'no fiber' };

    const visited = new Set();
    const queue = [root[fiberKey]];
    while (queue.length > 0) {
      const node = queue.shift();
      if (!node || visited.has(node)) continue;
      visited.add(node);

      // Check memoized hooks
      let hook = node.memoizedState;
      while (hook) {
        const state = hook.memoizedState;
        if (state && typeof state === 'object' && !Array.isArray(state)) {
          // Zustand store state object has phase, setPhase
          if (state.phase !== undefined && typeof state.setPhase === 'function') {
            state.setPhase(phase);
            // Also set extra state
            for (const [k, v] of Object.entries(extra)) {
              if (typeof state[k] !== 'undefined') state[k] = v;
            }
            return { success: true, method: 'fiber-hook', currentPhase: state.phase };
          }
          // Check if it's the store itself (zustand exposes setState)
          if (typeof state === 'function' && state.setState) {
            state.setState({ phase, ...extra });
            return { success: true, method: 'zustand-fn' };
          }
        }
        hook = hook.next;
      }

      if (node.child) queue.push(node.child);
      if (node.sibling) queue.push(node.sibling);
    }
    return { success: false, method: 'not found in fiber' };
  }, [phaseName, extraState]);
}

// Best method: use the store's setState directly via zustand's subscribe mechanism
async function injectState(page, stateObj) {
  return await page.evaluate((state) => {
    // Walk all React hooks to find the zustand subscription hook
    const root = document.getElementById('root');
    if (!root) return { error: 'no root' };

    const fiberKey = Object.keys(root).find(k => k.startsWith('__reactFiber'));
    if (!fiberKey) return { error: 'no fiber key' };

    // BFS through fiber tree
    const q = [root[fiberKey]];
    const seen = new WeakSet();
    while (q.length) {
      const f = q.shift();
      if (!f || seen.has(f)) continue;
      seen.add(f);

      let hook = f.memoizedState;
      while (hook) {
        // Zustand hook stores: { queue: { dispatch }, memoizedState: selector_result }
        // The store ref is in hook.queue.lastRenderedState or storeRef
        if (hook.queue && hook.queue.dispatch) {
          // This might be a useState/useReducer
          const storeRef = hook.queue.dispatch;
          if (storeRef && storeRef._origin) {
            storeRef._origin.setState(state);
            return { ok: true };
          }
        }
        hook = hook.next;
      }

      if (f.child) q.push(f.child);
      if (f.sibling) q.push(f.sibling);
    }
    return { error: 'store not found' };
  }, stateObj);
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') { consoleErrors.push(msg.text()); }
    else if (msg.type() === 'warning') { consoleWarnings.push(msg.text()); }
  });
  page.on('pageerror', err => consoleErrors.push(`PAGE_ERR: ${err.message}`));

  // ================================================================
  // SCREEN 1: MAIN MENU
  // ================================================================
  console.log('\n====== SCREEN 1: MAIN MENU ======');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await sleep(1200); // let fade-in animations settle
  let info = await getInfo(page);
  console.log('Headings:', info.headings);
  console.log('Buttons:', info.btns);
  await ss(page, '01-main-menu');

  // ================================================================
  // SCREEN 1b: HOW TO PLAY modal (click then close)
  // ================================================================
  console.log('\n====== SCREEN 1b: HOW TO PLAY Modal ======');
  await page.locator('button', { hasText: /HOW TO PLAY/i }).click();
  await sleep(500);
  info = await getInfo(page);
  console.log('Buttons after HOW TO PLAY click:', info.btns);
  await ss(page, '01b-how-to-play-open');

  // Close via ✕ button
  const closeBtn = page.locator('button', { hasText: '✕' });
  const closeBtnCount = await closeBtn.count();
  console.log(`Close buttons found: ${closeBtnCount}`);
  if (closeBtnCount > 0) {
    await closeBtn.first().click();
    await sleep(400);
    await ss(page, '01c-how-to-play-closed');
  } else {
    // Try pressing Escape
    await page.keyboard.press('Escape');
    await sleep(400);
    await ss(page, '01c-how-to-play-esc');
  }

  // ================================================================
  // SCREEN 1d: ABOUT modal
  // ================================================================
  console.log('\n====== SCREEN 1d: ABOUT Modal ======');
  // Wait for modal to be fully closed
  await sleep(200);
  const aboutBtn = page.locator('button', { hasText: /ABOUT/i });
  // Force click using JavaScript to bypass overlay interception issues
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const about = btns.find(b => b.textContent.includes('ABOUT'));
    if (about) about.click();
  });
  await sleep(500);
  info = await getInfo(page);
  console.log('Text after ABOUT click (first 200):', info.bodyText.substring(0, 200));
  await ss(page, '01d-about-open');

  // Close About
  const closeAbout = page.locator('button', { hasText: '✕' });
  if (await closeAbout.count() > 0) {
    await closeAbout.first().click();
    await sleep(400);
  }
  await ss(page, '01e-about-closed');

  // ================================================================
  // SCREEN 2: STORY / PROLOGUE (click NEW GAME)
  // ================================================================
  console.log('\n====== SCREEN 2: Click NEW GAME → Story Prologue ======');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const ng = btns.find(b => b.textContent.includes('NEW GAME') || b.textContent.includes('New Game'));
    if (ng) ng.click();
  });
  await sleep(1500); // let the prologue start

  info = await getInfo(page);
  console.log('After NEW GAME — body text:', info.bodyText.substring(0, 200));
  await ss(page, '02-story-prologue-start');

  // ================================================================
  // SCREEN 2+: Click through prologue panels (28 panels total)
  // ================================================================
  console.log('\n====== SCREEN 2+: Clicking through prologue panels ======');
  // Each panel needs: 1 click to skip typewriter, 1 click to advance
  // Some panels auto-advance (chapter cards)
  // 28 panels × 2 clicks = up to 56 clicks, but chapter cards auto-advance

  const panelScreenshotPoints = [3, 6, 10, 15, 20, 25];
  for (let i = 0; i < 60; i++) {
    // Check if we've left story phase (arrived at apartment)
    const phase = await page.evaluate(() => {
      const root = document.getElementById('root');
      if (!root) return 'unknown';
      const text = document.body.innerText;
      if (text.includes("Maya's Apartment") || text.includes("Points of Interest")) return 'apartment';
      if (text.includes("Thread") && text.includes("Evidence Trail")) return 'investigation';
      if (text.includes('SPACE to continue') || text.includes('click to skip')) return 'story';
      if (text.includes('WHAT MAYA KNEW') && text.includes('NEW GAME')) return 'menu';
      return 'story-or-unknown';
    });

    if (phase === 'apartment') {
      console.log(`  [Panel ${i}] Reached apartment page!`);
      break;
    }

    // Click to advance
    await page.locator('body').click({ position: { x: 640, y: 450 } });
    await sleep(300);

    if (panelScreenshotPoints.includes(i)) {
      await ss(page, `02-story-panel-${i}`);
      const pInfo = await getInfo(page);
      console.log(`  [Panel ${i}] Text: ${pInfo.bodyText.substring(0, 80)}`);
    }
  }

  await ss(page, '02z-story-end');

  // ================================================================
  // SCREEN 3: APARTMENT PAGE
  // ================================================================
  console.log('\n====== SCREEN 3: Apartment Page ======');
  info = await getInfo(page);
  console.log('Apartment page headings:', info.headings);
  console.log('Apartment page buttons:', info.btns);
  await ss(page, '03-apartment-page');

  // Check all three investigation items are present
  const itemLabels = ["Maya's Laptop", "Burned Notebook", "Investigation Board"];
  for (const label of itemLabels) {
    const count = await page.locator(`text=${label}`).count();
    console.log(`  Item "${label}": ${count > 0 ? 'FOUND' : 'MISSING'}`);
  }

  // ================================================================
  // SCREEN 4: INVESTIGATION PATH A (Laptop)
  // ================================================================
  console.log('\n====== SCREEN 4: Investigation Path A (Laptop) ======');
  // Click the laptop item in sidebar
  const laptopBtn = page.locator('button', { hasText: "Maya's Laptop" });
  if (await laptopBtn.count() > 0) {
    await laptopBtn.first().click();
    await sleep(600);
    info = await getInfo(page);
    console.log('Path A headings:', info.headings);
    console.log('Path A buttons:', info.btns);
    await ss(page, '04-investigation-path-a');

    // Node A1: File Browser — find and click the clue
    // The clue is 'c_marsh_crossref.txt' in the file tree
    const clueSpan = page.locator('.clue-text');
    const clueCount = await clueSpan.count();
    console.log(`  Clue spans found: ${clueCount}`);
    if (clueCount > 0) {
      await clueSpan.first().click();
      await sleep(400);
      await ss(page, '04b-clue-tagged-a1');
      info = await getInfo(page);
      console.log('  After clue tag — buttons:', info.btns);
    }

    // Should now show "clueFound" phase with "Open Username Scanner" button
    const openScannerBtn = page.locator('button', { hasText: /Open.*Scanner|Username Scanner/i });
    if (await openScannerBtn.count() > 0) {
      await openScannerBtn.first().click();
      await sleep(400);
      await ss(page, '04c-path-a-input-required');
      info = await getInfo(page);
      console.log('  Input required phase — buttons:', info.btns);

      // Type the correct input
      await page.fill('input[type="text"]', 'c_marsh_pdx');
      await sleep(200);
      const runBtn = page.locator('button', { hasText: /Run/i });
      if (await runBtn.count() > 0) {
        await runBtn.first().click();
        await sleep(1800); // wait for tool running animation
        await ss(page, '04d-path-a-tool-running');
        await sleep(1000);
        await ss(page, '04e-path-a-tool-output');

        // Find clue in results
        const clueInResults = page.locator('.clue-text');
        if (await clueInResults.count() > 0) {
          await clueInResults.first().click();
          await sleep(400);
          await ss(page, '04f-path-a-clue-in-results');
        }

        // Collect finding
        const collectBtn = page.locator('button', { hasText: /Record/i });
        if (await collectBtn.count() > 0) {
          await collectBtn.first().click();
          await sleep(400);
          await ss(page, '04g-path-a-node2-collected');
        }
      }
    } else {
      // No scanner button — maybe it directly shows collect
      const collectBtn = page.locator('button', { hasText: /Record/i });
      if (await collectBtn.count() > 0) {
        await collectBtn.first().click();
        await sleep(400);
        await ss(page, '04b2-path-a-collected');
      }
    }
  }

  // Continue Path A — click through remaining nodes
  console.log('  Continuing through Path A nodes...');
  for (let n = 0; n < 15; n++) {
    const phase = await page.evaluate(() => document.body.innerText?.substring(0, 50));

    // Check if path is complete
    if ((await page.locator('text=Thread Complete').count()) > 0 ||
        (await page.locator('text=Return to Apartment').count()) > 0) {
      console.log(`  Path A complete at node ${n}!`);
      await ss(page, '04z-path-a-complete');
      break;
    }

    // Tag clue if available
    const clue = page.locator('.clue-text');
    if (await clue.count() > 0) {
      await clue.first().click();
      await sleep(300);
      continue;
    }

    // Fill input if present
    const input = page.locator('input[type="text"]');
    if (await input.count() > 0) {
      // Get placeholder to know what to type
      const placeholder = await input.getAttribute('placeholder').catch(() => '');
      const correctText = await page.evaluate(() => {
        // Try to get correctInput from current node
        return window.__currentNodeCorrectInput || '';
      });
      // Read node number from header (N / total)
      const headerText = await page.locator('.ml-auto').innerText().catch(() => '');
      console.log(`  Input required — placeholder: "${placeholder}", header: "${headerText}"`);
      // For now, we'll check the page content for hints
      const pageContent = await page.locator('body').innerText();
      // Path A nodes use: c_marsh_pdx, then web.archive.org...
      const inputGuesses = {
        'c_marsh_pdx': 'c_marsh_pdx',
        'twitter.com/c_marsh_pdx': 'twitter.com/c_marsh_pdx',
        'archive.org': 'web.archive.org/web/*/twitter.com/c_marsh_pdx',
        'stillwater': 'stillwater-media.net',
      };
      let guessValue = placeholder.replace('e.g. ', '');
      // The placeholder often IS the correct input
      if (guessValue) {
        await page.fill('input[type="text"]', guessValue);
        await sleep(200);
        const runBtn = page.locator('button', { hasText: /Run/i });
        if (await runBtn.count() > 0) {
          await runBtn.first().click();
          await sleep(2000);
          continue;
        }
      }
      break; // Can't proceed without knowing input
    }

    // Click Open tool button
    const openBtn = page.locator('button', { hasText: /Open|→ Open/i });
    if (await openBtn.count() > 0) {
      await openBtn.first().click();
      await sleep(300);
      continue;
    }

    // Collect finding
    const recordBtn = page.locator('button', { hasText: /Record/i });
    if (await recordBtn.count() > 0) {
      await recordBtn.first().click();
      await sleep(300);
      continue;
    }

    break;
  }

  // ================================================================
  // SCREEN 5: Return to apartment, then Path B
  // ================================================================
  console.log('\n====== SCREEN 5: Return to Apartment ======');
  const returnBtn = page.locator('button', { hasText: /Return to Apartment|← Apartment/i });
  if (await returnBtn.count() > 0) {
    await returnBtn.first().click();
    await sleep(600);
    await ss(page, '05-apartment-after-path-a');
  }

  // ================================================================
  // Skip to convergence using state injection
  // ================================================================
  console.log('\n====== STATE INJECTION: Force all paths complete ======');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await sleep(800);

  // Click NEW GAME, advance past prologue quickly
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const ng = btns.find(b => b.textContent.includes('NEW GAME') || b.textContent.includes('New Game'));
    if (ng) ng.click();
  });
  await sleep(1000);

  // Speed through prologue
  for (let i = 0; i < 70; i++) {
    const isApartment = await page.evaluate(() => document.body.innerText.includes("Maya's Apartment"));
    if (isApartment) break;
    await page.locator('body').click({ position: { x: 640, y: 450 } });
    await sleep(100);
  }
  await sleep(500);

  console.log('  Attempting state injection to complete all paths...');
  const injResult = await page.evaluate(() => {
    // Find the useGameStore's setState — it's a zustand store
    // Zustand stores expose setState via the store object
    // The App component subscribes to it — we can find the store via React fiber hooks

    const root = document.getElementById('root');
    if (!root) return { error: 'no root' };

    const fiberKey = Object.keys(root).find(k => k.startsWith('__reactFiber'));
    if (!fiberKey) return { error: 'no fiber' };

    const visited = new WeakSet();
    const q = [root[fiberKey]];

    while (q.length) {
      const node = q.shift();
      if (!node || visited.has(node)) continue;
      visited.add(node);

      // Check memoized state chain for zustand
      let hook = node.memoizedState;
      while (hook) {
        // Zustand's useStore hook stores the bound getSnapshot in hook.queue.getSnapshot
        // and the store ref in hook.queue.dispatch._origin or similar
        if (hook.queue) {
          const q2 = hook.queue;
          // Check dispatch for zustand
          if (q2.dispatch) {
            try {
              // zustand bound stores have _stores or similar
              const dispatch = q2.dispatch;
              if (dispatch.length === 0) { // zustand setState has no required args typically
                // try calling with our state
                dispatch({
                  phase: 'apartment',
                  paths: {
                    A: { started: true, completed: true, nodesFound: ['a1','a2','a3','a4'], taggedClues: [] },
                    B: { started: true, completed: true, nodesFound: ['b1','b2','b3','b4'], taggedClues: [] },
                    C: { started: true, completed: true, nodesFound: ['c1','c2','c3','c4'], taggedClues: [] },
                  }
                });
                return { method: 'dispatch', success: true };
              }
            } catch(e) {}
          }

          // Try getSnapshot to find the actual store
          if (q2.getSnapshot) {
            try {
              const snap = q2.getSnapshot();
              if (snap && snap.phase !== undefined && snap.setPhase) {
                snap.setPhase('apartment');
                return { method: 'getSnapshot+setPhase', success: true };
              }
            } catch(e) {}
          }
        }

        // Check if memoized state IS the zustand state (when useGameStore is used)
        const ms = hook.memoizedState;
        if (ms && typeof ms === 'object') {
          if (ms.phase !== undefined && typeof ms.setPhase === 'function') {
            // This IS the zustand store state object
            // We can call setState on the store
            try {
              ms.setPhase('convergence');
              return { method: 'direct-store-state', currentPhase: ms.phase };
            } catch(e) {}
          }
        }

        hook = hook.next;
      }

      if (node.child) q.push(node.child);
      if (node.sibling) q.push(node.sibling);
    }
    return { error: 'store not injectable via fiber' };
  });
  console.log('  Injection result:', injResult);

  // ================================================================
  // Try fresh approach: reload + intercept + navigate to each phase
  // ================================================================
  // Reload and manually navigate to each phase using keyboard shortcut
  // or by exposing the store

  // Actually, let me just navigate to apartment naturally and take screenshots,
  // then use React's setState for the store phases

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await sleep(1000);

  // ================================================================
  // SCREEN 3 (fresh): Apartment page via store setState
  // ================================================================
  console.log('\n====== SCREEN 3 (via Zustand): Apartment ======');
  // Navigate to apartment using the real game flow: NEW GAME → story → apartment
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const ng = btns.find(b => b.textContent.includes('NEW GAME') || b.textContent.includes('New Game'));
    if (ng) ng.click();
  });
  await sleep(1000);

  // Speed through prologue via repeated spacebar presses
  for (let i = 0; i < 80; i++) {
    const isApartment = await page.evaluate(() => document.body.innerText.includes("Maya's Apartment") || document.body.innerText.includes('Points of Interest'));
    if (isApartment) { console.log(`  Reached apartment after ${i} clicks`); break; }
    await page.keyboard.press('Space');
    await sleep(120);
  }
  await sleep(600);

  info = await getInfo(page);
  console.log('Apartment page check:', info.headings, '|', info.btns.slice(0,4));
  await ss(page, '03-FRESH-apartment');

  // ================================================================
  // SCREEN 4: PATH B — Burned Notebook
  // ================================================================
  console.log('\n====== SCREEN 4: Path B — Burned Notebook ======');
  const notebookBtn = page.locator('button', { hasText: /Burned Notebook/i });
  if (await notebookBtn.count() > 0) {
    await notebookBtn.first().click();
    await sleep(600);
    await ss(page, '04-path-b-start');
    info = await getInfo(page);
    console.log('Path B heading:', info.headings);
    console.log('Path B buttons:', info.btns);
  }

  // Back to apartment
  const backBtn = page.locator('button', { hasText: /← Apartment/i });
  if (await backBtn.count() > 0) {
    await backBtn.first().click();
    await sleep(400);
  }

  // ================================================================
  // SCREEN 4: PATH C — Investigation Board
  // ================================================================
  console.log('\n====== SCREEN 4: Path C — Investigation Board ======');
  const boardBtn = page.locator('button', { hasText: /Investigation Board/i });
  if (await boardBtn.count() > 0) {
    await boardBtn.first().click();
    await sleep(600);
    await ss(page, '04-path-c-start');
    info = await getInfo(page);
    console.log('Path C heading:', info.headings);
    console.log('Path C buttons:', info.btns);
  }

  // Back to apartment
  const backBtn2 = page.locator('button', { hasText: /← Apartment/i });
  if (await backBtn2.count() > 0) {
    await backBtn2.first().click();
    await sleep(400);
  }

  // ================================================================
  // SCREEN 5: CONVERGENCE (inject state)
  // ================================================================
  console.log('\n====== SCREEN 5: Convergence Page (via state) ======');
  // Force navigate to convergence by clicking the menu item
  // First, let's complete path A in investigation to enable convergence button
  // Instead, use page.evaluate to find and trigger navigation

  const navResult = await page.evaluate(() => {
    // Try to find Zustand store through React component internals
    // Look for the setPhase function in component closures
    const root = document.getElementById('root');
    const fiberKey = Object.keys(root).find(k => k.startsWith('__reactFiber'));
    if (!fiberKey) return false;

    // Walk fibers looking for App component state
    function walk(fiber) {
      if (!fiber) return null;
      // Check pending state
      if (fiber.pendingProps && fiber.type && fiber.type.name === 'App') {
        return fiber;
      }
      // Check stateNode for class components (not applicable here)
      return walk(fiber.child) || walk(fiber.sibling);
    }

    // Walk all fibers
    const visited = new WeakSet();
    function bfs(fiber) {
      const queue = [fiber];
      while (queue.length) {
        const f = queue.shift();
        if (!f || visited.has(f)) continue;
        visited.add(f);

        // Check if this fiber has a store subscription (useGameStore)
        let hook = f.memoizedState;
        let hookIdx = 0;
        while (hook && hookIdx < 20) {
          if (hook.queue && hook.queue.dispatch) {
            // Try to check if this is our zustand subscription
            const lastState = hook.queue.lastRenderedState;
            if (lastState && typeof lastState === 'object' && lastState.phase !== undefined) {
              // Found it! But we need the store's setState
              // In zustand v5, the store is accessible via the hook's baseQueue
              return { found: true, phase: lastState.phase, hookIdx };
            }
          }
          hook = hook.next;
          hookIdx++;
        }

        if (f.child) queue.push(f.child);
        if (f.sibling) queue.push(f.sibling);
      }
      return { found: false };
    }

    return bfs(root[fiberKey]);
  });
  console.log('  Nav probe result:', navResult);

  // Alternative: force navigate by completing paths via clicking items in apartment
  // and then using the convergence button
  // For now, let's take a screenshot of the apartment showing all 3 items
  await ss(page, '05-apartment-all-items-visible');

  // ================================================================
  // SCREEN 6: Convergence — navigate via the real game flow
  // ================================================================
  // We need to complete 2+ paths. Let's use Path A (laptop) which starts directly.
  console.log('\n====== Completing Path A quickly (first node only then force complete) ======');
  const laptopBtnFresh = page.locator('button', { hasText: /Maya's Laptop/i });
  if (await laptopBtnFresh.count() > 0) {
    await laptopBtnFresh.first().click();
    await sleep(500);

    // Tag the clue
    const clue = page.locator('.clue-text').first();
    if (await clue.count() > 0) {
      await clue.click();
      await sleep(300);
    }

    // Click Open Username Scanner
    const openScanner = page.locator('button').filter({ hasText: /Open/i });
    if (await openScanner.count() > 0) {
      await openScanner.first().click();
      await sleep(300);
    }

    // Fill input with placeholder value
    const inp = page.locator('input[type="text"]');
    if (await inp.count() > 0) {
      const ph = await inp.getAttribute('placeholder').catch(() => 'c_marsh_pdx');
      await inp.fill(ph.replace('e.g. ', '') || 'c_marsh_pdx');
      const runB = page.locator('button', { hasText: /Run/i });
      if (await runB.count() > 0) {
        await runB.click();
        await sleep(2000);
      }
    }

    // Handle clue in results
    const clueR = page.locator('.clue-text').first();
    if (await clueR.count() > 0) {
      await clueR.click();
      await sleep(300);
    }

    // Collect
    const rec = page.locator('button', { hasText: /Record/i }).first();
    if (await rec.count() > 0) {
      await rec.click();
      await sleep(300);
    }

    await ss(page, '06a-path-a-progress');
  }

  // Force complete via Zustand setState directly if possible
  // Try the module-level store exposure trick
  const forceComplete = await page.evaluate(() => {
    // In development mode, Vite exposes modules via __vite_is_modern_browser etc.
    // Try to find zustand create store via module system
    // Check if there's a way to access the store

    // Method: walk ALL React hook chains
    const root = document.getElementById('root');
    const fiberKey = Object.keys(root).find(k => k.startsWith('__reactFiber'));
    if (!fiberKey) return { err: 'no fiber' };

    const visited = new WeakSet();
    const queue = [root[fiberKey]];
    const storesFound = [];

    while (queue.length) {
      const f = queue.shift();
      if (!f || visited.has(f)) continue;
      visited.add(f);

      let hook = f.memoizedState;
      while (hook) {
        // In zustand v5 with React 18+, the hook stores the store ref
        // The memoizedState stores the selected state
        // The queue.dispatch IS the store's subscribe-based dispatch

        // Try: does this hook have a 'store' or '_store' property?
        if (hook._owner) {
          const o = hook._owner;
          if (o && o.getState && o.setState) {
            storesFound.push('_owner with getState/setState');
            const currentState = o.getState();
            if (currentState && currentState.phase !== undefined) {
              o.setState({
                phase: 'convergence',
                paths: {
                  A: { started: true, completed: true, nodesFound: ['a1','a2','a3','a4'], taggedClues: [] },
                  B: { started: true, completed: true, nodesFound: ['b1','b2','b3','b4'], taggedClues: [] },
                  C: { started: true, completed: true, nodesFound: ['c1','c2','c3','c4'], taggedClues: [] },
                }
              });
              return { success: true, via: '_owner.setState' };
            }
          }
        }

        // Check if the memoizedState is a function (zustand selector result stored)
        // or if queue.getSnapshot() returns our store state
        if (hook.queue && hook.queue.getSnapshot) {
          try {
            const snap = hook.queue.getSnapshot();
            if (snap && snap.phase !== undefined) {
              // This is our zustand store subscription!
              // We need the store object — it should be accessible via hook.queue._storeRef
              // In zustand 5.x, find the store object
              const q = hook.queue;
              // Walk all enumerable keys
              for (const key of Object.keys(q)) {
                const val = q[key];
                if (val && typeof val === 'object' && typeof val.setState === 'function' && typeof val.getState === 'function') {
                  storesFound.push(`queue.${key} has setState/getState`);
                  const state = val.getState();
                  if (state.phase !== undefined) {
                    val.setState({
                      phase: 'convergence',
                      paths: {
                        A: { started: true, completed: true, nodesFound: ['a1','a2','a3'], taggedClues: [] },
                        B: { started: true, completed: true, nodesFound: ['b1','b2','b3'], taggedClues: [] },
                        C: { started: true, completed: true, nodesFound: ['c1','c2','c3'], taggedClues: [] },
                      }
                    });
                    return { success: true, via: `queue.${key}` };
                  }
                }
              }
            }
          } catch(e) {}
        }

        hook = hook.next;
      }

      if (f.child) queue.push(f.child);
      if (f.sibling) queue.push(f.sibling);
    }
    return { err: 'store not found', storesFound };
  });
  console.log('  Force complete result:', forceComplete);

  // ================================================================
  // SCREEN 6: Convergence via completing paths manually
  // ================================================================
  // Go back to apartment and complete 2 paths naturally
  console.log('\n====== Going back to apartment ======');
  const backApt = page.locator('button', { hasText: /← Apartment/i });
  if (await backApt.count() > 0) {
    await backApt.first().click();
    await sleep(500);
    await ss(page, '06-apartment-after-path-a-node1');
  }

  // Check if convergence button appeared
  const convergenceBtn = page.locator('button', { hasText: /Convergence/i });
  console.log(`  Convergence button visible: ${await convergenceBtn.count() > 0}`);

  // Let's attempt to go directly to convergence page
  // by completing all remaining path A nodes and path B node 1
  // This is getting complex. Instead, let's just navigate phases via URL change or dev tools

  // ================================================================
  // Navigate to all remaining phases via Zustand's exposed API
  // Zustand in Vite dev exposes stores via import.meta
  // ================================================================
  const zustandAccess = await page.evaluate(() => {
    // In Vite dev mode, ES modules are accessible via dynamic import
    // Try to access the gameStore module
    return new Promise((resolve) => {
      import('/src/store/gameStore.js').then(module => {
        if (module && module.useGameStore) {
          const store = module.useGameStore;
          const setState = store.setState;
          if (setState) {
            setState({
              phase: 'convergence',
              paths: {
                A: { started: true, completed: true, nodesFound: ['a1','a2','a3'], taggedClues: [] },
                B: { started: true, completed: true, nodesFound: ['b1','b2','b3'], taggedClues: [] },
                C: { started: true, completed: true, nodesFound: ['c1','c2','c3'], taggedClues: [] },
              }
            });
            resolve({ success: true });
          } else {
            resolve({ err: 'no setState on store' });
          }
        } else {
          resolve({ err: 'no useGameStore in module' });
        }
      }).catch(e => resolve({ err: e.message }));
    });
  });
  console.log('  Zustand direct access result:', zustandAccess);
  await sleep(600);

  info = await getInfo(page);
  console.log('  After injection — headings:', info.headings);
  console.log('  After injection — buttons:', info.btns.slice(0,5));
  await ss(page, '07-after-convergence-injection');

  // ================================================================
  // SCREEN 7: Convergence Page (if injection worked)
  // ================================================================
  const isConvergence = await page.evaluate(() => document.body.innerText.includes('Three Threads') || document.body.innerText.includes('Convergence'));
  console.log(`  Is convergence page: ${isConvergence}`);
  if (isConvergence) {
    await ss(page, '07-convergence-page');
    info = await getInfo(page);
    console.log('Convergence headings:', info.headings);
    console.log('Convergence buttons:', info.btns);
  }

  // ================================================================
  // SCREEN 8: Ending Page — click "Take it to the police"
  // ================================================================
  const policeBtn = page.locator('button', { hasText: /police/i });
  if (await policeBtn.count() > 0) {
    console.log('\n====== SCREEN 8: Ending — Police choice ======');
    await policeBtn.first().click();
    await sleep(800);
    await ss(page, '08-ending-police');
    info = await getInfo(page);
    console.log('Ending headings:', info.headings);
    console.log('Ending text:', info.bodyText.substring(0, 300));
  }

  // ================================================================
  // SCREEN 9: Ending — Ray choice (reload and inject again)
  // ================================================================
  console.log('\n====== SCREEN 9: Ending — Call Ray choice ======');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await sleep(500);

  // Re-inject convergence state
  await page.evaluate(() => {
    return import('/src/store/gameStore.js').then(m => {
      if (m.useGameStore && m.useGameStore.setState) {
        m.useGameStore.setState({
          phase: 'convergence',
          paths: {
            A: { started: true, completed: true, nodesFound: ['a1'], taggedClues: [] },
            B: { started: true, completed: true, nodesFound: ['b1'], taggedClues: [] },
            C: { started: true, completed: true, nodesFound: ['c1'], taggedClues: [] },
          }
        });
        return true;
      }
    }).catch(() => false);
  });
  await sleep(600);

  const callRayBtn = page.locator('button', { hasText: /Call Ray/i });
  if (await callRayBtn.count() > 0) {
    await callRayBtn.first().click();
    await sleep(800);
    await ss(page, '09-ending-call-ray');
    info = await getInfo(page);
    console.log('Ray ending headings:', info.headings);
  }

  // ================================================================
  // SCREEN 10: Play Again (restart)
  // ================================================================
  const playAgainBtn = page.locator('button', { hasText: /Play again/i });
  if (await playAgainBtn.count() > 0) {
    console.log('\n====== SCREEN 10: Play Again ======');
    await playAgainBtn.first().click();
    await sleep(600);
    await ss(page, '10-play-again-main-menu');
    info = await getInfo(page);
    console.log('After play again — headings:', info.headings);
  }

  // ================================================================
  // Check for any notifications system
  // ================================================================
  console.log('\n====== TESTING NOTIFICATIONS ======');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await sleep(500);
  // Trigger a notification by navigating to apartment and completing a path
  await page.evaluate(() => {
    return import('/src/store/gameStore.js').then(m => {
      if (m.useGameStore) {
        m.useGameStore.getState().addNotification('Test notification — path complete', 'complete');
        return true;
      }
    }).catch(() => false);
  });
  await sleep(800);
  await ss(page, '11-notification-test');
  info = await getInfo(page);
  console.log('With notification — page text includes notification?', info.bodyText.includes('notification') || info.bodyText.includes('Test notification'));

  // ================================================================
  // FINAL SUMMARY
  // ================================================================
  console.log('\n========================================');
  console.log('FINAL REPORT');
  console.log('========================================');
  console.log(`\nCONSOLE ERRORS (${consoleErrors.length}):`);
  consoleErrors.forEach((e,i) => console.log(`  ${i+1}. ${e}`));
  console.log(`\nCONSOLE WARNINGS (${consoleWarnings.length}):`);
  consoleWarnings.slice(0,10).forEach((w,i) => console.log(`  ${i+1}. ${w}`));
  console.log(`\nSCREENSHOTS (${allScreenshots.length}):`);
  allScreenshots.forEach((f,i) => console.log(`  ${i+1}. ${f}`));

  await browser.close();
}

main().catch(err => { console.error('[FATAL]', err.stack || err); process.exit(1); });
