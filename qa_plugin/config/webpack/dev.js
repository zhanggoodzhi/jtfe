const config = require('./share');
const path = require('path');
const webpack = require('webpack');

config.plugins.push(
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('development')
    })
);

Object.assign(config, {
    devServer: {
        contentBase: path.resolve('dist'),
        port: 9000
    },
    devtool: 'cheap-eval-source-map'
});


module.exports = config;
