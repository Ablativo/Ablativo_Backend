const User = require("../models/user.model.aws");
var config = require("../config.js");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const path = require("path");



exports.getMyInfo = (req, res) => {
  try {
    console.log(req.decoded._id + " DEBUG START: getMyInfo");
    var userId = req.decoded._id;

    User.query("username")
      .eq(userId)
      .attributes(["username", "mentor"]) 
      .exec((err, user) => {
        if (!err) {
          console.log(
            req.decoded._id +
              " INFO PARAM OUT: getMyInfo : " +
              JSON.stringify(user._doc, undefined, 4)
          );
          res.send({ success: true, status: 200, data: user._doc });
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

//logoutUser
