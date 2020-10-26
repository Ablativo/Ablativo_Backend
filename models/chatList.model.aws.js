"use strict";

const dynamoose = require("dynamoose");
const Schema = dynamoose.Schema;
const ChatMessage = require("./chatMessage.model.aws");

var ChatListSchema = new Schema({
  _id: {
    type: String,
    hashKey: true,
  },
  _userID: {
    type: String,
    required: true,
    index: {
      name: "mentornameIndex",
      global: true,
    }, // creates a global secondary index with the name `usernameIndex` and hashKey `username`
  },
  artworkName: {
    type: String,
    required: true,
  },
  artworkAvatar: {
    type: String,
    required: true,
  },
  date: {
    type: Number,
    required: true,
  },
  messages: {
    type: Array,
    schema: [ChatMessage],
  },
});

var ChatList = dynamoose.model("ChatList", ChatListSchema);

module.exports = ChatList;
