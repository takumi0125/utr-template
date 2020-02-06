const config = require('../../config.js');

module.exports = (env)=> {
  return {
    loader: 'babel-loader',
    options: {
      presets: [
        [
          '@babel/preset-env',
          {
            modules: false,
            corejs: 3,
            useBuiltIns: "usage",
            targets: {
              browsers: config.targetBrowsers
            }
          }
        ],
        '@babel/preset-react'
      ],
      plugins: [
        [ 'transform-react-pug' ]
      ]
    }
  }
}
