const fs = require('fs');
const path = require('path');
const loaderUtils = require('loader-utils');

module.exports = function(source) {
  const { name } = loaderUtils.getOptions(this);
  const callback = this.async();

  console.log(name);

  const json = JSON.stringify(source.replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029'));

  fs.readFile(path.join(__dirname, './async.txt'), 'utf-8', (err, data) => {
    if (err) {
      return callback(err, '');
    }
    callback(null, data);
  });

  return `export default ${json}`;
};
