import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();

  await page.goto('http://127.0.0.1:5174', { waitUntil: 'networkidle0' });
  
  const coverElements = await page.evaluate(() => {
    const ww = window.innerWidth;
    const wh = window.innerHeight;
    
    // Check multiple points (top right, center)
    const points = [
      {x: ww - 50, y: 30}, // Header buttons
      {x: ww / 2, y: wh / 2} // Center
    ];
    
    return points.map(p => {
      const el = document.elementFromPoint(p.x, p.y);
      return { x: p.x, y: p.y, tag: el?.tagName, cls: el?.className };
    });
  });
  
  console.log("Elements from point:", coverElements);

  await browser.close();
})();
