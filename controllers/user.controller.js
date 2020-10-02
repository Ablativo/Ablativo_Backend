const User = require("../models/user.model.aws");
const Visit = require("../models/visit.model.aws");

var config = require("../config.js");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const path = require("path");



exports.getMyInfo = (req, res) => {
  try {
    console.log(req.decoded._id + " DEBUG START: getMyInfo");
    var userId = req.decoded._id;

    User.query("_id")
      .eq(userId)
      .attributes(["username", "mentor", "counter"]) 
      .exec((err, user) => {
        if (!err) {
          console.log(
            req.decoded._id +
              " INFO PARAM OUT: getMyInfo : " +
              JSON.stringify(user, undefined, 4)
          );
          res.send({ success: true, status: 200, data: user});
        } else {
          console.error(
            req.decoded._id +
              " ERROR: getMyInfo : user error > " +
              JSON.stringify(err)
          );
          res.send({ success: false, message: err });
        }
      });
    console.log(req.decoded._id + " DEBUG END: getMyInfo");
  } catch (e) {
    console.error(req.decoded._id + " CATCH: getMyInfo : user error > " + e);
    return res.send({ success: false, message: e.message });
  }
};

exports.getMyVisits = (req, res) => {
  try {
    console.log(req.decoded._id + " DEBUG START: getMyVisits");
    var userId = req.decoded._id;

    Visit.query("_userID")
      .eq(userId)
      .attributes(["museum", "location", "time", "musicLink", "createdAt", "image"]) 
      .exec((err, visit) => {
        if (!err) {
          console.log(
            req.decoded._id +
              " INFO PARAM OUT: getMyVisits : " +
              JSON.stringify(visit._doc, undefined, 4)
          );
          res.send({ success: true, status: 200, data: visit._doc });
        } else {
          console.error(
            req.decoded._id +
              " ERROR: getMyVisits : visit error > " +
              JSON.stringify(err)
          );
          res.send({ success: false, message: err });
        }
      });
    console.log(req.decoded._id + " DEBUG END: getMyVisits");
  } catch (e) {
    console.error(req.decoded._id + " CATCH: getMyVisits : user error > " + e);
    return res.send({ success: false, message: e.message });
  }
};

exports.createVisit = (req, res) => {
  try {
    console.log(req.decoded._id + " DEBUG START: createVisit");
    var userId = req.decoded._id;

    Visit.query("_userID")
      .eq(userId)
      .attributes(["museum", "location", "time", "musicLink", "createdAt", "image"]) 
      .exec((err, visit) => {
        if (!err) {
          console.log(
            req.decoded._id +
              " INFO PARAM OUT: createVisit : " +
              JSON.stringify(visit._doc, undefined, 4)
          );
          res.send({ success: true, status: 200, data: visit._doc });
        } else {
          console.error(
            req.decoded._id +
              " ERROR: createVisit : user error > " +
              JSON.stringify(err)
          );
          res.send({ success: false, message: err });
        }
      });
    console.log(req.decoded._id + " DEBUG END: createVisit");
  } catch (e) {
    console.error(req.decoded._id + " CATCH: createVisit : user error > " + e);
    return res.send({ success: false, message: e.message });
  }
};


//logoutUser
