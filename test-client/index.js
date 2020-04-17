const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const { LAMBDA_ENDPOINT } = process.env;
if (!LAMBDA_ENDPOINT)
  throw Error('Missing Environment Variable "LAMBDA_ENDPOINT"');

const html = fs.readFileSync(path.join(__dirname, "test.html"));
const buffer = Buffer.from(html).toString("base64");
console.info("Sending Htmlfile to Lambda Endpoint...");

fetch(LAMBDA_ENDPOINT, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    html: buffer,
    filename: "test.pdf",
  }),
})
  .then((response) => response.json())
  .then((response) => {
    console.info("Saving Pdf File...");

    fs.writeFileSync(
      path.join(__dirname, response.filename),
      Buffer.from(response.pdf)
    );
  });
