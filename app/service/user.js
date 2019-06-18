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

  async findUserByName(payload){
    return await this.ctx.model.User.findOne(payload);
  }

  async login(payload){
    const { ctx } = this;
    payload.password = await ctx.genHash(payload.password);
    return ctx.model.User.findOne(payload);
  }
}

module.exports = UserService;