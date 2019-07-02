# Pdf Lambda

The source code for an AWS Lambda that converts Html to Pdf

## Usage

Send a Post Request to the Lambda using a body like this:
```javascript
{
    html: "<html string>",
    filename: "<file.pdf>"
}
```

The function will return a json containing the pdf as a buffer and the filename for further usage of the file.

## Command

Start local Development:
```bash
npm start
```

Deploy the Function to your AWS Account:
```bash
npm run deploy
```

## License
[MIT](https://choosealicense.com/licenses/mit/)