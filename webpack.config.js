const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: {
        'game': path.resolve(__dirname, 'src/js/index.ts')
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
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: { sourceMap: true }
                    }
                ],
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: (resourcePath) => {
                                return resourcePath.substring(resourcePath.indexOf('images')).replace(/\\/gm, '/');
                            }
                        }
                    }
                ]
            },
            {
                test: /\.(woff2|woff)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'font'
                        }
                    }
                ]
            }
        ],
    },
    resolve: {
        extensions: ['.js', '.ts', '.scss'],
    },
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
        watchContentBase: true,
        inline: true,
        hot: true
    },
    devtool: 'source-map',
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'src/index.html',
            title: 'Blast Game',
            minify: false,
            inject: 'head'
        }),
        new MiniCssExtractPlugin({ filename: '[name].css' }),
    ]
};
