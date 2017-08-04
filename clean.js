const fs = require("fs");
const path = require('path');

/**
 * Traversal folder
 * @param  {String} dir
 * @param  {Function} callback
 */

function travel (dir, callback) {
  fs.readdirSync(dir).forEach(function (file) {
    var pathname = path.join(dir, file);

    if (fs.statSync(pathname).isDirectory()) {
      travel(pathname, callback);
    } else {
      callback(pathname);
    }
  });
}

/**
 * Clean file
 */
function clean () {
  travel('svg', function(pathname) {
    if (/.svg$/.test(pathname)) {
      let text = fs.readFileSync(pathname, 'utf8')
      let reg = /id=".*?"|version=".*?"|xmlns:xlink=".*?"|width=".*px?"|height=".*px?"|x=".*px?"|y=".*px?"|enable-background=".*?"|xml:space=".*?"/g
      text = text.slice(text.indexOf('\<svg'), text.indexOf('\<\/svg\>') + 6)
      .replace(reg, '')
      .replace(/\s{2,}/g, ' ')
      .replace(/\>(\s|\n)*?\</g, '>\r  <')
      .replace(/\>(\s|\n)*?\<(?=animate)|\>(\s|\n)*?\<(?=\/animate)/g, '>\r    <')
      .replace(/\>(\s|\n)*?\<(?=\/svg)/g, '>\r<')
      fs.writeFileSync(pathname, text, 'utf8')
      console.log(`${pathname}清洗完成`)
    }
  })
}
clean()
