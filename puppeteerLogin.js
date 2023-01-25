const puppeteer = require("puppeteer");
const fs = require('fs').promises;


// the parameter of the function is the page adress of page to be scraped and a callback function.
// This function is the logic of the scraping
// parameters of the callback function is:
// cookies, type cookies
// name and path of the cookie json filename, type string
// Adress/Url of the page that could be scraped, string
//
//

// login function is responsible for logging in to the website and saving the cookies to a file
const login = async (pageAdress, scrapeFunction) => {
  // create URL from environment variable and cookie file name
  const url = new URL(pageAdress);
  const cookieFileName = "./.cookies/".concat(url.hostname.replace(/\./g, "_").concat(".json"));

  // check if cookies already exist in the cookie file
  let cookies;
  try {
    const cookiesString = await fs.readFile(cookieFileName);
    cookies = JSON.parse(cookiesString);
  } catch (e) {
    console.error(e);
  }

  // if cookies exist, use them to scrape the website
  if (cookies) {
    console.log("No need to login. Cookie is good to go");
    scrapeFunction(cookies, cookieFileName, pageAdress);
    return;
  }

  // if cookies do not exist, use puppeteer to log in to the website
  console.log("Preparing to log in to site");
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(url.href, {
    waitUntil: "networkidle2",
  });

  // save cookies to file when browser window closes
  page.on('close', async () => {
    console.log('The browser window is closing');
    try {
      await fs.writeFile(cookieFileName, JSON.stringify(cookies, null, 2));
    } catch (error) {
      console.error(error);
    }

    scrapeFunction(cookies, cookieFileName, pageAdress);
  });

  // save cookies to variable when page is fully loaded
  page.on('load', async () => {
    if (url.href === await page.url()) {
      cookies = await page.cookies();
      console.log('Page fully loaded');
    }
  });
}




module.exports = {
  login: login
};
