/**
 * Created by evio on 16/7/20.
 */
'use strict';
const pkg = require('../package.json');
const globalName = pkg.project.name;
const libraryName = pkg.project.library;
const path = require('path');
const AutoPrefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const result = {};
result.plugins = [];

result.plugins.push(new ExtractTextPlugin(globalName + '.css'));
/**
 * 配置启动文件地址
 * @type {*|Promise.<*>}
 */
result.entry = ['babel-polyfill', path.resolve(__dirname, '../src/index')];

/**
 * 配置输出文件地址和输出文件模式
 * @type {{path: (*|Promise.<*>), filename: string, libraryTarget: string}}
 */
result.output = {
    path: './build',
    filename: globalName + '.umd.js',
    library: libraryName,
    libraryTarget: 'umd'
};

result.module = {};

/**
 * 配置loaders
 * @type {*[]}
 */
result.module.loaders = [
    { test: /\.js$/, loader: "babel" },
    { test: /\.css$/, loader: ExtractTextPlugin.extract("style", "css!postcss") },
    { test: /\.scss$/, loader: ExtractTextPlugin.extract("style", "css!postcss!sass")  }
];

/**
 * autoprefix
 * @returns {*[]}
 */
result.postcss = () => {
    return [ AutoPrefixer({browsers: ['last 20 versions']}) ];
};

module.exports = result;