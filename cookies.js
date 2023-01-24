const puppLogin = require('./puppeteerLogin');

const puppeteer = require("puppeteer");
const fs = require('fs').promises;
const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

const dotenv = require('dotenv');
// Load environment variables from the .env file
dotenv.config();




async function scrape(cookies, cookieFilenameAndPath, pageURL) {
  // console.log(cookies);
  if (!cookies) {
    return;
  }


  const dotenv = require('dotenv');
  const { Console } = require("console");
  const puppeteer = require("puppeteer");
  const fs = require("fs").promises;

  dotenv.config();
  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();

  //load cookies
  await page.setCookie(...cookies);
  await page.goto(pageURL.href); // her er feilen, etter login, så feiler det her undefined
  await page.screenshot({ path: 'screenshot.png' });
  const pageurl = await page.url();
  // // The test under is no ned for. the logic is taken care of in the login function page on load event
  if (pageurl !== pageURL.href) {

    console.log("url matsjer ikke med den vi vil inn på. prosessen stopper\n%s  <>  %s", pageurl, url.href);

    await browser.close();
    // Fjern Cokies filen
    await fs.rm(cookieFilenameAndPath);
    return;
  }
  await browser.close();
}








(async () => {


  const isLogedIn = await puppLogin.login(scrape);
  // console.log(isLogedIn);



})();
