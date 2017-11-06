const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const share = require('./share');
const commomConfig = require('../');

const config = {
    devtool: 'source-map',
    output: {
        path: path.resolve('../src/main/resources/public/build'),
        publicPath: '/build/',
        filename: 'js/[name].js',
        pathinfo: true
    },
    devServer: {
        contentBase: path.resolve('../src/main/resources/public'),
        port: commomConfig.port || 9000,
        historyApiFallback: {
            index: '/build/index.html'
        },
        proxy: {
            '/api': {
                target: commomConfig.proxy,
                onError: (error, req, res) => {
                    if (error.code === 'ECONNREFUSED') {
                        res.json({
                            error
                        });
                    } else {
                        res.end();
                    }
                }
            }
        }
    }
};

const plugins = [
    new HtmlWebpackPlugin({
        template: 'templates/index.pug',
        filename: 'index.html'
    }),
    new webpack.DefinePlugin({
        'process.env': {
            BROWSER: JSON.stringify(true),
            NODE_ENV: JSON.stringify('development')
        }
    })
];

share.plugins.push(...plugins);

module.exports = Object.assign({}, share, config);
