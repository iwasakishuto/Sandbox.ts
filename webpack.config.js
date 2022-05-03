const path = require("path");
const GasPlugin = require("gas-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: false,
  context: __dirname,
  entry: {
    "LabCafe-shift": "./src/gas/LabCafe-shift.ts",
  },
  output: {
    path: path.join(__dirname, "gas"),
    filename: "[name]/[name].gas.js",
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    modules: [path.resolve(__dirname, "src"), "node_modules"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
      },
    ],
  },
  plugins: [new GasPlugin()],
};
