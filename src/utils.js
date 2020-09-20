module.exports.btoa = (binary) =>
  Buffer.from(binary, "binary").toString("base64");

module.exports.atob = (ascii) =>
  Buffer.from(ascii, "base64").toString("binary");
