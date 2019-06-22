'use strict';
module.exports = app => {
  const mongoose = app.mongoose
  const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    avatar: { type: String},
    userage: {type: Number},
    logindate : { type: Date, default:Date.now},   
    createdAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now }
  })
  return mongoose.model('User', UserSchema)
}