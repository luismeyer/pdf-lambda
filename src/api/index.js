"use strict";
const awsChromium = require("chrome-aws-lambda");
const chromium = require("chromium");

const { atob, btoa } = require("../utils");

const { IS_OFFLINE } = process.env;

const DEFAULT_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
};

const installChromium = () => {
  if (chromium.path) return;

  console.info("Installing chrome...");
  return chromium.install();
};

module.exports = async ({ body }) => {
  const parsedBody = JSON.parse(IS_OFFLINE ? body : atob(body));
  const html = atob(parsedBody.html);

  if (IS_OFFLINE) {
    await installChromium();
  }

  const executablePath = IS_OFFLINE
    ? chromium.path
    : await awsChromium.executablePath;

  const browser = await awsChromium.puppeteer.launch({
    args: awsChromium.args,
    defaultViewport: awsChromium.defaultViewport,
    executablePath,
    headless: awsChromium.headless,
  });

  try {
    console.info("Opening HTML File...");
    const page = await browser.newPage();
    await page.goto(`data:text/html,${html}`, { waitUntil: "networkidle2" });

    console.info("Printing PDF...");
    const buffer = await page.pdf({ format: "A4" });

    console.info("Cleanup...");
    await browser.close();

    return {
      statusCode: 200,
      headers: { ...DEFAULT_HEADERS, "Content-type": "application/json" },
      body: JSON.stringify({
        data: btoa(buffer),
      }),
    };
  } catch (e) {
    console.error("Error while rendering PDF: ", e);
    await browser.close();

    return {
      statusCode: 400,
      headers: { ...DEFAULT_HEADERS, "Content-type": "application/json" },
      body: JSON.stringify({
        message: "Error while rendering pdf",
      }),
    };
  }
};
