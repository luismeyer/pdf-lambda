"use strict";
const launchChrome = require("@serverless-chrome/lambda");
const request = require("superagent");
const puppeteer = require("puppeteer");

const btoa = (b) => Buffer.from(b, "base64").toString();
const CorsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
};

const getChrome = async () => {
  const chrome = await launchChrome({
    flags: ["--headless"],
  });

  const response = await request
    .get(`${chrome.url}/json/version`)
    .set("Content-Type", "application/json");

  return response.body.webSocketDebuggerUrl;
};

module.exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const html = btoa(body.html);

  const endpoint = await getChrome();
  const browser = await puppeteer.connect({
    browserWSEndpoint: endpoint,
  });

  try {
    console.info("Opening HTML File");
    const page = await browser.newPage();
    await page.goto("data:text/html," + html, { waitUntil: "networkidle2" });
    await page.waitFor("*");

    console.info("Printing PDF");
    const buffer = await page.pdf({ format: "A4" });

    console.info("Cleanup...");
    await browser.close();

    return {
      statusCode: 200,
      headers: CorsHeaders,
      body: JSON.stringify({
        pdf: buffer,
        filename: body.filename,
      }),
    };
  } catch (e) {
    console.error("Error while rendering PDF: ", e);
    await browser.close();
    return {
      statusCode: 404,
      headers: CorsHeaders,
      body: JSON.stringify({
        message: "Error while rendering pdf",
      }),
    };
  }
};
