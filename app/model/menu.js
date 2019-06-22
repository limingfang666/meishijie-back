'use strict';
module.exports = app => {
  const mongoose = app.mongoose
  const MenuSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    property: {
      craft: {type: Number, enum: [1,2,3,4], required: true},  // 工艺
      flavor: {type: Number, enum: [1,2,3,4], required: true}  // 口味
    },
    product_pic_url: { type: String, required: true },
    product_story: { type: String, required: true, minlength:1, maxlength:100 },
    raw_material:{ // 原材料
      main_material: {  // 主料
        name: {type: String, required: true},
        specs: {type: String, required: true},
      },
      accessories_material: {  // 辅料
        name: {type: String, required: true},
        specs: {type: String, required: true},
      }
    },
    step: [{
      img_url: {type: String, required: true},
      describe: {type: String, required: true},
    }],
    product_pics:[String],
    skill:  { type: String, required: true, minlength:1, maxlength:100 },
    classify: {type: String, required: true},
    parent_classify: {type: String, required: true},
    createdAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now }
  })
  return mongoose.model('Menu', MenuSchema)
}