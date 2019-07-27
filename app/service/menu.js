const Service = require('egg').Service
class MenuService extends Service {
  constructor(ctx){
    super(ctx);
  }

  async publish(payload){
    const { ctx } = this;

    if(!payload.parent_classify) {
      payload.parent_classify = payload.classify[0];
    }
    // 错误的设置
    const menu = await this.ctx.model.Menu.create(payload);
    return menu;
  }

  async query(payload){
    const { ctx } = this;
    const field = {userId:1, title: 1, classify: 1, property: 1, product_pic_url: 1,name:1};
    return await this.ctx.model.Menu.find(payload, field);
  }

  async menuInfo(payload){
    const { ctx } = this;
    return await this.ctx.model.Menu.findOne(payload);
  }
  
  // 获取所有的分类
  async classify(){
    const classifies = await this.ctx.model.Classification.find().select('-_id -__v');
    // 格式化一下
    let obj = [];
    classifies.forEach((item) => {
      let option = obj.find(o => o.parent_type === item.parent_type);
      if(option) {
        option.list.push(item);
      }else {
        let o = {
          parent_type: item.parent_type,
          parent_name: item.parent_name,
        }
        o.list = [item];
        obj.push(o);
      }
    });

    return obj;
  }
  // 获取所有属性的分类
  async property(){
    const Property = await this.ctx.model.Property.find().select('-_id -__v');
    // 格式化一下
    let obj = [];
    Property.forEach((item) => {
      let option = obj.find(o => o.parent_type === item.parent_type);
      if(option) {
        option.list.push(item);
      }else {
        let o = {
          parent_type: item.parent_type,
          parent_name: item.parent_name,
          title: item.title,
        }
        o.list = [item];
        obj.push(o);
      }
    });

    return obj;
  }
}

module.exports = MenuService;