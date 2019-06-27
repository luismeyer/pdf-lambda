const fetch = require('node-fetch');
const fs = require('fs');

const { LAMBDA_ENDPOINT } = require('./.env.js')

var html = fs.readFileSync("./test.html");
const buffer = Buffer.from(html).toString('base64');
console.info('Sending Htmlfile to Lambda Endpoint...');
fetch(LAMBDA_ENDPOINT, {
  method: 'POST',
  body: JSON.stringify({
    html: buffer,
    filename: "test.pdf"
  })
})
.then( (response) => response.json())
.then( (response) => {
  console.info('Saving Pdf File...')
  var wstream = fs.createWriteStream(response.filename);
  wstream.write(new Buffer(response.pdf));
  wstream.end();
});