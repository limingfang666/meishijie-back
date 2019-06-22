'use strict';

const Controller = require('egg').Controller;

class UserActionController extends Controller {
  /**
   * get 获取关注者 {userId}
   * post 关注或取消关注指定的用户 {userId:,followUserId:,}
   * 
   */
  async follow() {
    const { ctx,service } = this;
    if(ctx.request.method === 'GET'){
      const payload = ctx.request.query || {};
      //现在自己
      let follows = await service.user.findUserFollows(payload);
      // 找到
      ctx.body = {
        userId: payload.userId,
        list: follows
      }
      return;
    }

    const body = ctx.request.body || {};
    let has = await service.user.toggleFollow(body);
    console.log(has);

    ctx.body = 'ok';
  }
}

module.exports = UserActionController;
