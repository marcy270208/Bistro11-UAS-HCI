import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();

  await page.goto('http://127.0.0.1:5174', { waitUntil: 'networkidle0' });
  
  const elementCovering = await page.evaluate(() => {
    const btn = document.querySelector('.account-btn');
    if (!btn) return "No button";
    const rect = btn.getBoundingClientRect();
    const el = document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
    return el ? (el.className || el.tagName) : "None";
  });
  
  console.log("Element covering the button:", elementCovering);

  await browser.close();
})();
