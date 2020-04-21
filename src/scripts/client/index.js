const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const btoa = require("btoa");
const atob = require("atob");

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
  headers: { "Content-Type": "application/text" },
  body: btoa(html),
  isBase64Encoded: true,
})
  .then((res) => res.json())
  .then((res) => {
    console.log(res);
    console.log("Saving PDf");
    console.log(atob(res.data));
    fs.writeFileSync("test.pdf", atob(res.data));
  });
