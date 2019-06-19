'use strict';

const Controller = require('egg').Controller;

class MenuController extends Controller {
  publish(){
    const { ctx,service } = this;
    const payload = ctx.request.body || {};
    service.menu.publish(payload);
    ctx.body = 'test';
  }
}

module.exports = MenuController;