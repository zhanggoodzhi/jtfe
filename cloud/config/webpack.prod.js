const config = require('./index.js')('production');

const webpack = require('webpack');

const webpackConfig = config.webpack;

webpackConfig.plugins.push(
	new webpack.optimize.UglifyJsPlugin({
		compress: {
			warnings: false
		},
		comments: false,
		sourceMap: false
	}),
	new webpack.BannerPlugin(config.copyright)
);

module.exports = Object.assign({}, webpackConfig);
