const mongoose = require('mongoose')
const User = mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true 
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  date: {
    type: Date,
    default: Date.now()
  },
  password: {
    type: String,
    required: true
  },
  isAdmin :{
    type: Boolean,
    default: false
  }, 
  isSuperAdmin: {
    type: Boolean,
    default: false
  },
  duration:{
    type: String,
    required: false
  }
});
module.exports  = mongoose.model("user", User )