"use strict";

const dynamoose = require("dynamoose");
const Schema = dynamoose.Schema;

var ChatMessageSchema = new Schema({
  id: {
    type: String,
    hashKey: true,
  },
  user: {
    type: Object,
    schema: {
      id: String,
      name: String,
      avatar: String,
    },
  },
  text: {
    type: String,
  },
  createdAt: {
    type: String,
  },
});

var ChatMessage = dynamoose.model("ChatMessage", ChatMessageSchema);

module.exports = ChatMessage;
