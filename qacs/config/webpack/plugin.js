const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: {
        'jtchat-plugin': './src/plugin/jtchat-plugin.js' 
    },
    output: {
        path: path.resolve('dist'),
        filename: 'plugin/[name].js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    },
    plugins: [
        new UglifyJSPlugin({
            compress: {
                warnings: false
            },
            comments: false,
            sourceMap: false
        })
    ]
};