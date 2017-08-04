const fs = require("fs");
const path = require('path');

/**
 * Files name list in some folder
 * @return {Array}
 */

function getFilesname () {
  // 读取 .svg 文件
  let files = []
  let dirs = []
  travel('svg', dirs, function(pathname) {
    files.push(pathname)
  })
  return files.filter(function (file) {
    return /.svg$/.test(file)
  });
}

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
 * Check folder and mkdir
 * @param  {String} fileName
 * @param  {Number} fromIndex
 */
function check (fileName, fromIndex) {
  var index = fileName.indexOf('\/', fromIndex)
  if (index !== -1) {
    var folderName = fileName.slice(0, index)
    if (!fs.existsSync(`js/${folderName}/`)) {
      fs.mkdirSync(`js/${folderName}`,0744);
    }
    check(fileName, index + 1);
  } else {
    return
  }
}

/**
 * Parse file, get path node in svg xml, return paths
 * @param  {String} fileName
 * @return {String}
 */
function parseFile (fileName) {
  let text = fs.readFileSync(fileName, 'utf8')
  text = text.slice(text.indexOf('\<svg'), text.indexOf('\<\/svg\>') + 6)
  return 'export default `'+text+'`'
}

/**
 * Write js to file
 * @param {String} fileName
 * @param {String} js
 */
function writeFile (fileName, js) {
  fileName = fileName.replace(/.svg$/, '.js').slice(4)
  check(fileName, 0)
  fs.open(`js/${fileName}`, 'a', function (err, fd) {
    var writeBuffer = new Buffer(js),
      offset = 0,
      len = writeBuffer.length,
      filePostion = null;

    fs.writeFile(fd, writeBuffer, offset, len, filePostion, function(err, readByte){
      console.log(`${fileName} 创建成功`)
    })
  })
}
/**
 * Empty './js' Folder
 */

function empty () {
  if (fs.existsSync('js')) {
    let dirs = []
    travel('js', dirs, function(pathname) {
      fs.unlinkSync(pathname)
    })
    for (let i = 0; i < dirs.length; i ++) {
      fs.rmdirSync(dirs[i])
    }
  }
}

/**
 * Handle svg file to write js
 */
function handleSvgFile () {
  const files = getFilesname()
  if (!fs.existsSync('js')) {
    fs.mkdirSync('js',0744);
  }
  files.forEach(fileName => {
    const js = parseFile(fileName)
    writeFile(fileName, js)
  })
  console.log('完成')
}

empty()
handleSvgFile()
