const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const share = require('./share');
const commomConfig = require('../');

const config = {
    output: {
        path: path.resolve('../src/main/resources/public/build'),
        publicPath: '/build/',
        filename: 'js/[name].js',
        pathinfo: true
    }
};

const plugins = [
    new HtmlWebpackPlugin({
        template: 'templates/index.pug',
        filename: '../../templates/index.html'
    }),
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

share.plugins.push(...plugins
)
;

module.exports = Object.assign({}, share, config);
