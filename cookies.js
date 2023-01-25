const puppLogin = require('./puppeteerLogin');

const puppeteer = require("puppeteer");
const fs = require('fs').promises;
const dotenv = require('dotenv');
dotenv.config();



// scrape function is responsible for accessing a specific page on the website after logging in
const scrape = async (cookies, cookieFilenameAndPath, pageAdress) => {
  if (!cookies) {
    return;
  }
  const pageURL = new URL(pageAdress); // if cookies do not exist, stop the process   const url = new URL(pageAdress); if (!cookies) {

  // use puppeteer to access the desired page
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.setCookie(...cookies);
  await page.goto(pageURL.href);
  await page.screenshot({ path: 'screenshot.png' });

  // if the URL does not match the desired page, stop the process and delete the cookies file
  if (pageURL.href !== await page.url()) {
    console.log("URL does not match desired page. Process stopped.");
    await browser.close();
    await fs.rm(cookieFilenameAndPath);
    return;
  }

  await browser.close();
}





(async () => {
  await puppLogin.login(process.env.CORNERSTONE_URL, scrape);
})();
