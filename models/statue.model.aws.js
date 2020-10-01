"use strict";

const dynamoose = require("dynamoose");
const { v4: uuidv4 } = require("uuid");

const Schema = dynamoose.Schema;


var StatueSchema = new Schema({
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
  artist: { type: String, required: true },
  image: { type: String },
  description: { type: String },
});

var Statue = dynamoose.model("Statue", StatueSchema);

module.exports = Statue;
