const Service = require('egg').Service
class MenuService extends Service {
  constructor(ctx){
    super(ctx);
  }

  async publish(payload){
    const { ctx } = this;
    let menuPublish = await this.ctx.model.Menu.create(payload);
    console.log(menuPublish);
  }

  async query(payload){
    const { ctx } = this;
    console.log(payload)
    return await this.ctx.model.Menu.find(payload,{userId:1, title: 1, classify: 1, property: 1});
  }
  
}

module.exports = MenuService;