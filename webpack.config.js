const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = [
  {
    entry: './lib/store.js',

    output: {
      filename: 'mqtt-localforage-store.min.js',
      path: path.resolve(__dirname, 'dist'),
      library: 'MQTTLocalForageStore',
      libraryTarget: 'var'
    },

    plugins: [
      new UglifyJSPlugin({
        test: /\.js$/
      })
    ],

    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['babel-preset-env']
            }
          }
        }
      ]
    }
  },
  
  {
    entry: './lib/store.js',

    output: {
      filename: 'mqtt-localforage-store.standalone.min.js',
      path: path.resolve(__dirname, 'dist'),
      library: 'MQTTLocalForageStore',
      libraryTarget: 'var'
    },

    externals: ['readable-stream'],

    plugins: [
      new UglifyJSPlugin({
        test: /\.js$/
      })
    ],

    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['babel-preset-env']
            }
          }
        }
      ]
    }
  }
];