'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  constructor(ctx){
    super(ctx);
  }

  async create(){
    const { ctx,service,model } = this;
    const payload = ctx.request.body || {};
    const findUser = await service.user.findUser({name: payload.name});
    
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
      data: {
        _id: findUser._id,
        name: findUser.name,
        token: token,
      },
      mes: '登录成功'
    }
  }
  // 拿到用户信息
  async info(){
    const { ctx,service,model } = this;
    const payload = ctx.request.body || {};
    let userId = '';
    if(payload.userId){
      userId = payload.userId;
    }else {
      let authorization = ctx.request.header.authorization.split(' ')[1];
      let decode = ctx.app.jwt.decode(authorization);
      userId = decode.data._id;
    }
    

    const findUser = await service.user.findUser({_id: userId});
    const menus = await service.menu.query({userId: userId});
    if(!findUser) {
      ctx.body = {
        code: 1,
        data: {},
        mes: '用户不存在'
      }
      return;
    }
    console.log(1111, menus)
    ctx.body = {
      code: 0,
      data: {
        name: findUser.name,
        _id: findUser._id,
        follows_len: findUser.follows.length,
        following_len: findUser.following.length,
        collections_len: findUser.collections.length,
        work_menus_len: menus.length,
        avatar: findUser.avatar,
        createdAt: findUser.createdAt
      },
      mes: '用户已返回'
    }
  }
}

module.exports = UserController;

