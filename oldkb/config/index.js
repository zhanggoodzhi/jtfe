// tslint:disable:variable-name
const fs = require('fs'),
	path = require('path');

const webpack = require('webpack'),
	getEntries = require('get-entries');

const env = process.env.NODE_ENV || 'development';

const
	CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin,
	AssetsPlugin = require('assets-webpack-plugin'),
	ExtractTextPlugin = require('extract-text-webpack-plugin'),
	autoprefixer = require('autoprefixer'),
	cssnano = require('cssnano');

const srcPath = './libs',
	distPath = './main/resources/public/dist',
	entryPath = srcPath + '/pages',
	templatePath = './main/resources/templates',
	devHost = '127.0.0.1',
	devserverPort = 8189,
	outputPath = distPath;

const entries = getEntries(entryPath + '/**/index.ts', {
	dir: true,
	publicModule: ['global/index']
});

const webpackConfig = {
	entry: entries,
	context: path.resolve(__dirname, '../'),
	target: 'web',
	output: {
		path: path.resolve(__dirname, '../', distPath),
		filename: '[name]/[id].js',
		publicPath: '/dist/',
		library: 'kb[id]'
	},
	resolve: {
		extensions: ['.ts', '.js'],
		modules: [
			'libs/components',
			'main/resources/public/modules',
			'node_modules'
		]
	},
	module: {
		rules: [{
			test: /\.ts$/,
			loader: 'awesome-typescript-loader',
			options: {
				useCache: true
			}
		}, {
			test: /\.css$/,
			use: ExtractTextPlugin.extract({
				fallback: 'style-loader',
				use: 'css-loader'
			})
		}, {
			test: /\.less$/,
			use: ExtractTextPlugin.extract({
				fallback: 'style-loader',
				use: [
					'css-loader',
					{
						loader: 'postcss-loader',
						options: {
							plugins: () => [
								autoprefixer({
									browsers: ['ie >= 10', 'Chrome >= 35', 'Firefox >= 31', 'Safari >= 7']
								}),
								cssnano({
									safe: true
								})
							]
						}
					},
					'less-loader'
				]
			})
		}, {
			test: /\.(woff|ttf|eot|svg|woff2|jpg|png|gif)$/,
			use: [{
				loader: 'url-loader',
				options: {
					limit: '8192',
					name: 'files/[hash:20].[ext]'
				}
			}]
		}, {
			test: /\.pug$/,
			loader: 'pug-loader'
		}]
	},
	plugins: [
		new CheckerPlugin(),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'common',
			minChunks: 5
		}),
		new AssetsPlugin({
			path: 'config',
			filename: 'assets.json'
		}),
		new webpack.BannerPlugin(`Copyright ${new Date().getFullYear().toString()} by Jintongsoft\n@author Ding <ding.yuchao@jintongsoft.cn>`)
	]
};

module.exports = {
	srcPath,
	entryPath,
	outputPath,
	templatePath,
	webpackConfig,
	devserverPort,
	devHost
};
