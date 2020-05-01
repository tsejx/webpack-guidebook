if (typeof window === 'undefined') {
  global.window = {};
}

const path = require('path');
const fs = require('fs');
const express = require('express');
const { renderToString } = require('react-dom/server');
const SSR = require('../dist/index.js');
const template = fs.readFileSync(path.join(__dirname, '../dist/index.html'), 'utf-8');
const data = require('./data.json');

server(process.env.PORT || '4321');

function server(port) {
  const app = express();

  app.use(express.static('dist'));

  app.get('/index', (req, res) => {
    const html = renderMarkUp(renderToString(SSR));
    res.status(200).send(html);
  });

  app.listen(port, () => {
    console.log('Server is running on port ' + port);
  });
}

const renderMarkUp = str => {
  const dataStr = JSON.stringify(data);
  return template.replace('<!--HTML_PLACEHOLDER-->', str).replace('<!--INITIAL_DATA_PLACEHOLDER-->', `<script>window.__initial_data=${dataStr}</script>`);
};
