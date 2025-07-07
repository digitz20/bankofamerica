const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
  },

  userId: {
    type: Number,
  },

  password: {
    type: String,
    
  },

  email: {
    type: String
  },

  username: {
    type: String
  },
  
  


},{timestamps: true})

const userModel = mongoose.model('users',userSchema)


module.exports = userModel;