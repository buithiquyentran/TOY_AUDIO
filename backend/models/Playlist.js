const mongoose = require('mongoose')
const Playlist = mongoose.Schema({
  id: {
    type: String
  },
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'all'
  },
  image: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now()
  },
  songIds: {
    type: Array,
    // default: []
  }
});
module.exports = mongoose.model("playlist",Playlist)