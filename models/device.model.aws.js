"use strict";

const dynamoose = require("dynamoose");
const { v4: uuidv4 } = require("uuid");

const Schema = dynamoose.Schema;

var DeviceSchema = new Schema({
  id: { type: String },
  dateTime: { type: String },
  Payload: {type: Map }
});

var Device = dynamoose.model("Device", DeviceSchema);

module.exports = Device;
