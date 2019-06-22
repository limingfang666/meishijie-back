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
  async findUserFollows(payload){
    // 根据userId找到自己，然后再找到用户的follow
    let {follows} = await this.ctx.service.user.findUser(payload);
    let followsArr = [];
    if(follows.length){
      for(let i = 0; i < follows.length; i++){
        let findUser = await this.ctx.service.user.findUser({userId: follows[i].userId}, {follows: 0});
        followsArr.push(findUser);
      }
    }
    return followsArr;
  }
  // 关注或取消关注指定用户
  /**
   *关注或取消关注
   * @param {*} payload
   * @returns {Boolean} true 添加 false，取消
   * @memberof UserService
   */
  async toggleFollow(payload){
    let findUser = await this.ctx.service.user.findUser({userId: payload.userId});
    let follows = findUser.follows;
    let has = false; 
    if(follows.findIndex(item => item.userId.toString() === payload.followUserId) !== -1){
      
      follows = follows.filter(item => {
        return item.userId.toString() !== payload.followUserId
      });
      has = false;
    }else {
      follows.push({
        userId: payload.followUserId
      });
      has = true;
    }
    
    findUser.follows = follows;
    await findUser.save();
    return has;
  }
}

module.exports = UserService;