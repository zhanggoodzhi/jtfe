const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const {
    CheckerPlugin
} = require('awesome-typescript-loader');
const share = require('./share');
const commomConfig = require('../');
const initialState = require('../initial-state');

const config = {
    output: {
        path: path.resolve('../main/resources/static/build'),
        publicPath: '/build/',
        filename: 'js/[name].js',
        pathinfo: true
    }
};

const plugins = [

    new HtmlWebpackPlugin(
        Object.assign(
            initialState, {
                template: 'templates/index.pug',
                filename: '../../templates/index.html',
                alwaysWriteToDisk: true
            })),

    new webpack.DefinePlugin({
        'process.env': {
            BROWSER: JSON.stringify(true),
            NODE_ENV: JSON.stringify('production')
        }
    }),

    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        },
        comments: false,
        sourceMap: false
    })
];

share.plugins.push(...plugins);

module.exports = Object.assign({}, share, config);
