const path = require('path');
const webpack = require('webpack');
const ManifestPlugin = require('webpack-manifest-plugin');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const commomConfig = require('../');

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
        importuse: 2,
        sourceMap: true
    }
};

module.exports = {
    entry: {
        app: [
            './src/vendor/index.ts',
            './src/index.jsx'
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        modules: [
            path.resolve('src/app'),
            path.resolve('src/app/components'),
            // path.resolve('src/app/redux'),
            'node_modules'
        ],
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
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true
                }
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            },
            {
                test: /\.less$/,
                include: path.resolve('./src/app'),
                use: [
                    'style-loader',
                    cssLoader,
                    postcssLoader,
                    {
                        loader: 'less-loader',
                        options: {
                            strictMath: true,
                            sourceMap: true,
                            paths: [
                                path.resolve('src/app'),
                                path.resolve('node_modules')
                            ]
                        }
                    }
                ]
            },
            {
                test: /\.less$/,
                exclude: path.resolve('./src/app'),
                use: [
                    'style-loader',
                    cssLoader,
                    postcssLoader,
                    {
                        loader: 'less-loader',
                        options: {
                            sourceMap: true,
                            modifyVars: commomConfig.modifyVars
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                exclude: path.resolve('./src/app'),
                use: [
                    'style-loader',
                    cssLoader
                ]
            },
            {
                test: /\.pug$/,
                loader: 'pug-loader'
            }, {
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
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
        new ManifestPlugin({
            fileName: 'manifest.json'
        })
    ]
};
