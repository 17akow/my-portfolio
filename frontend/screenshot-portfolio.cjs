const { chromium } = require("playwright");
const path = require("path");

const BASE = "http://localhost:5173";
const OUT = path.join(__dirname, "public/projects/portfolio");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);

  const sections = [
    { id: "hero", file: "portfolio-hero.png" },
    { id: "about", file: "portfolio-about.png" },
    { id: "skills", file: "portfolio-skills.png" },
    { id: "certifications", file: "portfolio-certifications.png" },
    { id: "projects", file: "portfolio-projects.png" },
    { id: "contact", file: "portfolio-contact.png" },
  ];

  for (const s of sections) {
    try {
      const el = page.locator(`section#${s.id}`);
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(800);
      await el.screenshot({ path: path.join(OUT, s.file) });
      console.log(`OK ${s.file}`);
    } catch (e) {
      console.log(`FAIL ${s.file}: ${e.message}`);
    }
  }

  // Mobile
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(OUT, "portfolio-mobile.png"), fullPage: true });
  console.log("OK portfolio-mobile.png");

  // Performance: revert desktop, full page
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(OUT, "portfolio-performance.png"), fullPage: true });
  console.log("OK portfolio-performance.png");

  await browser.close();
  console.log("Done.");
})();
