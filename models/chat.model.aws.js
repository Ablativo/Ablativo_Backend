"use strict";

const dynamoose = require("dynamoose");
const Schema = dynamoose.Schema;

var ChatSchema = new Schema({
  _id: {
    type: String,
    hashKey: true,
  },
  text: {
    type: String,
  },

});

var Chat = dynamoose.model("Chat", ChatSchema);

module.exports = Chat;
