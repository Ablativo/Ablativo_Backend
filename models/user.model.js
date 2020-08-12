"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate");
//const crypto = require('crypto');
const bcrypt = require("bcrypt");

var UserSchema = new Schema({
  name: String,
  surname: String,
  completeName: String,
  email: { type: String, lowercase: true, trim: true, dropDubs: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  mentor: {
    type: String,
    enum: ['AUGUSTO', 'CESARE', 'NERONE'],
    default: 'AUGUSTO',
  },
}).plugin(mongoosePaginate);

UserSchema.path("password").validate(function (pwd) {
  return pwd.length;
}, "Password required");

UserSchema.path("username").validate(function (username) {
  return username.length;
}, "Username required");

UserSchema.methods.authenticate = function (password) {
  return bcrypt.compareSync(password, this.password);
};

var User = mongoose.model("User", UserSchema);
module.exports = User;
