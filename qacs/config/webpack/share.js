const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const commomConfig = require('../');

const {
    client,
    server
} = commomConfig;

const postcssLoader = {
    loader: 'postcss-loader',
    options: {
        sourceMap: true,
        plugins: [
            cssnano({
                safe: true
            }),
            autoprefixer({
                browsers: ['> 1%', 'ie >= 9', 'not ie <= 8']
            })
        ]
    }
};

const cssLoader = {
    loader: 'css-loader',
    options: {
        modules: true,
        importuse: 2,
        localIdentName: '[path]__[local]',
        sourceMap: true
    }
};

const styleLoader = {
    loader: 'style-loader'
};

module.exports = {
    entry: {
        [client]: [
            './src/vendor/index.ts',
            './src/client.tsx'
        ],
        [server]: [
            './src/vendor/index.ts',
            './src/server.tsx'
        ]
    },
    output: {
        path: path.resolve('build'),
        filename: 'js/[name].js',
        pathinfo: true
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        modules: [
            path.resolve('src/app'),
            path.resolve('src/app/redux'),
            'node_modules'
        ]
    },
    module: {
        rules: [{
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'awesome-typescript-loader',
                    options: {
                        useCache: true,
                        useBabel: true
                    }
                }]
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            },
            {
                test: /\.less$/,
                include: path.resolve('./src/app'),
                // use: ExtractTextPlugin.extract({
                use: [
                    styleLoader,
                    cssLoader,
                    postcssLoader,
                    {
                        loader: 'less-loader',
                        options: {
                            strictMath: true,
                            sourceMap: true
                        }
                    }
                ]
                // })
            },
            {
                test: /\.less$/,
                exclude: path.resolve('./src/app'),
                // use: ExtractTextPlugin.extract({
                use: [
                    styleLoader,
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    postcssLoader,
                    {
                        loader: 'less-loader',
                        options: {
                            sourceMap: true,
                            modifyVars: commomConfig.modifyVars
                        }
                    }
                ]
                // })
            },
            {
                test: /\.css$/,
                exclude: path.resolve('./src/app'),
                // use: ExtractTextPlugin.extract({
                use: [
                    styleLoader,
                    {
                        loader: 'css-loader',
                        options: {
                            minimize: true,
                            sourceMap: true
                        }
                    }
                ]
                // })
            },
            {
                test: /\.pug$/,
                loader: 'pug-loader'
            },
            {
                test: /\.eot(\?.*)?$/,
                loader: 'file-loader?name=fonts/[hash].[ext]'
            },
            {
                test: /\.(woff|woff2)(\?.*)?$/,
                loader: 'file-loader?name=fonts/[hash].[ext]'
            },
            {
                test: /\.ttf(\?.*)?$/,
                loader: 'url-loader?limit=10000&mimetype=application/octet-stream&name=fonts/[hash].[ext]'
            },
            {
                test: /\.svg(\?.*)?$/,
                loader: 'url-loader?limit=10000&mimetype=image/svg+xml&name=fonts/[hash].[ext]'
            },
            {
                test: /\.(jpe?g|png|gif)$/i,
                loader: 'url-loader?limit=1000&name=images/[hash].[ext]'
            },
            {
                test: /\.mp3$/,
                loader: 'url-loader?&name=voice/[hash].[ext]'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            name: client,
            template: 'templates/client.pug',
            inject: false,
            filename: path.join('../../cs' + client, commomConfig.views, 'v2-' + client + '.jsp'),
            alwaysWriteToDisk: true,
            title: '${robotName}'
        }),
        new HtmlWebpackPlugin({
            name: server,
            template: 'templates/server.pug',
            inject: false,
            filename: path.join('../../cs' + server, commomConfig.views, 'v2-' + server + '.jsp'),
            alwaysWriteToDisk: true,
            title: '金童人工客服'
        }),
        new webpack.ProvidePlugin({
            fch: ['helper/fetch', 'default']
        }),
        new ManifestPlugin({
            fileName: 'manifest.json'
        })
    ]
};
