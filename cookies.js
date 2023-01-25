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
  // await page.screenshot({ path: 'screenshot.png' });

  // if the URL does not match the desired page, stop the process and delete the cookies file
  if (pageURL.href !== await page.url()) {
    console.log("URL does not match desired page. Process stopped.");
    await browser.close();
    await fs.rm(cookieFilenameAndPath);
    return;
  }


  // -------------------------------------------------------------
  const pageElements = {
    firstName: await page.$eval('#view_5042867_form____name_first', cc => cc.value),

    midleName: await page.$eval('#view_5042867_form____name_middle', cc => cc.value),
    lastName: await page.$eval('#view_5042867_form____name_last', cc => cc.value),
    ssn: await page.$eval('#view_5042867_form____ssn', cc => cc.value),
  }

  if (!pageElements.ssn) {
    console.log('fødselsnummer eksisterer ikke');
    Object.assign(pageElements, {
      streetAdress: await page.$eval('#view_5042867_form_address_5721983____line1', cc => cc.value),
      postNumber: await page.$eval('#view_5042867_form_address_5721983____postal_code', cc => cc.value),
      postAdress: await page.$eval('#view_5042867_form_address_5721983____city', cc => cc.value),
      // firstName: await page.$eval('', cc => cc.value),
      // firstName: await page.$eval('', cc => cc.value),
      // firstName: await page.$eval('', cc => cc.value),
    });
  }
  console.log(pageElements);


  // -------------------------------------------------------------






  await browser.close();
}





(async () => {
  await puppLogin.login(process.env.CORNERSTONE_URL, scrape);
})();
