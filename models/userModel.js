const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  userType: String,
  phone:String,
  bloodGroup:{type:String,default:" "},
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  adharNumber :String,
});

module.exports = mongoose.model('User', userSchema);
