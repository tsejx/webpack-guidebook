const fs = require('fs');
const path = require('path');
const Spritesmith = require('spritesmith');
const loaderUtils = require('loader-utils');

module.exports = function(source) {
  const callback = this.async();
  // 匹配 ?__sprite 结尾的图片
  const imgs = source.match(/url\((\S*)\?__sprite/g);
  const matchedImgs = [];

  for (let i = 0; i < imgs.length; i++) {
    const img = imgs[i].match(/url\((\S*)\?__sprite/)[1];

    matchedImgs.push(path.join(__dirname, img));
  }

  Spritesmith.run(
    {
      src: matchedImgs,
    },
    (err, result) => {
      fs.writeFileSync(path.join(process.cwd(), 'dist/sprite.jpg'), result.image);

      source = source.replace(/url\((\S*)\?__sprite/g, match => {
        console.log
        return `url("dist/sprite.png"`;
      });

      fs.writeFileSync(path.join(process.cwd(), 'dist/index.css'), source);

      callback(null, source);
    }
  );
};
