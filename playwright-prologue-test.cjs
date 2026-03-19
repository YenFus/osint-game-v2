// Playwright script: capture first 8 illustrated scene panels of the prologue
const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });

  const screenshotDir = path.join(__dirname, 'playwright-screenshots');
  const errors = [];

  // Capture console errors
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', err => errors.push(err.message));

  console.log('Opening localhost:5173 ...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.screenshot({ path: `${screenshotDir}/00_main_menu.png` });
  console.log('Screenshot: main menu');

  // Click NEW GAME
  const newGameBtn = page.getByRole('button', { name: /new game/i });
  if (await newGameBtn.count() === 0) {
    console.error('ERROR: Could not find NEW GAME button');
    await page.screenshot({ path: `${screenshotDir}/error_no_newgame.png` });
    await browser.close();
    process.exit(1);
  }
  await newGameBtn.click();
  console.log('Clicked NEW GAME');

  // Wait a moment for prologue to start
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${screenshotDir}/01_after_newgame.png` });
  console.log('Screenshot: after NEW GAME click');

  // Now we need to advance through panels.
  // title card (chapter) → auto-advances
  // chapter_one (chapter) → auto-advances
  // Then 8 scene panels start: restaurant_exterior, restaurant_exterior_2, restaurant_wide, hands_cup, empty_chair, empty_chair_2, thomas_face, thomas_face_2

  // Wait for auto-advance through the first two chapter cards (~5 seconds total)
  // title auto: 2200ms, chapter_one auto: 1800ms
  console.log('Waiting for chapter title cards to auto-advance...');
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${screenshotDir}/02_title_card.png` });
  console.log('Screenshot: title card');

  await page.waitForTimeout(2400); // wait past title card
  await page.screenshot({ path: `${screenshotDir}/03_chapter_one_card.png` });
  console.log('Screenshot: chapter one card');

  await page.waitForTimeout(2000); // wait past chapter one card
  // Now we should be on the first scene panel: restaurant_exterior
  await page.screenshot({ path: `${screenshotDir}/scene01_restaurant_exterior.png` });
  console.log('Screenshot: scene 1 - restaurant_exterior');

  // Helper: advance by clicking the scene area (or pressing space/enter/arrow)
  const advance = async (label, waitMs = 300) => {
    // Try clicking the main content area to advance
    await page.keyboard.press('Space');
    await page.waitForTimeout(waitMs);
  };

  // scene 1 narration: "Tuesday. November." — short, ~1s
  // We need to wait for the narration to finish or click to skip
  // Let's wait for narration to complete, then the panel waits for a click
  // Actually the panels may auto-advance on click. Let's wait for narration + advance.

  // Scene 1 narration time: "Tuesday." pause 600ms + "November." ~140ms*2 = ~1s total
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `${screenshotDir}/scene01_restaurant_exterior_narrating.png` });
  // Click to advance to scene 2
  await page.click('body');
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${screenshotDir}/scene02_restaurant_exterior_2.png` });
  console.log('Screenshot: scene 2 - restaurant_exterior_2');

  // Scene 2 narration: "She said seven. I was there at six-forty-five." ~3s
  await page.waitForTimeout(4000);
  await page.click('body');
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${screenshotDir}/scene03_restaurant_wide.png` });
  console.log('Screenshot: scene 3 - restaurant_wide');

  // Scene 3 narration: long ~5s
  await page.waitForTimeout(6000);
  await page.click('body');
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${screenshotDir}/scene04_hands_cup.png` });
  console.log('Screenshot: scene 4 - hands_cup');

  // Scene 4 narration: long ~7s
  await page.waitForTimeout(8000);
  await page.click('body');
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${screenshotDir}/scene05_empty_chair.png` });
  console.log('Screenshot: scene 5 - empty_chair');

  // Scene 5 narration: "Seven-fifteen. Seven-thirty." ~2.5s
  await page.waitForTimeout(3500);
  await page.click('body');
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${screenshotDir}/scene06_empty_chair_2.png` });
  console.log('Screenshot: scene 6 - empty_chair_2');

  // Scene 6 narration: ~5s
  await page.waitForTimeout(6000);
  await page.click('body');
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${screenshotDir}/scene07_thomas_face.png` });
  console.log('Screenshot: scene 7 - thomas_face');

  // Scene 7 narration: "Eight o'clock." ~1.5s
  await page.waitForTimeout(2500);
  await page.click('body');
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${screenshotDir}/scene08_thomas_face_2.png` });
  console.log('Screenshot: scene 8 - thomas_face_2');

  // Final error screenshot
  console.log('\n=== Console errors collected ===');
  if (errors.length === 0) {
    console.log('No errors.');
  } else {
    errors.forEach(e => console.log('ERROR:', e));
  }

  // Keep browser open briefly for inspection
  await page.waitForTimeout(1000);
  await browser.close();
  console.log('Done.');
})();
