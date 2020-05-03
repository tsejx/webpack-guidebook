const path = require('path');
const MyPlugin = require('./plugins/my-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'main.js',
  },
  plugins: [
    new MyPlugin({
      name: 'My Plugin',
    }),
  ],
};
