const User = require("../models/user.model.aws");
const Visit = require("../models/visit.model.aws");
const Room = require("../models/room.model.aws");
const Statue = require("../models/statue.model.aws");

var config = require("../config.js");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const path = require("path");

const { v4: uuidv4 } = require("uuid");

//DONE

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

exports.getMyVisits = async (req, res) => {
  try {
    console.log(req.decoded._id + " DEBUG START: getMyVisits");
    var userId = req.decoded._id;

    await Visit.query("_userID")
      .eq(userId)
      .exec((err, visit) => {
        if (!err) {
          console.log(
            req.decoded._id +
              " INFO PARAM OUT: getMyVisits : " +
              JSON.stringify(visit, undefined, 4)
          );
          res.send({ success: true, status: 200, data: visit});
          
          //res.send({ success: true, status: 200, data: visit});
        } else {
          console.error(
            req.decoded._id +
              " ERROR: getMyVisits : visit error > " +
              JSON.stringify(err)
          );
          res.send({ success: false, message: err });
        }
      });
    console.log(req.decoded._id + " DEBUG END: getMyVisits ");

  } catch (e) {
    console.error(req.decoded._id + " CATCH: getMyVisits : visit error > " + e);
    return res.send({ success: false, message: e.message });
  }
};

exports.createVisit = (req, res) => {
  try {
    console.log(req.decoded._id + " DEBUG START: createVisit");
    var userId = req.decoded._id;
    const _id = uuidv4();

    var visit = new Visit({
      //_id: _id,
      _userID: userId,
      museum: req.body.museum,
      location: req.body.location,
      time: req.body.time,
      musicLink: req.body.musicLink,
      createdAt: req.body.createdAt,
      image: req.body.image,
    });

    visit.save((err, visitSaved) => {
      if (!err) {
            console.log(
            req.decoded._id +
              " INFO PARAM OUT: createVisit : " +
              JSON.stringify(visitSaved, undefined, 4)
          );
          res.send({ success: true, status: 200, data: visitSaved});
        } else {
          console.error(
            req.decoded._id +
              " ERROR: createVisit : visit error > " +
              JSON.stringify(err)
          );
          res.send({ success: false, status: 500, message: err });
        }
      });
    console.log(req.decoded._id + " DEBUG END: createVisit");
  } catch (e) {
    console.error(req.decoded._id + " CATCH: createVisit : user error > " + e);
    return res.send({ success: false, status: 500, message: e.message });
  }
};

//TODO

exports.getRoomByID = (req, res) => {
  try {
    console.log(req.decoded._id + " DEBUG START: getRoomByID");
    
    var roomID = req.body.roomID;

    Room.query("_id")
    .eq(roomID)
    .exec((err, room) => {
      if (!err) {
        console.log(
          req.decoded._id +
            " INFO PARAM OUT: getRoomByID : " +
            JSON.stringify(room, undefined, 4)
        );
        res.send({ success: true, status: 200, data: room});
     } else {
        console.error(
          req.decoded._id +
            " ERROR: getRoomByID  error > " +
            JSON.stringify(err)
        );
        res.send({ success: false, message: err });
      }
    });
  
  } catch (e) {
    console.error(req.decoded._id + " CATCH: getRoomByID : error > " + e);
    return res.send({ success: false, message: e.message });
  }
};

exports.createRoom = (req, res) => {
  try {
    console.log(req.decoded._id + " DEBUG START: createRoom");

    const _id = uuidv4();
    

    var room = new Room({
      _id: _id,
      roomName: req.body.roomName,
      statue: req.body.statue,
    });

    room.save((err, roomSaved) => {
      if (!err) {
            console.log(
            req.decoded._id +
              " INFO PARAM OUT: createRoom : " +
              JSON.stringify(roomSaved, undefined, 4)
          );
          res.send({ success: true, status: 200, data: roomSaved});
        } else {
          console.error(
            req.decoded._id +
              " ERROR: createRoom error > " +
              JSON.stringify(err)
          );
          res.send({ success: false, status: 500, message: err });
        }
      });
    console.log(req.decoded._id + " DEBUG END: createRoom");

  } catch (e) {
    console.error(req.decoded._id + " CATCH: createRoom : error > " + e);
    return res.send({ success: false, message: e.message });
  }
};

exports.getStatueByID = (req, res) => {
  try {
    console.log(req.decoded._id + " DEBUG START: getStatueByID");
    var statueID = req.decoded._id;

    Statue.query("statueID")
    .eq(statueID)
    .exec((err, statue) => {
      if (!err) {
        console.log(
          req.decoded._id +
            " INFO PARAM OUT: getStatueByID : " +
            JSON.stringify(statue, undefined, 4)
        );
        res.send({ success: true, status: 200, data: statue});
     } else {
        console.error(
          req.decoded._id +
            " ERROR: getStatueByID  error > " +
            JSON.stringify(err)
        );
        res.send({ success: false, message: err });
      }
    });
  
  
  } catch (e) {
    console.error(req.decoded._id + " CATCH: getStatueByID : error > " + e);
    return res.send({ success: false, message: e.message });
  }
};

exports.createStatue = (req, res) => {
  try {
    console.log(req.decoded._id + " DEBUG START: createStatue");

    const _id = uuidv4();

    var statue = new Statue({
      _id: _id,
      name: req.body.name,
      artist: req.body.artist,
      image: req.body.image,
      description: req.body.description
    });

    statue.save((err, statueSaved) => {
      if (!err) {
            console.log(
            req.decoded._id +
              " INFO PARAM OUT: createStatue : " +
              JSON.stringify(statueSaved, undefined, 4)
          );
          res.send({ success: true, status: 200, data: statueSaved});
        } else {
          console.error(
            req.decoded._id +
              " ERROR: createStatue error > " +
              JSON.stringify(err)
          );
          res.send({ success: false, status: 500, message: err });
        }
      });
    console.log(req.decoded._id + " DEBUG END: createRoom");

  } catch (e) {
    console.error(req.decoded._id + " CATCH: createStatue " + e);
    return res.send({ success: false, message: e.message });
  }
};




//logoutUser
