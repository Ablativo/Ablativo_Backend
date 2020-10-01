"use strict";

const dynamoose = require("dynamoose");
const Schema = dynamoose.Schema;

var ChatListSchema = new Schema({
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
  mentor: {
    type: String,
    enum: ["AUGUSTO", "CESARE", "NERONE"],
    default: "AUGUSTO",
  },
});

var ChatList = dynamoose.model("ChatList", ChatListSchema);


module.exports = ChatList;
