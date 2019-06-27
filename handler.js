"use strict";
const chromium = require("chrome-aws-lambda");

const btoa = (b) => Buffer.from(b, 'base64').toString();
const CorsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
};

const errorResponse = {
  statusCode: 404,
  headers: CorsHeaders,
  body: JSON.stringify({
    message: 'Error while rendering pdf',
  }),
};

const successResponse = (pdf, filename) => ({
  statusCode: 200,
  headers: CorsHeaders,
  body: JSON.stringify({
    pdf,
    filename,
  }),
});

module.exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const encodedHtml = body.html

  const html = btoa(encodedHtml);
  console.log(html);
  
  const browser = await chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
  });

  try {
    const page = await browser.newPage();
    await page.goto('data:text/html,' + html, { waitUntil: 'networkidle2' });
    await page.waitFor('*');
    console.info('Rendering PDF in Chrome');
    const buffer = await page.pdf({ format: 'A4' });

    console.info('Cleanup...');
    await browser.close();

    return successResponse(buffer, body.filename);
  } catch (e) {
    console.error('Error while rendering PDF: ', e)
    await browser.close()
    return errorResponse
  }
};