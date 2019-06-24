const Service = require('egg').Service
class UserService extends Service {
  constructor(ctx){
    super(ctx);
  }

  async create(payload){
    const { ctx } = this;
    payload.password = await ctx.genHash(payload.password);
    return await ctx.model.User.create(payload);
  }

  async findUser(payload, options={}){
    if('userId' in payload){  // _id 和userId 都可以搜索
      payload._id = payload.userId;
      delete payload.userId;
    }
    return await this.ctx.model.User.findOne(payload, options);
  }

  async login(payload){
    const { ctx } = this;
    payload.password = await ctx.genHash(payload.password);
    return ctx.model.User.findOne(payload);
  }

  //查找用户的关注者
  async findUserFollowing(payload){

    let followings = await this.ctx.model.User
                            .findOne({_id: payload.userId}, {following: 1})
                            .populate({
                              path: 'following',
                              select: 'name _id sign'
                            });
                            
    if(followings){
      return followings.following;
    }
    return [];
  }
  // 关注或取消关注指定用户
  /**
   *关注或取消关注
   * @param {*} payload
   * @returns {Boolean} true 添加 false，取消
   * @memberof UserService
   */
  async toggleFollow(payload){
    let following = await this.ctx.model.User
                        .findOne({_id: payload.userId})
                        .populate({
                          path: 'following',  // 关注
                        });
    let follows = await this.ctx.model.User
                .findOne({_id: payload.followUserId})
                .populate({
                  path: 'follows',  // 粉丝
                });
    let isAdd = false;
    // 关注 - 取关
    if(!!following.following.find(item => item._id.toString() === payload.followUserId)){
      // 取消关注
      following.following = following.following.filter(item => item._id.toString() !== payload.followUserId);
      // 删掉粉丝
      follows.follows = follows.follows.filter(item => item._id.toString() !== payload.userId);
      isAdd = false;
    }else {
      // 关注
      following.following.push(payload.followUserId);
      // 添加粉丝
      follows.follows.push(payload.userId);
      isAdd = true;
    }
    await following.save();
    await follows.save();
    return isAdd;
  }

  async findUserCollections(payload){
    let collections = await this.ctx.model.User
        .findOne({_id: payload.userId}, {collections: 1})
        .populate({
          path: 'collections',
          // select: 'name _id sign'
        });
        
    if(collections){
    return collections.collections;
    }
    return [];
  }
  
}

module.exports = UserService;