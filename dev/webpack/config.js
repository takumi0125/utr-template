// npm modules
const path = require('path');
const webpack = require('webpack');
const WriteFilePlugin = require('write-file-webpack-plugin');

const VueLoaderPlugin = require('vue-loader/lib/plugin');
const TerserPlugin = require('terser-webpack-plugin');

// loader settings
const babelLoaderSettings = require('./loaderSettings/babel.js');
const tsLoaderSettings = require('./loaderSettings/ts.js');
const sassLoaderSettings = require('./loaderSettings/sass.js');
const cssLoaderSettings = require('./loaderSettings/css.js');
const postCSSLoaderSettings = require('./loaderSettings/postcss.js');

const config = require('../config.js');

// src and publish path (resolved)
const srcDir = path.resolve(config.srcDir);
const publishDir = path.resolve(config.publishDir);

module.exports = (env, entry)=> {
  const webpackConfig = {
    entry,

    context: srcDir,

    output: {
      path: publishDir,
      filename: '[name]',
      chunkFilename: '[name].js',
      publicPath: '/'
    },

    mode: env || 'development',

    devtool: env == 'development'? 'source-map': 'none',

    devServer: {
      hot: true
    },

    resolve: {
      extensions: [ '.js', '.jsx', '.vue', '.ts', '.tsx', '.glsl', '.vert', '.frag' ],
    },

    module: {
      rules: [
        // js/jsx
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules\/(?!(three|gsap|vuex)\/).*/,
          use: [
            babelLoaderSettings(env)
          ]
        },

        // ts/tsx
        {
          test: /\.(ts|tsx)$/,
          // exclude: /node_modules\/(?!(three|gsap|vuex)\/).*/,
          use: [
            tsLoaderSettings(env)
          ]
        },

        // vue
        {
          test: /\.vue$/,
          use: [ 'vue-loader' ]
        },

        //  json
        { test: /\.json$/, use: [ 'json-loader' ], type: "javascript/auto" },

        //  glsl
        { test: /\.(glsl|vert|frag)$/, use: [ 'raw-loader', 'glslify-loader' ] },

        // pug
        {
          test: /\.pug$/,
          oneOf: [
            // for <template lang="pug">
            {
              resourceQuery: /^\?vue/,
              use: [ 'pug-plain-loader' ]
            },
            { use: [ 'raw-loader', 'pug-plain-loader' ] }
          ]
        },

        // css/sass/scss
        {
          test: /\.(css|sass|scss)$/,
          oneOf: [
            // for <template lang="scss">
            {
              resourceQuery: /^\?vue/,
              use: [
                'vue-style-loader',
                cssLoaderSettings(env, 2),
                sassLoaderSettings(env),
                postCSSLoaderSettings(env)
              ]
            },
            {
              use: [
                'style-loader',
                cssLoaderSettings(env, 2, true),
                sassLoaderSettings(env),
                postCSSLoaderSettings(env)
              ]
            }
          ]
        }
      ]
    },

    plugins: [
      new WriteFilePlugin(),

      new VueLoaderPlugin(),

      // define
      new webpack.DefinePlugin({
        ENV: JSON.stringify({
          env,
          projectName: config.projectName,
          data: config.defineData[env]
        })
      })
    ],

    optimization: {}
  };

  if(env !== 'production' && config.hmr) {
    webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
  }

  if(config.splitChunksCommon) {
    webpackConfig.optimization.splitChunks = {
      cacheGroups: {
        vendors: {
          test: (module, chunks)=> {
            const regExp = new RegExp(config.splitChunksCommon.includes.join('|'));
            return module.resource && module.resource.match(regExp);
          },
          name: config.splitChunksCommon.name,
          chunks: 'all',
          enforce: true,
          minChunks: 2
        },
        default: false,
        defaultVendors: false
      }
    }
  }

  if(env == 'production' && config.minify.js) {
    webpackConfig.optimization = {
      ...webpackConfig.optimization,
      minimize: true,
      minimizer: [
        new TerserPlugin({
          // parallel: true,
          terserOptions: {
            compress: { drop_console: true }
          }
        })
      ]
    }
  }

  return webpackConfig;
}