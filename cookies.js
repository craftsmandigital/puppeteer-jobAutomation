const dotenv = require('dotenv');
const puppeteer = require("puppeteer");
const fs = require('fs').promises;
const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

// Load environment variables from the .env file
dotenv.config();


async function scrape(cookies) {
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
  await page.goto(process.env.CORNERSTONE_URL);
  await page.screenshot({ path: 'screenshot.png' });
  const url = await page.url();
  // // The test under is no ned for. the logic is taken care of in the login function page on load event
  if (url !== process.env.CORNERSTONE_URL) {

    console.log("url matsjer ikke med den vi vil inn på. prosessen stopper");

    await browser.close();
    // Fjern Cokies filen
    await fs.rm("./cookies.json")
    return;
  }
  await browser.close();
}


async function login() {



  // Read the cookies from the file, if they exist
  let cookies;
  try {
    const cookiesString = await fs.readFile("./cookies.json");

    cookies = JSON.parse(cookiesString);
    // await page.setCookie(...cookies);

  } catch (e) {
    console.error(e);// Cookies file does not exist, so we need to log in
  }

  if (cookies) {
    scrape(cookies);
    return;
  }

  // console.log(cookies);
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(process.env.CORNERSTONE_URL, {
    waitUntil: "networkidle2",
  });

  // await page.type("#login-username", "jviksaas@yahoo.no");
  // await page.click("#identifierNext");

  // await page.waitForSelector("#password", {
  //   visible: true,
  //   hidden: false,
  // });
  // await page.type(
  //   "#login-password",
  //   "ypv69HxCA9BhiG"
  // );
  // await sleep(1000);
  // await page.click("#login");

  // await sleep(10000);

  //save cookies





  // This function will run when the browser window closes
  page.on('close', async () => {
    let cookie;
    // You can perform any cleanup tasks here, such as saving data or closing connections
    //save cookies
    //const cookies = await page.cookies();
    console.log('The browser window is closing');
    try {
      await fs.writeFile('./cookies.json', JSON.stringify(cookies, null, 2));
      cookie = true;
    } catch (error) {
      cookie = false;
    }
    scrape(cookies);
  });



  page.on('load', async () => {
    // You can perform any cleanup tasks here, such as saving data or closing connections
    //save cookies
    // Only set cookies if we are redirected to the right page
    if (process.env.CORNERSTONE_URL === await page.url()) {
      cookies = await page.cookies();
      console.log('Siden er fulstendig lastet ned');
    }
  });
}





(async () => {

  const isLogedIn = await login();
  // console.log(isLogedIn);



})();
