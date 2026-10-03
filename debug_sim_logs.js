import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE:', msg.text()));
  
  await page.goto('http://127.0.0.1:5174', { waitUntil: 'networkidle0' });
  
  console.log("Injecting a 'new' order into localStorage...");
  await page.evaluate(() => {
    const s = JSON.parse(localStorage.getItem('bistro11')) || { orders: [] };
    s.orders = [{ id: 'TEST', status: 'new' }];
    localStorage.setItem('bistro11', JSON.stringify(s));
    
    // Inject a console log into the global simulation useEffect!
    // Actually we can't easily do that from puppeteer...
    // But we can observe how many times the timeout is cleared.
  });
  
  await page.reload({ waitUntil: 'networkidle0' });
  
  await new Promise(r => setTimeout(r, 10000));
  await browser.close();
})();
