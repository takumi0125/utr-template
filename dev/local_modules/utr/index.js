#!/usr/bin/env node
'use strict';

const chalk = require('chalk');
const browserSync = require('browser-sync').create();

module.exports = (()=> {
  let env, tasks;

  const log = (taskNames, eventName = '', msg)=> {
    const header = (Array.isArray(taskNames)? taskNames.map(taskName => `[${taskName}]`).join(' > '): taskNames) + ':';
    let methodName = eventName == 'error'? 'error': 'log';
    let eventChalk = chalk.bold.green;
    let msgChalk = chalk.gray;
    
    if(eventName) {
      if(eventName == 'error') {
        eventChalk = chalk.bold.red;
        msgChalk = chalk.red;
      }
      eventName = `<${eventName}>`;
    }

    console[methodName](chalk.bold.blue(header), eventChalk(eventName), msgChalk(msg));
  }
  
  const error = (taskNames, msg)=> {
    log(taskNames, 'error', msg);
  }

  const execTask = async (taskName, options = {})=> {
    log(taskName, 'task start', '');
    const startTime = Date.now();
    await tasks[taskName](options);
    log(taskName, 'task finish', `${Date.now() - startTime}ms`);
  };

  return {
    execTask,
    log,
    error,

    execTaskSerial: async (taskNames)=> {
      for(let i = 0, l = taskNames.length; i < l; i++) {
        await execTask(taskNames[i]);
      }
    },
  
    execTaskParallel: async (taskNames)=> {
      const promises = [];
      for(let i = 0, l = taskNames.length; i < l; i++) {
        promises.push(execTask(taskNames[i]));
      }
      return Promise.all(promises);
    },
  
    setEnv: value => env = value,
  
    getEnv: ()=> env,
  
    setTasks: value => tasks = value,
  
    getTasks: ()=> tasks,

    initServer: (initOptions, callback = ()=> {})=> {
      browserSync.init(initOptions, ()=> {
        callback();
        log('server', 'start', 'start server powered by browser-sync');
      });
      return browserSync;
    },

    reloadServer: (filePaths = null)=> {
      browserSync.active && browserSync.reload(filePaths);
    }
  }
})();