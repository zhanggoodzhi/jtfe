const path = require('path');
const config = require('./index.js')('development');

const webpackConfig = config.webpack;

module.exports = Object.assign({}, webpackConfig, {
	devtool: 'source-map',
	devServer: {
		contentBase: './public/dist',
		port: 9243,
		headers: {
			'Access-Control-Allow-Origin': '*'
		}
	}
});
