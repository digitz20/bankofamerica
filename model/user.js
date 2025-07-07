const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
  },

  userID: {
    type: Number,
  },

  password: {
    type: String,
    
  },

  email: {
    type: String,
    unique: true, // Ensure email is unique
    // required: true
  },

  username: {
    type: String
  },
  
  


},{timestamps: true})

const userModel = mongoose.model('users',userSchema)


module.exports = userModel;