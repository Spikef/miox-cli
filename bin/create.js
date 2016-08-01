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
                "Miox@next"
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
            return create.install(target, type, options.name);
        })
        .then(function () {
            console.log('');
            console.log(chalk.green('Successfully create project %s', options.name));
            console.log('Commands:');
            console.log('------------------');
            console.log('% cd '+ options.name);
            console.log('------------------');
            console.log('      npm run dev: 开启调试服务');
            console.log('      npm run git: 自动提交代码');
            console.log('    npm run build: 启动项目编译');
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
    packet.description = name + ' project';
    packet.project = {
        framework: 'miox',
        framework_version: '0.0.1',
        online: ''
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

create.install = function(target, type, name) {
    return new Promise(function(resolve, reject){
        var result, list = [];
        var deps = require('../template/' + type + '/deps');

        if ( !deps.scss ){
            deps.scss = function(target, fn){
                fn();
            }
        }

        if ( !deps.packages ){
            deps.packages = function(a, fn){
                fn();
            }
        }

        deps.devDependencies.forEach(function (dependency) {
            console.log('');
            console.log(chalk.red('% npm install --save-dev ' + dependency));
            result = spawn('npm', ['install', dependency, '--save-dev'], { cwd: target, stdio: 'inherit'});
            if (result.status != 0) {
                list.push(dependency);
            }
        });
        deps.dependencies.forEach(function (dependency) {
            console.log('');
            console.log(chalk.red('% npm install --save ' + dependency));
            result = spawn('npm', ['install', dependency, '--save'], { cwd: target, stdio: 'inherit'});
            if (result.status != 0) {
                list.push(dependency);
            }
        });

        console.log('');
        console.log(chalk.blue('% Try load package.json, then catch miox version writting.'));
        setTimeout(function(){
            var packages = fs.readFileSync(target + '/package.json', 'utf8');
            var packet = JSON.parse(packages);
            packet.project.framework_version = packet.dependencies.miox.replace(/^[\~\^\=\-\@\>\<]/, '');
            deps.scss(target, function(){
                deps.packages(packet, function(){
                    fs.writeFileSync(target + '/package.json', JSON.stringify(packet, null, 2), 'utf8');
                    fs.unlinkSync(target + '/deps.js');
                    resolve();
                });
            });
        }, 3000);
    });
};