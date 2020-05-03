const Spritesmith = require('spritesmith');
const fs = require('fs');
const path = require('path');

const sprites = ['./loaders/images/a.jpg', './loaders/images/b.jpg'];

Spritesmith.run({src: sprites}, (err, result) => {
  console.log(result.image);
  console.log(result.coordinates);
  console.log(result.properties);
  fs.writeFileSync(path.join(__dirname, 'dist/sprite.jpg'), result.image);
});
