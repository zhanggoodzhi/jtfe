const path = require('path');
const webpack = require('webpack');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const {
    CheckerPlugin
} = require('awesome-typescript-loader');
const share = require('./share');
const commomConfig = require('../');

const {
    client,
    server
} = commomConfig;

const config = Object.assign({
    devtool: 'source-map',
    devServer: {
        contentBase: path.resolve('../'),
        port: commomConfig.devport,
        disableHostCheck: true
    }
}, share);

config.output.publicPath = 'http://localhost:' + commomConfig.devport + '/build/';

config.resolve.alias = {
    '@jintong/qa-plugin': path.resolve('../../qa-plugin/src/index')
};

const plugins = [
    new ExtractTextPlugin('css/[name].css'),
    new HtmlWebpackHarddiskPlugin(),
    new webpack.DefinePlugin({
        'process.env': {
            BROWSER: JSON.stringify(true),
            NODE_ENV: JSON.stringify('development')
        }
    })
];

config.plugins.push(...plugins);

module.exports = Object.assign(config);
