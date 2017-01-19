const fs = require("fs");
const path = require('path');

/**
 * Traversal folder
 * @param  {String} dir
 * @param  {Function} callback
 */

function travel (dir, dirs, callback) {
  fs.readdirSync(dir).forEach(function (file) {
    var pathname = path.join(dir, file);

    if (fs.statSync(pathname).isDirectory()) {
      dirs.unshift(pathname)
      travel(pathname, dirs, callback);
    } else {
      callback(pathname);
    }
  });
}

/**
 * Rename file
 */

function rename () {
  let dirs = []
  let folder = ''
  let file = ''
  travel('svg', dirs, function(pathname) {
    if (/.svg$/.test(pathname)) {
      var index = pathname.lastIndexOf('\/')

      if (index !== -1) {
        var newIndex = pathname.lastIndexOf('\/', index - 1)

        if (newIndex  !== -1) {
          folder = pathname.slice(newIndex + 1, index)
          file = pathname.slice(index + 1)
          let len = folder.length

          if (file.slice(0 ,len + 1) === folder + '-') {
            let arr = pathname.split('')
            arr.splice(index + 1, len + 1)
            let newpathname = arr.join('')
            fs.rename(pathname, newpathname, function (err) {
               if (err) throw err;
                console.log(`${newpathname}重命名完成`);
            })
          }
        }
      }
    }
  })
}

rename()
