const { Schema, model } = require('mongoose');

const UserModel = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    unique: true,
    required: true,
  },
  profileImage: {
    type: String,
  },
});

module.exports = model('user', UserModel);
