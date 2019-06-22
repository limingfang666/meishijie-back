// mock 数据
var Mock = require('mockjs')
var Random = Mock.Random;

let menuModel = require('../app/model/menu.js')(global);
let classifyDatas = require('./data/classify');  // 分类数据
let classifyDatas_len = classifyDatas.length-1;
// 根据用户来生成的，现获取指定个数的用户
let userModel;
try{
  userModel = global.mongoose.model('User');
}catch(e){
  userModel = require('../app/model/user.js')(global);
}
const createNum = 5;  // 生成的个数
// 每一个人创建指定数字的数据
// 分类

async function createMenu(){
  let users = await userModel.find({}).limit(10);
  if(!users || !users.length) return;
  // [[],[]]
  let datas = users.map((user) => {
    return (new Array(createNum).fill(createNum)).map(() => {
      let menu = createMockMenu().menus;
      menu.userId = user._id;
      // 随机分配给一个分类
      let random = Math.round(Math.random()*classifyDatas_len);
      let classify = classifyDatas[random];
      menu.classify = classify.type;
      menu.parent_classify = classify.parent_type;
      return menu;
    })
  }).reduce((item1,item2) => {
    
    return [
      ...item1,
      ...item2
    ]
  });
  await menuModel.deleteMany({});
  await menuModel.insertMany(datas).then((e,d) => {
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
            craft: Math.round(Math.random()*3) + 1,
            flavor: Math.round(Math.random()*3) + 1
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
          skill:  '一堆故事'
      }]
  })
}