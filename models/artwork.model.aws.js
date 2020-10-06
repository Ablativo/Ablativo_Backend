"use strict";
//const Room = require("./room.model.aws");
const dynamoose = require("dynamoose");
const { v4: uuidv4 } = require("uuid");
const Room = require("./room.model.aws");

const Schema = dynamoose.Schema;

var ArtworkSchema = new Schema({
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
  //room: { type: Room, required: true},
  artist: { type: String, required: true },
  image: { type: String },
  description: { type: String },
  upVote: { type: Number, default: 0},
  downVote: {type: Number, default: 0},

});

var Artwork = dynamoose.model("Artwork", ArtworkSchema);

module.exports = Artwork;
