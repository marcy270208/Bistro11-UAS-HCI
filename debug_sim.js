import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE:', msg.text()));
  
  await page.goto('http://127.0.0.1:5174', { waitUntil: 'networkidle0' });
  
  await page.evaluate(() => {
    // Expose data to console
    const state = JSON.parse(localStorage.getItem('bistro11'));
    console.log("Initial orders:", state?.orders?.length || 0);
  });
  
  console.log("Placing an order via console API...");
  await page.evaluate(async () => {
    // Click random add to cart
    document.querySelectorAll('.btn').forEach(b => {
        if(b.textContent.includes('Add')) b.click();
    });
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.evaluate(() => {
     const cartBtn = document.querySelector('.icon-btn--cart');
     if(cartBtn) cartBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.evaluate(() => {
     const payBtn = [...document.querySelectorAll('.btn')].find(b => b.textContent.includes('Place order'));
     if(payBtn) payBtn.click();
  });
  
  console.log("Waiting 15 seconds for simulation...");
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
