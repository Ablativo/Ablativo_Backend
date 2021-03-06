const Room = require("../models/room.model.aws");
const Device = require("../models/device.model.aws");
const Artwork = require("../models/artwork.model.aws");

var config = require("../config.js");
const path = require("path");

const { v4: uuidv4 } = require("uuid");

exports.getRoomList = async (req, res) => {
  try {
    console.log(" DEBUG START: getRoomList");

    await Room.scan()
      .attributes([
        "_id",
        "device",
        "roomName",
        "description",
        "image",
        "upVote",
      ])
      .exec(async function (error, result) {
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
          console.error(" ERROR: getRoomList error> " + error);
          res.send({ success: false, status: 404, message: error });
        }
      });
  } catch (e) {
    console.error(" CATCH: getRoomList : room error > " + e);
    return res.send({ status: 500, success: false, message: e.message });
  }
};

exports.getRoomByDeviceID = async (req, res) => {
  try {
    console.log(" DEBUG START: getRoomByDeviceID ");
    var deviceID = req.query.deviceID;

    console.log(
      " INFO PARAM IN: getRoomByDeviceID : " +
        JSON.stringify(deviceID, undefined, 4)
    );

    Room.query("device.id")
      .eq(deviceID)
      .exec(async (err, result) => {
        if (!err) {
          console.log(
            " INFO PARAM OUT: getRoomByDeviceID : " +
              JSON.stringify(result, undefined, 4)
          );
          res.send({
            success: true,
            status: 200,
            data: result,
          });
        } else {
          console.log(" DEBUG END: getRoomByDeviceID " + err);
          res.send({
            success: false,
            status: 500,
            message: 'Cannot retrieve room'
          });
        }
      });
    console.log(" DEBUG END: getRoomByDeviceID");
  } catch (e) {
    console.error(" CATCH: getRoomByDeviceID : user error > " + e);
    return res.send({ success: false, message: e.message });
  }
};

exports.getRoomByID = async (req, res) => {
  try {
    console.log(" DEBUG START: getRoomByID ");
    var roomID = req.query.roomID;

    console.log(
      " INFO PARAM IN: getRoomByID : " + JSON.stringify(roomID, undefined, 4)
    );

    Room.query("_id")
      .eq(roomID)
      .exec(async (err, result) => {
        if (!err) {
          console.log(
            " INFO PARAM OUT: getRoomByID : " +
              JSON.stringify(result, undefined, 4)
          );

          // [0] cause data inside array
          const room = result[0];

          // get telemetries for given room
          await Device.query("id")
            .eq(room.device)
            .limit(1) // get only last value
            .exec((error, response) => {
              if (!error) {
                const telemetries =
                  response[0].Payload != undefined ? response[0].Payload : {};
                console.log(telemetries);

                let payload = {
                  _id: room._id,
                  image: room.image,
                  upVote: room.upVote,
                  roomName: room.roomName,
                  description: room.description,
                  artworks: room.artworks,
                  telemetries: telemetries,
                };
                res.send({
                  success: true,
                  status: 200,
                  data: payload,
                  appdata: result,
                });
              } else {
                console.error(" ERROR: get room telemetries> " + error);
                res.send({
                  success: true,
                  status: 200,
                  data: "Missing Payload",
                  appdata: result,
                });
                //res.send({ success: false, status: 404, message: error });
              }
            });
        } else {
          console.error(
            " ERROR: getRoomByID : room error > " + JSON.stringify(err)
          );
          res.send({
            success: false,
            message: err,
          });
        }
      });
    console.log(" DEBUG END: getRoomByID");
  } catch (e) {
    console.error(" CATCH: getRoomByID : user error > " + e);
    return res.send({ success: false, message: e.message });
  }
};

exports.getArtworkByID = (req, res) => {
  try {
    console.log(" DEBUG START: getArtworkByID");
    var artworkID = req.body.artworkID;

    Artwork.query("artworkID")
      .eq(artworkID)
      .exec((err, artwork) => {
        if (!err) {
          console.log(
            " INFO PARAM OUT: getArtworkByID : " +
              JSON.stringify(artwork, undefined, 4)
          );
          res.send({ success: true, status: 200, data: artwork });
        } else {
          console.error(
            " ERROR: getArtworkByID  error > " + JSON.stringify(err)
          );
          res.send({ success: false, message: err });
        }
      });
  } catch (e) {
    console.error(" CATCH: getArtworkByID : error > " + e);
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
      image: req.body.image,
      roomName: req.body.roomName,
    });

    await room.save((err, roomSaved) => {
      if (!err) {
        console.log(
          " INFO PARAM OUT: createRoom : " +
            JSON.stringify(roomSaved, undefined, 4)
        );
        console.log(" DEBUG END: createRoom");
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
    console.log(" DEBUG START: createArtwork " + req.body);

    const _id = uuidv4();
    const room = await Room.get(req.body.roomID);
    var artworkContained = room.artworks;

    var artwork = new Artwork({
      _id: _id,
      name: req.body.name,
      artist: req.body.artist,
      image: req.body.image,
      description: req.body.description,
      initialMessage: req.body.initialMessage,
      questions: req.body.question,
    });
    console.log(artwork);

    await artwork.save((err, artworkSaved) => {
      if (!err) {
        var artworks = [];
        if (artworkContained != undefined)
          artworkContained.filter((item) => artworks.push(item._id));

        artworks.push(artworkSaved);

        Room.update(
          {
            _id: req.body.roomID,
            artworks: artworks,
          },
          (error, room) => {
            if (error) {
              console.error(
                " ERROR: createArtwork on update room error > " + err
              );
              res.send({ success: false, status: 500, message: err });
            } else {
              console.log(
                " INFO PARAM OUT: createArtwork : " +
                  JSON.stringify(artworks, undefined, 4)
              );

              res.send({ success: true, status: 200, data: artworkSaved });
            }
          }
        );
      } else {
        console.error(" ERROR: createArtwork error > " + err);
        res.send({ success: false, status: 500, message: err });
      }
    });
  } catch (e) {
    console.error(" CATCH: createArtwork " + e);
    return res.send({ success: false, message: e.message });
  }
};

exports.upvoteRoom = async (req, res) => {
  try {
    console.log(
      " DEBUG START: upvoteRoom" + JSON.stringify(req.body.roomID, null, 4)
    );

    await Room.update(
      { _id: req.body.roomID },
      { $ADD: { upVote: 1 } },
      async function (error, result) {
        if (!error) {
          console.log(
            " INFO PARAM OUT: upvoteRoom : " +
              JSON.stringify(result, undefined, 4)
          );

          res.send({
            success: true,
            status: 200,
          });
        } else {
          console.error(" ERROR: upvoteRoom error> " + error);
          res.send({ success: false, status: 404, message: error });
        }
      }
    );
  } catch (e) {
    console.error(" CATCH: upvoteRoom : room error > " + e);
    return res.send({ status: 500, success: false, message: e.message });
  }
};

exports.upvoteArtwork = async (req, res) => {
  try {
    console.log(
      " DEBUG START: upvoteArtwork" + JSON.stringify(req.body, null, 4)
    );

    await Artwork.update(
      { _id: req.body.artworkID },
      { $ADD: { upVote: req.body.value } },
      async function (error, result) {
        if (!error) {
          console.log(
            " INFO PARAM OUT: upvoteArtwork  : " +
              JSON.stringify(result, undefined, 4)
          );

          res.send({
            success: true,
            status: 200,
          });
        } else {
          console.error(" ERROR: upvoteArtwork  error> " + error);
          res.send({ success: false, status: 404, message: error });
        }
      }
    );
  } catch (e) {
    console.error(" CATCH: upvoteRoom : room error > " + e);
    return res.send({ status: 500, success: false, message: e.message });
  }
};
