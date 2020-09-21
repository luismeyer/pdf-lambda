const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");

const { btoa, atob } = require("../../utils");

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
  body: JSON.stringify({ html: btoa(html) }),
})
  .then((res) => res.json())
  .then((res) => {
    if (res.error || !res.data) {
      throw Error(`ERROR: ${res.error || "missing data"}`);
    }

    fs.writeFileSync("test.pdf", Buffer.from(res.data, "base64"));
  });
