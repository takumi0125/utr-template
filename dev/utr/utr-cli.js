#!/usr/bin/env node
'use strict';

const path = require('path');
const program = require('commander');
const chalk = require('chalk');

const utr = require('./utr');

const defaultTask = require('./task');

program
.name("utr")
.version('1.0.0')
.option('-e, --env [env]', 'production or development')
.option('-t, --taskfile [taskfile]', 'task file path')

// execTask task command
program
.arguments('<taskName>')
.action(async (taskName)=> {
  const tasks = program.taskfile? require(path.resolve(program.taskfile)): defaultTask;
  utr.setEnv(program.env || 'development');
  utr.setTasks(tasks);

  if(!tasks[taskName]) {
    utr.error([ 'task error' ], `task:${taskName} doesn't exist.`);
    return;
  }

  await utr.execTask(taskName);
});

console.log(chalk.bold.greenBright('====================================='));
console.log(chalk.bold.greenBright('static website builder by unshift'));
console.log(chalk.bold.greenBright('====================================='));

program.parse(process.argv);