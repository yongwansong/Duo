/**
 * * Webpack configuration.
 */

const path = require("path");
const miniCssExtractPlugin = require("mini-css-extract-plugin");

const BUILD_DIR = path.resolve(__dirname, "../../assets");
const SASS_DIR = path.resolve(__dirname, "../../src/scss");
const JS_DIR = path.resolve(__dirname, "../../src/js");
const TS_DIR = path.resolve(__dirname, "../../src/ts");

const entry = {
  "endrock.styles-product": SASS_DIR + "/products.scss",
  "endrock.style-ingredients": SASS_DIR + "/ingredientspage.scss",
  "endrock.scripts-product": JS_DIR + "/products.js"
};

const output = {
  path: BUILD_DIR,
  filename: "[name].js",
};

const rules = [
  {
    test: /\.js$/,
    include: [JS_DIR],
    exclude: /node_modules/,
    use: {
      loader: "babel-loader",
      options: {
        presets: ["@babel/preset-env"],
      },
    },
  },
  {
    test: /\.ts?$/,
    include: [TS_DIR],
    use: [
      {
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-typescript", "@babel/preset-env"],
        },
      },
      { loader: "ts-loader" },
    ],
    exclude: /node_modules|\.d\.ts$/,
  },
  {
    include: [SASS_DIR],
    test: /\.css$/i,
    use: ["style-loader", "css-loader"],
  },
  {
    include: [SASS_DIR],
    test: /\.scss$/,
    exclude: /node_modules/,
    use: [miniCssExtractPlugin.loader, "css-loader", "sass-loader"],
  },
];

module.exports = {
  entry: entry,

  output: output,

  devtool: "source-map",

  module: {
    rules: rules,
  },

  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },

  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
};