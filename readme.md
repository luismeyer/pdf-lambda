# Pdf λ 📄

AWS Lambda that converts Html to Pdf

## Usage

Send a Post Request to the Lambda using a body like this:

```javascript
{
    html: "<b64 encoded html string>",
}
```

The function will return a json containing the pdf as a b64.

```javascript
{
    data: "<b64 encoded pdf file>",
}
```

## Get Started

To start local Development:

```bash
npm i
npm start
```

Send an example request to the lambda endpoint:

```bash
npm run client
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
