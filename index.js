const fs = require("fs");
const path = require('path');

/**
 * Files name list in some folder
 * @return {Array}
 */

function getFilesname () {
  // 读取 .svg 文件
  let files = []
  travel('svg', function(pathname) {
    files.push(pathname)
  })
  return files.filter(function (file) {
    return /.svg$/.test(file)
  });
}

function travel(dir, callback) {
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
 * Parse file, get path node in svg xml, return paths
 * @param  {String} fileName
 * @return {String}
 */
function parseFile (fileName) {
  let text = fs.readFileSync(fileName, 'utf8')
  text = text.slice(text.indexOf('\<svg'), text.indexOf('\<\/svg\>') + 6).replace(/width=".*" | height=".*"/, '')
  return 'export default `'+text+'`'
}
/**
 * Write js to file
 * @param {String} fileName
 * @param {String} js
 */
function writeFile (fileName, js) {
  fileName = fileName.replace(/.svg$/, '.js').slice(4)
  if (fileName.lastIndexOf('\/') !== -1) {
    var dir = fileName.slice(0, fileName.lastIndexOf('\/'))
    if (!fs.existsSync(`dist/${dir}/`)) {
      fs.mkdirSync(`dist/${dir}`,0744);
    }
  }
  fs.open(`dist/${fileName}`, 'a', function (err, fd) {
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
 * Handle svg file to write js
 */
function handleSvgFile () {
  const files = getFilesname()
  files.forEach(fileName => {
    const js = parseFile(fileName)
    writeFile(fileName, js)
  })
  console.log('完成')
}

handleSvgFile()
