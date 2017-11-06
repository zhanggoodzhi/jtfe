const path = require('path');
const {
    CheckerPlugin
} = require('awesome-typescript-loader');

module.exports = {
    entry: {
        'qa-plugin': './src/index.ts'
    },
    output: {
        path: path.resolve('dist'),
        filename: '[name].min.js',
        pathinfo: true,
        library: 'QAPlugin',
        libraryExport: 'default',
        libraryTarget: 'window'
    },
    resolve: {
        modules: [
            'node_modules'
        ],
        extensions: ['.js', '.ts']
    },
    module: {
        rules: [{
                test: /\.ts$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'awesome-typescript-loader',
                    options: {
                        useCache: true,
                        useBabel: true
                    }
                }]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    },
    plugins: [
        new CheckerPlugin()
    ]
};
