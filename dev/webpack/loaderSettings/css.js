const config = require('../../config.js');

module.exports = (env, importLoaders = 1, modules = false)=> {
  return {
    loader: 'css-loader',
    options: {
      modules,
      importLoaders,
      sourceMap: env == 'development'
    }
  }
}
