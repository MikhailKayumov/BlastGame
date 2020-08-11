const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        'js/game': path.resolve(__dirname, 'src/index.ts')
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.([jt]s)$/,
                include: path.resolve(__dirname, 'src'),
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                        cacheCompression: false,
                        presets: [
                            ['@babel/preset-env', {
                                debug: true,
                                useBuiltIns: "usage",
                                corejs: 3,
                                forceAllTransforms: true,
                                shippedProposals: true
                            }],
                            ['@babel/preset-typescript', {
                                allowNamespaces: true,
                                onlyRemoveTypeImports: true,
                                allowDeclareFields: true
                            }]
                        ],
                        plugins: []
                    }
                }
            }
        ],
    },
    resolve: {
        extensions: ['.js', '.ts'],
    },
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
        watchContentBase: true,
        inline: true,
        hot: true
    },
    devtool: 'source-map',
    plugins: [new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'src/index.html',
        title: 'Blast Game',
        minify: false,
        inject: 'head'
    })]
};
