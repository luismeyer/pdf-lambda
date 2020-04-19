const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const btoa = require("btoa");
require("dotenv").config();

const { LAMBDA_ENDPOINT } = process.env;
if (!LAMBDA_ENDPOINT) {
  throw Error('Missing Environment Variable "LAMBDA_ENDPOINT"');
}

const testHtmlPath = path.join(__dirname, "test.html");
if (!fs.existsSync(testHtmlPath)) {
  throw Error("Missing html file");
}

const html = fs.readFileSync(testHtmlPath);
console.info("Sending Htmlfile to Lambda Endpoint...");

fetch(LAMBDA_ENDPOINT, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    html: btoa(html),
  }),
})
  .catch((err) => console.error("Error while fetching lambda:", err))
  .then((response) => response.buffer())
  .then((response) => {
    console.info("Saving Pdf File...");
    fs.writeFileSync(path.join(process.cwd(), "test.pdf"), response);
  })
  .catch((err) => console.error("Error while saving pdf file:", err));
