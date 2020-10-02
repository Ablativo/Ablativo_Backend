"use strict";

const dynamoose = require("dynamoose");
const Schema = dynamoose.Schema;

//const crypto = require('crypto');
const bcrypt = require("bcrypt");

var UserSchema = new Schema({
  _id: {
    type: String,
    hashKey: true,
  },
  username: {
    type: String,
    required: true,
    index: {
      name: "usernameIndex",
      global: true,
    }, // creates a global secondary index with the name `usernameIndex` and hashKey `username`
  },
  password: { type: String, required: true },
  counter: {
    type: String,
    list: {
      question: {
        type: Number,
        default: 0,
      },
      time: {
        type: Number,
        default: 0,
      },
      visit: {
        type: Number,
        default: 0,
      },
    },
  },
  mentor: {
    type: String,
    enum: ["AUGUSTO", "CESARE", "NERONE"],
    default: "AUGUSTO",
  },
});

/* UserSchema.getAttributeValue("password").validate(function (pwd) {
  return pwd.length;
}, "Password required");

UserSchema.getAttributeValue("username").validate(function (username) {
  return username.length;
}, "Username required");
 */

var User = dynamoose.model("User", UserSchema);

User.methods.set("authenticate", function (password) {
  return bcrypt.compareSync(password, this.password);
});
module.exports = User;
