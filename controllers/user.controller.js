const User = require("../models/user.model.aws");
const Visit = require("../models/visit.model.aws");
const Room = require("../models/room.model.aws");
const Artwork = require("../models/artwork.model.aws");

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
          res.send({ success: true, status: 200, data: user });
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
          res.send({ success: true, status: 200, data: visit });

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
        res.send({ success: true, status: 200, data: visitSaved });
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

exports.getRoomByID = async (req, res) => {
  try {
    console.log(req.decoded._id + " DEBUG START: getRoomByID");

    var roomID = req.body.roomID;

    await Room.get(roomID, function (error, result) {
      if (!error) {
        console.log(
          req.decoded._id +
            " INFO PARAM OUT: getRoomByID : " +
            JSON.stringify(result, undefined, 4)
        );
        res.send({
          success: true,
          status: 200,
          data: result,
        });
      } else {
        console.error(
          req.decoded._id + " ERROR: getRoomByID  error on find artwork> " + err
        );
        res.send({ success: false, status: 404, message: err });
      }
    });
    
  } catch (e) {
    console.error(req.decoded._id + " CATCH: getRoomByID : error > " + e);
    return res.send({ success: false, message: e.message });
  }
};

//ONLY DASHBOARD USERS
exports.createRoom = async (req, res) => {
  try {
    console.log(req.decoded._id + " DEBUG START: createRoom");

    const _id = uuidv4();

    var room = new Room({
      _id: _id,
      roomName: req.body.roomName,
    });

    await room.save((err, roomSaved) => {
      if (!err) {
        console.log(
          req.decoded._id +
            " INFO PARAM OUT: createRoom : " +
            JSON.stringify(roomSaved, undefined, 4)
        );
        console.log(req.decoded._id + " DEBUG END: createRoom");
        res.send({ success: true, status: 200, data: roomSaved });
      } else {
        console.error(req.decoded._id + " ERROR: createRoom error > " + err);
        res.send({ success: false, status: 500, message: err });
      }
    });
  } catch (e) {
    console.error(req.decoded._id + " CATCH: createRoom : error > " + e);
    return res.send({ success: false, message: e.message });
  }
};

exports.getArtworkByID = (req, res) => {
  try {
    console.log(req.decoded._id + " DEBUG START: getArtworkByID");
    var artworkID = req.body.artworkID;

    Artwork.query("artworkID")
      .eq(artworkID)
      .exec((err, artwork) => {
        if (!err) {
          console.log(
            req.decoded._id +
              " INFO PARAM OUT: getArtworkByID : " +
              JSON.stringify(artwork, undefined, 4)
          );
          res.send({ success: true, status: 200, data: artwork });
        } else {
          console.error(
            req.decoded._id +
              " ERROR: getArtworkByID  error > " +
              JSON.stringify(err)
          );
          res.send({ success: false, message: err });
        }
      });
  } catch (e) {
    console.error(req.decoded._id + " CATCH: getArtworkByID : error > " + e);
    return res.send({ success: false, message: e.message });
  }
};

//ONLY DASHBOARD USERS
exports.createArtwork = async (req, res) => {
  try {
    console.log(
      req.decoded._id +
        " DEBUG START: createArtwork " +
        JSON.stringify(req.body, undefined, 4)
    );

    const _id = uuidv4();
    const room = await Room.get(req.body.roomID);
    var artworkContained = room.artworks;

    var artwork = new Artwork({
      _id: _id,
      name: req.body.name,
      artist: req.body.artist,
      image: req.body.image,
      description: req.body.description,
    });
    //roomID,

    await artwork.save((err, artworkSaved) => {
      if (!err) {
        artworkContained == undefined
          ? (artworkContained = [artworkSaved])
          : (artworkContained = [...artworkContained, artworkSaved]);

        Room.update(
          {
            _id: req.body.roomID,
            artworks: artworkContained,
          },
          (error, room) => {
            if (error) {
              console.error(
                req.decoded._id +
                  " ERROR: createArtwork on update room error > " +
                  err
              );
              res.send({ success: false, status: 500, message: err });
            } else {
              console.log(
                req.decoded._id +
                  " INFO PARAM OUT: createArtwork : " +
                  JSON.stringify(artworkContained, undefined, 4)
              );
              /* console.log(
                req.decoded._id +
                  " INFO PARAM OUT: createArtwork roomUpdated : " +
                  JSON.stringify(room, undefined, 4)
              ); */
              res.send({ success: true, status: 200, data: artworkSaved });
            }
          }
        );
      } else {
        console.error(req.decoded._id + " ERROR: createArtwork error > " + err);
        res.send({ success: false, status: 500, message: err });
      }
    });
  } catch (e) {
    console.error(req.decoded._id + " CATCH: createArtwork " + e);
    return res.send({ success: false, message: e.message });
  }
};

//TODO

//logoutUser
