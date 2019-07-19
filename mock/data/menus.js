let imgs = require('./imgs'); // 所有真实的图片地址

let oneData = {
  userId: '',
  userName: '',
  title: '',
  subtitle: '',
  property: {
    craft: 1,  // 工艺 enum: [1,2,3,4],
    flavor: 1,  // 口味  enum: [1,2,3,4],
    hard: 1,   // 难度
    pepole: 1, // 人数
  },
  product_pic_url: '',
  product_story: '',
  raw_material:{ // 原材料
    main_material: {  // 主料
      name: '',
      specs: '',
    },
    accessories_material: {  // 辅料
      name: '',
      specs: '',
    }
  },
  step: [{
    img_url: '',
    describe: '',
  }],
  skill:  '',
  classify: '',
}