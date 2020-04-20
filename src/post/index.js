"use strict";
const chromium = require("chrome-aws-lambda");
const atob = require("atob");
const btoa = require("btoa");

const chromePath = process.env.CHROME_PATH;

const DEFAULT_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
};

module.exports = async ({ body }, _, callback) => {
  const html = atob(body.html);

  const browser = await chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: chromePath || (await chromium.executablePath),
    headless: chromium.headless,
  });

  try {
    console.info("Opening HTML File...");
    const page = await browser.newPage();
    await page.goto(`data:text/html,${html}`, { waitUntil: "networkidle2" });
    await page.waitFor("*");

    console.info("Printing PDF...");
    const buffer = await page.pdf({ format: "A4" });

    console.info("Cleanup...");
    await browser.close();

    callback(null, {
      statusCode: 200,
      headers: { ...DEFAULT_HEADERS, "Content-type": "application/json" },
      body: JSON.stringify({
        data: btoa(buffer),
      }),
    });
  } catch (e) {
    console.error("Error while rendering PDF: ", e);
    await browser.close();
    callback(null, {
      statusCode: 400,
      headers: { ...DEFAULT_HEADERS, "Content-type": "application/json" },
      body: JSON.stringify({
        message: "Error while rendering pdf",
      }),
    });
  }
};
