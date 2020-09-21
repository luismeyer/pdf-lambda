const fs = require("fs");
const path = require("path");

module.exports.btoa = (binary) =>
  Buffer.from(binary, "binary").toString("base64");

module.exports.atob = (ascii) =>
  Buffer.from(ascii, "base64").toString("binary");

module.exports.VERSION_FILE = path.resolve(__dirname, "version");

module.exports.version = () =>
  fs.existsSync(this.VERSION_FILE)
    ? fs.readFileSync(this.VERSION_FILE).toString() || "local"
    : "not set";
