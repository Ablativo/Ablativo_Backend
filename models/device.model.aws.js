"use strict";

const dynamoose = require("dynamoose");
const { v4: uuidv4 } = require("uuid");

const Schema = dynamoose.Schema;

var DeviceSchema = new Schema({
  id: { type: String },
  dateTime: { type: Number },
  Payload: {
    type: Object,
    schema: {
      deviceId: Number,
      hum: Number,
      press: Number,
      temp: Number
    }
  }
});

var Device = dynamoose.model("Device", DeviceSchema);

module.exports = Device;
