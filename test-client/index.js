const fetch = require('node-fetch');
const fs = require('fs');

var html = fs.readFileSync('./test-client/test.html');
const buffer = Buffer.from(html).toString('base64');
console.info('Sending Htmlfile to Lambda Endpoint...');
fetch('http://localhost:4000/pdf', {
  method: 'POST',
  body: JSON.stringify({
    html: buffer,
    filename: "test.pdf"
  })
})
.then( (response) => response.json())
.then( (response) => {
  console.info('Saving Pdf File...')
  var wstream = fs.createWriteStream(`./test-client/${response.filename}`);
  wstream.write(new Buffer(response.pdf));
  wstream.end();
});