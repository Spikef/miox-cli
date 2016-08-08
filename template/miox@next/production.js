/**
 * Created by evio on 16/7/20.
 */
'use strict';

const path = require('path');
const AutoPrefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const result = {};
result.plugins = [];

result.plugins.push(new ExtractTextPlugin('index.[contenthash:10].css'));
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
    path: path.resolve(__dirname, 'build'),
    filename: 'index.[hash:10].js',
    libraryTarget: 'var'
};

result.module = {};

/**
 * 配置loaders
 * @type {*[]}
 */
result.module.loaders = [
    { test: /\.js$/, exclude: /node_modules/, loader: "babel" },
    { test: /\.css$/, loader: ExtractTextPlugin.extract("style", "css!postcss") },
    { test: /\.scss$/, loader: ExtractTextPlugin.extract("style", "css!postcss!sass")  },
    { test: /\.(png|gif)$/, loader: "url?limit=1&name=img/[name]-[hash].[ext]!image-webpack" },
    { test: /\.json$/, loader: "json" }
];

/**
 * autoprefix
 * @returns {*[]}
 */
result.postcss = () => {
    return [ AutoPrefixer({browsers: ['last 20 versions']}) ];
};

result.plugins.push(new HtmlWebpackPlugin({
    template: path.resolve(__dirname, './src/index.html'),
    filename: './index.html'
}));

result.imageWebpackLoader = {
    pngquant:{
        quality: "65-90",
        speed: 4
    }
};

module.exports = result;
