
const Service = require('egg').Service
const pageSize = 20;
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

  async query(payload, otherData={page:1}){
    const { ctx } = this;
    const field = {userId:1, title: 1, classify: 1, property: 1, product_pic_url: 1,name:1};
    const page = +otherData.page;
    const skip = (page-1) * pageSize;
    const total = await this.ctx.model.Menu.count();
    let query = ctx.helper.filterDef(payload);
    const list = await this.ctx.model.Menu.find(query, field).skip(skip).limit(pageSize).sort({_id: -1});
    return {
      list,
      total: 100,
      current_page: page,
      page_size: pageSize
    }
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

  async comment(payload){
    return await this.ctx.model.Comment.create(payload);
  }
  async getComment(payload){
    return await this.ctx.model.Comment.find(payload);
  }
}

module.exports = MenuService;