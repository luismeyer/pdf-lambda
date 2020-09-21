const Handlebars = require("handlebars");
const path = require("path");
const fs = require("fs");

const { STAGE, IS_OFFLINE } = process.env;
if (!STAGE) throw Error("Missing Environment Variable: STAGE");

const basePath = IS_OFFLINE ? `/${STAGE}` : "";

module.exports = (event, _, callback) => {
  console.info("Incoming: ", event);

  const htmlSource = fs
    .readFileSync(path.join(__dirname, "index.html"))
    .toString();

  const template = Handlebars.compile(htmlSource);
  const result = template({
    basePath,
  });

  callback(null, {
    statusCode: 200,
    headers: {
      "Content-Type": "text/html",
    },
    body: result,
  });
};
