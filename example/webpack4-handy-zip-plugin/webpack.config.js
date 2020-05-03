const path = require('path');
const ZipPlugin = require('./plugins/zip-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'main.js',
  },
  plugins: [
    new ZipPlugin({
      filename: 'ZipPlugin',
    }),
  ],
};
