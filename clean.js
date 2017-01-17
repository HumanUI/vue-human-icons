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
    let text = fs.readFileSync(pathname, 'utf8')
    let reg = /width=".*?"|height=".*?"|version=".*?"|xmlns:xlink=".*?"|fill=".*?"/g
    text = text.slice(text.indexOf('\<svg'), text.indexOf('\<\/svg\>') + 6).replace(reg, '')
    text = text.replace(/\s{2}/g, ' ')
    fs.writeFileSync(pathname, text, 'utf8')
    console.log(`${pathname}清洗完成`)
  })
}
clean()
