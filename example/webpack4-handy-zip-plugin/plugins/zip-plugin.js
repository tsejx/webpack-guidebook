const path = require('path');
const RawSource = require('webpack-sources').RawSource;
const JSZip = require('jszip');

const zip = new JSZip();

module.exports = class ZipPlugin {
  constructor(options) {
    this.options = options;
  }
  apply(compiler) {
    compiler.hooks.emit.tapAsync('ZipPlugin', (compilation, callback) => {
      const folder = zip.folder(this.options.filename);

      for (let filename in compilation.assets) {
        const source = compilation.assets[filename].source();
        folder.file(filename, source);
      }

      zip.generateAsync({ type: 'nodebuffer' }).then(content => {
        const outputPath = path.join(
          compilation.options.output.path,
          this.options.filename + '.zip'
        );
        const oiutputRelativePath = path.relative(compilation.options.output.path, outputPath);
        compilation.assets[oiutputRelativePath] = new RawSource(content);

        callback();
      });
    });
  }
};
