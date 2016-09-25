#!/usr/bin/env node

var app = require('cmdu');

app.version = require('../package.json').version;

app.action(function () {
    this.showHelp();
});

app
    .command('create')
    .alias('c')
    .describe('Create a new project with miox.')
    .use('../lib/create');

app.listen();