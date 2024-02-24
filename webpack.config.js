const path = require('path')
const Dotenv = require('dotenv-webpack')

module.exports = {
    entry: "./src/index.js",
    target: "web",
    output: {
        path: path.resolve(__dirname, "dist/assets"),
        filename: "bundle.js",
        libraryTarget: "umd"
    },
    watch: true,
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: "babel-loader"
            }
        ]
    },
    mode: "production",
    devServer: {
        static: {
            directory: path.resolve(__dirname, "dist"),
            watch: true
        },
        port: 9000,
        hot: true,
        open: true
    },
    plugins: [
        new Dotenv()
    ]
}