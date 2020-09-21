const fs = require("fs");

const { VERSION_FILE } = require("../utils");

const { GITHUB_SHA } = process.env;

fs.writeFileSync(VERSION_FILE, GITHUB_SHA ? GITHUB_SHA.slice(0, 8) : "");
