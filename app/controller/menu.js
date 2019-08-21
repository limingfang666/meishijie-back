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
const maxSize = 1024 * 1024 * 10;

const Controller = require('egg').Controller;

class MenuController extends Controller {
  async publish(){
    const { ctx,service } = this;
    const payload = ctx.request.body || {};
    const findUser = await service.user.findUser({_id: payload.userId});
    payload.name = findUser.name;
    const menu = await service.menu.publish(payload);
    
    ctx.body = {
      code: 0,
      mes: '发布成功'
    }
  }

  // 上传成品图片
  async upload() {
    const { ctx } = this;
    const stream = await ctx.getFileStream();
    const s = await streamToBuffer(stream)
    const imgWh = sizeOf(s);
    if(imgWh.width > 328 || imgWh.width > 440){
      ctx.body = {
        code: 1,
        data:{},
        mes: '请上传符合尺寸的图片'
      }
      return;
    }
    const parse = path.parse(stream.filename);
    const filename = parse.name + Date.now() + parse.ext;
    const target = path.join(__dirname, '../public/product', filename);
    const writeStream = fs.createWriteStream(target);
    bufferToStream(s).pipe(writeStream);
    ctx.cleanupRequestFiles();
    ctx.body = {
      code: 0,
      data:{
        url: '/static/product/'+ filename
      },
      mes: '上传图片成功'
    }
  }
  // 上传成品图片
  async stepUpload() {
    const { ctx } = this;
    const stream = await ctx.getFileStream();
    const s = await streamToBuffer(stream)
    const imgWh = sizeOf(s);
    console.log(imgWh);
    // if(imgWh.width > 550 || imgWh.width < 400 || imgWh.height > 550){
    //   ctx.body = {
    //     code: 1,
    //     data:{},
    //     mes: '请上传符合尺寸的图片'
    //   }
    //   return;
    // }
    const parse = path.parse(stream.filename);
    const filename = parse.name + Date.now() + parse.ext;
    const target = path.join(__dirname, '../public/step', filename);
    const writeStream = fs.createWriteStream(target);
    bufferToStream(s).pipe(writeStream);
    ctx.cleanupRequestFiles();
    ctx.body = {
      code: 0,
      data:{
        url: '/static/step/'+ filename
      },
      mes: '上传图片成功'
    }
  }

  // 查询菜谱
  /**
   * 查询菜谱 GET
   * ctx.request.query 说明
   *  userId 根据用户Id来查询所有菜谱
   *  classify 根据分类查询 '1': 大类；'1-1': 小类查询
   *  property 根据属性来删选 [普通筛选] 
   *  
   *  以上可以单独查询，也可以组合查询
   */
  async query(){
    const { ctx,service } = this;
    const payload = ctx.request.query || {};
    // 转换分类查询数据
    if(payload.classify) {
      if(payload.classify.indexOf('-') === -1){
        payload.parent_classify = payload.classify;
        delete payload.classify;
      }
    }

    // property 是一个json字符串
    if(payload.property){
      const property = JSON.parse(payload.property);
      Object.keys(property).forEach((key) => {
        payload[`property.${key}`] = property[key];
      })
      delete payload.property;
    }
    const menus = await service.menu.query(payload);
    ctx.body = {
      code: 0,
      data: {
        list: menus,
        userId: payload.userId
      },
      mes: '菜谱返回成功'
    };
  }

  // 根据id拿到菜单具体的信息
  async menuInfo(){
    const { ctx,service } = this;
    const payload = ctx.request.query || {};

    const menu = await service.menu.menuInfo({_id: payload.menuId});
    if(!menu){
      ctx.body = {
        code: 1,
        data: {
          menuId: payload.menuId
        },
        mes: '菜谱信息不存在'
      }
      return;
    }
    const userInfo = await service.user.findUserInfo({_id: menu.userId});
    let menuInfo = {...menu._doc};
    menuInfo.collection_len = menuInfo.collectionUsers.length;
    delete menuInfo.collectionUsers;
    // 收藏的users中是否有当前的用户
    // 用户自己
    let authorization = ctx.request.header.authorization.split(' ')[1];
    let decode = ctx.app.jwt.decode(authorization);
    let ownId = decode.data._id;
    let isCollection = false; // 是否收藏
    isCollection = !!menu.collectionUsers.find(item => item._id.toString() === ownId);
    ctx.body = {
      code: 0,
      data: {
        info:{
          ...menuInfo,
          isCollection,
          userInfo
        },
        menuId: payload.menuId
      },
      mes: '成功返回菜谱信息'
    }
  }

  async classify(){
    const { ctx,service } = this;
    const classify = await service.menu.classify();
    ctx.body = {
      ec: 200,
      data: classify
    };
  }
  async property(){
    const { ctx,service } = this;
    const properties = await service.menu.property();
    ctx.body = {
      ec: 200,
      data: properties
    };
  }
}

module.exports = MenuController;