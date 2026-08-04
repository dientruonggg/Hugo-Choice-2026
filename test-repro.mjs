import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Intercept console messages and print everything to find the stack trace
  page.on('console', msg => {
    console.log(`[BROWSER ${msg.type().toUpperCase()}]:`, msg.text());
  });
  page.on('pageerror', err => {
    console.log('[PAGE ERROR]:', err.toString());
  });

  await page.goto('http://localhost:3000');
  await new Promise(r => setTimeout(r, 1000));
  
  // Click Log In & Vote
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('*')).filter(el => 
      el.textContent && (el.textContent.includes('Start Voting') || el.textContent.includes('Log In & Vote'))
      && el.tagName !== 'SCRIPT' && el.tagName !== 'STYLE' && el.offsetParent !== null
    );
    // Find the deepest element to click
    const clickable = btns.reverse()[0];
    if (clickable) clickable.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  
  // Click Got it
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('*')).filter(el => 
      el.textContent && el.textContent.includes('Got It!') && el.offsetParent !== null
    );
    const clickable = btns.reverse()[0];
    if (clickable) clickable.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  // Type dobiet
  await page.type('input[type="text"]', 'dobiet');
  
  // Click next
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button')).filter(b => b.textContent && b.textContent.includes('Next'));
    if (btns.length > 0) btns[0].click();
  });
  await new Promise(r => setTimeout(r, 2000));
  
  await browser.close();
})();
