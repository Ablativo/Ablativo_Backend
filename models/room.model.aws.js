"use strict";

const dynamoose = require("dynamoose");
const Schema = dynamoose.Schema;
const Artwork = require("./artwork.model.aws");
const Device = require("./device.model.aws");

var RoomSchema = new Schema({
  _id: {
    type: String,
    hashKey: true,
  },
  device: {
    type: Device,
    //required: true,
  },
  image: {
    type: String
  },
  description: {
    type: String
  },
  upVote: {
    type: Number,
    default: 0
  },
  roomName: {
    type: String,
    required: true,
    index: {
      name: "roomnameIndex",
      global: true,
    }, // creates a global secondary index with the name `usernameIndex` and hashKey `username`
  },
  artworks: {
    type: Array,
    schema: [Artwork]
  },
});

var Room = dynamoose.model("Room", RoomSchema);

module.exports = Room;
