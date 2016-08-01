/**
 * Created by evio on 16/8/1.
 */
'use strict';

var fs = require('fs-extra');
var path = require('path');

exports.devDependencies = ["autoprefixer", "babel-core", "babel-loader", "babel-plugin-add-module-exports", "babel-polyfill", "babel-preset-es2015", "babel-preset-stage-0", "css-loader", "extract-text-webpack-plugin", "file-loader", "html-webpack-plugin", "image-webpack-loader", "json-loader", "node-sass", "postcss-loader", "rimraf", "sass-loader", "style-loader", "url-loader", "webpack", "webpack-dev-server"];
exports.dependencies = ["miox@next", "miox-animate", "miox-router", "miox-vue-components", "miox-vue-engine", "normalize.css"];
exports.scss = function(where, fn){
    var source = path.resolve(where, 'node_modules', 'miox', 'src', 'scss');
    var target = path.resolve(where, 'src', 'scss');
    fs.copy(source, target, function(err){
        if (err) { throw err; }
        fn();
    });
};