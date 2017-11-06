const config = require('./share');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

config.plugins.push(
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new UglifyJSPlugin({
        sourceMap: false,
        output: {
            comments: false,
            beautify: false
        }
    })
);

module.exports = config;
