const path = require('path');

module.exports = {
    entry: "./src/scripts/app.ts",
    output: {
        filename: "app.js",
        path: path.resolve(__dirname, 'dist')
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
    devtool: "inline-source-map"
};