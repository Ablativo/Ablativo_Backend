const Room = require("../models/room.model.aws");
const Device = require("../models/device.model.aws");
const Artwork = require("../models/artwork.model.aws");

var config = require("../config.js");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const path = require("path");

const { v4: uuidv4 } = require("uuid");


exports.getRoomList = async (req, res) => {
    try {
      console.log(" DEBUG START: getRoomList");

      await Room.scan().exec( function (error, result) {
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
            " ERROR: getRoomList error> " + err
          );
          res.send({ success: false, status: 404, message: err });
        }
      });


    } catch (e) {
      console.error(" CATCH: getRoomList : room error > " + e);
      return res.send({ status: 500, success: false, message: e.message });
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



// not currently implemented on dashboard... only for tests
exports.createRoom = async (req, res) => {
  try {
    console.log(" DEBUG START: createRoom" + req.body);

    const _id = uuidv4();

    var room = new Room({
      _id: _id,
      device: req.body.device,
      roomName: req.body.roomName,
    });

    await room.save((err, roomSaved) => {
      if (!err) {
        console.log(
            " INFO PARAM OUT: createRoom : " +
            JSON.stringify(roomSaved, undefined, 4)
        );
        console.log( " DEBUG END: createRoom");
        res.send({ success: true, status: 200, data: roomSaved });
      } else {
        console.error(" ERROR: createRoom error > " + err);
        res.send({ success: false, status: 500, message: err });
      }
    });
  } catch (e) {
    console.error(" CATCH: createRoom : error > " + e);
    return res.send({ success: false, message: e.message });
  }
};


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