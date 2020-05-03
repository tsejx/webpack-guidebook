const fs = require('fs');
const path = require('path');
const { runLoaders } = require('loader-runner');

runLoaders(
  {
    resource: path.join(__dirname, './loaders/index.css'),
    loaders: [path.join(__dirname, './loaders/sprite-loader.js')],
    readResource: fs.readFile.bind(fs),
  },
  (err, result) => {
    err ? console.log(err) : null;
  }
);
