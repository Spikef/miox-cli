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
            message: 'Tool name',
            validate: function (val) {
                return !val ? 'Project name cannot be empty' : fs.existsSync('./' + val) ? 'Project already exist' : true;
            }
        },
        {
            type: 'confirm',
            name: 'camel',
            message: 'Camel case name',
            default: false,
            when: function (answers) {
                return /\-[a-z]/i.test(answers.name);
            }
        }
    ];

    inquirer
        .prompt(questions)
        .then(function (answers) {
            create.makeProject(answers)
        })
};

create.makeProject = function(options) {
    var target = path.resolve(process.cwd(), options.name);

    create
        .copyProject(target)
        .then(function() {
            var name = options.name;
            if (options.camel) name = camelCase(name);
            return create.makePackage(target, name);
        })
        .catch(function(err) {
            util.exit(err);
        })
        .then(function(dependencies) {
            console.log('');
            console.log(chalk.cyan('> npm install\n'));
            console.log('------------------------------------------------------------');
            console.log('');

            return create.install(target, options.name, dependencies);
        });
};

create.copyProject = function(target) {
    return new Promise(function(resolve, reject){
        var source = path.resolve(__dirname, '../template/tool');
        fs.copy(source, target, function(err){
            if (err) {
                reject(err)
            } else {
                resolve();
            }
        });
    });
};

create.makePackage = function(target, name) {
    var packet = require('../template/tool/package.json');
    packet.name = name;
    packet.description = name + ' project';
    packet['project-library'] = name;

    var dependencies = packet.devDependencies;

    return new Promise(function(resolve, reject){
        fs.writeFile(
            path.resolve(target, 'package.json'),
            JSON.stringify(packet, null, 2),
            function(err) {
                if (err) {
                    reject(err)
                } else {
                    resolve(dependencies);
                }
            }
        )
    });
};

create.install = function(target, name, dependencies) {
    var result, list = [];

    Object.keys(dependencies).forEach(function (dependency) {
        result = spawn('npm', ['install', dependency, '--save-dev'], { cwd: target, stdio: 'inherit'});
        if (result.status != 0) {
            list.push(dependency);
        }
    });

    if (list.length > 0) {
        console.log('');
        console.log(chalk.yellow('Failed to install some modules, try [npm install --save-dev] manually.'));
    }

    console.log('');
    console.log('Successfully create project %s', name);
};

function camelCase(input) {
    return input.replace(/\-([a-z])/ig, function($0, $1){
        return $1.toUpperCase();
    })
}