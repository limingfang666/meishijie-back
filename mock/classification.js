
let meunClassificationModel = require('../app/model/classification.js')(global);
let datas = require('./data/classify');
// 根据用户来生成的，现获取指定个数的用户
// let userModel;
// try{
//   userModel = global.mongoose.model('User');
// }catch(e){
//   userModel = require('../app/model/user.js')(global);
// }



module.exports = async function(){
  for(let i = 0; i < datas.length; i++){
    // 保证不重复添加
    let ification = await meunClassificationModel.findOne({type: datas[i].type});
    console.log(1,ification)
    if(ification) continue;
    await meunClassificationModel.create(datas[i]).then((e,d) => {
      console.log('分类插入成功')
    })
  }
  
};