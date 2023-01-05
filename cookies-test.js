const dotenv = require('dotenv');
const { Console } = require("console");
const puppeteer = require("puppeteer");
const fs = require("fs").promises;

(async () => {
  dotenv.config();
  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();

  //load cookies
  const cookiesString = await fs.readFile("./cookies.json");
  const cookies = JSON.parse(cookiesString);
  await page.setCookie(...cookies);
  await page.goto(process.env.CORNERSTONE_URL);
  await page.screenshot({ path: 'screenshot.png' });
  await browser.close();
})();
