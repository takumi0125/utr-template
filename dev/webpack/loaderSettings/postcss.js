const config = require('../../config.js');
const autoprefixer = require('autoprefixer');

module.exports = (env)=> {
  return {
    loader: 'postcss-loader',
    options: {
      sourceMap: env == 'development',
      plugins: [ autoprefixer(config.autoprefixerOpt) ]
    }
  }
}