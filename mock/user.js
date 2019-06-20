// mock 数据
var Mock = require('mockjs')
var Random = Mock.Random;

let userModel = require('../app/model/user.js')(global);
// 随机生成一些名字和密码


async function createUser(){
  var data = Mock.mock({
    'users|200': [{
        'name|+1': Random.word(),
        'password|+1': 1
    }]
  })
  
  data.users = data.users.map((item) => {
    return {
      ...item,
      name: Random.word()
    }
  })
  userModel.insertMany(data.users).then((e,d) => {
    console.log('用户插入成功');
  });
}

module.exports = createUser;