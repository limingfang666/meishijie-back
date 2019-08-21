'use strict';
const path = require('path');
const fs = require('fs');
var sizeOf = require('image-size');
let Duplex = require('stream').Duplex;

function bufferToStream(buffer) {  
  let stream = new Duplex();
  stream.push(buffer);
  stream.push(null);
  return stream;
}
function streamToBuffer(stream) {  
  return new Promise((resolve, reject) => {
    let buffers = [];
    stream.on('error', reject);
    stream.on('data', (data) => buffers.push(data))
    stream.on('end', () => resolve(Buffer.concat(buffers)));
  });
}
const maxSize = 1024 * 1024 * 1;

const Controller = require('egg').Controller;



class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'hi, egg';
  }
  async create() {
    const { ctx } = this;
    ctx.body = 'create';
  }
  async upload() {
    const { ctx } = this;
    const stream = await ctx.getFileStream();
    const s = await streamToBuffer(stream)
    const imgWh = sizeOf(s);
    console.log(s.length);
    console.log(maxSize)
    // if(imgWh.width > 100){
    //   ctx.body = {
    //     code: 1,
    //     data:{},
    //     meg: '请上传符合尺寸的图片'
    //   }
    //   return;
    // }
    const parse = path.parse(stream.filename);
    const filename = parse.name + Date.now() + parse.ext;
    const target = path.join(__dirname, '../public/user', filename);
    const writeStream = fs.createWriteStream(target);
    // console.log(sizeOf(stream));
    bufferToStream(s).pipe(writeStream);
    ctx.cleanupRequestFiles();
    ctx.body = {
      code: 0,
      data:{
        url: '/static/user/'+ filename
      },
      meg: '上传图片成功'
    }
  }
}

module.exports = HomeController;
