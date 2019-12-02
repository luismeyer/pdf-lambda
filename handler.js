'use strict';
const chromium = require('chrome-aws-lambda');
const chromepath = process.env.IS_OFFLINE && process.env.CHROME_PATH;

const btoa = b => Buffer.from(b, 'base64').toString();
const CorsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true
};

const errorResponse = {
  statusCode: 404,
  headers: CorsHeaders,
  body: JSON.stringify({
    message: 'Error while rendering pdf'
  })
};

const successResponse = (pdf, filename) => ({
  statusCode: 200,
  headers: CorsHeaders,
  body: JSON.stringify({
    pdf,
    filename
  })
});

module.exports.handler = async event => {
  const body = JSON.parse(event.body);
  const html = btoa(body.html);

  const browser = await chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: chromepath ? chromepath : await chromium.executablePath,
    headless: true
  });

  try {
    console.info('Opening HTML File');
    const page = await browser.newPage();
    await page.goto('data:text/html,' + html, { waitUntil: 'networkidle2' });
    await page.waitFor('*');

    console.info('Printing PDF');
    const buffer = await page.pdf({ format: 'A4' });

    console.info('Cleanup...');
    await browser.close();

    return successResponse(buffer, body.filename);
  } catch (e) {
    console.error('Error while rendering PDF: ', e);
    await browser.close();
    return errorResponse;
  }
};
