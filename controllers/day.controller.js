const Day = require("../models/day.model.aws");

var config = require("../config.js");
const path = require("path");


exports.getWeek = async (req, res) => {
    try {
      console.log(" DEBUG START: getRoomList");

      await Day.scan().limit(7).exec( async function (error, result) {
        if (!error) {

          console.log(
              " INFO PARAM OUT: getRoomList : " +
              JSON.stringify(result, undefined, 4)
          );

          res.send({
            success: true,
            status: 200,
            data: result,
          });
        } else {
          console.error(
            " ERROR: getWeek error> " + error
          );
          res.send({ success: false, status: 404, message: error });
        }
      });


    } catch (e) {
      console.error(" CATCH: getWeek : day error > " + e);
      return res.send({ status: 500, success: false, message: e.message });
    }
  };



exports.createDay = async (req, res) => {
  try {
    console.log(" DEBUG START: createDay" + req.body);

    var day = new Day({
      day: req.body.day,
      number: parseInt(req.body.number),
    });

    await day.save((err, daySaved) => {
      if (!err) {
        console.log(
            " INFO PARAM OUT: createDay : " +
            JSON.stringify(daySaved, undefined, 4)
        );
        console.log( " DEBUG END: createDay");
        res.send({ success: true, status: 200, data: daySaved });
      } else {
        console.error(" ERROR: creatDay error > " + err);
        res.send({ success: false, status: 500, message: err });
      }
    });
  } catch (e) {
    console.error(" CATCH: createDay : error > " + e);
    return res.send({ success: false, message: e.message });
  }
};
