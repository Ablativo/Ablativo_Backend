"use strict";

const dynamoose = require("dynamoose");
const Schema = dynamoose.Schema;

var DaySchema = new Schema({
  date: {
    type: Number,
    required: true,
  },
  number: {
    type: Number,
    default: 0,
  },
});

var Day = dynamoose.model("Day", DaySchema);

module.exports = Day;
