"use strict";

const dynamoose = require("dynamoose");
const { v4: uuidv4 } = require("uuid");

const Schema = dynamoose.Schema;

var VisitSchema = new Schema({
  _id: {
    type: String,
    hashKey: true,
    default: uuidv4(),
  },
  _userID: {
    type: String,
    required: true,
    index: {
      name: "_userID",
      global: true,
    }, // creates a global secondary index with the name `usernameIndex` and hashKey `username`
  },
  museum: {
    type: String,
    required: true,
  },
  location: { type: String },
  time: { type: String },
  musicLink: { type: String },
  createdAt: { type: Date },
  finishedAt: {type: Date },
  image: { type: String },
  /* questions: {
    type: "list",
    list: [
      {
        question: { type: String },
        answer: { type: String },
        statue: {
          statueID: { type: String },
        },
      },
    ],
  }, */
});

var Visit = dynamoose.model("Visit", VisitSchema);

module.exports = Visit;
