const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const share = require('./share');
const commomConfig = require('../');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');

const NODE_ENV = 'development';

const port = commomConfig.port || 9000;

const config = {
    devtool: 'source-map',
    output: {
        path: path.resolve('../src/main/resources/static/build'),
        publicPath: `http://localhost:${port}/build/`,
        filename: 'js/[name].js',
        pathinfo: true
    },
    devServer: {
        contentBase: path.resolve('../src/main/resources/static'),
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        port
    }
};

const plugins = [
    new HtmlWebpackPlugin({
        template: 'templates/index.pug',
        filename: 'main.jsp',
        alwaysWriteToDisk: true,
        NODE_ENV
    }),
    new HtmlWebpackHarddiskPlugin({
        outputPath: path.resolve('../src/main/webapp/WEB-INF/jsp')
    }),
    new webpack.DefinePlugin({
        'process.env': {
            BROWSER: JSON.stringify(true),
            NODE_ENV: JSON.stringify(NODE_ENV)
        }
    })
];

share.plugins.push(...plugins);

module.exports = Object.assign({}, share, config);
