const config = require('../../config.js');
const path = require('path');

module.exports = (env)=> {
  return {
    loader: 'ts-loader',
    options: {
      appendTsSuffixTo: [/\.vue$/],
      context: path.resolve(config.srcDir),
      configFile: path.join(config.projectDir, 'tsconfig.json'),
      compilerOptions: {
        sourceMap: env == 'development'
      }
    }
  }
}
