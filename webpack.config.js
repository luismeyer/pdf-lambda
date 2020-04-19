const path = require("path");
const slsw = require("serverless-webpack");
const nodeExternals = require("webpack-node-externals");

const { IS_OFFLINE } = process.env;

module.exports = {
  entry: slsw.lib.entries,
  target: "node",
  externals: [nodeExternals()],
  mode: IS_OFFLINE ? "development" : "production",
  output: {
    libraryTarget: "commonjs",
    path: path.join(__dirname, ".webpack"),
    filename: "index.js",
  },
};
