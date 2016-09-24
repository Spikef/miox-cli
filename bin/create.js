"use strict";

var fs = require('fs-extra');
var path = require('path');
var inquirer = require('inquirer');
var chalk = require('chalk');
var spawn = require('child_process').spawnSync;
var util = require('../lib/util');

var create = module.exports = function() {
    var questions = [
        {
            type: 'input',
            name: 'name',
            message: 'Project name',
            validate: function (val) {
                return !val
                    ? 'Project name cannot be empty'
                    : (fs.existsSync('./' + val) ? 'Project already exist' : true);
            }
        },
        {
            type: 'list',
            name: 'type',
            message: 'Which kind of project do you choose?',
            choices: [
                "Miox@stable",
                "Miox@plugin"
            ]
        }
    ];

    inquirer
        .prompt(questions)
        .then(function (answers) {
            create.makeProject(answers);
        })
};

create.makeProject = function(options) {
    var target = path.resolve(process.cwd(), options.name);
    var type = options.type;

    create
        .copyProject(target, type)
        .then(function() {
            return create.makePackage(target, options.name, type);
        })
        .catch(function(err) {
            util.exit(err);
        })
        .then(function() {
            return create.install(target);
        })
        .then(function () {
            console.log('');
            console.log(chalk.green('Successfully create project %s', options.name));
            console.log('Commands:');
            console.log('------------------');
            console.log('% cd '+ options.name);
            console.log('------------------');
            console.log('      nbm run dev: 开启调试服务');
            console.log('      nbm run git: 自动提交代码');
            console.log('    nbm run build: 启动项目编译');
        });
};

create.copyProject = function(target, type) {
    return new Promise(function(resolve, reject){
        var source = path.resolve(__dirname, '../template', type);
        if ( !fs.existsSync(source) ){
            return reject(new Error('can not find source dir'));
        }
        fs.copy(source, target, function(err){
            if (err) {
                reject(err)
            } else {
                resolve();
            }
        });
    });
};

create.makePackage = function(target, name, type) {
    var packet = require('../template/' + type + '/package.json');
    packet.name = name;
    packet.description = name;
    packet.project = {
        "name": name.replace(/\-/g, '.'),
        "library": change(name)
    };

    return new Promise(function(resolve, reject){
        fs.writeFile(
            path.resolve(target, 'package.json'),
            JSON.stringify(packet, null, 2),
            function(err) {
                if (err) {
                    reject(err)
                } else {
                    resolve();
                }
            }
        )
    });
};

create.install = function(target) {
    return new Promise(function(resolve){
        spawn('nbm', ['install'], { cwd: target, stdio: 'inherit'});
        resolve();
    });
};

function change(s1){
    return s1.replace(/\-(\w)/g, function(all, letter){
        return letter.toUpperCase();
    });
}