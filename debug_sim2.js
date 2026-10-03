import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE:', msg.text()));
  page.on('pageerror', err => console.log('ERROR:', err.message));
  
  await page.goto('http://127.0.0.1:5174', { waitUntil: 'networkidle0' });
  
  console.log("Injecting a 'new' order into localStorage...");
  await page.evaluate(() => {
    const s = JSON.parse(localStorage.getItem('bistro11')) || { orders: [] };
    s.orders = [{ id: 'TEST', status: 'new' }];
    localStorage.setItem('bistro11', JSON.stringify(s));
  });
  
  console.log("Reloading page...");
  await page.reload({ waitUntil: 'networkidle0' });
  
  console.log("Waiting for simulation...");
  for(let i=0; i<15; i++) {
     await new Promise(r => setTimeout(r, 1000));
     const status = await page.evaluate(() => {
        const st = JSON.parse(localStorage.getItem('bistro11'));
        return st?.orders?.[0]?.status;
     });
     console.log(`Sec ${i+1}: status = ${status}`);
  }

  await browser.close();
})();
