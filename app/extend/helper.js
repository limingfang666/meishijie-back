const cloneDeepWith = require('lodash/cloneDeepWith');
let Duplex = require('stream').Duplex;
var sizeOf = require('image-size');
var path = require('path');
var fs = require('fs');

exports.cloneDeepWith = function(object){
  return cloneDeepWith(object);
}

const bufferToStream = function (buffer) {  
  let stream = new Duplex();
  stream.push(buffer);
  stream.push(null);
  return stream;
}
exports.bufferToStream = bufferToStream;
const streamToBuffer = function(stream) {
  return new Promise((resolve, reject) => {
    let buffers = [];
    stream.on('error', reject);
    stream.on('data', (data) => buffers.push(data))
    stream.on('end', () => resolve(Buffer.concat(buffers)));
  });
}
exports.streamToBuffer = streamToBuffer;
// 获取上传图片的大小和尺寸
const getStreamInfo = async function(stream) {
  const fileBuffer = await streamToBuffer(stream);
  return {
    ...sizeOf(fileBuffer),
    fileBuffer,
    size: fileBuffer.length
  }
}
exports.getStreamInfo = getStreamInfo;
/** 
 * path
 * width
 * height
 * size
*/
exports.writeStreamToDisk = async function(stream, options) {
  let defaults = {
    path: path.join(process.cwd(), './app/public'),  // 默认路径
    filename: '',
    width: Infinity,
    height: Infinity,
    size: Infinity
  }
  Object.assign(defaults, options);
  const {width, height, size} = defaults;
  const streamInfo = await getStreamInfo(stream);
  if(streamInfo.width > width || streamInfo.height > height) {
    return {
      error: 1,
      mes: '文件尺寸不符合规定'
    }
  }
  if(streamInfo.size > size) {
    return {
      error: 1,
      mes: '文件大小不符合规定'
    }
  }
  const parse = path.parse(stream.filename);
  const filename = parse.name + Date.now() + parse.ext;
  
  const fileStream = bufferToStream(streamInfo.fileBuffer);
  const target = path.join(this.config.multipart.tmpdir,defaults.path, filename);
  const writeStream = fs.createWriteStream(target);
  fileStream.pipe(writeStream);
  return {
    success: 0,
    filename: filename,
    uploadPath: options.path,
    accessPath:  path.join(this.config.static.prefix, options.path, filename),
    mes: '文件上传成功'
  }
}


