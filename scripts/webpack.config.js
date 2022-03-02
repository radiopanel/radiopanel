const path = require("path");
const webpack = require('webpack');

module.exports = {
	entry: "./src/index.ts",
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: "ts-loader",
				exclude: /node_modules/,
			},
		],
	},
	target: 'node',
	resolve: {
		extensions: [".tsx", ".ts", ".js"],
	},
	output: {
		filename: "radiopanel.js",
		path: path.resolve(__dirname, "dist"),
	},
	plugins: [
		new webpack.BannerPlugin({
			banner: "#!/usr/bin/env node",
			raw: true,
		}),
	],
};
