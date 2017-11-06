const path = require('path');
const config = require('./index');

const ExtractTextPlugin = require('extract-text-webpack-plugin');

const webpackConfig = config.webpackConfig;

webpackConfig.output.publicPath = `http://${config.devHost}:${config.devserverPort}/`;

webpackConfig.plugins.unshift(
	new ExtractTextPlugin('[name]/[id].css')
);

Object.assign(webpackConfig, {
	devServer: {
		contentBase: path.resolve(__dirname, '../main/resources/public'),
		port: config.devserverPort,
		headers: {
			'Access-Control-Allow-Origin': '*'
		}
	},
	devtool: 'source-map'
});

module.exports = webpackConfig;
