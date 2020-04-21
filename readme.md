# Pdf Lambda

AWS Lambda that converts Html to Pdf

## Usage

Send a Post Request to the Lambda using a body like this:

```javascript
{
    html: "<b64 encoded html string>",
}
```

The function will return a json containing the pdf as a buffer and the filename for further usage of the file.

## Commands

Start local Development:
(If you aren't on Mac or if you don't have Chrome installed in the default directory put your Chromepath into the serverless.yml file)

```bash
npm start
```

Deploy the Function to your AWS Account:

```bash
npm run deploy
```

Client Example:

```bash
npm run client
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
