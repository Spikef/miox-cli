#!/usr/bin/env node

'use strict';

var app = require('cmdu');

app.version = require('../package.json').version;

app.action(function () {
    this.showHelp();
});

app
    .command('create')
    .alias('c')
    .describe('Create a new project with miox.')
    .option('-d, --no-dependencies', 'Don\'t install dependencies automatically')
    .use('./create');

app
    .command('tool')
    .alias('t')
    .describe('Create component or tools.')
    .use('./tool');

app.listen();