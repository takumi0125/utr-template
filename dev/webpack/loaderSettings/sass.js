const config = require('../../config.js');

module.exports = (env)=> {
  return {
    loader: 'sass-loader',
    options: {
      sourceMap: env == 'development',
      sassOptions: {
        outputStyle: 'expanded'
      }
    }
  }
}