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
  
}

module.exports = MenuService;