'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  constructor(ctx){
    super(ctx);
  }

  async create(){
    const { ctx,service,model } = this;
    const payload = ctx.request.body || {};
    const findUser = await service.user.findUserByName({name: payload.name});
    
    if(findUser){
      ctx.body = {
        code: 1,
        mes: '用户已存在'
      }
      return;
    }

    const res = await service.user.create(payload);
    
    ctx.body = {
        code: 0,
        mes: '用户已创建完成'
      }
  }
  async login_out(){
    const { ctx,service } = this;
    const payload = ctx.request.body || {};
    await service.actionToken.deleteToken({userId: payload._id});
    ctx.body = {
      code: 1,
      mes: '已登出'
    }
  }
  async login(){
    const { ctx,service } = this;
    const payload = ctx.request.body || {};
    
    const findUser = await service.user.findUser({name: payload.name});
    
    if(!findUser) {
      ctx.body = {
        code: 1,
        mes: '用户或密码输入错误，请重新输入'
      }
      return;
    }

    const result = await ctx.compare(payload.password, findUser.password);

    if(!result){
      ctx.body = {
        code: 1,
        mes: '用户或密码输入错误，请重新输入'
      }
      return;
    }
    
    // 登录操作 发送个令牌给前端
    let token = await service.actionToken.apply(findUser._id);
    // 将令牌存储在数据库中
    await service.actionToken.saveToken({userId: findUser._id, token});

    ctx.body = {
      code: 0,
      _id: findUser._id,
      token: token,
      mes: '登录成功'
    }
  }
}

module.exports = UserController;

