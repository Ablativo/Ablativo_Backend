"use strict";

const dynamoose = require("dynamoose");
const Schema = dynamoose.Schema;

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
  statueContained: {
    type: 'list',
    data: []
  },
});

var Room= dynamoose.model("Room", RoomSchema);

module.exports = Room;
