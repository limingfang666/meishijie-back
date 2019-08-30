'use strict';
const path = require('path');
const fs = require('fs');


const Controller = require('egg').Controller;
class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'hi, egg';
  }
  async up(){
    // 测试断点续传
    const {ctx} = this;
    const stream = await ctx.getFileStream();

    stream.on('data',(chunk)=>{
      console.log('chunk: ', chunk);
    })
    stream.on('end',(chunk)=>{
      console.log('end: ', chunk);
    })

    ctx.body = {
      mes:'ok'
    }
  }
  async upload () {
    const { ctx } = this;
    const {type} = ctx.request.query;

    // 如果没有传type或者传入的type不对，则提示
    if(!type || !ctx.upload[type]){
      return ctx.body = {
        code: 1,
        data:{},
        mes: '请上传正确的type类型'
      }
    }

    const fileOptions = ctx.upload[type];
    const stream = await ctx.getFileStream();
    const info = await ctx.helper.writeStreamToDisk(stream, fileOptions);

    if(info.error){
      return ctx.body = {code: 1,data:{},mes: info.mes}
    }
    ctx.body = {
      code: 0,
      data:{
        url: info.accessPath
      },
      mes: '上传图片成功'
    }
  }
}

module.exports = HomeController;
