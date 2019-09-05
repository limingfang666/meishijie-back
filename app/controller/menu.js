'use strict';
const path = require('path');
const fs = require('fs');

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

  // 查询菜谱
  /**
   * 查询菜谱 GET
   * ctx.request.query 说明
   *  userId 根据用户Id来查询所有菜谱
   *  classify 根据分类查询 '1': 大类；'1-1': 小类查询
   *  property 根据属性来删选 [普通筛选] 
   *  page 分页
   *  
   *  以上可以单独查询，也可以组合查询
   */
  async query(){
    const { ctx,service } = this;
    const payload = ctx.request.query || {};
    const otherData = {page:1};
    // 转换分类查询数据
    if(payload.classify) {
      if(payload.classify.indexOf('-') === -1){
        payload.parent_classify = payload.classify;
      }
    }

    // property 是一个json字符串
    if(payload.property){
      const property = JSON.parse(payload.property);
      Object.keys(property).forEach((key) => {
        payload[`property.${key}`] = property[key];
      });
    }
    if(payload.page) otherData.page = payload.page;

    if(isNaN(+otherData.page)){
      ctx.body = {
        code: 1,
        data: {},
        mes: '分页不为数字，请重新填写'
      };
      return;
    }

    const query = {
      classify: payload.classify,
      property: payload.property,
    }
    const menus = await service.menu.query(query, otherData);
    await ctx.helper.sleep(1000);
    ctx.body = {
      code: 0,
      data: {
        ...menus,
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

  async comment() {
    const { ctx,service } = this;
    if(ctx.request.method === 'GET'){
      const payload = ctx.request.query || {};
      const commentInfo = await service.menu.getComment(payload);
      console.log('commentInfo: ', commentInfo);
      return ctx.body = {
        ec: 200,
        data: {
          comments: commentInfo,
          menu_id: payload.menu_id
        },
        mes: '评论成功'
      };;
    }
    const payload = ctx.request.body || {};
    const commentInfo = await service.menu.comment(payload);
    console.log('commentInfo: ', commentInfo);

    ctx.body = {
      ec: 200,
      data: {},
      mes: '评论成功'
    };
  }
}

module.exports = MenuController;