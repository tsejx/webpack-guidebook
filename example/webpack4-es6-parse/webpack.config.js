'use strict';

const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    index: './src/index.js',
    foo: './src/foo.js',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /.js$/,
        use: 'babel-loader?cacheDirectory=true',
      },
    ],
  },
};
