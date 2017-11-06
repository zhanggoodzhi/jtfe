const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const {
    CheckerPlugin
} = require('awesome-typescript-loader');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const share = require('./share');
const commomConfig = require('../');
const {
    client,
    server
} = commomConfig;

const config = Object.assign({}, share);
Object.assign(config.output, {
    publicPath: '${pageContext.request.contextPath}/public/build/',
    filename: 'js/[name].[chunkhash].js'
});

const plugins = [
    // new ExtractTextPlugin('css/[name].[contenthash].css'),
    new webpack.DefinePlugin({
        'process.env': {
            BROWSER: JSON.stringify(true),
            NODE_ENV: JSON.stringify('production')
        }
    }),
    // new UglifyJSPlugin({
    //     compress: {
    //         warnings: false
    //     },
    //     comments: false,
    //     sourceMap: false
    // })
];

config.plugins.push(...plugins);

module.exports = Object.assign(config);
