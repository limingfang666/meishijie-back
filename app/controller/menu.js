'use strict';

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