const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        trim: true,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    lastLogin: Date
  });

  module.exports = mongoose.model('Users', UserSchema);