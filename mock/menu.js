// mock 数据
var Mock = require('mockjs')
var Random = Mock.Random;

let menuModel = require('../app/model/menu.js')(global);
// 根据用户来生成的，现获取指定个数的用户
let userModel;
try{
  userModel = global.mongoose.model('User');
}catch(e){
  userModel = require('../app/model/user.js')(global);
}
const createNum = 1;  // 生成的个数


async function createMenu(){
  let users = await userModel.find({}).limit(200);
  if(!users || !users.length) return;
  let datas = users.map((user) => {
    return createMockMenu().menus;
  });
  datas.forEach((item,index) => {
    item.userId = users[index]._id;
  })
  menuModel.insertMany(datas).then((e,d) => {
    console.log('菜谱数据插入成功');
  });
}

module.exports = createMenu;

function createMockMenu(userId){
  return Mock.mock({
    'menus|1': [
      {
          //userId: userId,
          title: '好吃的菜系',
          subtitle: '好吃的菜系好吃的菜系好吃的菜系',
          property: {
            craft: 5,
            flavor: 5
          },
          product_pic_url: 'http:img_url',
          product_story: '一堆故事',
          raw_material:{ 
            main_material: {  
              name: '有什么美味呢',
              specs: '有什么美味呢',
            },
            accessories_material: {  
              name: '有什么美味呢',
              specs: '有什么美味呢',
            }
          },
          step: [{
            img_url: 'img_url',
            describe: 'img_url',
          }],
          product_pics:[String],
          skill:  '一堆故事',
      }]
  })
}