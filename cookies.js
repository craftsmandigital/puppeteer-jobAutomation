const dotenv = require('dotenv');
const puppeteer = require("puppeteer");
const fs = require('fs').promises;
const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

(async () => {
  // Load environment variables from the .env file
  dotenv.config();
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
    // You can perform any cleanup tasks here, such as saving data or closing connections
    //save cookies
    //const cookies = await page.cookies();
    await fs.writeFile('./cookies.json', JSON.stringify(cookies, null, 2));
    console.log('The browser window is closing');
  });



  page.on('load', async () => {
    // You can perform any cleanup tasks here, such as saving data or closing connections
    //save cookies
    cookies = await page.cookies();
    console.log('Siden er fulstendig lastet ned');
  });




})();
