#!/usr/bin/env node
'use strict';

const chalk = require('chalk');
const browserSync = require('browser-sync').create();

const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const url = require('url');
const proxy = require('proxy-middleware');

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

  const localServerInfo = (options)=> {
    const protcol = options.https? 'https://': 'http://';
    const host = options.host || 'localhost';
    const port = options.port || '3000';
    const uiPort = (options.ui && options.ui.port) || '3001';
    const dir = options.startPath? `/${options.startPath}`: '';

    const local = `${protcol}${host}:${port}${dir}`;
    const ui = `${protcol}${host}:${uiPort}`;

    log('server', 'start', 'start server powered by browser-sync');
    log('server', 'info', '-----------------------------------');
    log('server', 'info', `  Local: ${chalk.bold.cyan(local)}`);
    log('server', 'info', `     UI: ${chalk.bold.cyan(ui)}`);
    log('server', 'info', '-----------------------------------');
    log('server', 'info', `Serving files from: ${options.server}`);
  };

  return {
    execTask,
    log,
    error,
    localServerInfo,

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

    initServer: (options, webpackCompiler, hmr = false, apiMiddlewareProxySettings = null, callback = ()=> {})=> {
      options = Object.assign({
        open: 'external',
        host: "0.0.0.0",
        port: 50000,
        ui: { port: 50001 },
        browser: 'google chrome',
        logLevel: "silent"
      }, options);

      const middleware = [];

      if(apiMiddlewareProxySettings) {
        const proxyOptions = url.parse(apiMiddlewareProxySettings.url);
        proxyOptions.route = apiMiddlewareProxySettings.route;
        proxyOptions.cookieRewrite = apiMiddlewareProxySettings.cookieRewrite;

        const authJson = apiMiddlewareProxySettings.authJson;
        if(authJson) proxyOptions.auth = `${authJson.username}:${authJson.password}`;

        middleware.push(proxy(proxyOptions));
      }

      if(env !== 'production' && hmr) {
        const webpackDevMiddlewareInstance = new webpackDevMiddleware(webpackCompiler);
        webpackDevMiddlewareInstance.waitUntilValid(()=> {
          callback();
          localServerInfo(options);
        })

        middleware.push(new webpackHotMiddleware(webpackCompiler));
        middleware.push(webpackDevMiddlewareInstance);

        if(apiMiddlewareProxySettings) {
          const proxyOptions = url.parse(apiMiddlewareProxySettings.url);
          proxyOptions.route = apiMiddlewareProxySettings.route;
          proxyOptions.cookieRewrite = apiMiddlewareProxySettings.cookieRewrite;

          const authJson = apiMiddlewareProxySettings.authJson;
          if(authJson) proxyOptions.auth = `${authJson.username}:${authJson.password}`;

          middleware.push(proxy(proxyOptions));
        }

        options.middleware = middleware;
        browserSync.init(options);
      } else {
        options.middleware = middleware;
        browserSync.init(options, ()=> {
          callback();
          localServerInfo(options);
        });
      }

      return browserSync;
    },

    reloadServer: (filePaths = null)=> {
      browserSync.active && browserSync.reload(filePaths);
    }
  }
})();