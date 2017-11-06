const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const share = require('./share');
const commomConfig = require('../');
const NODE_ENV = 'production';

const config = {
    output: {
        path: path.resolve('../src/main/resources/static/build'),
        publicPath: '/resources/build/',
        filename: 'js/[chunkhash].js',
        chunkFilename: 'js/[chunkhash].js',
        pathinfo: true
    }
};

const plugins = [
    new HtmlWebpackPlugin({
        template: 'templates/index.pug',
        filename: '../../../webapp/WEB-INF/jsp/main.jsp',
        NODE_ENV
    }),
    new webpack.DefinePlugin({
        'process.env': {
            BROWSER: JSON.stringify(true),
            NODE_ENV: JSON.stringify(NODE_ENV)
        }
    }),
    new webpack.optimize.UglifyJsPlugin({
        uglifyOptions: {
            warnings: false
        },
        extractComments: false,
        sourceMap: false
    })
];

share.plugins.push(...plugins);

module.exports = Object.assign({}, share, config);
