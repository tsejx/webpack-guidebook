/**
 * In order to have each documentation page to have its own meta data
 * and URI we break them out in to individual routes.
 */
const fs = require('fs');
const path = require('path');

const pathname = (route) => path.resolve(__dirname, `../${route}/`);

module.exports = (route) =>  fs.readdirSync(pathname(route)).filter(f => /.md$/g.test(f)).map(m => `/${route}/${m.split('.')[0]}`)
