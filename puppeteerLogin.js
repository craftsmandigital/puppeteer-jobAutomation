const puppeteer = require("puppeteer");
const fs = require('fs').promises;

const dotenv = require('dotenv');
// Load environment variables from the .env file
dotenv.config();




// the parameter of the function is a function. This function is the logic of the scraping
// parameters of the function is:
// cookies
// name and path of the cookie json filename
// Url object of the page that could be scraped
//
//
// There could be improvments of this function. extra parameters instead og environment variables.
async function login(scrapeFunction) {


  const url = new URL(process.env.CORNERSTONE_URL);
  const cookieFileName = "./.cookies/".concat(url.hostname.replace(/\./g, "_").concat(".json"));
  console.log(cookieFileName); // 'www.example.com'


  // Read the cookies from the file, if they exist
  let cookies;
  try {
    const cookiesString = await fs.readFile(cookieFileName);

    cookies = JSON.parse(cookiesString);
    // await page.setCookie(...cookies);

  } catch (e) {
    console.error(e);// Cookies file does not exist, so we need to log in
  }

  if (cookies) {

    console.log("No need to login. Cookie is good to go");
    scrapeFunction(cookies, cookieFileName, url);
    return;
  }

  console.log("Prepare to log in to site");
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(url.href, {
    waitUntil: "networkidle2",
  });


  // This function will run when the browser window closes
  page.on('close', async () => {
    let cookie;
    // You can perform any cleanup tasks here, such as saving data or closing connections
    //save cookies
    //const cookies = await page.cookies();
    console.log('The browser window is closing');
    try {
      await fs.writeFile(cookieFileName, JSON.stringify(cookies, null, 2));
      cookie = true;
    } catch (error) {
      cookie = false;
    }

    const pageURL = new URL(process.env.CORNERSTONE_URL);
    scrape(cookies, cookieFileName, pageURL);
  });


  page.on('load', async () => {
    // You can perform any cleanup tasks here, such as saving data or closing connections
    //save cookies
    // Only set cookies if we are redirected to the right page
    if (url.href === await page.url()) {
      cookies = await page.cookies();
      console.log('Siden er fulstendig lastet ned');
    }
  });
}


module.exports = {
  login: login
};
