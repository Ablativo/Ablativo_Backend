"use strict";

const dynamoose = require("dynamoose");
const Schema = dynamoose.Schema;

var ChatMessageSchema = new Schema({
  _id: {
    type: String,
    hashKey: true,
  },
  user: {
    type: Object,
    schema: {
      _id: String,
      name: String,
      avatar: String,
    },
  },
  text: {
    type: String,
  },
  createdAt: {
    type: Date,
  },
});

var ChatMessage = dynamoose.model("ChatMessage", ChatMessageSchema);

module.exports = ChatMessage;
