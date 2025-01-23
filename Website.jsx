const puppeteer = require("puppeteer");

const takeScreenshot = async (url) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });

  await page.goto(url, { waitUntil: "networkidle2" });
  const image = await page.screenshot({ path: "screenshot.png" });
  console.log("Screenshot saved as screenshot.png");
  console.log(image);
  console.log(URL.createObjectURL(image));
  await browser.close();
};

takeScreenshot("https://www.facebook.com/ads/library/?id=1094339605252809");
