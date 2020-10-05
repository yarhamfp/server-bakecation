const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const usersSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
  },
  facebook: {
    type: String,
  },
  instagram: {
    type: String,
  },
  github: {
    type: String,
  },
  telepon: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  about: {
    type: String,
  },
  password: {
    type: String,
    required: true
  },
})

usersSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
})

module.exports = mongoose.model('Users', usersSchema)