const webpack = require('webpack');

const ExtractTextPlugin = require("extract-text-webpack-plugin");

const config = require('./index');

const webpackConfig = config.webpackConfig;


webpackConfig.output.filename = '[name]/[chunkhash].js';

webpackConfig.plugins.unshift(
	new ExtractTextPlugin('[name]/[chunkhash].css'),
	new webpack.optimize.UglifyJsPlugin({
		compress: {
			warnings: false
		},
		comments: false,
		sourceMap: false
	})
);

module.exports = webpackConfig;
