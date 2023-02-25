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
  balance: {
    type: Number,
    default: 0,
  },
  profileImage: {
    type: String,
    default: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png',
  },
  deliveryCity: {
    type: String,
    required: false,
    default: 'Не вказано',
  },
  deliveryDepartment: {
    type: String,
    required: false,
    default: 'Не вказано',
  },
});

module.exports = model('user', UserModel);
