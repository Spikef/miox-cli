/**
 * Created by evio on 16/7/20.
 */
'use strict';

const path = require('path');
const AutoPrefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const result = {};
const pkg = require('./package.json');

/**
 * 配置启动文件地址
 * @type {*|Promise.<*>}
 */
result.entry = path.resolve(__dirname, './src/index');

/**
 * 配置输出文件地址和输出文件模式
 * @type {{path: (*|Promise.<*>), filename: string, libraryTarget: string}}
 */
result.output = {
    path: path.resolve(__dirname, './build'),
    filename: pkg.name + '.js',
    libraryTarget: 'var'
};

result.module = {};

/**
 * 配置loaders
 * @type {*[]}
 */
result.module.loaders = [
    { test: /\.js$/, exclude: /node_modules/, loader: "babel" },
    { test: /\.css$/, loader: "style!css!postcss" },
    { test: /\.scss$/, loader: "style!css!postcss!sass" },
    { test: /\.(png|gif)$/, loader: "url?limit=5000&name=img/[name]-[hash].[ext]!image-webpack" },
    { test: /\.json$/, loader: "json" }
];

/**
 * autoprefix
 * @returns {*[]}
 */
result.postcss = () => {
    return [ AutoPrefixer({browsers: ['last 20 versions']}) ];
};

/**
 * 配置插件
 * @type {*[]}
 */
result.plugins = [
    new HtmlWebpackPlugin({
        template: path.resolve(__dirname, './src/index.html'),
        filename: './index.html'
    })
];

result.imageWebpackLoader = {
    pngquant:{
        quality: "65-90",
        speed: 4
    }
};

module.exports = result;