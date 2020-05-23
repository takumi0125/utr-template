const config = require('../../config.js');

module.exports = (env)=> {
  const plugins = [
    '@babel/plugin-syntax-dynamic-import',
    'transform-react-pug'
  ];

  // if(env === 'development') plugins.unshift('react-hot-loader/babel');

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
      plugins
    }
  }
}
