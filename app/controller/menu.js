'use strict';

const Controller = require('egg').Controller;

class MenuController extends Controller {
  async publish(){
    const { ctx,service } = this;
    const payload = ctx.request.body || {};
    await service.menu.publish(payload);
    ctx.body = 'test';
  }

  // 查询指定关键字菜谱
  async query(){
    const { ctx,service } = this;
    const payload = ctx.request.query || {};
    const menus = await service.menu.query(payload);
    ctx.body = menus;
  }
}

module.exports = MenuController;