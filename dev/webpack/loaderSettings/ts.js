const config = require('../../config.js');
const path = require('path');

module.exports = (env)=> {
  return {
    loader: 'ts-loader',
    options: {
      appendTsSuffixTo: [/\.vue$/],
      context: path.resolve(config.srcDir),
      configFile: path.join(__dirname, '../../tsconfig.json'),
      compilerOptions: {
        sourceMap: env == 'development'
      }
    }
  }
}
