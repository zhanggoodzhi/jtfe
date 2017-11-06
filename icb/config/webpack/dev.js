const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const {
    CheckerPlugin
} = require('awesome-typescript-loader');
const share = require('./share');
const commomConfig = require('../');
const initialState = require('../initial-state');

const config = {
    devtool: 'source-map',
    output: {
        path: path.resolve('../main/resources/static/build'),
        publicPath: '/static/build/',
        filename: 'js/[name].js',
        pathinfo: true
    },
    devServer: {
        contentBase: path.resolve('../main/resources/static'),
        port: 9000,
        setup: app => {
            app.use('/static', (req, res, next) => {
                req.url = req.url.replace('/static', '');
                next();
            });

            app.all('*', (req, res, next) => {
                const reqUrl = req.path;
                if (
                    reqUrl.match(/^\/static/) ||
                    reqUrl.match(/\.ico$/) ||
                    req.get('x-requested-with') === 'XMLHttpRequest'
                ) {
                    next();
                } else {
                    console.info('Send Index.html! url: "' + req.url + '"');
                    res.sendFile(path.resolve('../main/resources/templates/index.html'));
                }
            });
        },
        proxy: {
            '/v1': commomConfig.proxy,
            '/api': commomConfig.proxy,
            '/authentication': commomConfig.proxy,
            '/test': 'http://localhost:3000'
        }
    }
};

const plugins = [
    new HtmlWebpackPlugin(
        Object.assign(
            initialState, {
                template: 'templates/index.pug',
                filename: 'index.html',
                alwaysWriteToDisk: true
            })),
    new HtmlWebpackHarddiskPlugin({
        outputPath: path.resolve('../main/resources/templates')
    }),
    new webpack.DefinePlugin({
        'process.env': {
            BROWSER: JSON.stringify(true),
            NODE_ENV: JSON.stringify('development')
        }
    }),
    new OpenBrowserPlugin({
        url: 'http://localhost:9000'
    })
];

share.plugins.push(...plugins);

module.exports = Object.assign({}, share, config);
