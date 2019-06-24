'use strict';

const Controller = require('egg').Controller;

class UserActionController extends Controller {
  /**
   * get 获取关注者 {userId}
   * post 关注或取消关注指定的用户 {userId:,followUserId:,}
   * 
   */
  async following() {
    const { ctx,service } = this;
    if(ctx.request.method === 'GET'){
      const payload = ctx.request.query || {};
      const payloadClone = ctx.helper.cloneDeepWith(payload);
      //现在自己
      let follows = await service.user.findUserFollowing(payloadClone);
      // 找到
      ctx.body = {
        userId: payload.userId,
        list: follows
      }
      return;
    }
    const body = ctx.request.body || {};
    let isAdd = await service.user.toggleFollow(body);
    ctx.body = {
      code: 0,
      mes: isAdd ? '已关注' : '已取消关注'
    }
  }
  /**
   * 收藏的菜单
   */
  async collection(){
    const { ctx,service } = this;
    if(ctx.request.method === 'GET'){
      const payload = ctx.request.query || {};
      const payloadClone = ctx.helper.cloneDeepWith(payload);
      //现在自己
      let collections = await service.user.findUserCollections(payloadClone);
      // 找到
      ctx.body = {
        userId: payload.userId,
        list: collections
      }
      return;
    }

    const body = ctx.request.body || {};
    let isAdd = await service.user.toggleCollection(body);
    ctx.body = {
      code: 0,
      mes: isAdd ? '已收藏' : '已取消收藏'
    }
  }
}

module.exports = UserActionController;
