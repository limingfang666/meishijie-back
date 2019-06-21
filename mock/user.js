// mock 数据
var Mock = require('mockjs')
var Random = Mock.Random;

let userModel = require('../app/model/user.js')(global);
// 随机生成一些名字和密码
const creteUserNum = 1;

async function createUser(){
  // 生成数据
  var data = (new Array(creteUserNum)).fill(1).map(() => {
    return createMockUser().user;
  })
  await userModel.insertMany(data).then((e,d) => {
    console.log('用户插入成功');
    console.log(d);
  });
}

module.exports = createUser;

function createMockUser(){
  return Mock.mock({
    'user|1': [{
        'name': Random.word(),
        'password': Math.round(Math.random() * 1000) // 密码需要加密
    }]
  })
}