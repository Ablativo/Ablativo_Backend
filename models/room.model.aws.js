"use strict";

const dynamoose = require("dynamoose");
const Schema = dynamoose.Schema;
const Artwork = require("./artwork.model.aws");

var RoomSchema = new Schema({
  _id: {
    type: String,
    hashKey: true,
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
