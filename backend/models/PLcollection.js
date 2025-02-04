const mongoose = require("mongoose")
const PLcollectionModel  = mongoose.Schema({
  id: {
    type: String
  },
  name: {
    type: String,
  },
  username: {
    type: String,
    default: 'B2113345'
  },
  type: {
    type: String,
    default: 'all'
  },
  date: {
    type: Date,
    default: Date.now()
  },
  playlistIds: {
    type: Array,
    default: []
    // required: true
  }
});
module.exports = mongoose.model("PLcollection",PLcollectionModel )
