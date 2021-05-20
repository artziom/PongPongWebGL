const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: "./src/scripts/app.ts",
    output: {
        filename: "app.js",
        path: path.resolve(__dirname, 'dist'),
        clean: true
    },
    mode: "development",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "Webpack App"
        })
    ],
    devtool: "inline-source-map"
};