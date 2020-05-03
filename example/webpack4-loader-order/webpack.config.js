const path = require('path');
const loaderA = require('./loaders/a-loader');
const loaderB = require('./loaders/b-loader');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'main.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [path.resolve('./loaders/a-loader.js'), path.resolve('./loaders/b-loader.js')],
      },
    ],
  },
};
