/**
 * Created by evio on 16/8/1.
 */
'use strict';

var fs = require('fs-extra');
var path = require('path');

exports.devDependencies = ["autoprefixer", "babel-core", "babel-loader", "babel-plugin-add-module-exports", "babel-preset-es2015", "cross-env", "css-loader", "extract-text-webpack-plugin", "html-loader", "html-minify-loader", "html-webpack-plugin", "less", "less-loader", "node-sass", "normalize.css", "postcss-loader", "rimraf", "sass-loader", "style-loader", "url-loader", "file-loader", "webpack", "webpack-dev-server"];
exports.dependencies = ["miox", "miox-components"];

exports.scss = function(where, fn){
    var source = path.resolve(where, 'node_modules', 'miox', 'src', 'css');
    var target = path.resolve(where, 'src', 'css', 'scss');
    fs.copy(source, target, function(err){
        if (err) { throw err; }
        fn();
    });
};