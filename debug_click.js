import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  await page.goto('http://127.0.0.1:5174', { waitUntil: 'networkidle0' });
  console.log("Page loaded. Trying to click Guest button...");
  
  try {
    const btn = await page.$('.account-btn');
    if (btn) {
      console.log("Found account button! Clicking...");
      await btn.click();
      console.log("Clicked.");
      await new Promise(r => setTimeout(r, 1000));
      
      const modal = await page.$('.modal');
      if (modal) {
        console.log("Modal opened successfully!");
      } else {
        console.log("Modal did NOT open!");
      }
    } else {
      console.log("Account button not found!");
    }
  } catch (e) {
    console.log("Failed to click:", e.message);
  }

  await browser.close();
})();
