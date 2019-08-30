'use strict';
module.exports = app => {
  const mongoose = app.mongoose
  const Comment = new mongoose.Schema({
    user_id: { type: String, required: true },
    meun_id: { type: String, required: true },
    comment: { type: String, required: true }
  })
  return mongoose.model('Comment', Comment)
}