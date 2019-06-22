'use strict';
module.exports = app => {
  const mongoose = app.mongoose
  const Classification = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    parent_name: { type: String, required: true },
    parent_type: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now }
  })
  return mongoose.model('Classification', Classification)
}