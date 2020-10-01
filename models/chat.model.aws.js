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
  password: { type: String, required: true },
  mentor: {
    type: String,
    enum: ["AUGUSTO", "CESARE", "NERONE"],
    default: "AUGUSTO",
  },
});

var Chat = dynamoose.model("Chat", ChatSchema);

module.exports = Chat;
