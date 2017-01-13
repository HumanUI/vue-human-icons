const fs = require("fs");
const cheerio = require('cheerio');
const lodash = require('lodash');

/**
 * Files name list in some folder
 * @return {Array}
 */
function getFilesname () {
  // 仅读取 .svg 文件
  return lodash.filter(fs.readdirSync('svg'), (file) => {
    return /.svg$/.test(file)
  });
}

/**
 * Parse file, get path node in svg xml, return paths
 * @param  {String} fileName
 * @return {String}
 */
function parseFile (fileName) {
  let paths = '';

  let html = fs.readFileSync(`svg/${fileName}`, 'utf8')
  let $ = cheerio.load(html)
	$('svg > path').each((index, element) => {
	  let path = $(element).attr('d');
	  paths += '<path d="'+path+'"></path>'
	});
  return 'export default `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32">'+paths+'</svg>`';
}

/**
 * Write js to file
 * @param {String} fileName
 * @param {String} js
 */
function writeFile (fileName, js) {
  fs.open(`dist/all/${fileName}.js`, 'a', function (err, fd) {
    var writeBuffer = new Buffer(js),
			offset = 0,
			len = writeBuffer.length,
			filePostion = null;

	  fs.write(fd, writeBuffer, offset, len, filePostion, function(err, readByte){
			console.log('写数据总数：'+readByte+' bytes' );		
	   })
	})
}

/**
 * Remove file name `.svg` suffix
 * @param  {String} fileName
 * @return {String}
 */
function getFileTitle (fileName) {
  return fileName.slice(0, fileName.indexOf('.svg'));
}

/**
 * Handle svg file to write js
 */
function handleSvgFile () {
  const files = getFilesname()
  files.forEach(fileName => {
    const title = getFileTitle(fileName)
    const js = parseFile(fileName)
    writeFile(title, js)
  })
  console.log('完成')
}

handleSvgFile()
