// const puppeteer = require("puppeteer");
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require("fs").promises;
puppeteer.use(StealthPlugin());

const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};


(async () => {




  const browser = await puppeteer.launch(
    {
      headless: false,
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    });
  const page = await browser.newPage();



  //load cookies
  const cookiesString = await fs.readFile('./cookies.json');
  const cookies = JSON.parse(cookiesString);
  await page.setCookie(...cookies);
  // console.log(cookies);


  await page.goto("https://accounts.google.com/signin/v2/identifier", {
    waitUntil: "networkidle2",
  });







})();

