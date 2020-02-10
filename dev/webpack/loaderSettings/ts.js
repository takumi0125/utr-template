const config = require('../../config.js');
const path = require('path');

module.exports = (env)=> {
  return {
    loader: 'ts-loader',
    options: {
      context: path.resolve(config.srcDir),
      configFile: path.join(__dirname, '../../tsconfig.json'),
      compilerOptions: {
        // allowJs: true,
        // strict: true,
        // checkJs: true,
        target: 'es5',
        module: 'es2015',
        sourceMap: env == 'development'
      }
    }
  }
}
