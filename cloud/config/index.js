const path = require('path'),
	webpack = require('webpack');

const getEntries = require('get-entries');

// tslint:disable-next-line:variable-name
const ExtractTextPlugin = require('extract-text-webpack-plugin'),
	// tslint:disable-next-line:variable-name
	AssetsPlugin = require('assets-webpack-plugin');

const entries = getEntries('./pages/**/index.ts', {
	dir: true,
	publicModule: ['common']
});


const cssnano = require('cssnano'),
	autoprefixer = require('autoprefixer');

module.exports = function (env) {
	const config = {
			development: {
				filename: '[id]',
				publicPath: '//localhost:9243/',
				urlName: 'files/[name].[ext]'
			},
			production: {
				filename: '[id].[chunkhash]',
				publicPath: 'dist/',
				urlName: 'files/[hash:20].[ext]'
			}
		},
		c = config[env || 'development'];

	return {
		copyright: `Copyright ${new Date().getFullYear()} by Jintongsoft\n@author Ding <ding.yuchao@jintongsoft.cn>`,
		webpack: {
			entry: entries,
			output: {
				path: path.resolve(__dirname, '../public/dist'),
				filename: `${c.filename}.js`,
				publicPath: c.publicPath
			},
			module: {
				rules: [{
						test: /\.ts$/,
						loader: 'ts-loader'
					},
					{
						test: /\.pug$/,
						loader: 'pug-loader'
					},
					{
						test: /\.(woff|ttf|eot|svg|woff2|je?pg|png|gif)$/,
						use: [{
							loader: 'url-loader',
							options: {
								limit: '8192',
								name: c.urlName,
								publicPath: './'
							}
						}]
					},

					// {
					// 	test: /\.(je?pg|png|gif)$/,
					// 	use: [{
					// 		loader: 'file-loader',
					// 		options: {
					// 			name: 'files/[name].[ext]'
					// 		}
					// 	}]
					// },
					{
						test: /\.css/,
						use: ExtractTextPlugin.extract({
							fallback: 'style-loader',
							use: [{
								loader: 'css-loader',
								options: {
									sourceMap: true
								}
							}]
						})
					},
					{
						test: /\.less$/,
						use: ExtractTextPlugin.extract({
							fallback: 'style-loader',
							use: [{
									loader: 'css-loader',
									options: {
										sourceMap: true
									}
								},
								{
									loader: 'postcss-loader',
									options: {
										sourceMap: true,
										plugins: () => [
											autoprefixer({
												browsers: ['ie > 8', 'Chrome > 5', 'Firefox > 5']
											}),
											cssnano({
												safe: true,
												sourcemap: true
											})
										]
									}
								},
								{
									loader: 'less-loader',
									options: {
										strictMath: true,
										sourceMap: true
									}
								}
							]
						})
					}
				]
			},
			resolve: {
				modules: [
					path.resolve(__dirname, '../components'),
					'node_modules',
					path.resolve(__dirname, '../public/module')
				],
				extensions: ['.js', '.ts']
			},
			target: 'web',
			plugins: [
				new webpack.optimize.CommonsChunkPlugin({
					name: 'common',
					minChunks: 5
				}),
				new ExtractTextPlugin({
					filename: `${c.filename}.css`,
					allChunks: true
				}),
				new AssetsPlugin({
					path: 'config',
					filename: 'assets.json'
				})
			]
		}
	};
};
