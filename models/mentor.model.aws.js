"use strict";
//const Room = require("./room.model.aws");
const dynamoose = require("dynamoose");
const { v4: uuidv4 } = require("uuid");
const Room = require("./room.model.aws");

const Schema = dynamoose.Schema;

var MentorSchema = new Schema({
  _id: {
    type: String,
    default: uuidv4(),
    hashKey: true,
  },
  name: {
    type: String,
    required: true,
    index: {
      name: "nameIndex",
      global: true,
    }, // creates a global secondary index with the name `usernameIndex` and hashKey `username`
  },
  image: { type: String },
  description: { type: String },
  upVote: { type: Number, default: 0 },
  downVote: { type: Number, default: 0 },
  initialMessage: { type: String },
  questions: {
    type: Object,
    schema: {
      Q: {
        type: Array,
        schema: [String],
      },
      A: {
        type: Array,
        schema: [String],
      },
      R: {
        type: Array,
        schema: [String],
      },
      
    },
  },
});

var Mentor = dynamoose.model("Mentor", MentorSchema);

module.exports = Mentor;
