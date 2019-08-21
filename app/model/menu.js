'use strict';
module.exports = app => {
  const mongoose = app.mongoose
  const MenuSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    name: { type: String, required: true },
    collectionUsers:[{
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
    }],
    title: { type: String, required: true },
    property: {
      craft: {type: String,  required: true},  // 工艺 enum: [1,2,3,4],
      flavor: {type: String, required: true},  // 口味  enum: [1,2,3,4],
      hard: {type: String, required: true},   // 难度 enum: [1,2,3,4],
      people: {type: String, required: true}  // pepole 人数: [1,2,3,4],
    },
    product_pic_url: { type: String, required: true },
    product_story: { type: String, required: true, minlength:1, maxlength:100 },
    raw_material:{ // 原材料
      main_material: [{  // 主料
        name: {type: String, required: true},
        specs: {type: String, required: true},
      }],
      accessories_material: [{  // 辅料
        name: {type: String, required: true},
        specs: {type: String, required: true},
      }]
    },
    steps: [{
      img_url: {type: String, required: true},
      describe: {type: String, required: true},
    }],
    skill:  { type: String, required: true, minlength:1, maxlength:100 },
    classify: {type: String, required: true},
    parent_classify: {type: String, required: true},
    createdAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now }
  })
  return mongoose.model('Menu', MenuSchema)
}