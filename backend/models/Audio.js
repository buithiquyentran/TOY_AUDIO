const mongoose = require('mongoose')

const Audio = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // Thêm trường id tùy chỉnh
  name: {
    type: String,
    required: true
  },
  singer: {
    type: Array,
    required: true
  },
  type: {
    type: String,
    // default: 'music'
  },
  view: {
    type: Number,
    default: 0
  },
  image: {
    type: String,
    // required: true
  },
  file: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now()
  }

});

module.exports = mongoose.model("audio", Audio )