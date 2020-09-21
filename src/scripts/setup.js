const fs = require("fs");

const { VERSION_FILE } = require("../utils");

const { GITHUB_SHA, SHA } = process.env;

const versionSha = SHA || GITHUB_SHA;
const version = versionSha ? versionSha.slice(0, 8) : "";
fs.writeFileSync(VERSION_FILE, version);

console.info("Set version to: ", version);
