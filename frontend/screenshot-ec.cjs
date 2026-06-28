const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 1200 } });
  await page.goto("file:///Users/akbar/Desktop/my-portfolio/ecommerce-screens.html", { waitUntil: "networkidle", timeout: 15000 });
  await page.waitForTimeout(800);

  const screens = [
    { id: "sc-home", file: "frontend/public/projects/ecommerce/ecommerce-hero.png" },
    { id: "sc-product", file: "frontend/public/projects/ecommerce/ecommerce-product.png" },
    { id: "sc-cart", file: "frontend/public/projects/ecommerce/ecommerce-cart.png" },
    { id: "sc-checkout", file: "frontend/public/projects/ecommerce/ecommerce-checkout.png" },
    { id: "sc-admin", file: "frontend/public/projects/ecommerce/ecommerce-admin.png" },
    { id: "sc-mobile", file: "frontend/public/projects/ecommerce/ecommerce-mobile.png" },
  ];

  for (const s of screens) {
    const sel = "#" + s.id;
    const el = await page.$(sel);
    if (!el) { console.error("NOT FOUND:", sel); continue; }
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    const box = await el.boundingBox();
    if (!box) { console.error("NO BOX:", sel); continue; }
    if (box.width < 10 || box.height < 10) { console.error("TOO SMALL:", sel, box); continue; }
    const absPath = path.resolve(s.file);
    await page.screenshot({ path: absPath, clip: { x: box.x, y: box.y, width: Math.round(box.width), height: Math.round(box.height) } });
    const size = fs.statSync(absPath).size;
    console.log("OK", s.id, (size / 1024).toFixed(0) + "KB");
  }

  await browser.close();
})();
