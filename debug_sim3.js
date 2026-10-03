import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE:', msg.text()));
  
  await page.goto('http://127.0.0.1:5174', { waitUntil: 'networkidle0' });
  
  await page.evaluate(() => {
    // Overwrite advanceOrder globally so we can intercept it!
    // Wait, advanceOrder is enclosed in AppProvider. We can't overwrite it.
    // Let's just monitor the DOM for toasts!
    const observer = new MutationObserver(mutations => {
      mutations.forEach(m => {
        if (m.addedNodes.length) {
          m.addedNodes.forEach(n => {
            if (n.classList && n.classList.contains('toast')) {
              console.log("TOAST APPEARED:", n.innerText);
            }
          });
        }
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
    
    // Also log whenever localStorage changes
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
      if(key === 'bistro11') {
        const d = JSON.parse(value);
        console.log("LocalStorage bistro11 updated! First order status:", d.orders?.[0]?.status);
      }
      originalSetItem.apply(this, arguments);
    };
  });
  
  // Inject order by calling the Place Order function via UI
  console.log("Placing an order via console API...");
  await page.evaluate(async () => {
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
  
  console.log("Waiting 10 seconds for simulation...");
  await new Promise(r => setTimeout(r, 10000));

  await browser.close();
})();
