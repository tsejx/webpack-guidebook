const { getAST, getDependencies, transform } = require('./parser');
const path = require('path');

const ast = getAST(path.join(__dirname, '../src/index.js'));
const dependenes = getDependencies(ast);
const source = transform(ast);

console.log(source)